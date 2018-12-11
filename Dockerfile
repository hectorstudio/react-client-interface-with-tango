FROM node:9.11.2-alpine AS build

WORKDIR /home/node/app

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

COPY package.json package-lock.json ./
RUN npm install --no-cache

COPY tsconfig.json tsconfig.prod.json tslint.json ./
COPY src src
COPY public public

RUN npm run build

FROM nginx:1.15.0-alpine

EXPOSE 80

COPY --from=build /home/node/app/build /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/

