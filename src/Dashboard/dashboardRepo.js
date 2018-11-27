export const save = (id, canvases, callback) => {
  fetch('/dashboards/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({id : id, canvases: canvases})
    
  }).then((res) => res.json())
  .then((res) => {
    callback(res)
  })
  .catch(function(){
    console.log("Couldn't reach dashboard repo");
  });
}

export const load = (id, callback) => {
  fetch('/dashboards/' + id, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => res.ok ? res.json() : null)
  .then((res) => callback(res))
}