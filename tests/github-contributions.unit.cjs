const assert = require('node:assert/strict');
const test = require('node:test');
const { createHandler } = require('../api/github-contributions.js');

const unavailable = { error: 'GitHub activity is temporarily unavailable' };

function responseRecorder() {
  const headers = {};
  return {
    headers,
    statusCode: null,
    body: null,
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    end(body) { this.body = JSON.parse(body); }
  };
}

function githubResponse(calendar) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      data: {
        user: {
          login: 'nachopalmeri',
          url: 'https://github.com/nachopalmeri',
          contributionsCollection: { contributionCalendar: calendar }
        }
      }
    })
  };
}

function calendar(days, totalContributions = days.reduce((sum, day) => sum + day.contributionCount, 0)) {
  return {
    totalContributions,
    weeks: [{ firstDay: '2026-07-19', contributionDays: days }]
  };
}

test('rejects non-GET requests before reading credentials or calling GitHub', async () => {
  const secret = 'safe-test-token';
  let tokenReads = 0;
  let fetchCalls = 0;
  const handler = createHandler({
    getToken: () => {
      tokenReads += 1;
      return secret;
    },
    fetchImpl: async () => {
      fetchCalls += 1;
      throw new Error('fetch must not run');
    }
  });
  const response = responseRecorder();

  await handler({ method: 'POST' }, response);

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.allow, 'GET');
  assert.deepEqual(response.body, { error: 'Method Not Allowed' });
  assert.equal(tokenReads, 0);
  assert.equal(fetchCalls, 0);
  const diagnostic = JSON.stringify({ body: response.body, headers: response.headers });
  assert.equal(diagnostic.includes(secret), false);
  assert.equal(diagnostic.toLowerCase().includes('authorization'), false);
});

test('accepts requests without a method for compatible server invocation', async () => {
  let fetchCalls = 0;
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    fetchImpl: async () => {
      fetchCalls += 1;
      return githubResponse(calendar([]));
    }
  });
  const response = responseRecorder();

  await handler({}, response);

  assert.equal(response.statusCode, 200);
  assert.equal(fetchCalls, 1);
});

test('returns only public contribution-calendar fields for the allowlisted GitHub profile', async () => {
  let receivedRequest;
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    fetchImpl: async (url, options) => {
      receivedRequest = { url, options };
      return githubResponse(calendar([
        { date: '2026-07-20', weekday: 1, contributionCount: 3, contributionLevel: 'SECOND_QUARTILE' },
        { date: '2026-07-21', weekday: 2, contributionCount: 8, contributionLevel: 'FOURTH_QUARTILE' }
      ]));
    }
  });
  const response = responseRecorder();

  await handler({ method: 'GET', query: { login: 'someone-else' } }, response);

  assert.equal(receivedRequest.url, 'https://api.github.com/graphql');
  assert(Object.values(receivedRequest.options.headers).includes('Bearer safe-test-token'), 'GitHub request must authenticate server-side');
  const graphQl = JSON.parse(receivedRequest.options.body);
  assert.equal(graphQl.variables.login, 'nachopalmeri');
  assert.match(graphQl.query, /contributionCalendar/);
  assert.doesNotMatch(graphQl.query, /includePrivateContributions/);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    login: 'nachopalmeri',
    profileUrl: 'https://github.com/nachopalmeri',
    totalContributions: 11,
    updatedAt: response.body.updatedAt,
    weeks: [{
      firstDay: '2026-07-19',
      days: [
        { date: '2026-07-20', weekday: 1, count: 3, level: 2 },
        { date: '2026-07-21', weekday: 2, count: 8, level: 4 }
      ]
    }]
  });
  assert.match(response.body.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(response.headers['cache-control'], 'public, max-age=300');
  assert.equal(response.headers['vercel-cdn-cache-control'], 'public, s-maxage=21600, stale-while-revalidate=86400');
  assert.equal(JSON.stringify(response.body).includes('safe-test-token'), false);
  assert.equal(JSON.stringify(response.body).toLowerCase().includes('authorization'), false);
});

test('keeps a zero-contribution calendar valid and maps NONE to level zero', async () => {
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    fetchImpl: async () => githubResponse(calendar([
      { date: '2026-07-20', weekday: 1, contributionCount: 0, contributionLevel: 'NONE' }
    ], 0))
  });
  const response = responseRecorder();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.totalContributions, 0);
  assert.equal(response.body.weeks[0].days[0].level, 0);
});

test('sanitizes GitHub rate-limit failures', async () => {
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({ message: 'API rate limit exceeded' }) })
  });
  const response = responseRecorder();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, unavailable);
  assert.equal(JSON.stringify(response.body).includes('rate limit'), false);
});

test('sanitizes a GitHub request that times out', async () => {
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })
  });
  const response = responseRecorder();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, unavailable);
});

test('sanitizes a request when GITHUB_TOKEN is not configured', async () => {
  const handler = createHandler({ getToken: () => '', fetchImpl: async () => { throw new Error('fetch must not run'); } });
  const response = responseRecorder();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, unavailable);
});

test('sanitizes an upstream response with an invalid contribution-calendar shape', async () => {
  const handler = createHandler({
    getToken: () => 'safe-test-token',
    fetchImpl: async () => githubResponse({ totalContributions: 2, weeks: [{ firstDay: 'bad-date', contributionDays: [] }] })
  });
  const response = responseRecorder();

  await handler({ method: 'GET' }, response);

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.body, unavailable);
});
