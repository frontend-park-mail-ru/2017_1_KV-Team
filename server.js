/**
 * Created by andreivinogradov on 15.02.17.
 */

'use strict';
const http = require('http');
const fs = require('fs');
const Maybe = require('data.maybe');
const Task = require('data.task');
const { safeProp } = require('./utils/helperFunctions');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

const routes = {
    '/': 'static/login.html',
    '/login': 'static/login.html',
    '/menu': 'static/menu.html',
    '/register': 'static/register.html',
    '/leaders': 'static/leaders.html',
    '/about': 'static/about.html',
    '/play': 'static/play.html'
};

// readFileUTF8 :: String -> Task Error String
const readFileUTF8 = filename => new Task((reject, resolve) =>
    fs.readFile(filename, 'utf8', (e, d) => e ? reject(e) : resolve(d)));

// serverAtPort :: Number -> Task Error Object
const serverAtPort = port => new Task(((reject, resolve) =>
    http.createServer((req, res) => resolve({ req, res })).on('error', reject).listen(port)));

// mb :: String -> _ -> Just String
const mb = url => () => Maybe.of(url);

// checkUrl :: String -> Maybe Nothing String
const checkUrl = url => url.endsWith('.js') ?
    mb('static/js' + url) : url.endsWith('.css') ?
    mb('static/css' + url) : safeProp(url);

// writeToRes :: Object -> Resolved
const writeToRes = res => Task.of(text => { res.write(text); res.end(); });

// getFilePath :: (String, Routes) -> Just String
const getFilePath = (url, routes) => checkUrl(url)(routes)
    .orElse(() => Maybe.of('static/404.html'));

// worker :: Object -> Object
const worker = ({ req, res }) =>
    writeToRes(res)
        .ap(readFileUTF8(getFilePath(req.url, routes).get()))
        .map(() => req.url);

serverAtPort(process.env.PORT || 3000)
    .chain(worker)
    .fork(errorHandler, logger);

