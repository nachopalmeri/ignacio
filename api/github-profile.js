const CACHE_MAX_AGE = 3600;

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

function createHandler({ fetchImpl = global.fetch, timeoutMs = 8000 } = {}) {
  return async function githubProfileHandler(request, response) {
    if (request?.method && request.method !== 'GET') {
      sendJson(response, 405, { error: 'Method Not Allowed' }, { Allow: 'GET' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const [profileRes, reposRes] = await Promise.all([
        fetchImpl('https://api.github.com/users/nachopalmeri', {
          headers: { Accept: 'application/vnd.github.v3+json' },
          signal: controller.signal
        }),
        fetchImpl('https://api.github.com/users/nachopalmeri/repos?sort=pushed&per_page=4&type=public', {
          headers: { Accept: 'application/vnd.github.v3+json' },
          signal: controller.signal
        })
      ]);

      if (!profileRes.ok || !reposRes.ok) {
        sendJson(response, 503, { error: 'GitHub unavailable' });
        return;
      }

      const profile = await profileRes.json();
      const repos = await reposRes.json();

      sendJson(response, 200, {
        public_repos: profile.public_repos,
        followers: profile.followers,
        repos: repos.map((repo) => ({
          name: repo.name,
          description: repo.description || '',
          html_url: repo.html_url,
          language: repo.language || null,
          stargazers_count: repo.stargazers_count,
          private: repo.private
        }))
      }, {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`
      });
    } catch (_error) {
      sendJson(response, 503, { error: 'GitHub unavailable' });
    } finally {
      clearTimeout(timeout);
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
