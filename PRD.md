# PRODUCT REQUIREMENT DOCUMENT (PRD) v1.0
## KIRA — AI Cultural & Fashion Decision Agent
**Pilot Partner / Brand**: Oerip Indonesia (Dian Erra Kumalasari / Dian Oerip)  
**Status**: APPROVED — Production Specification Ready  
**Tanggal**: September 2026  
**Klasifikasi**: Enterprise AI Solution, Cultural Preservation & E-Commerce Decision Engine  
**File PDF**: `PRD_KIRA_Oerip_Indonesia.pdf` (dapat diunduh via `/api/prd/download` atau tombol PRD di antarmuka web)

---

## DAFTAR ISI

1. [Bagian 1: Pendahuluan & Visi Produk](#bagian-1-pendahuluan--visi-produk)
2. [Bagian 2: Problem Statement & Target Pengguna](#bagian-2-problem-statement--target-pengguna)
3. [Bagian 3: Arsitektur Informasi & Navigasi Antarmuka](#bagian-3-arsitektur-informasi--navigasi-antarmuka)
4. [Bagian 4: Spesifikasi Fitur Mode Pelanggan](#bagian-4-spesifikasi-fitur-mode-pelanggan)
5. [Bagian 5: Spesifikasi Fitur Admin & Kurasi](#bagian-5-spesifikasi-fitur-admin--kurasi)
6. [Bagian 6: Arsitektur AI & RAG Grounding Engine](#bagian-6-arsitektur-ai--rag-grounding-engine)
7. [Bagian 7: Guardrails Integritas Budaya & Anti-Halusinasi](#bagian-7-guardrails-integritas-budaya--anti-halusinasi)
8. [Bagian 8: Algoritma Cultural Fit Score & Styling](#bagian-8-algoritma-cultural-fit-score--styling)
9. [Bagian 9: Spesifikasi 6 Entitas Knowledge Base](#bagian-9-spesifikasi-6-entitas-knowledge-base)
10. [Bagian 10: Tata Kelola Data Rahasia (Restricted Data)](#bagian-10-tata-kelola-data-rahasia-restricted-data)
11. [Bagian 11: Spesifikasi Teknis & Arsitektur API](#bagian-11-spesifikasi-teknis--arsitektur-api)
12. [Bagian 12: Metrik Keberhasilan (KPI) & Roadmap](#bagian-12-metrik-keberhasilan-kpi--roadmap)
13. [Lembar Pengesahan (Sign-Off)](#lembar-pengesahan-sign-off)

---

## BAGIAN 1: PENDAHULUAN & VISI PRODUK

### 1.1 Latar Belakang Brand Oerip Indonesia
Oerip Indonesia didirikan oleh Dian Erra Kumalasari (dikenal luas sebagai Dian Oerip), seorang desainer dan penjelajah budaya yang mendedikasikan hidupnya untuk melestarikan dan merevitalisasi wastra tenun tradisional Indonesia ke dalam busana kontemporer bernilai seni tinggi. Karya Oerip dikenal dengan filosofi *zero-waste pattern* (pola minim potong), pemanfaatan pewarna alami (akar mengkudu, daun tarum, lumpur, dll.), serta jalinan hubungan langsung dengan para mama penenun di pelosok Nusantara.

### 1.2 Visi & Pernyataan Misi KIRA
Visi KIRA adalah menjadi agen keputusan budaya dan mode cerdas terdepan di dunia yang menjembatani kekayaan warisan wastra adiluhung Nusantara dengan generasi modern secara etis, autentik, dan presisi.
- **Misi Pengetahuan (Knowledge)**: Menyimpan, memverifikasi, dan menyajikan arsip data budaya, filosofi motif, dan teknik tenun secara akurat tanpa distorsi komersial.
- **Misi Identitas (Identity)**: Membantu setiap individu menemukan busana wastra yang beresonansi dengan kepribadian dan nilai-nilai hidupnya.
- **Misi Resonansi (Resonance)**: Menyampaikan narasi budaya yang menyentuh hati melalui pendekatan storytelling emosional dan edukatif.
- **Misi Adaptasi (Adaptation)**: Menghadirkan panduan styling kontemporer yang relevan untuk acara formal kenegaraan, resepsi, hingga kasual global.

---

## BAGIAN 2: PROBLEM STATEMENT & TARGET PENGGUNA

### 2.1 Analisis Masalah (The Core Problems)
1. **Kesenjangan Pengetahuan Pelanggan (Cultural Literacy Gap)**: Pelanggan mengagumi keindahan kain Oerip, namun ragu membeli karena tidak memahami etika pemakaian (apakah motif ini sakral, untuk duka cita, atau acara pernikahan?), asal daerah, atau cara perawatan bahan alami.
2. **Keterbatasan Skalabilitas Kurator Manusia**: Dian Oerip dan tim kurator senior memiliki pengetahuan adat mendalam, namun waktu mereka terbatas untuk melayani ratusan pertanyaan konsultasi harian via WhatsApp dan Instagram.
3. **Risiko Halusinasi AI Generik**: Model AI umum sering mencampuradukkan motif Sumba dengan Toraja, mengarang mitologi fiktif, atau memberikan saran pencucian detergen kimia keras yang merusak pewarna alami.
4. **Kebutuhan Pembuatan Konten Edukasi yang Cepat & Konsisten**: Tim pemasaran membutuhkan generator narasi budaya yang terstandarisasi dengan *tone of voice* Oerip.

### 2.2 Persona Pengguna
- **The Cultural Enthusiast (Kolektor & Pecinta Wastra)**: Usia 30-55 tahun. Mengutamakan orisinalitas, filosofi motif, pewarna alami, dan nilai histori.
- **The Modern Professional (Diplomat & Eksekutif)**: Usia 28-48 tahun. Membutuhkan busana formal unik untuk diplomasi, konferensi internasional, atau gala dinner.
- **The Creative Minimalist (Generasi Muda / Pemula)**: Usia 20-35 tahun. Tertarik pada fashion etnik modern namun takut terkesan "tua" atau kaku.
- **Tim Kurator & Marketing Oerip (Internal Enterprise User)**: Tim pengelola katalog, media sosial, dan hubungan pelanggan Oerip Indonesia.

---

## BAGIAN 3: ARSITEKTUR INFORMASI & NAVIGASI

KIRA mengadopsi arsitektur dwifungsi (Dual-Mode Architecture) yang dapat beralih secara instan:
- **Mode Pelanggan (USER MODE)**:
  1. *Beranda (Landing)*: Hero section inspiratif, highlight filosofi Dian Oerip, akses kilat ke seluruh fitur.
  2. *Tanya AI (Consultation)*: Chatbot RAG percakapan budaya, deteksi intent busana, dan rekomendasi busana real-time.
  3. *Pustaka Wastra*: Ensiklopedia 5 wastra unggulan Oerip lengkap dengan motif, mitologi, serat, dan peta wilayah.
  4. *Katalog Produk*: Katalog busana Dian Oerip terverifikasi dengan siluet, bahan, acara, dan estimasi investasi.
  5. *Rekomendasi Gaya*: Studio padu-padan (Layering Canvas), kalkulator Cultural Fit Score, dan panduan siluet.
  6. *Persona Budaya*: Kuis 4 langkah penentu arketipe karakter busana wastra.
- **Mode Tim Oerip (ADMIN MODE)**:
  1. *Dashboard & KPI*: Statistik total entitas, skor akurasi RAG (98.4%), volume query, dan distribusi status data.
  2. *Knowledge Base Manager*: Panel CRUD untuk 6 entitas: Brand, Produk, Wastra, FAQ, Pedoman Konten, dan Sumber Data.
  3. *Content Studio*: Generator artikel blog SEO, caption Instagram, hook TikTok, dan newsletter Oerip.
  4. *Validasi & Feedback*: Review queue untuk data baru, audit konflik fakta, dan penanganan feedback jempol pengguna.

---

## BAGIAN 4: SPESIFIKASI FITUR MODE PELANGGAN

1. **Tanya AI: KIRA Decision Agent**:
   - Deteksi Konteks Cerdas: menganalisis acara, preferensi warna, kenyamanan iklim, tingkat formalitas, dan sensitivitas adat.
   - Transparansi Keputusan (Decision Trace Drawer): alasan rekomendasi, status verifikasi, dan grounding id.
   - Tombol Konsultasi Kurator WhatsApp: eskalasi langsung ke kurator manusia resmi.
2. **Pustaka Wastra Nusantara**:
   - 5 Wastra Unggulan: Tenun Ikat Sumba Timur, Batik Gedog Tuban, Tenun Songket Toraja, Ulos Ragi Hotang Batak, dan Tenun Lurik Klaten.
   - Status Kesakralan Motif: PUBLIC, CULTURAL_RESPECT, SACRED_RESTRICTED.
3. **Rekomendasi Gaya & Styling Studio (Layering Canvas)**:
   - Statement Outer Tenun, Bawahan/Inner Modest, Aksesoris Tradisional Nusantara.
   - Manekin Interaktif 3 Mode (Kanvas Layering, Manekin Studio 3 Pose, Panduan Drape).
4. **Kuis Persona Budaya Nusantara**:
   - 6 Arketipe: The Sovereign, The Grounder, The Guardian, The Nomad, The Luminary, The Diplomat.

---

## BAGIAN 5: SPESIFIKASI FITUR ADMIN & KURASI

1. **Knowledge Base Manager**:
   - Pengelolaan 6 entitas inti dengan status validasi (DRAFT, NEEDS_REVIEW, VALIDATED, REJECTED, ARCHIVED).
2. **Content Studio (AI Storytelling Generator)**:
   - Format: Blog Long-form, Instagram Caption, Video Script TikTok/Reels, Newsletter VIP.
   - Brand Voice & Keyword Checker: memastikan penggunaan istilah wajib dan penolakan istilah terlarang.
3. **Validation Queue & Audit Konflik**:
   - Antrean moderasi data baru, penyelesaian perbedaan versi mitologi, dan audit feedback kepuasan (Thumbs Up / Down).

---

## BAGIAN 6: ARSITEKTUR AI & RAG GROUNDING ENGINE

- **Model Utama**: Google Gemini 2.5 Flash (Latensi rata-rata 1.2 detik).
- **Arsitektur RAG**:
  1. Analisis Kueri & Intent Parsing
  2. Vector & Semantic Retrieval terhadap database resmi Oerip
  3. Re-Ranking & Guardrail Filter (penyaringan restricted data)
  4. Grounded Prompt Injection (hanya data Oerip sebagai rujukan faktual)
  5. Post-Processing & Tracing Output
- **Prinsip Grounding Ketat**: Pengetahuan umum internet tidak boleh menimpa atau mengarang data Oerip yang kosong.

---

## BAGIAN 7: GUARDRAILS INTEGRITAS BUDAYA & ANTI-HALUSINASI

- **Lapisan 1: Filter Istilah Terlarang & Tabu Adat**: Mencegah klaim kain cetak pabrik sebagai tenun asli, melarang motif sakral untuk busana pesta duka/pesta sembarangan.
- **Lapisan 2: Verification Badge Matching**: Hanya merekomendasikan entitas berstatus VALIDATED.
- **Lapisan 3: Penjaga Data Sensitif (Restricted Guard)**: Memblokir kebocoran data HPP, kontak penenun, dan formula pewarna alam.
- **Protokol Out-of-Knowledge**: KIRA jujur mengakui bila suatu wastra belum diverifikasi oleh Dian Oerip, memunculkan kartu "Butuh Riset Kurator", dan mendaftarkan tiket riset baru ke antrean kurasi.

---

## BAGIAN 8: ALGORITMA CULTURAL FIT SCORE

Formula pembobotan skor kecocokan budaya (0-100%):
- **Kesesuaian Acara (Occasion Appropriateness)**: Bobot 35%
- **Harmoni Serat & Bahan (Material Resonance)**: Bobot 25%
- **Kepatuhan Adat & Nilai Sakral (Cultural Propriety)**: Bobot 25%
- **Keselarasan Palet Warna Bumi (Color Harmony)**: Bobot 15%

---

## BAGIAN 9: SPESIFIKASI 6 ENTITAS KNOWLEDGE BASE

1. **Brand & Filosofi**: Visi Dian Oerip, zero-waste pattern, etika pemberdayaan.
2. **Katalog Produk**: Siluet, bahan, teknik, ukuran all-size, panduan cuci lerak, rentang harga.
3. **Pustaka Wastra**: Asal suku, teknik tenun tangan, serat alam, mitologi motif, zat pewarna.
4. **FAQ Terverifikasi**: Pertanyaan seputar fitting, pre-order, pengiriman internasional, dan perawatan.
5. **Pedoman Konten**: Istilah wajib, istilah terlarang, nada bicara (santun, puitis, berwibawa).
6. **Sumber Data & Hirarki**: Level 1 (Primer Oerip), Level 2 (Resmi Katalog/Web), Level 3 (Hasil Validasi Kurator).

---

## BAGIAN 10: TATA KELOLA DATA RAHASIA (RESTRICTED DATA)

Klasifikasi data `STRICTLY_RESTRICTED_ADMIN_ONLY`:
- HPP & Margin Produksi Asli
- Nomor Telepon & Alamat Mama Penenun Pedalaman
- Formula Racikan Fermentasi Pewarna Alam Studio
- Daftar Kolektor VIP & Pejabat Negara

---

## BAGIAN 11: SPESIFIKASI TEKNIS & API

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons.
- **Backend Server**: Node.js, Express 4.21, TypeScript (tsx/esbuild), RESTful API.
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash).
- **PDF Engine**: PDFKit untuk kompilasi dokumen PRD resmi.
- **Daftar Endpoint API**:
  - `GET /api/health`
  - `GET /api/kira/businesses`
  - `POST /api/kira/chat`
  - `POST /api/kira/storytelling`
  - `POST /api/kira/inquiry`
  - `GET /api/kira/entities`
  - `POST /api/kira/entities`
  - `GET /api/kira/validation-queue`
  - `POST /api/kira/validation-queue/action`
  - `POST /api/kira/feedback`
  - `GET /api/prd/pdf` (View inline PDF)
  - `GET /api/prd/download` (Download file PDF)
  - `GET /PRD_KIRA_Oerip_Indonesia.pdf` (Direct static route)

---

## BAGIAN 12: METRIK KEBERHASILAN (KPI) & ROADMAP

### Target KPI
- Akurasi Fakta Budaya: >= 98.0% (Realisasi: 98.4%)
- Kepuasan Pengguna (CSAT): >= 90.0% (Realisasi: 92.5%)
- Zero Cultural Halucination: 0 Kasus
- Latensi Respon AI: < 2.0 detik (Realisasi: 1.2 detik)
- Efisiensi Tim Konten: Penghematan waktu 70% (Realisasi: 75%)

### Roadmap Pengembangan
- **Fase 1 (Selesai)**: Dual-mode UI, RAG 5 wastra unggulan, 6 entitas KB, Styling Studio.
- **Fase 2 (Aktif)**: Integrasi eskalasi WhatsApp kurator, penyempurnaan generator PDF PRD resmi, dev-server HMR stability.
- **Fase 3 (Q1 2027)**: Virtual Fitting Room 3D drape kain berbasis WebXR.
- **Fase 4 (Q2 2027)**: Mesin budaya multibahasa (Inggris, Prancis, Jepang) untuk diplomasi global.

---

## LEMBAR PENGESAHAN (SIGN-OFF)

Dokumen ini telah disetujui bersama oleh:
1. **Dian Erra Kumalasari (Dian Oerip)** — Founder, Creative Director & Master Curator Oerip Indonesia
2. **Lead AI Solutions Architect & Head of Product** — KIRA Engineering Team
