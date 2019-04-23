const headers = {
  "Content-Type": "application/json; charset=utf-8"
};

export async function save(id, widgets, name) {
  const withoutValid = widgets.map(widget => {
    const { valid, ...theRest } = widget;
    return theRest;
  });

  const res = await fetch("/dashboards/", {
    method: "POST",
    headers,
    body: JSON.stringify({ id, widgets: withoutValid, name })
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

export async function loadUserDashboards() {
  const res = await fetch("/dashboards/user/dashboards/", {
    method: "GET",
    headers
  });
  return res.json();
}


export async function deleteDashboard(dashboardId) {
  const res = await fetch("/dashboards/" + dashboardId, {
    method: "DELETE",
    headers
  });
  return res.json();
}

export async function cloneDashboard(dashboardId) {
  const res = await fetch("/dashboards/" + dashboardId + "/clone", {
    method: "POST",
    headers
  });
  return res.json();
}

export async function renameDashboard(id, newName) {
  const res = await fetch("/dashboards/" + id + "/rename", {
    method: "POST",
    headers,
    body: JSON.stringify({ newName })
  });
  return res.json();
}
