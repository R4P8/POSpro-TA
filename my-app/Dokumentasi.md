# POSPro — Frontend

Aplikasi Point of Sale berbasis web dibangun dengan **Next.js 14 App Router**, **TypeScript**, dan **Tailwind CSS**.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| HTTP | Native `fetch` |
| Auth | JWT via `localStorage` |

---

## Struktur Folder

```
my-app/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── types/
│   │   └── index.ts            # Global shared types
│   ├── lib/
│   │   └── constants.ts        # Global constants
│   │
│   ├── login/                  # Halaman login
│   │   ├── page.tsx            # Server wrapper
│   │   └── LoginPage.tsx       # Client orchestrator
│   │
│   ├── register/               # Halaman registrasi
│   │   ├── page.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── admin/                  # Role: Owner
│   │   ├── layout.tsx          # Layout admin (sidebar, auth guard)
│   │   ├── dashboard/          # Dashboard overview
│   │   ├── pos/                # Point of Sale
│   │   ├── product/            # Manajemen produk
│   │   ├── gudang/             # Manajemen gudang
│   │   ├── laporan/            # Laporan penjualan
│   │   ├── unit-bisnis/        # Manajemen tenant
│   │   ├── hak-akses/          # Manajemen role user
│   │   ├── account/            # Profil akun
│   │   └── settings/           # Pengaturan
│   │
│   ├── gudang/                 # Role: Gudang
│   │   ├── layout.tsx
│   │   ├── mgudang/            # Manajemen gudang
│   │   ├── product/            # Manajemen produk
│   │   ├── account/
│   │   └── settings/
│   │
│   ├── kasir/                  # Role: Kasir
│   │   ├── layout.tsx
│   │   ├── pos/                # Point of Sale (full access)
│   │   ├── product/            # Produk (view only)
│   │   ├── account/
│   │   └── settings/
│   │
│   └── components/             # Shared UI components
│       ├── Sidebar.tsx
│       ├── ui/                 # Primitive & auth components
│       ├── dashboard/          # Dashboard-specific components
│       ├── pos/                # POS-specific components
│       ├── product/            # Product-specific components
│       ├── warehouse/          # Warehouse-specific components
│       ├── laporan/            # Laporan-specific components
│       ├── bussines/           # Unit bisnis components
│       ├── profile/            # Profile components
│       └── layout/             # Navigation & footer
```

---

## Konvensi Struktur Per Page

Setiap page yang memiliki logika mengikuti pola yang konsisten:

```
feature/
├── page.tsx          # Server component wrapper (3 baris)
├── FeaturePage.tsx   # Client orchestrator — hanya JSX, tanpa logika
├── useFeature.ts     # Custom hook — semua state & business logic
├── services.ts       # Semua fetch API call
├── types.ts          # Interface & type definitions
├── utils.ts          # Helper functions (format, auth headers, dll)
└── constants.ts      # Konstanta (opsional)
```

### Prinsip utama

- **`page.tsx`** — hanya `import` dan `return <FeaturePage />`, tidak ada `'use client'`
- **`FeaturePage.tsx`** — orchestrator, hanya menerima data dari hook dan mendistribusikan ke komponen
- **`useFeature.ts`** — seluruh state, derived data, dan side effect ada di sini
- **`services.ts`** — semua `fetch` call, tidak ada state, pure async functions
- **Komponen UI** — diambil dari `app/components/` dan di-reuse lintas role

---

## Role & Akses

| Role | Route | Akses |
|---|---|---|
| **Owner** | `/admin/*` | Dashboard, POS (view only), Produk, Gudang, Laporan, Unit Bisnis, Hak Akses |
| **Gudang** | `/gudang/*` | Manajemen Gudang, Produk (full CRUD) |
| **Kasir** | `/kasir/*` | POS (full transaksi), Produk (view only) |

Auth guard dilakukan di masing-masing `layout.tsx` dengan membaca `userRole` dari `localStorage`.

---

## Shared Components

Komponen di `app/components/` dipakai lintas role untuk menghindari duplikasi:

| Folder | Komponen | Dipakai di |
|---|---|---|
| `ui/auth/` | `LoginForm`, `LoginLeftSide`, `RegisterForm`, dll | `login/`, `register/` |
| `product/` | `ProductCard`, `ProductGrid`, `ProductModal`, `ProductHeader`, `ProductAtoms` | `admin/product`, `gudang/product`, `kasir/product` |
| `pos/` | `CartPanel`, `CartItem`, `PaymentSection`, `SuccessModal`, `POSAtoms` | `admin/pos`, `kasir/pos` |
| `warehouse/` | `WarehouseCard`, `GudangHeader`, `GudangModal`, `MGudangAtoms` | `admin/gudang`, `gudang/mgudang` |
| `dashboard/` | `StatsGrid`, `BestSellerPanel`, `CriticalStockPanel`, `TransactionTable` | `admin/dashboard` |
| `laporan/` | `TabBar`, `DateFilter`, `TabPeriode`, `TabProduk`, `TabStok`, `TabKasir` | `admin/laporan` |

---

## Memulai

### Prerequisites

- Node.js >= 18
- npm atau yarn
- Backend berjalan di `http://localhost:8080` (atau sesuai `.env`)

### Instalasi

```bash
cd my-app
npm install
```

### Environment Variables

Buat file `.env.local` di root `my-app/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Menjalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t pospro-fe .
docker run -p 3000:3000 pospro-fe
```

---

## API Integration

Semua request ke backend menggunakan JWT Bearer token:

```ts
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

Token disimpan di `localStorage` saat login berhasil bersama dengan `userId`, `userEmail`, dan `userRole`.

### Endpoint Utama

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/login` | Login user |
| POST | `/api/register` | Registrasi user |
| GET | `/Api/product` | Daftar produk |
| GET | `/Api/warehouses` | Daftar gudang |
| GET | `/Api/transaction-report/cashier` | Laporan transaksi |
| POST | `/Api/transaction` | Buat transaksi baru |
| GET | `/Api/products/report/best-seller` | Produk terlaris |
| GET | `/Api/products/report/critical-stock` | Stok kritis |

---

## Checkout Flow (POS)

```
1. Kasir pilih produk → masuk cart
2. Pilih metode bayar (Tunai / Transfer / Kartu)
3. Input uang diterima (jika tunai)
4. Tekan "Bayar"
     ↓
  POST /Api/transaction          → buat header transaksi
  POST /Api/transaction-items    → simpan item (parallel)
  POST /Api/stocks-logs          → catat stock-out (parallel)
  PUT  /Api/product/:id          → update stok produk (parallel)
     ↓
5. Tampil SuccessModal + invoice number
6. Stok di-update optimistic (tanpa refetch)
```

---

## Naming Convention

| Jenis | Konvensi | Contoh |
|---|---|---|
| Komponen | PascalCase | `ProductCard.tsx` |
| Hook | camelCase dengan prefix `use` | `useProduct.ts` |
| Service | camelCase | `services.ts` |
| Type/Interface | PascalCase | `Product`, `WarehouseForm` |
| Konstanta | SCREAMING_SNAKE_CASE | `PAYMENT_METHODS`, `EMPTY_FORM` |
| File kebanyakan | camelCase | `utils.ts`, `constants.ts` |

> **Catatan:** Beberapa file di `kasir/pos/` menggunakan PascalCase (`Constants.ts`, `Types.ts`) — sebaiknya disamakan ke camelCase untuk konsistensi.