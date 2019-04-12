const proxy = require("http-proxy-middleware");

const proxies = {
  "/kitslab/socket": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true,
    ws: true
  },
  "/kitslab/db": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  },
  "/auth": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  },
  "/dashboards": {
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  }
};

module.exports = function(app) {
  Object.entries(proxies).forEach(([endpoint, setting]) => {
    app.use(proxy(endpoint, setting));
  });
};
