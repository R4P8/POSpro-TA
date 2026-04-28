# POSPro — Backend

Backend service berbasis **Go** untuk aplikasi **POSPro** — sistem Point of Sale multi-role dengan arsitektur clean architecture, dilengkapi observability stack (OpenTelemetry, Prometheus), JWT authentication, dan role-based access control.

> 🖥️ Frontend repository: [pospro-fe](../my-app) — dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Language | Go 1.21+ |
| Architecture | Clean Architecture |
| Auth | JWT (JSON Web Token) |
| Observability | OpenTelemetry + Prometheus |
| Logging | Structured Logger |
| Containerization | Docker |

---

## 📁 Struktur Proyek

```
be-go/
├── Dockerfile
├── go.mod
├── otel-config.yaml
├── prometheus.yaml
├── cmd/
│   ├── main.go
│   ├── sales_per_day.csv
│   └── stock_history.csv
├── internal/
│   ├── delivery/
│   ├── dto/
│   ├── entity/
│   ├── infrastructure/
│   ├── repository/
│   ├── routes/
│   └── service/
│       ├── user_service.go
│       ├── userAkses_service.go
│       └── warehouse_service.go
└── pkg/
    ├── exporter/
    │   ├── sales_exporter.go
    │   ├── salesperday_exporter.go
    │   └── stock_history_exporter.go
    ├── helpers/
    │   └── jwt.go
    ├── logger/
    │   └── logger.go
    ├── metrics/
    │   ├── metrcis.go
    │   └── provider.go
    └── middleware/
        ├── cors.go
        ├── jwt.go
        ├── metrcis.go
        ├── otel_http.go
        ├── Protected.go
        ├── role.go
        ├── tracer.go
        └── wrap.go
```

---

## 🧱 Arsitektur

Proyek ini menggunakan pola **Clean Architecture** dengan pemisahan tanggung jawab yang jelas:

| Layer | Direktori | Deskripsi |
|---|---|---|
| **Delivery** | `internal/delivery/` | Handler HTTP, request parsing, response formatting |
| **Service** | `internal/service/` | Business logic utama aplikasi |
| **Repository** | `internal/repository/` | Abstraksi akses data / database |
| **Entity** | `internal/entity/` | Model domain / struct utama |
| **DTO** | `internal/dto/` | Data Transfer Object untuk request & response |
| **Infrastructure** | `internal/infrastructure/` | Koneksi database, third-party client, dll |
| **Routes** | `internal/routes/` | Definisi routing dan pengelompokan endpoint |

---

## 📦 Deskripsi Package

### `cmd/`
Entry point aplikasi. `main.go` menginisialisasi seluruh dependency, middleware, dan menjalankan server HTTP.

File CSV (`sales_per_day.csv`, `stock_history.csv`) digunakan sebagai seed data atau sumber data statis untuk fitur exporter.

---

### `internal/service/`
Berisi business logic yang diorganisasikan per domain:

- **`user_service.go`** — Logika manajemen pengguna (registrasi, profil, dll)
- **`userAkses_service.go`** — Logika kontrol akses dan hak pengguna; menentukan role yang dikembalikan ke frontend untuk auth guard di `layout.tsx`
- **`warehouse_service.go`** — Logika pengelolaan data gudang / inventory

---

### `pkg/exporter/`
Modul untuk mengekspor dan memproses data dari sumber eksternal (CSV):

- **`sales_exporter.go`** — Ekspor data penjualan
- **`salesperday_exporter.go`** — Ekspor data penjualan per hari (dikonsumsi halaman `admin/laporan`)
- **`stock_history_exporter.go`** — Ekspor riwayat stok barang (dikonsumsi halaman `admin/laporan` tab Stok)

---

### `pkg/helpers/`
- **`jwt.go`** — Helper untuk pembuatan dan parsing JWT token yang dikirim ke frontend saat login berhasil

---

### `pkg/logger/`
- **`logger.go`** — Konfigurasi dan inisialisasi logger terpusat (structured logging)

---

### `pkg/metrics/`
Integrasi **Prometheus** untuk monitoring aplikasi:

- **`metrcis.go`** — Definisi custom metrics (counter, histogram, gauge)
- **`provider.go`** — Inisialisasi Prometheus metrics provider

---

### `pkg/middleware/`
Kumpulan middleware HTTP yang dapat dikomposisikan:

| File | Fungsi |
|---|---|
| `cors.go` | Penanganan CORS — mengizinkan request dari frontend (`localhost:3000`) |
| `jwt.go` | Validasi JWT token dari header `Authorization: Bearer <token>` yang dikirim frontend |
| `metrcis.go` | Pencatatan metrics per request (latency, count) |
| `otel_http.go` | Propagasi context OpenTelemetry untuk HTTP |
| `Protected.go` | Guard untuk endpoint yang membutuhkan autentikasi |
| `role.go` | Middleware RBAC — memvalidasi role Owner, Kasir, dan Gudang sesuai route frontend |
| `tracer.go` | Distributed tracing dengan OpenTelemetry |
| `wrap.go` | Wrapper response writer untuk intercept status code |

---

## ⚙️ Konfigurasi

### `otel-config.yaml`
Konfigurasi **OpenTelemetry Collector** untuk pengumpulan dan ekspor telemetry data (traces, metrics, logs) ke backend monitoring.

