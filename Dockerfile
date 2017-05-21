FROM ubuntu:16.04
MAINTAINER KVTeam

RUN apt-get -y update
RUN apt-get install -y wget curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y software-properties-common \
    && apt-add-repository -y ppa:nginx/stable \
    && apt-get update \
    && apt-get install -y nginx \
    && rm -rf /var/lib/apt/lists/*

ADD . /TheLastSiege-Frontend
WORKDIR /TheLastSiege-Frontend
RUN mv productionBackendUrls.js static/application/backendUrls.js \
    && npm install \
    && npm run deploy \
    && cp static/index.html /usr/share/nginx/html/index.html \
    && cp static/style.css /usr/share/nginx/html/style.css \
    && cp static/style.css.map /usr/share/nginx/html/style.css.map \
    && cp static/serviceWorker.js /usr/share/nginx/html/serviceWorker.js \
    && cp static/bundle.js /usr/share/nginx/html/bundle.js \
    && cp static/bundle.js.map /usr/share/nginx/html/bundle.js.map \
    && cp static/vendor.bundle.js /usr/share/nginx/html/vendor.bundle.js \
    && cp static/vendor.bundle.js.map /usr/share/nginx/html/vendor.bundle.js.map \
    && mkdir -p /usr/share/nginx/html/game \
    && cp -avr static/images /usr/share/nginx/html/images \
    && cp -avr static/game/assets /usr/share/nginx/html/game/assets

WORKDIR /
RUN rm -r /TheLastSiege-Frontend && apt-get purge -y nodejs

ADD nginx.conf /etc/nginx/nginx.conf

# RUN rm /etc/nginx/sites-enabled/default

RUN cat /etc/nginx/nginx.conf
RUN ls -la /usr/share/nginx/html

CMD /bin/bash -c "echo \"listen 80;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
