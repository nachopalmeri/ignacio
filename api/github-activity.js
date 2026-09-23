// Latest public commits across Ignacio's most recently pushed public repos.
// Only public, non-fork repos are queried, so private work can't leak; the
// response is reduced to repo, first line of the message, date and link.
const GITHUB_LOGIN = 'nachopalmeri';
const API = 'https://api.github.com';
const REPOS_TO_SCAN = 4;
const COMMITS_PER_REPO = 3;
const MAX_ITEMS = 6;
const BROWSER_CACHE_CONTROL = 'public, max-age=300';
const CDN_CACHE_CONTROL = 'public, s-maxage=1800, stale-while-revalidate=86400';

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

function firstLine(message) {
  const line = String(message || '').split('\n')[0].trim();
  return line.length > 100 ? line.slice(0, 97).trimEnd() + '…' : line;
}

function isOwnUrl(url) {
  return typeof url === 'string' && url.startsWith(`https://github.com/${GITHUB_LOGIN}/`);
}

function normalizeCommits(repoName, list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((c) => c && c.commit && typeof c.commit.message === 'string')
    .filter((c) => !/^Merge (pull request|branch|remote-tracking)/.test(c.commit.message))
    .filter((c) => !(c.author && typeof c.author.login === 'string' && c.author.login.endsWith('[bot]')))
    .map((c) => ({
      repo: repoName,
      message: firstLine(c.commit.message),
      date: c.commit.author && c.commit.author.date,
      url: c.html_url
    }))
    .filter((c) => c.message && !Number.isNaN(Date.parse(c.date)) && isOwnUrl(c.url));
}

function createHandler({
  fetchImpl = global.fetch,
  getToken = () => process.env.GITHUB_TOKEN || null,
  now = () => new Date(),
  timeoutMs = 7000
} = {}) {
  return async function githubActivityHandler(request, response) {
    if (request?.method && request.method !== 'GET') {
      sendJson(response, 405, { error: 'Method Not Allowed' }, { Allow: 'GET' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const token = getToken();
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'nachopalmeri-portfolio' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const get = (path) => fetchImpl(API + path, { headers, signal: controller.signal });

    try {
      const reposRes = await get(`/users/${GITHUB_LOGIN}/repos?sort=pushed&per_page=10&type=owner`);
      if (!reposRes?.ok) throw new Error('repos ' + reposRes?.status);
      const repos = (await reposRes.json())
        .filter((r) => r && !r.private && !r.fork && typeof r.name === 'string' && /^[\w.-]+$/.test(r.name))
        .slice(0, REPOS_TO_SCAN);

      const perRepo = await Promise.all(repos.map(async (repo) => {
        const res = await get(`/repos/${GITHUB_LOGIN}/${repo.name}/commits?per_page=${COMMITS_PER_REPO}`);
        if (!res?.ok) return [];
        return normalizeCommits(repo.name, await res.json());
      }));

      const commits = perRepo.flat()
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, MAX_ITEMS);

      if (!commits.length) throw new Error('no commits');

      sendJson(response, 200, { login: GITHUB_LOGIN, updatedAt: now().toISOString(), commits }, {
        'Cache-Control': BROWSER_CACHE_CONTROL,
        'CDN-Cache-Control': CDN_CACHE_CONTROL,
        'Vercel-CDN-Cache-Control': CDN_CACHE_CONTROL
      });
    } catch (_error) {
      sendJson(response, 503, { error: 'GitHub activity is temporarily unavailable' }, {
        'Cache-Control': 'public, max-age=60'
      });
    } finally {
      clearTimeout(timeout);
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
module.exports.normalizeCommits = normalizeCommits;
