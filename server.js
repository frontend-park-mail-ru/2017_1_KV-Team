/**
 * Created by andreivinogradov on 15.02.17.
 */

'use strict';
const http = require('http');
const fs = require('fs');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const URL = require('url');
const path = require('path');

const BASE_ROUTE = 'static';

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt',
    '': 'text/html'
};

const mimeRoutes = {
    '': BASE_ROUTE,
    '.css': BASE_ROUTE + '/style',
    '.js': BASE_ROUTE + '/js',
    '.ico': BASE_ROUTE + '/images',
    '.jpg': BASE_ROUTE + '/images'
};

// readNotFound :: _ -> String
const readNotFound = () => readFile(BASE_ROUTE + '/404.html');

// writeToRes :: Object -> Undefined
const writeToRes = (res, req) => text => {
    const ext = path.parse(URL.parse(req.url).pathname).ext;
    res.setHeader('Content-type', mimeType[ext] || 'text/plain');
    res.write(text, 'utf8');
    res.end();
};

// getFilePath :: (String, Object) -> String
const getFilePath = (url, mimeRoutes) => {
    const ext = path.parse(url.pathname).ext;
    const filePath = mimeRoutes[ext] + url.pathname;
    return ext ? filePath : filePath + '.html';
};

// readFile :: String -> Promise String Error
const readFile = filename => new Promise((resolve, reject) =>
    fs.readFile(filename, (e, d) => e ? reject(e) : resolve(d)));

// worker :: (Object, Object) -> Promise Undefined Error
const worker = (req, res) =>
    Promise.resolve(getFilePath(URL.parse(req.url), mimeRoutes))
        .then(readFile)
        .catch(readNotFound)
        .then(writeToRes(res, req))
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

