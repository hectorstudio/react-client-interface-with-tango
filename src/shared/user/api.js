import Cookies from "universal-cookie";

export default {
  async preloadUser() {
    try {
      const res = await fetch("/auth/user", {credentials: 'include'});
      const user = await res.json();
      return user;
    } catch (err) {
      return null;
    }
  },

  async login(username, password) {
    const init = {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    try {
      const res = await fetch("/auth/login", init);
      const json = await res.json()
      const cookies = new Cookies();
      cookies.set("webjive_jwt", json.webjive_jwt, { path: "/"});
      return res.ok ? username : null;
    } catch (err) {
      return null;
    }
  },

  async logout() {
    try {
      const init = { method: "POST" };
      await fetch("/auth/logout", {credentials: 'include'}, init);
      const cookies = new Cookies();
      cookies.set("webjive_jwt", "", { path: "/"});
      return true;
    } catch (err) {
      return false;
    }
  },

  async extendLogin() {
    try {
      const init = { method: "POST" };
      await fetch("/auth/extend", {credentials: 'include'}, init);
      return true;
    } catch (err) {
      return false;
    }
  }
};
