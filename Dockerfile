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
    && mkdir -p /data/www \
    && cp static/index.html /data/www/index.html \
    && cp static/style.css /data/www/style.css \
    && cp static/style.css.map /data/www/style.css.map \
    && cp static/serviceWorker.js /data/www/serviceWorker.js \
    && cp static/bundle.js /data/www/bundle.js \
    && cp static/vendor.bundle.js /data/www/vendor.bundle.js \
    && mkdir -p /data/www/game \
    && cp -avr static/images /data/www/images \
    && cp -avr static/game/assets /data/www/game/assets

WORKDIR /
RUN rm -r /TheLastSiege-Frontend && apt-get purge -y nodejs

ADD nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/sites-enabled/default

RUN cat /etc/nginx/nginx.conf
RUN ls /
RUN ls /data/www
RUN cat /data/www/index.html
RUN echo $PORT

CMD /bin/bash -c "echo \"listen $PORT;\" > /etc/nginx/listen.conf && nginx -g 'daemon off;'"
