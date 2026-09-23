const assert = require('node:assert/strict');
const test = require('node:test');
const { createHandler } = require('../api/github-activity.js');

function recorder() {
  const headers = {};
  return {
    headers, statusCode: null, body: null,
    setHeader(n, v) { headers[n.toLowerCase()] = v; },
    end(b) { this.body = JSON.parse(b); }
  };
}

const ok = (data) => ({ ok: true, status: 200, json: async () => data });
const commit = (msg, date, extra = {}) => ({
  html_url: `https://github.com/nachopalmeri/${extra.repo || 'ignacio'}/commit/abc`,
  author: { login: extra.login || 'nachopalmeri' },
  commit: { message: msg, author: { date } }
});

function fakeGithub(routes) {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, opts });
    for (const [pattern, data] of routes) if (url.includes(pattern)) return typeof data === 'function' ? data() : ok(data);
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return { fetchImpl, calls };
}

test('returns newest public commits across recently pushed repos, newest first', async () => {
  const { fetchImpl } = fakeGithub([
    ['/users/nachopalmeri/repos', [{ name: 'ignacio' }, { name: 'jobbot' }]],
    ['/repos/nachopalmeri/ignacio/commits', [commit('Fix mobile nav\n\nlong body', '2026-09-20T10:00:00Z')]],
    ['/repos/nachopalmeri/jobbot/commits', [commit('Add retry', '2026-09-21T10:00:00Z', { repo: 'jobbot' })]]
  ]);
  const res = recorder();
  await createHandler({ fetchImpl, getToken: () => null })({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.commits.map((c) => [c.repo, c.message]), [['jobbot', 'Add retry'], ['ignacio', 'Fix mobile nav']]);
  assert.match(res.headers['cdn-cache-control'], /s-maxage/);
});

test('never queries private or forked repos', async () => {
  const { fetchImpl, calls } = fakeGithub([
    ['/users/nachopalmeri/repos', [{ name: 'darter', private: true }, { name: 'someones-lib', fork: true }, { name: 'ignacio' }]],
    ['/repos/nachopalmeri/ignacio/commits', [commit('Public work', '2026-09-20T10:00:00Z')]]
  ]);
  const res = recorder();
  await createHandler({ fetchImpl, getToken: () => null })({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(!calls.some((c) => c.url.includes('/darter/') || c.url.includes('/someones-lib/')));
});

test('drops merge commits, bot commits and foreign links; trims long messages', async () => {
  const long = 'x'.repeat(150);
  const { fetchImpl } = fakeGithub([
    ['/users/nachopalmeri/repos', [{ name: 'ignacio' }]],
    ['/repos/nachopalmeri/ignacio/commits', [
      commit('Merge pull request #3 from x/y', '2026-09-22T10:00:00Z'),
      commit('Bump deps', '2026-09-22T09:00:00Z', { login: 'dependabot[bot]' }),
      { ...commit('Evil link', '2026-09-22T08:00:00Z'), html_url: 'https://evil.example/x' },
      commit(long, '2026-09-21T10:00:00Z')
    ]]
  ]);
  const res = recorder();
  await createHandler({ fetchImpl, getToken: () => null })({ method: 'GET' }, res);
  assert.equal(res.body.commits.length, 1);
  assert.equal(res.body.commits[0].message.length, 98);
});

test('sends the token only as an Authorization header when configured', async () => {
  const { fetchImpl, calls } = fakeGithub([
    ['/users/nachopalmeri/repos', [{ name: 'ignacio' }]],
    ['/repos/nachopalmeri/ignacio/commits', [commit('ok', '2026-09-20T10:00:00Z')]]
  ]);
  const res = recorder();
  await createHandler({ fetchImpl, getToken: () => 'secret-token' })({ method: 'GET' }, res);
  assert.equal(calls[0].opts.headers.Authorization, 'Bearer secret-token');
  assert.ok(!JSON.stringify(res.body).includes('secret-token'));
});

test('answers 503 without leaking details when GitHub fails', async () => {
  const res = recorder();
  await createHandler({ fetchImpl: async () => { throw new Error('boom internal detail'); }, getToken: () => null })({ method: 'GET' }, res);
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: 'GitHub activity is temporarily unavailable' });
});

test('rejects non-GET methods', async () => {
  const res = recorder();
  await createHandler({ fetchImpl: async () => { throw new Error('must not fetch'); } })({ method: 'POST' }, res);
  assert.equal(res.statusCode, 405);
});
