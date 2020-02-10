<<<<<<< HEAD
import Cookies from "universal-cookie";

export default {
  async preloadUser() {
    try {
      const res = await fetch("/auth/user", {credentials: 'include'});
      const user = await res.json();
      if (!user.groups){
        user.groups = [];
      }
=======
export default {
  async preloadUser() {
    try {
      const res = await fetch("/auth/user");
      const user = await res.json();
>>>>>>> origin/master
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
<<<<<<< HEAD
      const json = await res.json()
      const cookies = new Cookies();
      cookies.set("webjive_jwt", json.webjive_jwt, { path: "/"});
      let groups = [];
      try{
        groups = JSON.parse(window.atob(json.webjive_jwt.split('.')[1])).groups;
      }catch(err){}
      return res.ok ? {username, groups} : null;
=======
      return res.ok ? username : null;
>>>>>>> origin/master
    } catch (err) {
      return null;
    }
  },

  async logout() {
    try {
<<<<<<< HEAD
      const init = { method: "POST", credentials: 'include' };
      await fetch("/auth/logout", init);
      const cookies = new Cookies();
      cookies.set("webjive_jwt", "", { path: "/"});
=======
      const init = { method: "POST" };
      await fetch("/auth/logout", init);
>>>>>>> origin/master
      return true;
    } catch (err) {
      return false;
    }
  },

  async extendLogin() {
    try {
<<<<<<< HEAD
      const init = { method: "POST", credentials: 'include' };
=======
      const init = { method: "POST" };
>>>>>>> origin/master
      await fetch("/auth/extend", init);
      return true;
    } catch (err) {
      return false;
    }
  }
};
