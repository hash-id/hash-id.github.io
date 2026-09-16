# GTM `GTM-NKPFBLZN` (container "hash.id") — sinkron dengan `script.js`

Status per 16 Sep 2026: **sudah di-import & diverifikasi di Preview, belum di-publish.**
Workspace: Default Workspace (50 perubahan). Tinggal **Submit → Publish**.

## Yang ada di container sekarang

### Tag (10)

| Tag | Trigger | Status | Fungsi |
|---|---|---|---|
| `GA4 - Google Tag (config)` | Initialization - All Pages | aktif | `page_view` + parameter `angle`/`site_type` ke semua event (via `GTES - common`) |
| `GA4 - generate_lead (KEY EVENT)` | `CE - generate_lead` | aktif | konversi utama; param `location`, `method` |
| `GA4 - cta_click` | `CE - cta_click` | aktif | `location`, `to_whatsapp` |
| `GA4 - element_click` | `CE - element_click` | aktif | `element_type/label/location`, `link_url`, `to_whatsapp` |
| `GA4 - scroll_depth` | `CE - scroll_depth` | aktif | `percent_scrolled` |
| `GA4 - view_section` | `CE - view_section` | aktif | `section` |
| `GA4 - engaged_view` | `CE - engaged_view` | aktif | `engaged_seconds` |
| `FB_CONVERSIONS_API-…-Pixel_Template` (Meta Pixel, CAPI opt-in) | DOM Ready + `CE - generate_lead` + `CE - engaged_view` | aktif, **trigger diganti** | `PageView`, `Lead`, `engaged_view`; object props `content_name={{js - angle}}`, `content_category={{dlv - location}}` |
| `FB_CONVERSIONS_API-…-GA4_Config` | DOM Ready | **paused** | dobel dengan `GA4 - Google Tag (config)` |
| `FB_CONVERSIONS_API-…-GA4_Event` | catch-all | **paused** | mengirim semua event mentah (termasuk `gtm.dom`) ke GA4 tanpa `angle` |

Tag Meta **tidak** diganti pixel custom HTML karena template bawaan Meta sudah
opt-in *Meta-enabled Conversions API* (event ID dedup, cookie fbp/fbc). Yang
diubah cuma trigger (dulu catch-all → semua dataLayer event masuk Meta) dan
object properties.

### Trigger (8 + 2 bawaan Meta)

`CE - generate_lead`, `CE - cta_click`, `CE - element_click`, `CE - scroll_depth`,
`CE - view_section`, `CE - engaged_view` dipakai tag. `CE - whatsapp_click` dan
`CE - page_meta` **sengaja tidak dipakai** (whatsapp_click selalu fire bareng
generate_lead → jangan dobel konversi; page_meta metadata internal).
Trigger lama `FB_…-Trigger-Custom_Event` (catch-all) sekarang tidak dipakai tag mana pun.

### Variable (21 baru)

- `dlv - *` — satu per field yang di-push `script.js`
  (`angle`, `location`, `method`, `element_*`, `link_url`, `to_whatsapp`, `section`,
  `percent_scrolled`, `engaged_seconds`, `utm_*`, `page_path`).
- `js - angle` — `dlv - angle` → fallback `body[data-angle]` → fallback `rt - angle from path`.
  Perlu karena `page_view` fire di Initialization, sebelum `page_meta` di-push.
  Di halaman selain LP nilainya `website` → LP vs website bisa dipisah di report.
- `js - is landing page` — `true` kalau hostname `promo.hash.id`.
- `GTES - common` — Event Settings: `angle`, `site_type`, dilampirkan ke semua tag GA4.
- `const - GA4 Measurement ID` = `G-HX4FKLT4BW`.
- Variabel `FB_CONVERSIONS_API-1093260756550533-*` (pixel kedua) tinggal sisa, tidak
  dipakai tag; boleh dihapus.

## Hasil Preview (landing-accounting, 16 Sep 2026)

| Event | Tag fire | Nilai terverifikasi |
|---|---|---|
| DOM Ready | Meta `PageView` | — |
| `page_meta` | *(tidak ada)* | — |
| `scroll_depth` ×2, `view_section` | GA4 masing-masing | — |
| `engaged_view` (20 dtk) | GA4 + Meta `engaged_view` | — |
| klik WA topbar → `generate_lead` | GA4 `generate_lead` + Meta `Lead` | `angle: angle-accounting`, `location: topbar`, `method: whatsapp`, `site_type: true`, Meta `content_name: angle-accounting`, CAPI opt-in `true` |
| `whatsapp_click` | *(tidak ada)* | — |
| `element_click`, `cta_click` | GA4 masing-masing | — |

## Setelah publish

- **GA4** → Admin → Events → `generate_lead` jadi **key event** (opsional `engaged_view`).
  Admin → Custom definitions → event-scoped dimension `angle`, `location`,
  `element_label`, `site_type` supaya muncul di report.
- **Meta** → Events Manager → Custom Conversions dari `engaged_view` ("LP Engaged 20s");
  Aggregated Event Measurement: `Lead` prioritas #1.
- Kalau Meta template ternyata dipakai website hash.id juga untuk e-commerce event
  (`purchase` dll. lewat "GA4 dataLayer Integration"), tambah trigger yang sesuai ke
  tag Pixel — trigger catch-all lama sudah dilepas.

## Regenerate kalau `script.js` berubah

`build-gtm.js` adalah sumber JSON. Tambah `dlv(...)`, `customEvent(...)`,
`ga4Event(...)` di sana, lalu:

```bash
node gtm/build-gtm.js gtm/hashrt-gtm-container.json
```

Import ulang: Admin → Import Container → Existing workspace → **Merge → Rename conflicting**.
