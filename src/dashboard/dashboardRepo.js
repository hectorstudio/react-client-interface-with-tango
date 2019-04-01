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
      resolve([{id: "123", name: "test"}, {id: "1234", name: "test2"}, {id: "1235", name: "test3"}, {id: "1236", name: "test4"}, ]);
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
export async function renameDashboard(dashboardId, newName) {
  return await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({id: dashboardId, name: newName});
    }, 300);
  });
}
