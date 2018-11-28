export const save = (id, canvases) => {
  return fetch('/dashboards/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({id : id, canvases: canvases})
  });
}

export const load = (id) => {
  return fetch('/dashboards/' + id, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
}