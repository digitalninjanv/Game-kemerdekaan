# Lomba 17-an Online

Web game bertema lomba 17 Agustus dengan beberapa mode permainan seru, leaderboard global, dan chat realtime. Dibangun dengan Next.js, Tailwind CSS, dan Firebase.

## Fitur

- **Mode permainan**: Drone Race, Quiz Blitz, Emoji Sprint
- **Leaderboard global**: skor tersimpan di Firestore dan diurutkan secara realtime
- **Chat global**: semua pemain dapat berkirim pesan saat bermain
- **Responsive**: tampilan menyesuaikan layar desktop dan perangkat mobile

## Instalasi

1. **Clone** atau salin repositori ini.
2. Pasang dependensi:

   ```bash
   npm install
   # atau
   yarn
   ```

3. Buat file `.env.local` di akar proyek dan tambahkan konfigurasi Firebase Anda:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
   ```

4. Jalankan aplikasi:

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`.

## Struktur Direktori

- `pages/` – Halaman Next.js.
- `components/` – Komponen UI seperti Chat dan Leaderboard.
- `components/games/` – Komponen mini game.
- `firebaseConfig.js` – Inisialisasi Firebase (gunakan variabel environment).
- `styles/` – File CSS global.

## Catatan

- Pastikan akun Firebase Anda sudah memiliki Firestore aktif.
- Data chat disimpan di koleksi `chatMessages` dan skor di koleksi `scores` dengan struktur dokumen sederhana.
- Aplikasi ini menggunakan autentikasi anonim. Anda dapat menyesuaikan ke skema autentikasi lain jika diperlukan.

Selamat bermain dan merayakan semangat 17 Agustus secara online! 🎉