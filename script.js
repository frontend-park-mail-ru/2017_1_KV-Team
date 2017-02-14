/**
 * Created by maxim on 10.02.17.
 */
'use strict';
const http = require('http');
const fs = require('fs');

const routes = {
    '/' : 'static/login.html',
    '/login' : 'static/login.html',
    '/menu' : 'static/menu.html',
    '/register' : 'static/register.html',
    '/leaders' : 'static/leaders.html',
    '/about' : 'static/about.html',
    '/play' : 'static/play.html',
};

const server = http.createServer( function(req, resp){
    const url = req.url;
    let text;
    try {
        if (url in routes) {
            text = fs.readFileSync(routes[url], 'utf8');
            resp.writeHead(200, {"Content-Type": "text/html"});
        } else if (url.endsWith('.js')) {
            text = fs.readFileSync('static/js' + url, 'utf8');
            resp.writeHead(200, {"Content-Type": "text/html"});
        }
    }catch(ex){}
    if(text === undefined){
        text = '<h1 align="center">404</h1>';
        resp.writeHead(404, {"Content-Type": "text/html"});
    }
    resp.write(text);
    resp.end();
});
const port = process.env.PORT || 3000;
console.log('Сервер запущен');
server.listen(port);

