const headers = {
  "Content-Type": "application/json; charset=utf-8"
};

export async function save(id, widgets) {
  const withoutValid = widgets.map(widget => {
    const { valid, ...theRest } = widget;
    return theRest;
  });

  const res = await fetch("/dashboards/", {
    method: "POST",
    headers,
    body: JSON.stringify({ id, widgets: withoutValid })
  });
  if (!res.ok){
    throw res;
  }
  return res.ok ? res.json() : null;
}

export async function load(id) {
  const res = await fetch("/dashboards/" + id, {
    method: "GET",
    headers
  });
  return res.json();
}

//TODO use correct endpoint when it exists.
export async function loadUserDashboards() {
  return await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve([{id: "5c9cd45b7aeef9352a7beb07", name: "test"}, {id: "5c9cd8c13c331e6014b8d384", name: "test2"}, {id: "5c9ce2dded681539a9979bcb", name: "test3"}, {id: "5c9dca9d9333ee18ce6d0e0e", name: "test4"}, ]);
    }, 300);
  });
}


//TODO use correct endpoint when it exists.
export async function deleteDashboard(dashboardId) {
  return await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("a7b8207ef");
    }, 300);
  });
}

//TODO use correct endpoint when it exists.
export async function cloneDashboard(dashboardId, newUserId) {
  return await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("a7b8207ef");
    }, 300);
  });
}

//TODO use correct endpoint when it exists.
export async function renameDashboard(id, newName) {
  return await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({id, name: newName});
    }, 100);
  });
}
