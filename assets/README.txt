ASET LANDING PAGE
=================

Dipakai halaman (hasil crop otomatis dari file besar, transparan, ringan):
  logo-white.webp    -> logo #ASH untuk header & footer (latar navy)
  logo-color.webp    -> logo #ASH warna untuk baris partner (latar terang)
  odoo-partner.webp  -> badge Odoo Learning Partner (hero, partner, footer)

File asli dari tim (disimpan, tidak dipakai langsung):
  hashrt-logo-white.webp / hashrt-logo.webp  -> 4500x4500, banyak ruang kosong
  odoo-learning-partner.webp                 -> 1200x600
  og-image.webp        -> 1920x1080, dipakai untuk preview share link (meta og:image)

Kalau logo/badge diganti: crop ruang transparannya dulu, lalu timpa file
logo-white.webp / logo-color.webp / odoo-partner.webp (nama harus sama).
Contoh crop pakai ffmpeg:
  ffmpeg -loop 1 -i sumber.webp -vf "alphaextract,cropdetect=limit=16:round=2:skip=0:reset=1" -frames:v 2 -f null -
  (baca angka crop=W:H:X:Y, lalu:)
  ffmpeg -y -loop 1 -i sumber.webp -vf "crop=W:H:X:Y,scale=720:-1" -frames:v 1 -c:v libwebp -lossless 1 -pix_fmt yuva420p logo-white.webp
