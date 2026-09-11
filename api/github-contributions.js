const fs = require('fs');
const path = require('path');

const GITHUB_LOGIN = 'nachopalmeri';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const CACHE_FILE = path.resolve(__dirname, 'github-contributions-cache.json');
const BROWSER_CACHE_CONTROL = 'public, max-age=300';
const CDN_CACHE_CONTROL = 'public, s-maxage=21600, stale-while-revalidate=86400';

const contributionLevels = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};

const contributionQuery = `
  query PublicContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      url
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              weekday
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isCount(value) {
  return Number.isInteger(value) && value >= 0;
}

function normalizeCalendar(payload, updatedAt) {
  const user = payload?.data?.user;
  const calendar = user?.contributionsCollection?.contributionCalendar;
  if (
    !user ||
    user.login !== GITHUB_LOGIN ||
    typeof user.url !== 'string' ||
    !isCount(calendar?.totalContributions) ||
    !Array.isArray(calendar.weeks)
  ) {
    throw new Error('Invalid GitHub contribution response');
  }

  const weeks = calendar.weeks.map((week) => {
    if (!isIsoDate(week?.firstDay) || !Array.isArray(week.contributionDays)) {
      throw new Error('Invalid GitHub contribution week');
    }

    const days = week.contributionDays.map((day) => {
      const level = contributionLevels[day?.contributionLevel];
      if (
        !isIsoDate(day?.date) ||
        !Number.isInteger(day.weekday) ||
        day.weekday < 0 ||
        day.weekday > 6 ||
        !isCount(day.contributionCount) ||
        level === undefined
      ) {
        throw new Error('Invalid GitHub contribution day');
      }
      return {
        date: day.date,
        weekday: day.weekday,
        count: day.contributionCount,
        level
      };
    });

    return { firstDay: week.firstDay, days };
  });

  return {
    login: GITHUB_LOGIN,
    profileUrl: user.url,
    totalContributions: calendar.totalContributions,
    updatedAt,
    weeks
  };
}

function resolveToken() {
  try {
    const { execSync } = require('child_process');
    const token = execSync('gh auth token --user nachopalmeri', { encoding: 'utf8' }).trim();
    if (token) return token;
  } catch (_e) {}
  try {
    const { execSync } = require('child_process');
    const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
    if (token) return token;
  } catch (_e) {}
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  return null;
}

function mergeCalendars(list, updatedAt) {
  const seen = new Set();
  const weeks = [];
  let total = 0;
  for (const cal of list) {
    for (const week of cal.weeks) {
      const days = week.days.filter((day) => {
        if (seen.has(day.date)) return false;
        seen.add(day.date);
        total += day.count;
        return true;
      });
      if (days.length) weeks.push({ firstDay: week.firstDay, days });
    }
  }
  return { login: list[0].login, profileUrl: list[0].profileUrl, totalContributions: total, updatedAt, weeks };
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (_e) {}
  return null;
}

function writeCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), 'utf8');
  } catch (_e) {}
}

function sendJson(response, statusCode, body, headers = {}) {
  if (typeof response.setHeader === 'function') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
  }
  if (typeof response.status === 'function' && typeof response.json === 'function') {
    response.status(statusCode).json(body);
    return;
  }
  response.statusCode = statusCode;
  response.end(JSON.stringify(body));
}

function createHandler({
  fetchImpl = global.fetch,
  getToken = resolveToken,
  now = () => new Date(),
  timeoutMs = 6000
} = {}) {
  return async function githubContributionsHandler(request, response) {
    if (request?.method && request.method !== 'GET') {
      sendJson(response, 405, { error: 'Method Not Allowed' }, { Allow: 'GET' });
      return;
    }

    const token = getToken();
    const scrapeYear = async (year) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const url = 'https://github.com/users/' + GITHUB_LOGIN + '/contributions?from=' + year + '-01-01&to=' + year + '-12-31';
        const upstreamResponse = await fetchImpl(url, {
          headers: { 'User-Agent': 'nachopalmeri-portfolio' },
          signal: controller.signal
        });
        if (!upstreamResponse?.ok) { console.log('scrape !ok:', upstreamResponse.status); return null; }
        const html = await upstreamResponse.text();
        console.log('scrape ok, days=', (html.match(/data-date=/g) || []).length);
        const counts = {};
        const tipRe = /<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g;
        let tip;
        while ((tip = tipRe.exec(html))) {
          const text = tip[2].trim();
          counts[tip[1]] = /^No /i.test(text) ? 0 : parseInt(text, 10) || 0;
        }
        const days = [];
        const rectRe = /<(?:td|rect)[^>]*>/g;
        let rect;
        while ((rect = rectRe.exec(html))) {
          const tag = rect[0];
          const date = (tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/) || [])[1];
          if (!date || !date.startsWith(String(year))) continue;
          const key = (tag.match(/id="(contribution-day-component-[\d-]+)"/) || [])[1];
          days.push({
            date,
            count: counts[key] || 0,
            level: Math.max(0, Math.min(4, parseInt((tag.match(/data-level="(\d+)"/) || [])[1] || '0', 10))),
            weekday: new Date(date + 'T00:00:00Z').getUTCDay()
          });
        }
        days.sort((a, b) => (a.date < b.date ? -1 : 1));
        if (days.length < 300) return null;
        const weeks = [];
        for (const day of days) {
          if (day.weekday === 0 || !weeks.length) weeks.push({ firstDay: day.date, days: [] });
          weeks[weeks.length - 1].days.push(day);
        }
        return {
          login: GITHUB_LOGIN,
          profileUrl: 'https://github.com/' + GITHUB_LOGIN,
          totalContributions: days.reduce((acc, d) => acc + d.count, 0),
          weeks
        };
      } catch (_error) { console.log('SCRAPE ERR:', _error && _error.message); return null; } finally {
        clearTimeout(timeout);
      }
    };

    const graphqlYear = async (fromDate, toDate) => {
      if (!token) return null;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const upstreamResponse = await fetchImpl(GITHUB_GRAPHQL_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'nachopalmeri-portfolio',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: contributionQuery,
            variables: { login: GITHUB_LOGIN, from: fromDate.toISOString(), to: toDate.toISOString() }
          }),
          signal: controller.signal
        });
        if (!upstreamResponse?.ok) { console.log('graphql !ok:', upstreamResponse.status); return null; }
        const upstreamBody = await upstreamResponse.json();
        const norm = normalizeCalendar(upstreamBody, toDate.toISOString());
        console.log('graphql ok, weeks=', norm.weeks.length);
        return norm;
      } catch (_error) {
        return null;
      } finally {
        clearTimeout(timeout);
      }
    };

    try {
      const currentTime = now();
      const to = new Date(currentTime);
      const year = currentTime.getUTCFullYear();
      const current = token
        ? await graphqlYear(new Date(Date.UTC(year, 0, 1)), new Date(currentTime))
        : await scrapeYear(year);
      if (current) {
        writeCache(current);
        sendJson(response, 200, current, {
          'Cache-Control': BROWSER_CACHE_CONTROL,
          'Vercel-CDN-Cache-Control': CDN_CACHE_CONTROL
        });
        return;
      }
    } catch (_error) {
      // Fallback to cache below
    }

    // Fallback: serve cached calendar if available
    const cached = readCache();
    if (cached && Array.isArray(cached.weeks) && cached.weeks.length >= 52) {
      sendJson(response, 200, cached, {
        'Cache-Control': BROWSER_CACHE_CONTROL,
        'X-Cache-Status': 'HIT'
      });
      return;
    }

    sendJson(response, 503, { error: 'GitHub activity is temporarily unavailable' });
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
module.exports.normalizeCalendar = normalizeCalendar;
