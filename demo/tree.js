fetch("materials_master.json")
  .then(res => res.json())
  .then(data => {
    const root = document.getElementById("root");

    // global controls
    const controls = document.createElement("div");
    controls.style.marginBottom = "12px";

    const expandBtn = document.createElement("button");
    expandBtn.textContent = "Expand all";
    expandBtn.onclick = () =>
      document.querySelectorAll("details").forEach(d => d.open = true);

    const collapseBtn = document.createElement("button");
    collapseBtn.textContent = "Collapse all";
    collapseBtn.style.marginLeft = "8px";
    collapseBtn.onclick = () =>
      document.querySelectorAll("details").forEach(d => d.open = false);

    controls.appendChild(expandBtn);
    controls.appendChild(collapseBtn);
    root.appendChild(controls);

    data.materials.forEach((material, idx) => {
      const node = renderNode(material.name || `material_${idx}`, material);
      node.open = true; // material open, internals collapsed
      root.appendChild(node);
    });
  });

/* -----------------------------
   CONFIG: auto-collapse these
------------------------------ */
const AUTO_COLLAPSE_KEYS = new Set([
  "processing_steps",
  "processing_route",
  "zt",
  "seebeck",
  "power_factor",
  "thermal_conductivity",
  "electrical_conductivity",
  "electrical_resistivity"
]);

function renderNode(label, value) {
  const container = document.createElement("details");

  // collapse long sections by default
  container.open = !AUTO_COLLAPSE_KEYS.has(label);

  const summary = document.createElement("summary");

  let badge = "";
  if (Array.isArray(value)) {
    badge = ` <span class="badge">[${value.length}]</span>`;
  }

  summary.innerHTML = `<span class="key">${label}</span>${badge}`;
  container.appendChild(summary);

  if (value === null) {
    container.appendChild(makeLeaf("value", null));
    return container;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) =>
      container.appendChild(renderNode(`[${i}]`, item))
    );
    return container;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        container.appendChild(renderNode(k, v));
      } else {
        container.appendChild(makeLeaf(k, v));
      }
    });
    return container;
  }

  container.appendChild(makeLeaf(label, value));
  return container;
}

function makeLeaf(key, value) {
  const leaf = document.createElement("div");
  leaf.className = "leaf";

  let val;
  if (value === null) val = `<span class="null">null</span>`;
  else if (typeof value === "number") val = `<span class="number">${value}</span>`;
  else val = `<span class="string">"${value}"</span>`;

  leaf.innerHTML = `<span class="key">${key}</span>: ${val}`;
  return leaf;
}
