const proxy = require("http-proxy-middleware");

const proxies = {
  "/testdb/socket": {
    target: "http://localhost:22484",
    secure: false,
    changeOrigin: true,
    ws: true
  },
  "/testdb/db": {
    target: "http://localhost:22484",
    secure: false,
    changeOrigin: true
  },
  "/auth": {
    target: "http://localhost:22484",
    secure: false,
    changeOrigin: true
  },
  "/dashboards": {
    target: "http://localhost:22484",
    secure: false,
    changeOrigin: true
  }
};


module.exports = function(app) {
  Object.entries(proxies).forEach(([endpoint, setting]) => {
    app.use(proxy(endpoint, setting));
  });
};