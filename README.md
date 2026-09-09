# HashRT Landing Page — Campaign Awareness

Static landing page, siap di-host di **GitHub Pages**. **4 landing page terpisah**,
satu per angle iklan. Semua terindeks Google, tanpa form, konversi ke WhatsApp,
tracking lewat satu container GTM.

## File

| File | Fungsi |
|---|---|
| `index.html` | Angle **tumbuh-sistem** (halaman utama / root) |
| `landing-multichannel/index.html` | Angle **multichannel** (jualan di banyak platform) |
| `landing-cautionary/index.html` | Angle **cautionary** (ekspansi cepat, sistem ketinggalan) |
| `landing-accounting/index.html` | Angle **accounting** (pembukuan berantakan) |
| `styles.css` | Semua styling, mobile-first — **dipakai keempat halaman** |
| `script.js` | Tracking dataLayer (GTM) + rakit link WhatsApp — **dipakai keempat halaman** |
| `<folder>/config.js` | **Yang perlu diisi tim** — `angle`, nomor WhatsApp, `waMessage`, angka kredibilitas. Satu per halaman. Root `config.js` untuk `index.html` |
| `.nojekyll` | Supaya GitHub Pages serve file apa adanya |
| `assets/` | Logo, badge Odoo, OG image — lihat `assets/README.txt` |

Folder anak (`landing-*`) pakai `../styles.css`, `../script.js`, `../assets/` —
jadi cukup edit satu file untuk styling/behaviour semua halaman. Yang **beda per
halaman** cuma: `<title>` + `<meta description>` + `<link canonical>`, H1 & sub di
hero, section Problem, teks CTA hero, dan `config.js` (angle + `waMessage`).

### ⚠️ Section yang sama di 4 halaman

Why, Process, Fitur, Hub, Testimoni, CTA WhatsApp, FAQ, Final, Footer isinya
identik di keempat file. Kalau ganti salah satu, **ganti di keempat `index.html`**.
Konten SEO-visible (H1, hero, Problem) sengaja beda per halaman biar tiap URL
punya isi sendiri.

## Catatan desain

- Layout mengikuti referensi "Quip" (hero gradient, glass card, pill stats, hub wheel,
  feature grid, testimonial slider), **warna diganti ke brand Hash**: navy `#0e2c4f`
  (utama), merah `#d0121e` (CTA/aksen), abu `#7c8a91`, latar netral. Token warna
  disusun mengikuti arsitektur ui-ux-pro-max untuk "B2B Service / SaaS".
- Font heading: **Sora** dari Google Fonts (butuh `fonts.googleapis.com` +
  `fonts.gstatic.com`). Body pakai system font. Fallback ke system sans kalau diblokir.
- Chart di section "Fitur utama" & hero adalah SVG inline (0 request tambahan).
- Skill UI/UX terpasang di `.claude/skills/` (7 skill dari repo ui-ux-pro-max).

## Publish / update

Sudah live di **https://hash-id.github.io/** — repo `hash-id/hash-id.github.io`,
GitHub Pages aktif (deploy from branch `main`, folder `/`).

Update selanjutnya:
```
git add -A
git commit -m "pesan perubahan"
git push
```
GitHub Pages otomatis rebuild ~1 menit setelah push.

## Konversi ke WhatsApp

Tidak ada form. Semua tombol/link ("Konsultasi gratis", "Chat HashRT di WhatsApp",
CTA hero, why, final, footer) mengarah ke **wa.me/62818422230**.

- Nomor diatur di `config.js` → `fills["wa-link"]`. Ganti di satu tempat itu saja.
- `config.js` → `waMessage` = teks yang otomatis terisi di aplikasi WhatsApp waktu
  calon klien klik.
- `script.js` menambahkan baris `(dari iklan: <utm_campaign> / <utm_content>)` di
  bawah pesan itu — jadi begitu chat masuk, bizdev langsung tahu iklan mana yang
  menghasilkan lead, tanpa perlu tanya.

## Google Tag Manager

Semua tracking (GA4, Meta Pixel, dll.) lewat **satu container GTM**, bukan script
terpisah di halaman.

Container: **`GTM-NKPFBLZN`** — sudah terpasang di `<head>` dan `<noscript>` pada
keempat `index.html`. Tidak ada yang perlu diganti lagi.

Bedakan angle di GTM/GA4 pakai field **`angle`** yang ikut di tiap event
(`angle-tumbuh-sistem` / `angle-multichannel` / `angle-cautionary` / `angle-accounting`).

Di dalam GTM tinggal pasang tag GA4 dan Meta Pixel, trigger-nya pakai event di bawah.

Event yang otomatis di-push `script.js` ke `dataLayer`:

| Event | Kapan | Data ikut |
|---|---|---|
| `page_meta` | begitu halaman load | `angle`, `utm_source/medium/campaign/content`, `page_path` |
| `view_section` | user scroll sampai section "cara kerja" | `section` |
| `scroll_depth` | 25 / 50 / 75 / 100% halaman | `percent_scrolled` |
| `cta_click` | klik tombol CTA apa pun | `location`, `angle`, `to_whatsapp` |
| `whatsapp_click` | **konversi utama** — klik yang mengarah ke WhatsApp | `location`, `angle` |

Di GTM: bikin trigger Custom Event `whatsapp_click` → kirim sebagai konversi ke
GA4 dan sebagai `Lead` / `Contact` ke Meta Pixel.

## Social proof — dari mana datanya

