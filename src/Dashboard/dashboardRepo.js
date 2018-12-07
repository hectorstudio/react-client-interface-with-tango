export const save = (id, canvases) => {
  return fetch("/dashboards/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ id: id, canvases: canvases })
  }).then(res => (res.ok ? res.json() : null));
};

export const load = id => {
  return fetch("/dashboards/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(res => res.json());
}; 
