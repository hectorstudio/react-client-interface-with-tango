FROM node:9.11.2-alpine AS build

COPY . /home/node/app

RUN cd /home/node/app && \
    npm install --no-cache && \
    npm run build && \
    rm -rf node_modules

FROM nginx:1.15.0-alpine

EXPOSE 80

COPY --from=build /home/node/app/build /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/
