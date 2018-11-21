export default {
async save(canvases, dashboardID) {
    const init = {
      method: "POST",
      body: JSON.stringify({ id: dashboardID, canvases }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    try {
      const res = await fetch('/dashboards/', init);
      return res;
    } catch (err) {
      return null;
    }
  }
};