### `prometheus.yaml`
Konfigurasi **Prometheus** scraping target untuk mengumpulkan metrics dari aplikasi.

---

## 🔌 API Endpoints

Seluruh endpoint dikonsumsi oleh frontend POSPro via `NEXT_PUBLIC_API_URL`. Request menggunakan JWT Bearer token di header `Authorization`.

### Auth

| Method | Endpoint | Deskripsi | Dikonsumsi di |
|---|---|---|---|
| POST | `/api/login` | Login user, returns JWT + role | `login/` |
| POST | `/api/register` | Registrasi user baru | `register/` |

### Produk

| Method | Endpoint | Deskripsi | Dikonsumsi di |
|---|---|---|---|
| GET | `/Api/product` | Daftar semua produk | `admin/product`, `gudang/product`, `kasir/product` |
| GET | `/Api/products/report/best-seller` | Produk terlaris | `admin/dashboard` — `BestSellerPanel` |
| GET | `/Api/products/report/critical-stock` | Produk dengan stok kritis | `admin/dashboard` — `CriticalStockPanel` |
| PUT | `/Api/product/:id` | Update stok produk (dipanggil setelah transaksi) | `kasir/pos` |

### Gudang

| Method | Endpoint | Deskripsi | Dikonsumsi di |
|---|---|---|---|
| GET | `/Api/warehouses` | Daftar gudang | `admin/gudang`, `gudang/mgudang` |

### Transaksi & POS

| Method | Endpoint | Deskripsi | Dikonsumsi di |
|---|---|---|---|
| POST | `/Api/transaction` | Buat header transaksi baru | `kasir/pos`, `admin/pos` |
| POST | `/Api/transaction-items` | Simpan item transaksi | `kasir/pos`, `admin/pos` |
| POST | `/Api/stocks-logs` | Catat stock-out log | `kasir/pos`, `admin/pos` |

### Laporan

| Method | Endpoint | Deskripsi | Dikonsumsi di |
|---|---|---|---|
| GET | `/Api/transaction-report/cashier` | Laporan transaksi per kasir | `admin/laporan` — `TabKasir` |

---

## 🔁 Checkout Flow (POS)

Berikut urutan API call yang dilakukan frontend saat transaksi berlangsung di `kasir/pos` atau `admin/pos`:

```
1. Kasir pilih produk → masuk cart (state lokal frontend)
2. Pilih metode bayar (Tunai / Transfer / Kartu)
3. Input uang diterima (jika tunai)
4. Tekan "Bayar"
     ↓
  POST /Api/transaction          → buat header transaksi
  POST /Api/transaction-items    → simpan item (parallel)
  POST /Api/stocks-logs          → catat stock-out (parallel)
  PUT  /Api/product/:id          → update stok produk (parallel)
     ↓
5. Response sukses → frontend tampil SuccessModal + invoice number
6. Stok di-update optimistic di sisi frontend (tanpa refetch)
```

---

## 🔐 Autentikasi & Otorisasi

Aplikasi menggunakan **JWT** untuk autentikasi dan **RBAC** untuk otorisasi:

- Token di-generate saat login dan dikirim ke frontend untuk disimpan di `localStorage` bersama `userId`, `userEmail`, dan `userRole`
- Setiap request dari frontend menyertakan token via `Authorization: Bearer <token>`
- Middleware `Protected.go` memvalidasi token sebelum request mencapai handler
- Middleware `role.go` memastikan pengguna memiliki role yang sesuai; frontend membaca `userRole` dari `localStorage` untuk auth guard di setiap `layout.tsx`

### Role yang Didukung

| Role | Route Frontend | Akses Backend |
|---|---|---|
| **Owner** | `/admin/*` | Dashboard, laporan, produk, gudang, hak akses, unit bisnis |
| **Kasir** | `/kasir/*` | POS (transaksi penuh), produk (view only) |
| **Gudang** | `/gudang/*` | Manajemen gudang, produk (full CRUD) |

---

## 📊 Observability

Aplikasi dilengkapi tiga pilar observability:

| Pilar | Tools | Keterangan |
|---|---|---|
| **Metrics** | Prometheus | Monitoring performa dan health aplikasi |
| **Tracing** | OpenTelemetry | Distributed tracing untuk melacak alur request |
| **Logging** | Structured Logger | Log terstruktur untuk debugging dan audit |

---

## 🐳 Docker

```bash
# Build image
docker build -t be-go .

# Jalankan container
docker run -p 8080:8080 be-go
```

---

## 🚀 Menjalankan Aplikasi

### Prasyarat

- Go `1.21+`
- Docker (opsional)
- Prometheus & OpenTelemetry Collector (untuk observability)

### Langkah-langkah

```bash
# Clone repositori
git clone <repository-url>
cd be-go

# Install dependencies
go mod download

# Jalankan aplikasi
go run cmd/main.go
```

Server berjalan di `http://localhost:8080` — pastikan nilai `NEXT_PUBLIC_API_URL` di file `.env.local` frontend sudah sesuai.

---

## 📄 Lisensi

Proyek ini bersifat internal. Lihat kebijakan lisensi organisasi untuk informasi lebih lanjut.
