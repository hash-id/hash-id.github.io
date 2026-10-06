/* HashRT Landing — penawaran implementasi Odoo. Pakai script.js dari ../ dan implementasi.css lokal. */
window.HASHRT_CONFIG = {

  angle: "angle-implementasi",

  fills: {
    clients: "40+",
    "wa-link": "https://wa.me/62818422230",
    "wa-hours": "Pesan Anda dibalas dalam 24 jam",
    urgency: "Kuota kickoff project terbatas", // "" = sembunyikan

    // Harga paket implementasi. "" = sembunyikan angka.
    "price-basic": "Rp 30 juta",
    "price-pro-man": "Rp 60 juta",
    "price-pro-custom": "Rp 60 juta",
  },

  // Cadangan kalau tombol WA tidak punya data-wa-text sendiri.
  waMessage: "Halo HashRT, saya ingin konsultasi gratis tentang implementasi Odoo untuk bisnis saya.",

  // Tracking lewat GTM (GTM-NKPFBLZN, di <head>).
  // Halaman ini: klik WA dikirim sebagai wa_click (GA4 wa_click + Meta Contact), tanpa generate_lead.
  trackWaClick: true,
  waLeadEvent: false,
  scrollMarks: [50, 90],
};
