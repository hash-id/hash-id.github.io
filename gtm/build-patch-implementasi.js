// Patch kecil untuk container GTM-NKPFBLZN: HANYA item baru untuk implementasi-odoo
// (wa_click, view_paket, Meta Contact). Diambil dari hashrt-gtm-container.json
// (hasil build-gtm.js) supaya isinya sama persis. ID dinomori ulang mulai 900
// supaya tidak bentrok dengan item yang sudah ada di workspace.
// Import: Merge -> "Rename conflicting tags, triggers, and variables".
const fs = require("fs");
const path = require("path");
const full = JSON.parse(fs.readFileSync(path.join(__dirname, "hashrt-gtm-container.json"), "utf8"));
const cv = full.containerVersion;

const VARS = ["dlv - button_location", "dlv - paket"];
const TRIGS = ["CE - wa_click", "CE - view_paket"];
const TAGS = ["GA4 - wa_click", "GA4 - view_paket", "Meta - Contact (wa_click)"];

let next = 900;
const trigMap = {};
const variable = cv.variable.filter((v) => VARS.includes(v.name)).map((v) => ({ ...v, variableId: String(next++) }));
const trigger = cv.trigger.filter((t) => TRIGS.includes(t.name)).map((t) => {
  const id = String(next++); trigMap[t.triggerId] = id; return { ...t, triggerId: id };
});
const tag = cv.tag.filter((t) => TAGS.includes(t.name)).map((t) => ({
  ...t, tagId: String(next++), firingTriggerId: t.firingTriggerId.map((id) => trigMap[id]),
}));
if (variable.length !== VARS.length || trigger.length !== TRIGS.length || tag.length !== TAGS.length) {
  throw new Error("item patch tidak lengkap - jalankan build-gtm.js dulu");
}
const out = {
  ...full,
  containerVersion: {
    ...cv,
    name: "Patch implementasi-odoo: wa_click, view_paket, Meta Contact",
    description: "Hanya item baru. Import Merge + Rename conflicting.",
    tag, trigger, variable,
    builtInVariable: cv.builtInVariable.filter((b) => b.type === "EVENT"),
  },
};
const outFile = process.argv[2] || path.join(__dirname, "patch-implementasi-odoo.json");
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(`OK: ${variable.length} variables, ${trigger.length} triggers, ${tag.length} tags -> ${outFile}`);
