const proxy = require("http-proxy-middleware");

const proxies = {
  "/testdb/socket": {
    target: "http://localhost:22484",
  "/kitslab/socket": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true,
    ws: true
  },
  "/testdb/db": {
    target: "http://localhost:22484",
  "/kitslab/db": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  },
  "/auth": {
    target: "http://localhost:22484",
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  },
  "/dashboards": {
    target: "http://localhost:22484",
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  }
