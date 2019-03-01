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
