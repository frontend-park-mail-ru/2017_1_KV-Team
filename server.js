/**
 * Created by andreivinogradov on 15.02.17.
 */
const http = require('http');
const fs = require('fs');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const URL = require('url');
const path = require('path');

const BASE_ROUTE = 'static';

const mimeRoutes = {
  '': BASE_ROUTE,
  '.css': `${BASE_ROUTE}/style`,
  '.js': `${BASE_ROUTE}/js`,
  '.ico': `${BASE_ROUTE}/images`,
  '.jpg': `${BASE_ROUTE}/images`,
  '.png': `${BASE_ROUTE}/images`,
};

// writeToRes :: Object -> Buffer -> Undefined
const writeToRes = res => (text) => {
  res.write(text, 'utf8');
  res.end();
};

// getFilePath :: (Object, Object) -> String
const getFilePath = (url, mRoutes) => {
  const ext = path.parse(url.pathname).ext;
  const filePath = mRoutes[ext] + url.pathname;
  // return ext ? filePath : (url.pathname === '/' ? `${filePath}index` : filePath) + '.html';
  return ext ? filePath : `${url.pathname === '/' ? `${filePath}index` : filePath}.html`;
};

// readFile :: String -> Promise Buffer Error
const readFile = filename => new Promise((resolve, reject) =>
    fs.readFile(filename, (e, d) => (e ? reject(e) : resolve(d))));

// readNotFound :: _ -> Buffer
const readNotFound = () => readFile(`${BASE_ROUTE}/404.html`);

// worker :: (Object, Object) -> Promise Undefined Error
const worker = (req, res) =>
    Promise.resolve(getFilePath(URL.parse(req.url), mimeRoutes))
        .then(readFile)
        .catch(readNotFound)
        .then(writeToRes(res))
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

