export default {
  async preloadUser() {
    try {
      const res = await fetch(process.env.REACT_APP_BASE_URL + "auth/user");
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
      const res = await fetch(process.env.REACT_APP_BASE_URL + "auth/login", init);
      return res.ok ? username : null;
    } catch (err) {
      return null;
    }
  },

  async logout() {
    try {
      const init = { method: "POST" };
      const res = await fetch(process.env.REACT_APP_BASE_URL + "auth/logout", init);
      return true;
    } catch (err) {
      return false;
    }
  },

  async extendLogin() {
    try {
      const init = { method: "POST" };
      const res = await fetch(process.env.REACT_APP_BASE_URL + "auth/extend", init);
      return true;
    } catch (err) {
      return false;
    }
  }
};
