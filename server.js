/**
 * Created by andreivinogradov on 15.02.17.
 */
const http = require('http');
const fs = require('fs');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const URL = require('url');
const path = require('path');
const qs = require('querystring');

const BASE_ROUTE = 'static';

const mimeRoutes = {
  '': BASE_ROUTE,
  '.css': BASE_ROUTE,
  '.js': BASE_ROUTE,
  '.ico': `${BASE_ROUTE}/images`,
  '.jpg': `${BASE_ROUTE}/images`,
  '.png': `${BASE_ROUTE}/images`,
};

const mimeTypes = {
  '.css': 'text/css',
  '': 'text/html',
  '.js': 'text/javascript',
};

const users = { admin: { password: '1234567' } };

// writeToRes :: Object -> Buffer -> Undefined
const writeToRes = (res, req) => (text) => {
  const ext = path.parse(URL.parse(req.url).pathname).ext;
  res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
  res.write(text, 'utf8');
  res.end();
};

// getFilePath :: (Object, Object) -> String
const getFilePath = (url, mRoutes) => {
  let filePath;
  const ext = path.parse(url.pathname).ext;
  if (url.pathname.includes('assets')) {
    filePath = `static/game/${url.pathname}`;
  } else {
    filePath = mRoutes[ext] + ((url.pathname.indexOf('views') === -1 && !ext)
        ? '/index' : url.pathname);
  }
  return ext ? filePath : `${filePath}.html`;
};

// readFile :: String -> Promise Buffer Error
const readFile = filename => new Promise((resolve, reject) =>
    fs.readFile(filename, (e, d) => (e ? reject(e) : resolve(d))));

// readNotFound :: _ -> Buffer
const readNotFound = () => readFile(`${BASE_ROUTE}/templates/src/404.xml`);

const handlePOST = req => new Promise((resolve, reject) => {
  let body = '';
  req.on('error', (err) => {
    reject(err);
  }).on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    body = qs.parse(body);
    switch (req.url) {
      case '/ajax_login':
        if (users[body.name] && (users[body.name].password === body.pass)) {
          resolve('success');
        } else {
          resolve('wrongLogPass');
        }
        break;
      case '/ajax_register':
        if (!users[body.name]) {
          users[body.name] = {
            password: body.pass,
            email: body.email,
          };
          resolve('success');
        } else {
          resolve('userAlreadyExists');
        }
        break;
      default:
    }
    console.log(users);
  });
});

const handleGet = req =>
  Promise.resolve(getFilePath(URL.parse(req.url), mimeRoutes))
    .then(readFile)
    .catch(readNotFound);

const worker = (req, res) =>
  (req.method === 'POST' ? handlePOST(req, res) : handleGet(req, res))
    .then(writeToRes(res, req))
    .then(logger(req.url));

// serverAtPort :: Number -> Promise Object Error
const serverAtPort = port => new Promise(((resolve, reject) => {
  const server = http.createServer(worker)
        .on('error', reject)
        .on('listening', () => resolve(server))
        .listen(port);
}));

serverAtPort(process.env.PORT || 3000)
    .then(server => console.log('serving on port:', server.address().port))
    .catch(errorHandler);
