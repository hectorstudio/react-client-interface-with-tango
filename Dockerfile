FROM smebberson/alpine-nginx-nodejs:4.4.0

EXPOSE 80

RUN mkdir /webjive
WORKDIR /webjive

COPY package.json .
RUN npm i

COPY public public
COPY src src

RUN npm run build
RUN mv build/* /usr/html
