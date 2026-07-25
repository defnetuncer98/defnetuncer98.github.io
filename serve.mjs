// Tiny static server with HTTP Range support (needed for <video> streaming).
// Usage: node serve.mjs [port]   — then open http://localhost:8123/
import { createServer } from 'http';
import { statSync, createReadStream, existsSync } from 'fs';
import { extname, join, normalize, sep } from 'path';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv[2]) || 8123;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.json': 'application/json', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = normalize(join(root, urlPath));
  if (!file.startsWith(root.endsWith(sep) ? root : root + sep) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404); res.end('not found'); return;
  }
  const { size } = statSync(file);
  const type = types[extname(file).toLowerCase()] || 'application/octet-stream';
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');

  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start); end = Math.min(end, size - 1);
    if (start > end) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return; }
    res.writeHead(206, {
      'Content-Type': type, 'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': size });
    createReadStream(file).pipe(res);
  }
}).listen(port, () => console.log(`portfolio → http://localhost:${port}/`));
