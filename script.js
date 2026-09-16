/* ===== HashRT Landing — behaviour (satu angle per halaman) ===== */
(function () {
  "use strict";
  var CFG = window.HASHRT_CONFIG || {};
  var ANGLE = CFG.angle || "unknown";

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var p = new URLSearchParams(window.location.search);

  /* ---------- 1. Data layer + tracking ----------
     Container GTM di-load inline di <head> tiap halaman (GTM-NKPFBLZN).
     GA4, Meta Pixel, dll. dikonfigurasi di dalam GTM. Di sini cuma push event. */
  window.dataLayer = window.dataLayer || [];
  function track(name, data) {
    var payload = { event: name };
    if (data) { for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) payload[k] = data[k]; }
    window.dataLayer.push(payload);
  }

  document.body.setAttribute("data-angle", ANGLE);
  track("page_meta", {
    angle: ANGLE,
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_content: p.get("utm_content") || "",
    page_path: window.location.pathname
  });

  /* ---------- 2. WhatsApp links ----------
     Semua [data-fill="wa-link"] pakai satu nomor (config.fills["wa-link"]),
     ditambah pesan pre-filled (config.waMessage). Tiap landing page punya
     waMessage sendiri yang bunyinya beda — itu yang jadi penanda chat ini
     datang dari halaman mana. Kalau UTM iklan ikut kebawa, ditambah satu baris
     info kampanye. */
  var fills = CFG.fills || {};
  var waBase = fills["wa-link"] || "";
  var waHref = waBase;
  if (waBase) {
    var campaign = [p.get("utm_campaign"), p.get("utm_content")].filter(Boolean).join(" / ");
    var msg = CFG.waMessage || "";
    if (campaign) msg += (msg ? "\n\n" : "") + "(dari iklan: " + campaign + ")";
    if (msg) waHref = waBase + (waBase.indexOf("?") === -1 ? "?" : "&") + "text=" + encodeURIComponent(msg);
  }

  /* ---------- 3. Fill placeholders from config ---------- */
  $all("[data-fill]").forEach(function (el) {
    var key = el.getAttribute("data-fill");
    if (key === "wa-link") { if (waHref) el.setAttribute("href", waHref); return; }
    if (Object.prototype.hasOwnProperty.call(fills, key) && typeof fills[key] === "string") {
      if (fills[key] === "") { el.style.display = "none"; }
      else if (el.children.length === 0) { el.textContent = fills[key]; }
    }
  });
  var yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  // hide partner logos row if no images resolved
  setTimeout(function () {
    var box = $(".partners");
    if (box && box.querySelectorAll("img").length === 0) box.remove();
  }, 500);

  /* ---------- 4. Scroll-depth + section view ---------- */
  var depthHit = {}; var viewSent = false;
  var solution = $("#cara-kerja");
  function onScroll() {
    var h = document.documentElement;
    var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight * 100;
    [25, 50, 75, 100].forEach(function (m) {
      if (pct >= m && !depthHit[m]) { depthHit[m] = true; track("scroll_depth", { percent_scrolled: m }); }
    });
    if (!viewSent && solution) {
      if (solution.getBoundingClientRect().top < window.innerHeight * 0.6) {
        viewSent = true;
        track("view_section", { section: "solution" });
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4b. Engaged view: 20 detik TERLIHAT di layar ----------
     Meta PageView SENGAJA tetap fire saat load. Itu fondasi kesehatan pixel,
     cookie matching, dan audiens retargeting "semua pengunjung" — jangan
     ditunda. Untuk "page view berkualitas" dipakai event terpisah:
     engaged_view, fire SEKALI setelah halaman terlihat di layar total 20 detik.

     Pakai Page Visibility API: waktu saat tab disembunyikan, HP dikunci, atau
     user pindah aplikasi TIDAK dihitung. Buka LP lalu tinggal 5 menit di tab
     lain bukan engagement.

     Di Meta: Events Manager -> Custom Conversions -> bikin dari event
     engaged_view, lalu pakai sebagai tujuan optimasi ad set dan/atau sumber
     Custom Audience. Di GA4 tinggal tandai engaged_view sebagai key event. */
  var ENGAGE_MS = 20000;
  var engagedSent = false, visibleSince = null, visibleTotal = 0, engageTimer = null;
  function engageAccumulated() {
    return visibleTotal + (visibleSince !== null ? Date.now() - visibleSince : 0);
  }
  function engageTick() {
    if (engagedSent) return;
    var acc = engageAccumulated();
    if (acc >= ENGAGE_MS) {
      engagedSent = true;
      track("engaged_view", { engaged_seconds: ENGAGE_MS / 1000, angle: ANGLE });
    } else if (visibleSince !== null) {
      engageTimer = setTimeout(engageTick, ENGAGE_MS - acc); // timer bisa telat, jangan pernah lebih awal
    }
  }
  function engageVisibility() {
    if (engagedSent) return;
    clearTimeout(engageTimer);
    if (document.visibilityState === "visible") {
      if (visibleSince === null) visibleSince = Date.now();
      engageTimer = setTimeout(engageTick, Math.max(0, ENGAGE_MS - engageAccumulated()));
    } else if (visibleSince !== null) {
      visibleTotal += Date.now() - visibleSince;
      visibleSince = null;
    }
  }
  document.addEventListener("visibilitychange", engageVisibility);
  engageVisibility();

  /* ---------- topbar solidify on scroll ---------- */
  var topbar = $(".topbar");
  if (topbar) {
    var syncBar = function () { topbar.classList.toggle("is-stuck", window.scrollY > 12); };
    window.addEventListener("scroll", syncBar, { passive: true });
    syncBar();
  }

  /* ---------- testimonial slider ---------- */
  var slides = $all(".testi__slide");
  if (slides.length > 1) {
    var cur = 0;
    var show = function (n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === cur); });
    };
    $all("[data-testi]").forEach(function (b) {
      b.addEventListener("click", function () {
        show(cur + (b.getAttribute("data-testi") === "next" ? 1 : -1));
      });
    });
  }

  /* ---------- 5. Click tracking — SEMUA tombol & link ----------
     Satu listener delegasi menangkap tiap <a>, <button>, dan <summary> di
     halaman (termasuk yang ditambah belakangan). Tiap klik push "element_click"
     ke dataLayer. Elemen ber-[data-cta] juga push "cta_click", dan yang menuju
     WhatsApp push "generate_lead" + "whatsapp_click" (konversi utama, di-fire
     paling awal supaya tidak kepotong waktu browser pindah ke aplikasi WA).

     Field di GTM:
       event            : element_click | cta_click | whatsapp_click | generate_lead
       element_type     : a | button | summary
       element_label    : teks tombol / aria-label / data-cta
       element_location : nilai data-cta, atau id/section terdekat
       link_url         : href (kalau ada)
       to_whatsapp      : true kalau menuju wa.me
       angle            : angle halaman */
  var lastLeadAt = 0;
  function sectionOf(node) {
    for (var n = node; n && n !== document.body; n = n.parentElement) {
      if (n.tagName === "SECTION" || n.tagName === "HEADER" || n.tagName === "FOOTER") {
        return n.id || (n.className || "").split(" ")[0] || n.tagName.toLowerCase();
      }
    }
    return "";
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("a, button, summary");
    if (!el) return;

    var cta = el.getAttribute("data-cta");
    var href = el.getAttribute("href") || "";
    var toWhatsApp = /wa\.me|whatsapp/i.test(href);
    var label = cta
      || (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60)
      || (el.getAttribute("data-testi") ? "testi-" + el.getAttribute("data-testi") : "")
      || "(tanpa label)";
    var location = cta || sectionOf(el) || "unknown";

    /* Konversi DIDAHULUKAN sebelum event lain.
       Alasannya: begitu link wa.me diklik di HP, browser sering langsung
       ke-background karena aplikasi WhatsApp dibuka. Request yang sudah
       terlanjur jalan biasanya selesai, yang masih antre bisa kepotong.
       Jadi generate_lead (yang jadi standard event "Lead" di Meta) harus
       jadi yang pertama keluar, bukan yang terakhir.

       Guard 1,5 detik mencegah double-tap kehitung dua lead. */
    if (toWhatsApp && Date.now() - lastLeadAt > 1500) {
      lastLeadAt = Date.now();
      track("generate_lead", { location: location, angle: ANGLE, method: "whatsapp" });
      track("whatsapp_click", { location: location, angle: ANGLE });
    }

    track("element_click", {
      element_type: el.tagName.toLowerCase(),
      element_label: label,
      element_location: location,
      link_url: href,
      to_whatsapp: toWhatsApp,
      angle: ANGLE
    });
    if (cta) track("cta_click", { location: cta, angle: ANGLE, to_whatsapp: toWhatsApp });
  }, true);
})();
