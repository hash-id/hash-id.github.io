/* =====================================================================
   HashRT Landing — KONFIGURASI  (angle: tumbuh-sistem / halaman utama)
   Isi nilai di bawah sebelum publish. Semua "[isi]" wajib diganti data asli.
   ===================================================================== */
window.HASHRT_CONFIG = {

  /* --- Angle halaman ini (dipakai untuk tracking di dataLayer) --- */
  angle: "angle-tumbuh-sistem",

  /* --- WhatsApp ---
     Semua tombol/link di halaman mengarah ke nomor ini. Ganti di satu tempat saja.
     waMessage = teks yang otomatis terisi di WhatsApp saat calon klien klik.
     Script menambahkan tag kampanye (utm_campaign / utm_content) di bawah pesan
     ini supaya tim bizdev tahu chat datang dari iklan yang mana. */
  fills: {
    clients: "40+",   // hash.id/erp-solutions: "40+ custom software development projects since 2016"
    years: "10",      // Hash berdiri 2016 (LinkedIn) · hash.id/erp-solutions: "10+ years"
    channels: "5+",   // integrasi yang disebut hash.id: Shopee, Tokopedia, TikTok Shop, GoFood, GrabFood
    industries: "6",  // healthcare, telco, F&B, manufaktur, retail, distribusi (dari klien di hash.id)
    "wa-link": "https://wa.me/62818422230",
    "wa-hours": "· Sen–Jum 09.00–17.00 WIB",
    urgency: "Slot konsultasi gratis bulan ini terbatas", // set "" untuk sembunyikan
  },

  waMessage: "Halo HashRT, saya mau tanya soal kesiapan sistem / Odoo ERP untuk bisnis saya.",

  /* --- Tracking ---
     Landing page ini TIDAK memuat GA4 / Meta Pixel langsung. Semua tag lewat
     Google Tag Manager. Container GTM Hash: GTM-NKPFBLZN (sudah terpasang di
     <head> dan <noscript>). Event ke dataLayer: page_meta, view_section,
     scroll_depth, cta_click, whatsapp_click. */

  /* --- Angka kredibilitas ---
     Diisi dari data publik di hash.id + LinkedIn (per Sep 2026).
     >>> TIM: cek angka pastinya sebelum publish, ganti kalau perlu. <<< */
};
