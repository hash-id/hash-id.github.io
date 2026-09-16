// Membangun file import container GTM yang sinkron dengan script.js HashRT LP.
const fs = require("fs");
const path = require("path");

const ACCOUNT = "6374821189";
const CONTAINER = "263057276";
const PUBLIC_ID = "GTM-NKPFBLZN";

const base = (id) => ({
  accountId: ACCOUNT,
  containerId: CONTAINER,
  ...id,
});

let vId = 0, tId = 0, trId = 0;
const variables = [], triggers = [], tags = [];
const trigId = {};

// ---------- helpers ----------
const P = (key, value, type = "TEMPLATE") => ({ type, key, value });
const LIST = (key, rows) => ({
  type: "LIST",
  key,
  list: rows.map((r) => ({ type: "MAP", map: r })),
});

function dlv(name, key) {
  variables.push(base({
    variableId: String(++vId),
    name,
    type: "v",
    parameter: [P("name", key), P("dataLayerVersion", "2", "INTEGER"), P("setDefaultValue", "false", "BOOLEAN")],
    formatValue: {},
  }));
}
function constant(name, value) {
  variables.push(base({
    variableId: String(++vId),
    name, type: "c",
    parameter: [P("value", value)],
  }));
}
function customJs(name, js) {
  variables.push(base({
    variableId: String(++vId),
    name, type: "jsm",
    parameter: [P("javascript", js)],
  }));
}
function regexTable(name, input, rows, def) {
  variables.push(base({
    variableId: String(++vId),
    name, type: "remm",
    parameter: [
      P("input", input),
      P("setDefaultValue", "true", "BOOLEAN"),
      P("defaultValue", def),
      P("fullMatch", "true", "BOOLEAN"),
      P("ignoreCase", "true", "BOOLEAN"),
      P("replaceAfterMatch", "false", "BOOLEAN"),
      LIST("map", rows.map(([k, v]) => [P("key", k), P("value", v)])),
    ],
  }));
}
function gtes(name, params) {
  variables.push(base({
    variableId: String(++vId),
    name, type: "gtes",
    parameter: [LIST("eventSettingsTable", params.map(([k, v]) => [P("parameter", k), P("parameterValue", v)]))],
  }));
}
function customEvent(name, eventName) {
  const id = String(++trId);
  trigId[eventName] = id;
  triggers.push(base({
    triggerId: id,
    name,
    type: "CUSTOM_EVENT",
    customEventFilter: [{
      type: "EQUALS",
      parameter: [P("arg0", "{{_event}}"), P("arg1", eventName)],
    }],
  }));
  return id;
}
function tag(o) {
  tags.push(base({
    tagId: String(++tId),
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
    ...o,
  }));
}

const ALL_PAGES = "2147479553";
const INITIALIZATION = "2147479573";

// ---------- VARIABLES ----------
constant("const - GA4 Measurement ID", "G-HX4FKLT4BW"); // property GA4 "hash.id"

// Field yang di-push script.js
dlv("dlv - angle", "angle");
dlv("dlv - location", "location");
dlv("dlv - method", "method");
dlv("dlv - element_type", "element_type");
dlv("dlv - element_label", "element_label");
dlv("dlv - element_location", "element_location");
dlv("dlv - link_url", "link_url");
dlv("dlv - to_whatsapp", "to_whatsapp");
dlv("dlv - section", "section");
dlv("dlv - percent_scrolled", "percent_scrolled");
dlv("dlv - engaged_seconds", "engaged_seconds");
dlv("dlv - utm_source", "utm_source");
dlv("dlv - utm_medium", "utm_medium");
dlv("dlv - utm_campaign", "utm_campaign");
dlv("dlv - utm_content", "utm_content");
dlv("dlv - page_path", "page_path");

// angle cadangan dari path: dipakai saat page_view (fire sebelum page_meta di-push)
regexTable("rt - angle from path", "{{Page Path}}", [
  ["^/(index\\.html)?$", "angle-tumbuh-sistem"],
  ["^/landing-multichannel/.*", "angle-multichannel"],
  ["^/landing-cautionary/.*", "angle-cautionary"],
  ["^/landing-accounting/.*", "angle-accounting"],
], "website");

customJs("js - angle", `function () {
  // Prioritas: field angle dari dataLayer (config.js). Kalau belum ada
  // (mis. saat page_view awal), tebak dari path URL.
  var a = {{dlv - angle}};
  if (a) return a;
  var b = document.body && document.body.getAttribute("data-angle");
  if (b) return b;
  return {{rt - angle from path}};
}`);

customJs("js - is landing page", `function () {
  return {{Page Hostname}} === "promo.hash.id";
}`);

gtes("GTES - common", [
  ["angle", "{{js - angle}}"],
  ["site_type", "{{js - is landing page}}"],
]);

// ---------- TRIGGERS ----------
customEvent("CE - generate_lead", "generate_lead");
customEvent("CE - cta_click", "cta_click");
customEvent("CE - element_click", "element_click");
customEvent("CE - scroll_depth", "scroll_depth");
customEvent("CE - view_section", "view_section");
customEvent("CE - engaged_view", "engaged_view");
customEvent("CE - whatsapp_click", "whatsapp_click"); // disediakan, TIDAK dipakai tag (hindari dobel dgn generate_lead)
customEvent("CE - page_meta", "page_meta");           // disediakan, TIDAK dipakai tag (metadata internal)

