# 🐝 Boostify — Frontend

Tampilan web untuk sistem absensi otomatis berbasis pengenalan wajah **Boostify**.

🔗 **Live:** [frontend-boostify.vercel.app](https://frontend-boostify.vercel.app)

---

## ✨ Fitur

- 🔐 Login dengan kode asisten & password
- 📝 Register akun baru
- 👤 Halaman profil (foto, kode, nama)
- 📸 Upload & hapus foto profil
- 📋 Riwayat absensi pribadi
- 📊 Live report absensi realtime
- 📈 Recap & prediksi absensi
- 🌙 Dark mode / Light mode

---

## 🛠️ Teknologi

| Teknologi | Fungsi |
|---|---|
| Next.js 14 | Framework utama |
| TypeScript | Bahasa pemrograman |
| Tailwind CSS | Styling |
| NextAuth.js | Autentikasi |
| Framer Motion | Animasi |

---

## 📁 Struktur Folder

```
BOOSTIFY-FrontEnd/
├── pages/
│   ├── api/auth/
│   │   └── [...nextauth].js   ← konfigurasi NextAuth
│   ├── _app.tsx               ← entry point
│   ├── index.tsx              ← landing page
│   ├── SignIn.tsx             ← halaman login
│   ├── Register.tsx           ← halaman register
│   ├── HomePage.tsx           ← dashboard
│   ├── Profile.tsx            ← profil pengguna
│   ├── LiveReport.tsx         ← laporan realtime
│   ├── Recap.tsx              ← rekap absensi
│   ├── Prediction.tsx         ← prediksi absensi
│   ├── About.tsx              ← halaman about
│   └── Team.tsx               ← halaman tim
│
├── components/
│   ├── HomeNav.tsx            ← navbar
│   └── Footer.tsx             ← footer
│
├── styles/
│   ├── globals.css
│   └── ThemeContext.tsx       ← dark/light mode
│
├── declarations.d.ts          ← type tambahan NextAuth
└── middleware.ts              ← proteksi halaman
```

---

## 🚀 Cara Menjalankan (Lokal)

### 1. Clone & Install

```bash
git clone https://github.com/Daffa12777/frontend-boostify.git
cd frontend-boostify
npm install
```

### 2. Buat File `.env.local`

```env
NEXTAUTH_SECRET=isi_dengan_random_string
NEXTAUTH_URL=http://localhost:3001
```

> Generate secret: `openssl rand -base64 32`

### 3. Jalankan

```bash
npm run dev
```

Buka di browser: [http://localhost:3001](http://localhost:3001)

---

## 🔐 Cara Login

1. Buka halaman Sign In
2. Masukkan **Kode Asisten** (contoh: `FDR`)
3. Masukkan **Password**
4. Klik Sign In

> Belum punya akun? Klik **Register** di halaman Sign In.

---

## 🌐 Environment Variables (Vercel)

| Variable | Nilai |
|---|---|
| `NEXTAUTH_SECRET` | Random string (generate pakai openssl) |
| `NEXTAUTH_URL` | `https://frontend-boostify.vercel.app` |

---

## 📡 Koneksi ke Backend

Frontend terhubung ke backend di:

```
https://web-boostify.vercel.app
```

Endpoint yang dipakai:

| Endpoint | Fungsi |
|---|---|
| `POST /api/auth/login` | Login |
| `POST /api/auth/register` | Register |
| `GET /api/whoami` | Data profil |
| `GET /api/personalrec` | Riwayat absensi |
| `PATCH /api/uploadImage` | Upload foto profil |
| `DELETE /api/deleteImage` | Hapus foto profil |
| `GET /api/attendances` | Live report |
| `GET /api/recap` | Rekap absensi |

---

## 🔗 Repository Terkait

| Repo | Link |
|---|---|
| Backend | [github.com/Daffa12777/web-boostify](https://github.com/Daffa12777/web-boostify) |
| ML | [github.com/Daffa12777/boostify-ml](https://github.com/Daffa12777/boostify-ml) |

---

*Boostify — Smart Attendance for Smart Campus* 🐝