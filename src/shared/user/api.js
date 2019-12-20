import Cookies from "universal-cookie";

export default {
  async preloadUser() {
    try {
      const res = await fetch("/auth/user", {credentials: 'include'});
      const user = await res.json();
      if (!user.groups){
        user.groups = [];
      }
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
      let groups = [];
      try{
        groups = JSON.parse(window.atob(json.webjive_jwt.split('.')[1])).groups;
      }catch(err){}
      return res.ok ? {username, groups} : null;
    } catch (err) {
      return null;
    }
  },

  async logout() {
    try {
      const init = { method: "POST", credentials: 'include' };
      await fetch("/auth/logout", init);
      const cookies = new Cookies();
      cookies.set("webjive_jwt", "", { path: "/"});
      return true;
    } catch (err) {
      return false;
    }
  },

  async extendLogin() {
    try {
      const init = { method: "POST", credentials: 'include' };
      await fetch("/auth/extend", init);
      return true;
    } catch (err) {
      return false;
    }
  }
};
