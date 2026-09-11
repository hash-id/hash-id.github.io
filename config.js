/* HashRT Landing — konfigurasi halaman utama (angle: tumbuh-sistem) */
window.HASHRT_CONFIG = {

  angle: "angle-tumbuh-sistem",

  // Nomor & pesan WhatsApp. wa-link dipakai semua tombol; waMessage terisi
  // otomatis di aplikasi WhatsApp, ditambah tag kampanye dari URL.
  fills: {
    clients: "40+",
    years: "10",
    channels: "5+",
    industries: "6",
    "wa-link": "https://wa.me/62818422230",
    "wa-hours": "· Sen–Jum 09.00–17.00 WIB",
    urgency: "Slot konsultasi gratis bulan ini terbatas", // "" = sembunyikan
  },

  waMessage: "Halo HashRT, saya mau tanya soal kesiapan sistem / Odoo ERP untuk bisnis saya.",

  // Label sumber — otomatis ikut di baris terakhir pesan WhatsApp, supaya tiap
  // chat masuk kelihatan dari landing page mana (dipakai buat monitoring lead).
  pageTag: "Landing Page: Tumbuh Sistem",

  // Tracking lewat GTM (GTM-NKPFBLZN, di <head>). Event: page_meta, view_section,
  // scroll_depth, cta_click, whatsapp_click.
};
