const headers = {
  "Content-Type": "application/json; charset=utf-8"
};

/**
 * [backwards compatibility] In case we loaded a dashboard with widgets that don't have 
 * order set on them, we assign them a incrementing integer order starting with zero here
 * Assuming the dashboard is edited in some way, this order will get saved to the database as well
 */
function ensureProperOrdering(widgets){
  let highest = widgets.reduce((max, current) => Math.max(max, current.order || -1), -1);
  widgets.forEach(widget => {
    if (!widget.hasOwnProperty("order")){
      highest++;
      widget.order = highest;
    }
  });
}

export async function save(id, widgets, name) {
  const withoutValid = widgets.map(widget => {
    const { valid, ...theRest } = widget;
    return theRest;
  });

  const res = await fetch("/dashboards/", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      id,
      widgets: withoutValid,
      name,
      tangoDB: getTangoDB()
    })
  });
  if (!res.ok) {
    throw res;
  }
  return res.ok ? res.json() : null;
}

export async function load(id) {
  const res = await fetch("/dashboards/" + id, {
    method: "GET",
    credentials: "include",
    headers
  });
  const dashboard = await res.json();
  ensureProperOrdering(dashboard.widgets);
  return dashboard;
}

export async function getGroupDashboardCount() {
  const res = await fetch(
    "/dashboards/group/dashboardsCount?excludeCurrentUser=true&tangoDB=" +
      getTangoDB(),
    {
      method: "GET",
      credentials: "include",
      headers
    }
  );
  return res.json();
}

export async function getGroupDashboards(groupName) {
  const res = await fetch(
    "/dashboards/group/dashboards?excludeCurrentUser=true&group=" +
      groupName +
      "&tangoDB=" +
      getTangoDB(),
    {
      method: "GET",
      credentials: "include",
      headers
    }
  );
  return res.json();
}

export async function loadUserDashboards() {
  const res = await fetch(
    "/dashboards/user/dashboards?tangoDB=" + getTangoDB(),
    {
      method: "GET",
      credentials: "include",
      headers
    }
  );
  return res.json();
}

export async function deleteDashboard(dashboardId) {
  const res = await fetch("/dashboards/" + dashboardId, {
    method: "DELETE",
    credentials: "include",
    headers
  });
  return res.json();
}

export async function cloneDashboard(dashboardId) {
  const res = await fetch("/dashboards/" + dashboardId + "/clone", {
    method: "POST",
    credentials: "include",
    headers
  });
  return res.json();
}

export async function shareDashboard(dashboardId, group) {
  const res = await fetch("/dashboards/" + dashboardId + "/share", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ group })
  });
  return res.json();
}

export async function renameDashboard(id, newName) {
  const res = await fetch("/dashboards/" + id + "/rename", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ newName })
  });
  return res.json();
}

function getTangoDB() {
  try {
    return window.location.pathname.split("/")[1];
  } catch (e) {
    return "";
  }
}
