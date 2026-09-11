// S1 dev server: static file server with video mime + Range/206 + HEAD fast-path.
// Slice 1 infra-only (PVP-6): serves .mp4 as video/mp4, .webm as video/webm so
// hover loops support seek/scrub via 206 partial content. Zero videos added.
'use strict';

const http = require('node:http');
const { createReadStream, existsSync } = require('node:fs');
const { stat } = require('node:fs/promises');
const path = require('node:path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

// Pure: map an extension to its Content-Type (S1 PVP-6 contract).
function resolveContentType(ext) {
  return MIME_TYPES[String(ext).toLowerCase()] || 'application/octet-stream';
}

// Pure: parse a single `bytes=start-end` Range header against a known size.
// Returns { start, end } (inclusive) or null when unsatisfiable/unsupported.
function parseRangeHeader(rangeHeader, size) {
  if (typeof rangeHeader !== 'string') return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return null;
  const [, startText, endText] = match;
  let start;
  let end;
  if (startText === '' && endText === '') return null;
  if (startText === '') {
    // Suffix range: last N bytes.
    const suffix = Number(endText);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(startText);
    end = endText === '' ? size - 1 : Number(endText);
  }
  if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
  if (start >= size || end >= size || start > end) return null;
  return { start, end };
}

function resolveFilePath(rootDir, requestUrl) {
  const pathname = decodeURIComponent(requestUrl.pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const fileResolved = path.resolve(path.join(rootDir, relativePath));
  if (fileResolved !== path.resolve(rootDir) && !fileResolved.startsWith(`${path.resolve(rootDir)}${path.sep}`)) {
    return { status: 403 };
  }
  return { status: 200, fileResolved };
}

function createDevServer({ rootDir, port = 4174 } = {}) {
  const rootResolved = path.resolve(rootDir || process.cwd());
  const server = http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', `http://127.0.0.1:${port}`);
      if (requestUrl.pathname === '/api/github-contributions') {
        const handler = require('../api/github-contributions.js');
        await handler(req, res);
        return;
      }
      const resolved = resolveFilePath(rootResolved, requestUrl);
      if (resolved.status !== 200) {
        res.statusCode = resolved.status;
        res.end(resolved.status === 403 ? 'Forbidden' : 'Not found');
        return;
      }
      if (!existsSync(resolved.fileResolved)) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const info = await stat(resolved.fileResolved);
      if (!info.isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const contentType = resolveContentType(path.extname(resolved.fileResolved));
      const size = info.size;
      const range = parseRangeHeader(req.headers.range, size);
      if (req.headers.range && !range) {
        res.statusCode = 416;
        res.setHeader('Content-Range', `bytes */${size}`);
        res.end('Range Not Satisfiable');
        return;
      }
      if (range) {
        const chunkSize = range.end - range.start + 1;
        res.statusCode = 206;
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
        res.setHeader('Content-Length', String(chunkSize));
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        createReadStream(resolved.fileResolved, { start: range.start, end: range.end }).pipe(res);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', String(size));
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      createReadStream(resolved.fileResolved).pipe(res);
    } catch (error) {
      res.statusCode = 500;
      res.end(String((error && error.message) || error));
    }
  });
  return server;
}

if (require.main === module) {
  const rootDir = path.resolve(__dirname, '..');
  const port = Number(process.env.PORT || 4174);
  createDevServer({ rootDir, port }).listen(port, () => {
    console.log(`dev server listening on http://127.0.0.1:${port}/`);
  });
}

module.exports = { createDevServer, resolveContentType, parseRangeHeader, MIME_TYPES };
