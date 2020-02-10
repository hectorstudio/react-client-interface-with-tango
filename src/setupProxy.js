const proxy = require("http-proxy-middleware");

const proxies = {
<<<<<<< HEAD
  "/testdb/socket": {
    target: "http://localhost:22484",
=======
  "/kitslab/socket": {
    target: "https://webjive-test.maxiv.lu.se",
>>>>>>> origin/master
    secure: false,
    changeOrigin: true,
    ws: true
  },
<<<<<<< HEAD
  "/testdb/db": {
    target: "http://localhost:22484",
=======
  "/kitslab/db": {
    target: "https://webjive-test.maxiv.lu.se",
>>>>>>> origin/master
    secure: false,
    changeOrigin: true
  },
  "/auth": {
<<<<<<< HEAD
    target: "http://localhost:22484",
=======
    target: "https://webjive-test.maxiv.lu.se",
>>>>>>> origin/master
    secure: false,
    changeOrigin: true
  },
  "/dashboards": {
<<<<<<< HEAD
    target: "http://localhost:22484",
    secure: false,
    changeOrigin: true
  }
}
=======
    target: "https://webjive-test.maxiv.lu.se",
    secure: false,
    changeOrigin: true
  }
};
>>>>>>> origin/master

module.exports = function(app) {
  Object.entries(proxies).forEach(([endpoint, setting]) => {
    app.use(proxy(endpoint, setting));
  });
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/master
