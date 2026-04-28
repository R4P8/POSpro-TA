# POSPro

**POSPro** adalah aplikasi Point of Sale (POS) berbasis web untuk manajemen toko multi-role — dirancang untuk Owner, Kasir, dan Staff Gudang. Sistem ini terdiri dari dua repository terpisah yang bekerja bersama:

| Repository | Teknologi | Deskripsi |
|---|---|---|
| [`be-go`](./be-go) | Go, OpenTelemetry, Prometheus | REST API backend dengan clean architecture |
| [`my-app`](./my-app) | Next.js 14, TypeScript, Tailwind CSS | Frontend web app dengan role-based UI |

---

## 🎯 Fitur Utama

- **Point of Sale** — Transaksi kasir dengan cart, metode pembayaran (Tunai / Transfer / Kartu), dan cetak invoice
- **Manajemen Produk** — CRUD produk, pemantauan stok, dan notifikasi stok kritis
- **Manajemen Gudang** — Pengelolaan data gudang dan riwayat stok masuk/keluar
- **Laporan** — Laporan penjualan per periode, per produk, per kasir, dan riwayat stok
- **Multi-Role** — Tiga role terpisah dengan tampilan dan akses yang berbeda
- **Observability** — Monitoring lengkap dengan OpenTelemetry (tracing) dan Prometheus (metrics)

---

## 👥 Role & Akses

| Role | Route | Fitur |
|---|---|---|
| **Owner** | `/admin/*` | Dashboard overview, laporan lengkap, manajemen produk & gudang, hak akses user, unit bisnis |
| **Kasir** | `/kasir/*` | Transaksi POS penuh, lihat produk (view only) |
| **Gudang** | `/gudang/*` | CRUD produk, manajemen gudang |

Autentikasi menggunakan JWT. Token disimpan di `localStorage` frontend dan disertakan di setiap request ke backend.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                    Browser / Client                  │
│              Next.js 14 (my-app · :3000)             │
│   /admin/*  ·  /kasir/*  ·  /gudang/*               │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP + JWT Bearer Token
                        │ NEXT_PUBLIC_API_URL
                        ▼
┌─────────────────────────────────────────────────────┐
│                  Go Backend (be-go · :8080)          │
│                                                      │
│  Middleware: CORS · JWT Auth · RBAC · OTel · Metrics │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Delivery │→ │ Service  │→ │    Repository     │  │
│  │ (Handler)│  │(Business)│  │  (Data Access)    │  │
│  └──────────┘  └──────────┘  └────────┬──────────┘  │
│                                        │             │
└────────────────────────────────────────│─────────────┘
                                         │
                        ┌────────────────┴─────────────┐
                        │            Database           │
                        └───────────────────────────────┘
                                         
┌─────────────┐    ┌──────────────────────────────────┐
│ Prometheus  │←── │   Metrics · Traces · Logs         │
│ + OTel      │    │   (pkg/metrics · pkg/middleware)  │
└─────────────┘    └──────────────────────────────────┘
```

---

## 🔁 Checkout Flow (POS)

Urutan operasi saat transaksi berlangsung di halaman Kasir:

```
1. Kasir pilih produk → masuk cart (state lokal frontend)
2. Pilih metode bayar: Tunai / Transfer / Kartu
3. Input nominal uang diterima (jika tunai)
4. Tekan "Bayar"
     ↓
  POST /Api/transaction          → buat header transaksi
  POST /Api/transaction-items    → simpan item (parallel)
  POST /Api/stocks-logs          → catat stock-out  (parallel)
  PUT  /Api/product/:id          → update stok produk (parallel)
     ↓
5. Tampil SuccessModal + nomor invoice
6. Stok diperbarui secara optimistic di frontend (tanpa refetch)
```

---

## 🔌 API Endpoints

Semua request menggunakan `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/login` | Login — returns JWT + role |
| POST | `/api/register` | Registrasi user baru |

### Produk

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/Api/product` | Daftar semua produk |
| PUT | `/Api/product/:id` | Update stok produk |
| GET | `/Api/products/report/best-seller` | Produk terlaris |
| GET | `/Api/products/report/critical-stock` | Produk dengan stok kritis |

### Gudang

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/Api/warehouses` | Daftar gudang |

### Transaksi

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/Api/transaction` | Buat header transaksi |
| POST | `/Api/transaction-items` | Simpan item transaksi |
| POST | `/Api/stocks-logs` | Catat log stok keluar |

### Laporan

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/Api/transaction-report/cashier` | Laporan transaksi per kasir |

---

## 🚀 Menjalankan Aplikasi

### Prasyarat

- Go `1.21+`
- Node.js `18+`
- Docker (opsional)

### 1. Backend (`be-go`)

```bash
cd be-go

# Install dependencies
go mod download

# Jalankan server (default: http://localhost:8080)
go run cmd/main.go
```

### 2. Frontend (`my-app`)

```bash
cd my-app

# Install dependencies
npm install

# Buat file environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Jalankan dev server (default: http://localhost:3000)
npm run dev
```

### Docker (masing-masing service)

```bash
# Backend
cd be-go && docker build -t pospro-be . && docker run -p 8080:8080 pospro-be

# Frontend
cd my-app && docker build -t pospro-fe . && docker run -p 3000:3000 pospro-fe
```

---

## 📁 Struktur Repository

### Backend — `be-go/`

```
be-go/
├── cmd/                    # Entry point + seed data CSV
├── internal/
│   ├── delivery/           # HTTP handler
│   ├── dto/                # Request & response struct
│   ├── entity/             # Domain model
│   ├── infrastructure/     # Koneksi DB & external client
│   ├── repository/         # Data access layer
│   ├── routes/             # Routing definition
│   └── service/            # Business logic
│       ├── user_service.go
│       ├── userAkses_service.go
│       └── warehouse_service.go
└── pkg/
    ├── exporter/           # CSV data exporter
    ├── helpers/            # JWT helper
    ├── logger/             # Structured logger
    ├── metrics/            # Prometheus metrics
    └── middleware/         # CORS, JWT, RBAC, OTel, tracer
```

### Frontend — `my-app/`

```
my-app/
├── app/
│   ├── admin/              # Role: Owner
│   │   ├── dashboard/      # Statistik & best seller
│   │   ├── pos/            # POS (view only)
│   │   ├── product/        # Manajemen produk
│   │   ├── gudang/         # Manajemen gudang
│   │   ├── laporan/        # Laporan penjualan & stok
│   │   ├── unit-bisnis/    # Manajemen tenant
│   │   └── hak-akses/      # Manajemen role user
│   ├── kasir/              # Role: Kasir
│   │   └── pos/            # Transaksi POS penuh
│   ├── gudang/             # Role: Gudang
│   │   └── mgudang/        # Manajemen gudang
│   └── components/         # Shared UI components lintas role
└── ...
```

Setiap halaman mengikuti konvensi: `page.tsx` → `FeaturePage.tsx` → `useFeature.ts` → `services.ts`.

---

## 📊 Observability

| Pilar | Tools | Konfigurasi |
|---|---|---|
| **Metrics** | Prometheus | `be-go/prometheus.yaml` |
| **Tracing** | OpenTelemetry | `be-go/otel-config.yaml` |
| **Logging** | Structured Logger | `pkg/logger/logger.go` |

---

## 📄 Lisensi

Proyek ini bersifat internal. Lihat kebijakan lisensi organisasi untuk informasi lebih lanjut.