// ---------- TAGS: GA4 ----------
tag({
  name: "GA4 - Google Tag (config)",
  type: "googtag",
  parameter: [
    P("tagId", "{{const - GA4 Measurement ID}}"),
    P("eventSettingsVariable", "{{GTES - common}}"),
    LIST("configSettingsTable", [[P("parameter", "send_page_view"), P("parameterValue", "true")]]),
  ],
  firingTriggerId: [INITIALIZATION],
});

function ga4Event(name, eventName, params, triggerKey) {
  tag({
    name,
    type: "gaawe",
    parameter: [
      P("eventName", eventName),
      P("measurementIdOverride", "{{const - GA4 Measurement ID}}"),
      P("eventSettingsVariable", "{{GTES - common}}"),
      LIST("eventSettingsTable", params.map(([k, v]) => [P("parameter", k), P("parameterValue", v)])),
    ],
    firingTriggerId: [trigId[triggerKey]],
  });
}
ga4Event("GA4 - generate_lead (KEY EVENT)", "generate_lead",
  [["location", "{{dlv - location}}"], ["method", "{{dlv - method}}"]], "generate_lead");
ga4Event("GA4 - cta_click", "cta_click",
  [["location", "{{dlv - location}}"], ["to_whatsapp", "{{dlv - to_whatsapp}}"]], "cta_click");
ga4Event("GA4 - element_click", "element_click", [
  ["element_type", "{{dlv - element_type}}"],
  ["element_label", "{{dlv - element_label}}"],
  ["element_location", "{{dlv - element_location}}"],
  ["link_url", "{{dlv - link_url}}"],
  ["to_whatsapp", "{{dlv - to_whatsapp}}"],
], "element_click");
ga4Event("GA4 - scroll_depth", "scroll_depth",
  [["percent_scrolled", "{{dlv - percent_scrolled}}"]], "scroll_depth");
ga4Event("GA4 - view_section", "view_section",
  [["section", "{{dlv - section}}"]], "view_section");
ga4Event("GA4 - engaged_view", "engaged_view",
  [["engaged_seconds", "{{dlv - engaged_seconds}}"]], "engaged_view");

// Meta Pixel: TIDAK dibuat di sini. Container sudah punya tag template Meta
// (FB_CONVERSIONS_API-...-Pixel_Template, opt-in CAPI). Cukup ganti trigger-nya
// ke: DOM Ready + CE - generate_lead + CE - engaged_view (lihat PANDUAN-IMPORT.md).

// ---------- BUILT-IN VARIABLES ----------
const builtIn = ["PAGE_URL", "PAGE_HOSTNAME", "PAGE_PATH", "REFERRER", "EVENT",
  "CLICK_ELEMENT", "CLICK_URL", "CLICK_TEXT", "CLICK_CLASSES", "CLICK_ID"].map((t) =>
  base({ type: t, name: {
    PAGE_URL: "Page URL", PAGE_HOSTNAME: "Page Hostname", PAGE_PATH: "Page Path",
    REFERRER: "Referrer", EVENT: "Event", CLICK_ELEMENT: "Click Element", CLICK_URL: "Click URL",
    CLICK_TEXT: "Click Text", CLICK_CLASSES: "Click Classes", CLICK_ID: "Click ID" }[t] }));

const out = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString().replace("T", " ").slice(0, 19),
  containerVersion: {
    path: `accounts/${ACCOUNT}/containers/${CONTAINER}/versions/0`,
    accountId: ACCOUNT,
    containerId: CONTAINER,
    containerVersionId: "0",
    name: "HashRT LP tracking - sync with script.js",
    description: "Variables/Triggers/Tags yang match dengan event dataLayer di script.js (promo.hash.id).",
    container: {
      path: `accounts/${ACCOUNT}/containers/${CONTAINER}`,
      accountId: ACCOUNT,
      containerId: CONTAINER,
      name: "HashRT",
      publicId: PUBLIC_ID,
      usageContext: ["WEB"],
      fingerprint: "0",
      tagManagerUrl: `https://tagmanager.google.com/#/container/accounts/${ACCOUNT}/containers/${CONTAINER}/workspaces?apiLink=container`,
      features: {
        supportUserPermissions: true, supportEnvironments: true, supportWorkspaces: true,
        supportGtagConfigs: false, supportBuiltInVariables: true, supportClients: false,
        supportFolders: true, supportTags: true, supportTemplates: true, supportTriggers: true,
        supportVariables: true, supportVersions: true, supportZones: true, supportTransformations: false,
      },
      tagIds: [PUBLIC_ID],
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: builtIn,
    fingerprint: "0",
    tagManagerUrl: `https://tagmanager.google.com/#/versions/accounts/${ACCOUNT}/containers/${CONTAINER}/versions/0?apiLink=version`,
  },
};

const outFile = process.argv[2];
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(`OK: ${variables.length} variables, ${triggers.length} triggers, ${tags.length} tags -> ${outFile}`);