Diambil dari halaman publik **hash.id** (dan LinkedIn Hash) per September 2026.
Semua ini **perlu diverifikasi tim** sebelum campaign jalan:

| Yang ditampilkan | Sumber | Catatan |
|---|---|---|
| Nama klien (RS Waron, Klinik Asha, Telin HK/Taiwan/Malaysia, Aksaramaya, Greatchain, Golden Pro Packaging) | Section "Klien Kami" di hash.id | Publik. Konfirmasi boleh dipakai untuk campaign ini |
| Testimoni Devy PS (CEO Telin Malaysia) & Kartia Rausen (CEO Telin Taiwan) | hash.id/tentang-kami | **Terjemahan** dari testimoni asli (aslinya bahasa Inggris). Klien telco, bukan retail/F&B — pertimbangkan ganti dengan testimoni klien SME retail |
| `10` tahun pengalaman | Hash berdiri 2016 (LinkedIn); hash.id: "10+ years" | |
| `40+` klien & project | hash.id/erp-solutions: "40+ custom software development projects since 2016" | Ini jumlah *project*, bukan tentu jumlah klien |
| `5+` channel terintegrasi | hash.id menyebut integrasi Shopee, Tokopedia, TikTok Shop, GoFood, GrabFood | |
| `6` industri | Klien di hash.id mencakup healthcare, telco, F&B, manufaktur, retail, distribusi | |

Slide testimoni ke-3 sengaja dibiarkan `[isi]` — idealnya tim isi dengan testimoni
klien retail/F&B/distribusi yang punya angka hasil konkret.

## WhatsApp

Semua tombol/link WhatsApp mengarah ke **0818-4222-30** (`https://wa.me/62818422230`),
diset di `config.js` → `fills["wa-link"]` dan dipakai ulang di semua section lewat
`data-fill="wa-link"`. Ganti di satu tempat itu saja kalau nomornya berubah.

## Sebelum launch — WAJIB

- [x] Container GTM `GTM-NKPFBLZN` terpasang di keempat halaman
- [ ] Di GTM: pasang tag GA4 + Meta Pixel, trigger konversi dari event `whatsapp_click`
- [ ] Preview GTM: buka tiap halaman, klik tombol WhatsApp, pastikan `cta_click` + `whatsapp_click` muncul di Tag Assistant (cek field `angle`-nya benar)
- [ ] `config.js` (4 file) → `fills` (clients/years/channels/industries) **verifikasi angka pastinya dengan tim** — sekarang diisi dari data publik hash.id, bukan angka internal resmi
- [ ] `config.js` (4 file) → cek nomor WhatsApp (`fills["wa-link"]`) dan teks `waMessage`
- [ ] Keempat `index.html` → slide testimoni ke-3 masih `[isi]`; jawaban FAQ berkurung `[isi]` diganti data asli
- [ ] Konfirmasi ke tim: nama klien yang ditampilkan (RS Waron, Klinik Asha, Telin, Aksaramaya, Greatchain, Golden Pro Packaging) OK dipakai di landing campaign ini
- [ ] Logo & badge Odoo sudah terpasang (`assets/logo-white.webp`, `logo-color.webp`, `odoo-partner.webp`); OG image `assets/og-image.webp`
- [ ] Tes klik WhatsApp di HP iOS + Android (pesan otomatis + tag iklan muncul di draft chat)
- [ ] PageSpeed Insights (mobile)

## URL kampanye — 1 URL per angle

Live di **https://hash-id.github.io/**. Arahkan iklan Meta ke URL yang sesuai:

```
tumbuh-sistem : https://hash-id.github.io/?utm_source=meta&utm_medium=paid&utm_campaign=awareness-hashrt&utm_content=angle-tumbuh-sistem
multichannel  : https://hash-id.github.io/landing-multichannel/?utm_source=meta&utm_medium=paid&utm_campaign=awareness-hashrt&utm_content=angle-multichannel
cautionary    : https://hash-id.github.io/landing-cautionary/?utm_source=meta&utm_medium=paid&utm_campaign=awareness-hashrt&utm_content=angle-cautionary
accounting    : https://hash-id.github.io/landing-accounting/?utm_source=meta&utm_medium=paid&utm_campaign=awareness-hashrt&utm_content=angle-accounting
```

UTM tetap dibaca `script.js` → dikirim ke `dataLayer` (event `page_meta`) dan
ditempel di pesan WhatsApp. `angle` di dataLayer datang dari `config.js` masing-masing
halaman, jadi tetap benar walau UTM lupa dipasang.

## Terindeks Google

Semua halaman **tidak** pakai `noindex` dan punya `<link rel="canonical" href="./">`
(self-referencing). H1, hero, dan section Problem beda per halaman supaya tiap URL
punya konten unik. Section bawah (Why → Footer) identik — Google mungkin anggap
sebagian mirip; kalau jadi masalah SEO, tim bisa perkaya section Fitur/FAQ per angle.
Kalau nanti mau salah satu halaman **tidak** diindeks (mis. murni buat iklan),
tambah `<meta name="robots" content="noindex, follow" />` di `<head>`-nya.

## Mode preview

Container `GTM-NKPFBLZN` sudah aktif — tag yang belum dibuat di GTM tidak akan
jalan, jadi halaman aman buat review. Link WhatsApp tetap aktif; kalau belum mau
menerima chat, ganti `fills["wa-link"]` di `config.js` ke nomor internal dulu.
