/* =====================================================================
   HashRT Landing — ANGLE ACCOUNTING (halaman iklan terpisah, terindeks).
   Pakai styles.css & script.js dari folder induk (../).
   ===================================================================== */
window.HASHRT_CONFIG = {

  angle: "angle-accounting",

  /* --- WhatsApp ---
     Semua tombol/link mengarah ke nomor ini. waMessage = teks yang otomatis
     terisi saat calon klien klik. Script menambahkan tag kampanye di bawahnya. */
  fills: {
    clients: "40+",   // hash.id/erp-solutions: "40+ custom software development projects since 2016"
    years: "10",      // Hash berdiri 2016 (LinkedIn) · hash.id/erp-solutions: "10+ years"
    industries: "6",  // healthcare, telco, F&B, manufaktur, retail, distribusi (dari klien di hash.id)
    "wa-link": "https://wa.me/62818422230",
    "wa-hours": "· Sen–Jum 09.00–17.00 WIB",
    urgency: "Slot audit gratis bulan ini terbatas", // set "" untuk sembunyikan
  },

  waMessage: "Halo HashRT, saya mau tanya soal audit pembukuan & Odoo Accounting untuk bisnis saya.",

  /* --- Tracking ---
     Tidak memuat GA4 / Meta Pixel langsung. Semua tag lewat Google Tag Manager.
     Container GTM Hash: GTM-NKPFBLZN (sama dengan landing utama, sudah terpasang
     di <head> dan <noscript>). Event ke dataLayer: page_meta,
     view_section, scroll_depth, cta_click, whatsapp_click. */
};
