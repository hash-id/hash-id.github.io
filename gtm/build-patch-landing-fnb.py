# Patch kecil untuk container GTM-NKPFBLZN: HANYA item baru untuk landing-fnb (kuis).
# Jalankan: python gtm/build-patch-landing-fnb.py  -> gtm/patch-landing-fnb.json
import json, os, datetime

ACC, CON = "6374821189", "263057276"
base = lambda **kw: {"accountId": ACC, "containerId": CON, **kw}
T = lambda k, v, t="TEMPLATE": {"type": t, "key": k, "value": v}

FIELDS = ["jumlah_outlet", "kota", "kendala", "sistem", "lead_tier"]
variables = [base(variableId=str(910 + i), name=f"dlv - {f}", type="v",
                  parameter=[T("name", f), T("dataLayerVersion", "2", "INTEGER"), T("setDefaultValue", "false", "BOOLEAN")],
                  formatValue={}) for i, f in enumerate(FIELDS)]

def ce(tid, name, ev):
    return base(triggerId=tid, name=name, type="CUSTOM_EVENT",
                customEventFilter=[{"type": "EQUALS", "parameter": [T("arg0", "{{_event}}"), T("arg1", ev)]}])
triggers = [ce("920", "CE - QuizStart", "QuizStart"), ce("921", "CE - QuizComplete", "QuizComplete")]

def ga4(tid, name, ev, params, trig):
    p = [T("eventName", ev), T("measurementIdOverride", "{{const - GA4 Measurement ID}}"),
         T("eventSettingsVariable", "{{GTES - common}}")]
    if params:
        p.append({"type": "LIST", "key": "eventSettingsTable", "list": [
            {"type": "MAP", "map": [T("parameter", f), T("parameterValue", "{{dlv - %s}}" % f)]} for f in params]})
    return base(tagId=tid, name=name, type="gaawe", tagFiringOption="ONCE_PER_EVENT",
                monitoringMetadata={"type": "MAP"}, consentSettings={"consentStatus": "NOT_SET"},
                parameter=p, firingTriggerId=[trig])

def meta(tid, name, ev, params, trig):
    props = ", ".join([f"{f}: {{{{dlv - {f}}}}}" for f in params] + ["content_category: {{js - angle}}"])
    html = f'<script>\n  if (window.fbq) fbq("trackCustom", "{ev}", {{ {props} }});\n</script>'
    return base(tagId=tid, name=name, type="html", tagFiringOption="ONCE_PER_EVENT",
                monitoringMetadata={"type": "MAP"}, consentSettings={"consentStatus": "NOT_SET"},
                parameter=[T("html", html), T("supportDocumentWrite", "false", "BOOLEAN")], firingTriggerId=[trig])

tags = [
    ga4("930", "GA4 - quiz_start", "quiz_start", [], "920"),
    ga4("931", "GA4 - quiz_complete", "quiz_complete", FIELDS, "921"),
    meta("932", "Meta - QuizStart", "QuizStart", [], "920"),
    meta("933", "Meta - QuizComplete", "QuizComplete", FIELDS, "921"),
]

out = {
    "exportFormatVersion": 2,
    "exportTime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "containerVersion": {
        "path": f"accounts/{ACC}/containers/{CON}/versions/0", "accountId": ACC, "containerId": CON,
        "containerVersionId": "0",
        "name": "Patch landing-fnb: QuizStart, QuizComplete (GA4 + Meta)",
        "description": "Hanya item baru. Import Merge + Rename conflicting.",
        "container": {"path": f"accounts/{ACC}/containers/{CON}", "accountId": ACC, "containerId": CON,
                      "name": "HashRT", "publicId": "GTM-NKPFBLZN", "usageContext": ["WEB"], "fingerprint": "0",
                      "tagIds": ["GTM-NKPFBLZN"]},
        "tag": tags, "trigger": triggers, "variable": variables,
        "builtInVariable": [base(type="EVENT", name="Event")],
        "fingerprint": "0",
    },
}
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), "patch-landing-fnb.json")
json.dump(out, open(dst, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("ok", dst, len(tags), "tags", len(triggers), "triggers", len(variables), "variables")
