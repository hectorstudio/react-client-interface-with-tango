export const save = (state, callback) => {
  fetch('/dashboards/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(state)
    
  }).then((res) => res.json())
  .then((res) => callback(res))
  .catch(function(){
    console.log("Couldn't reach dashboard repo");
  });
}

export const load = (callback) => {
  fetch('/dashboards/', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => res.ok ? res.json() : null)
  .then((res) => callback(res))
}