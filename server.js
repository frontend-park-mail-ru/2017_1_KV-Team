/**
 * Created by andreivinogradov on 15.02.17.
 */

'use strict';
const http = require('http');
const fs = require('fs');
const { identity } = require('./utils/helperFunctions');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const URL = require('url');
const path = require('path');

const BASE_ROUTE = 'static';

const mimeRoutes = {
    '': BASE_ROUTE,
    '.css': BASE_ROUTE + '/style',
    '.js': BASE_ROUTE + '/js',
    '.ico': BASE_ROUTE + '/images'
};

// readNotFound :: _ -> String
const readNotFound = () => readFileUTF8(BASE_ROUTE + '/404.html');

// writeToRes :: Object -> Resolved Promise
const writeToRes = res => text => { res.write(text); res.end(); };

// getFilePath :: (String, Object) -> String
const getFilePath = (url, mimeRoutes) => {
    const ext = path.parse(url.pathname).ext;
    const filePath = mimeRoutes[ext] + url.pathname;
    return ext ? filePath : filePath + '.html';
};

// readFileUTF8 :: String -> Promise String Error
const readFileUTF8 = filename => new Promise((resolve, reject) =>
    fs.readFile(filename, 'utf8', (e, d) => e ? reject(e) : resolve(d)));

// worker :: (Object, Object) -> Promise Undefined Error
const worker = (req, res) =>
    Promise.resolve(getFilePath(URL.parse(req.url), mimeRoutes))
        .then(readFileUTF8)
        .then(identity, readNotFound)
        .then(writeToRes(res))
        .then(logger(req.url));

// serverAtPort :: Number -> Promise Object Error
const serverAtPort = port => new Promise(((resolve, reject) => {
    const server = http.createServer(worker)
        .on('error', reject)
        .on('listening', () => resolve(server))
        .listen(port)
}));

serverAtPort(process.env.PORT || 3000)
    .then(server => console.log('serving on port:', server.address().port))
    .catch(errorHandler);

