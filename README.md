# accounts.ten.my.id — Centralized Identity Provider (SSO / IAM)

Produksi siap pakai untuk sistem **Centralized Identity Provider (SSO / IAM)** berbasis **Cloudflare Workers** (Edge Runtime), **Cloudflare D1** (Serverless SQLite), **Better Auth** (`better-auth` dengan plugin `@better-auth/oauth-provider`), dan **Hono.js**.

Platform ini bertindak sebagai pusat autentikasi dan penyedia OAuth 2.0 / OpenID Connect (OIDC) terpusat untuk domain `https://accounts.ten.my.id`, memungkinkan aplikasi satelit (seperti `jadwal.ten.my.id` atau `*.ten.my.id`) mengimplementasikan Single Sign-On (SSO).

---

## 🏗️ Arsitektur & Teknologi

- **Runtime**: Cloudflare Workers (Edge runtime dengan `nodejs_compat`)
- **API Framework**: [Hono.js](https://hono.dev/)
- **Auth Engine**: [Better Auth](https://www.better-auth.com/) + `@better-auth/oauth-provider` + `jwt()`
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Frontend UI**: Server-rendered HTML dengan estetika minimalis Zinc (terinspirasi oleh Linear/Vercel, border 1px, tipografi Inter, tanpa gradien neon)
- **CI/CD**: GitHub Actions otomatis untuk push ke branch `main`

---

## 📋 Fitur Utama

1. **Pusat Autentikasi (Pusat Akun)**:
   - Login & Register dengan email dan kata sandi (hashing aman).
   - Manajemen sesi dengan cookie HTTP-only yang dikonfigurasi untuk root domain `.ten.my.id`.
   - Halaman profil mandiri: melihat detail pengguna, mengganti kata sandi, dan memantau aplikasi satelit yang telah diotorisasi.

2. **OAuth 2.1 & OpenID Connect (SSO Engine)**:
   - **Authorization Endpoint**: `/api/auth/oauth2/authorize`
   - **Token Endpoint**: `/api/auth/oauth2/token`
   - **UserInfo Endpoint**: `/api/auth/oauth2/userinfo`
   - **Discovery Metadata**:
     - `/.well-known/openid-configuration`
     - `/.well-known/oauth-authorization-server`
     - `/api/auth/jwks`
   - **Consent Screen OIDC**: Tampilan persetujuan izin aplikasi satelit (`openid`, `profile`, `email`) dengan opsi Setujui atau Tolak.

3. **Manajemen Klien Satelit (OAuth Client)**:
   - Terdaftar di tabel D1 `oauthClient`.
   - Sudah dilengkapi data awal (seed) untuk `schedule-app` (`https://jadwal.ten.my.id/api/auth/callback`).

---

## 🚀 Panduan Setup & Deployment Langkah-demi-Langkah

### 1. Inisialisasi Database Cloudflare D1

Jalankan perintah berikut di terminal Anda untuk membuat database D1 baru di Cloudflare:

```bash
npx wrangler d1 create accounts-db
```

Output terminal akan memberikan konfigurasi database D1 seperti berikut:
```json
{
  "binding": "DB",
  "database_name": "accounts-db",
  "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

Buka file `wrangler.json` dan perbarui baris `database_id` dengan ID yang didapatkan:
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "accounts-db",
    "database_id": "MASUKKAN_DATABASE_ID_ANDA_DI_SINI"
  }
]
```

### 2. Terapkan Skema Database (`schema.sql`)

Eksekusi skema database D1 secara remote di Cloudflare:

```bash
# Terapkan skema pada remote Cloudflare D1
npm run d1:migrate:remote
# atau secara manual:
npx wrangler d1 execute accounts-db --remote --file=./schema.sql
```

### 3. Konfigurasi Rahasia Lingkungan (Secrets)

Buat rahasia `BETTER_AUTH_SECRET` (minimal 32 karakter acak):

```bash
# Generate rahasia acak dan set ke Cloudflare Worker
npx wrangler secret put BETTER_AUTH_SECRET
```
*Ketikkan atau paste string acak 32+ karakter saat diminta.*

Untuk pengembangan lokal, salin file contoh:
```bash
cp .dev.vars.example .dev.vars
```

### 4. Uji Coba Pengembangan Lokal

Jalankan server pengembangan lokal:

```bash
npm run dev
```

Buka browser Anda di `http://localhost:8787`. Anda dapat:
- Melakukan registrasi akun di `/register`.
- Melakukan login di `/login`.
- Melihat profil dan manajemen akun di `/profile`.
- Memeriksa endpoint discovery OIDC di `http://localhost:8787/.well-known/openid-configuration`.

### 5. Hubungkan ke Repositori GitHub

Inisialisasi git dan push ke repositori GitHub:

```bash
git init
git add .
git commit -m "feat: initial release of accounts-tenmyid identity provider"
git branch -M main
git remote add origin https://github.com/lastengtf/accounts-tenmyid.git
git push -u origin main
```

### 6. Konfigurasi GitHub Actions Secrets untuk Otomasi CI/CD

Buka repositori GitHub Anda di:
`https://github.com/lastengtf/accounts-tenmyid/settings/secrets/actions`

Tambahkan rahasia (*Repository Secrets*) berikut:

| Nama Secret | Deskripsi |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API Token Cloudflare dengan izin Worker & D1 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID Anda (dapat dilihat di dashboard Cloudflare) |
| `BETTER_AUTH_SECRET` | Kunci enkripsi sesi 32+ karakter (sama dengan yang di-set di wrangler) |

Setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan:
1. Memvalidasi TypeScript (`npm run typecheck`).
2. Menjalankan migrasi skema D1 (`npx wrangler d1 execute accounts-db --remote --file=./schema.sql`).
3. Men-deploy Worker ke domain `accounts.ten.my.id`.

---

## 🔗 Panduan Integrasi Aplikasi Satelit (*Satellite App SSO*)

Untuk menghubungkan aplikasi satelit (misalnya `jadwal.ten.my.id`) ke provider ini, gunakan konfigurasi OAuth 2.0 / OIDC standar:

### Kredensial Klien (Contoh: `schedule-app`):
- **Issuer / Discovery URL**: `https://accounts.ten.my.id`
- **Authorization Endpoint**: `https://accounts.ten.my.id/api/auth/oauth2/authorize`
- **Token Endpoint**: `https://accounts.ten.my.id/api/auth/oauth2/token`
- **Userinfo Endpoint**: `https://accounts.ten.my.id/api/auth/oauth2/userinfo`
- **Client ID**: `schedule-app`
- **Client Secret**: `schedule-app-secret-dev-2025` *(dapat diubah di tabel `oauthClient`)*
- **Allowed Redirect URI**: `https://jadwal.ten.my.id/api/auth/callback`
- **Scopes**: `openid profile email`

### Contoh Integrasi dengan Better Auth Client di Aplikasi Satelit:
```typescript
import { createAuthClient } from "better-auth/client";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient({
      providerId: "ten-accounts",
      discoveryUrl: "https://accounts.ten.my.id/.well-known/openid-configuration",
      clientId: "schedule-app",
      clientSecret: process.env.TEN_SSO_CLIENT_SECRET,
      scopes: ["openid", "profile", "email"],
    }),
  ],
});
```

---

## 📂 Struktur File Proyek

```
accounts-tenmyid/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD deployment
├── src/
│   ├── views/
│   │   ├── layout.ts           # Shell HTML dengan estetika Zinc & Inter
│   │   ├── login.ts            # Halaman login enterprise minimalis
│   │   ├── register.ts         # Halaman registrasi akun
│   │   ├── consent.ts          # OAuth 2.0 / OIDC consent screen
│   │   └── profile.ts          # Manajemen profil & aplikasi terhubung
│   ├── auth.ts                 # Inisialisasi Better Auth + D1 + OAuth Provider
│   ├── index.ts                # Router Hono, CORS *.ten.my.id, & delegasi auth
│   └── types.ts                # Tipe TypeScript bindings Cloudflare Worker
├── .dev.vars.example           # Contoh variabel lokal
├── .gitignore                  # Git ignore file
├── instruksiAGENT.md           # Spesifikasi teknis kebutuhan sistem
├── package.json                # Dependensi proyek
├── schema.sql                  # Skema D1 SQLite + seed client
├── tsconfig.json               # Konfigurasi TypeScript Worker
├── wrangler.json               # Konfigurasi Cloudflare Workers & D1
└── README.md                   # Dokumentasi lengkap proyek
```
