import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Layers,
  Award,
  Calendar,
  UserCheck,
  Search,
  ChevronRight,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PrdDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdDownloadModal: React.FC<PrdDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reader'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);

  if (!isOpen) return null;

  const sections = [
    {
      num: '01',
      title: 'Pendahuluan & Visi Produk',
      desc: 'Filosofi Dian Oerip, Fashion with a Mission, Misi KIRA',
      content: `Oerip Indonesia didirikan oleh Dian Erra Kumalasari (Dian Oerip), perancang busana dan penjelajah budaya yang mendedikasikan hidupnya melestarikan dan merevitalisasi wastra tenun Nusantara menjadi busana kontemporer adiluhung.\n\nPrinsip Utama:\n• Zero-waste pattern: Pola rancang tanpa memotong kain sembarangan demi menghormati jerih payah mama penenun.\n• Pewarna alami: Indigofera, akar mengkudu, babakan mahoni, dan lumpur alami.\n• Visi KIRA: Menjadi agen keputusan budaya dan mode cerdas terdepan di dunia yang menjembatani warisan tradisi dengan generasi modern secara etis, autentik, dan presisi.\n• 4 Misi: Pengetahuan (Knowledge), Identitas (Identity), Resonansi (Resonance), dan Adaptasi (Adaptation).`
    },
    {
      num: '02',
      title: 'Problem Statement & Target Pengguna',
      desc: '4 Kesenjangan industri & 4 persona pengguna komprehensif',
      content: `4 Kesenjangan Utama:\n1. Kesenjangan Pengetahuan Pelanggan (Cultural Literacy Gap): Keraguan pemakaian motif sakral vs umum.\n2. Keterbatasan Skalabilitas Kurator Manusia: Beban ratusan pertanyaan konsultasi harian.\n3. Risiko Halusinasi AI Generik: AI umum mencampuradukkan motif adat dan resep detergen kimia perusak pewarna alami.\n4. Kebutuhan Generator Konten Edukasi yang Konsisten: Menjaga tone of voice Oerip.\n\n4 Persona Pengguna:\n• The Cultural Enthusiast (Kolektor 30-55 thn): Menilai filosofi motif dan pewarna alami.\n• The Modern Professional (Diplomat 28-48 thn): Busana formal berwibawa untuk konferensi dunia.\n• The Creative Minimalist (Generasi Muda 20-35 thn): Padu-padan kasual santai tanpa terkesan kaku.\n• Tim Kurator & Marketing Oerip: Pengelolaan 6 entitas data dan automasi konten multi-channel.`
    },
    {
      num: '03',
      title: 'Arsitektur Informasi & Navigasi',
      desc: 'Dual-mode architecture (User mode vs Admin enterprise mode)',
      content: `KIRA mengadopsi Dual-Mode Architecture tanpa reload halaman:\n\n1. Mode Pelanggan (USER MODE):\n• Beranda (Landing): Sorotan filosofi dan akses cepat.\n• Tanya AI (Consultation): Chatbot RAG percakapan budaya & rekomendasi real-time.\n• Pustaka Wastra: Ensiklopedia 5 kain warisan Nusantara (Sumba, Tuban, Toraja, Batak, Klaten).\n• Katalog Produk: Koleksi busana terverifikasi Dian Oerip.\n• Rekomendasi Gaya: Kanvas Layering & kalkulator Cultural Fit Score.\n• Persona Budaya: Kuis 4 pertanyaan arketipe wastra.\n\n2. Mode Tim Oerip (ADMIN MODE):\n• Dashboard & KPI: Metrik akurasi 98.4% dan volume query.\n• Knowledge Base Manager: Panel CRUD untuk 6 entitas data inti.\n• Content Studio: Generator artikel blog SEO, caption Instagram, hook TikTok, & newsletter.\n• Antrean Validasi: Review data & audit konflik fakta.`
    },
    {
      num: '04',
      title: 'Spesifikasi Fitur Mode Pelanggan',
      desc: 'Tanya AI RAG, Pustaka Wastra, Styling Studio, Persona Kuis',
      content: `Fitur Utama Pelanggan:\n• Tanya AI: Gemini 2.5 Flash dengan strict grounding data Oerip. Mendeteksi acara, kenyamanan iklim, tingkat formalitas, dan etika adat.\n• Decision Trace Drawer: Menampilkan transparansi penalaran AI dan sumber data rujukan.\n• Pustaka Wastra: 5 wastra unggulan dengan klasifikasi motif: PUBLIC, CULTURAL_RESPECT, dan SACRED_RESTRICTED.\n• Styling Studio: Kanvas padu-padan outer tenun, inner modest/hijab, aksesoris tradisional, dan manekin interaktif.\n• Persona Budaya: 6 arketipe (The Sovereign, The Grounder, The Guardian, The Nomad, The Luminary, The Diplomat).`
    },
    {
      num: '05',
      title: 'Fitur Admin, Kurasi & Content Studio',
      desc: '6 Entitas KB Manager, AI Storytelling Generator, Review Queue',
      content: `Fitur Khusus Tim Internal:\n• Knowledge Base Manager: Mengelola 6 entitas pengetahuan mandiri (Brand, Produk, Wastra, FAQ, Pedoman Konten, Sumber Data).\n• Content Studio: Generator teks multi-channel dengan tone of voice Oerip (santun, puitis, berwibawa) dan pemeriksa istilah terlarang otomatis.\n• Validation Queue: Antrean persetujuan kurator untuk data baru, penggabungan variasi mitologi, dan audit feedback jempol pengguna.`
    },
    {
      num: '06',
      title: 'Arsitektur AI & RAG Grounding Engine',
      desc: 'Pipeline multi-tahap, Gemini 2.5 Flash, Zero-Halusinasi',
      content: `Pipeline Pemrosesan 5 Tahap:\n1. Analisis Kueri & Intent Parsing\n2. Vector & Semantic Retrieval pada data Oerip\n3. Context Re-Ranking & Guardrail Filter (menyaring data sensitif)\n4. Grounded Prompt Construction\n5. Gemini Generation & Post-Processing\n\nPrinsip Ketat Grounding:\nPengetahuan umum internet atau model AI generik TIDAK BOLEH menimpa data Oerip yang kosong. Kueri di luar arsip diarahkan ke antrean riset kurator internal.`
    },
    {
      num: '07',
      title: 'Guardrails Integritas Budaya',
      desc: '3 Lapisan filter proteksi, istilah terlarang, Out-of-Knowledge protocol',
      content: `3 Lapisan Perlindungan Budaya:\n• Lapisan 1: Filter istilah terlarang & tabu adat (mencegah kain cetak pabrik diklaim tenun asli; motif duka dilarang untuk pesta).\n• Lapisan 2: Verification Badge Matching (hanya merekomendasikan produk/wastra berstatus VALIDATED).\n• Lapisan 3: Penjaga Data Sensitif (mencegah kebocoran HPP, kontak penenun, formula pewarna).\n\nProtokol Out-of-Knowledge:\nMenyatakan santun bila data belum tercatat di arsip Oerip dan menyediakan tombol tiket riset kurator (/api/kira/inquiry).`
    },
    {
      num: '08',
      title: 'Algoritma Cultural Fit Score & Styling',
      desc: 'Formula 4 pilar bobot: Acara 35%, Bahan 25%, Adat 25%, Warna 15%',
      content: `Formula Penilaian Paduan Busana:\n• Kesesuaian Acara (35%): Kecocokan siluet dan tingkat kemewahan motif untuk konteks formal/kasual.\n• Harmoni Serat & Bahan (25%): Kecocokan tumpukan katun pintal tangan vs linen alami.\n• Kepatuhan Adat & Nilai Sakral (25%): Memastikan motif sakral tidak dijadikan bawahan yang menyentuh tanah.\n• Keselarasan Palet Warna Bumi (15%): Harmoni visual pewarna alami (Indigofera, Mengkudu, Kunyit, Terakota).\n\nSkala Penilaian:\n• 90%-100%: Sangat Sempurna (Exceptional Resonance)\n• 75%-89%: Harmonis & Siap Dikenakan\n• <75%: Perlu Penyesuaian dengan tips kurator spesifik.`
    },
    {
      num: '09',
      title: 'Spesifikasi 6 Entitas Knowledge Base',
      desc: 'Brand, Produk, Wastra Etnografi, FAQ, Content Guideline, Sumber Data',
      content: `Rincian 6 Entitas Data Tunggal:\n1. Brand & Filosofi: Visi Dian Oerip, zero-waste pattern, etika penenun.\n2. Katalog Produk: Siluet, teknik, bahan, kode keaslian, panduan cuci lerak.\n3. Pustaka Wastra: Daerah asal, suku, bahan baku serat, zat warna, makna motif.\n4. FAQ Terverifikasi: Fitting, pre-order, pengiriman diplomatik internasional.\n5. Pedoman Konten: Nada bicara puitis/berwibawa. Istilah wajib vs istilah terlarang.\n6. Sumber Data & Hirarki: Level 1 (Catatan primer 100%), Level 2 (Katalog resmi 95%), Level 3 (Wawancara terverifikasi 90%).`
    },
    {
      num: '10',
      title: 'Tata Kelola Data Rahasia (Restricted Data)',
      desc: 'Proteksi HPP asli, kontak pribadi mama penenun, formula pewarna alam',
      content: `Klasifikasi STRICTLY_RESTRICTED_ADMIN_ONLY:\n• HPP & Struktur Biaya: Dibatasi hanya untuk Manajemen & Finance. Dilarang dipaparkan AI.\n• Kontak Mama Penenun: Melindungi penenun pedalaman dari eksploitasi tengkulak luar.\n• Formula Pewarnaan Alami: Takaran fermentasi lumpur dan akar mengkudu rahasia studio Dian Oerip.\n• Daftar Kolektor VIP: Data pribadi pejabat negara dan diplomat kolektor Oerip (kepatuhan UU PDP).`
    },
    {
      num: '11',
      title: 'Spesifikasi Teknis & Arsitektur API',
      desc: 'React 19, Tailwind, Express 4.21, 11 endpoint RESTful JSON',
      content: `Stack Arsitektur:\n• Frontend: React 19, TypeScript, Tailwind CSS, Motion, Lucide Icons.\n• Backend: Node.js, Express 4.21, tsx runner, bundel tunggal dist/server.cjs.\n• AI: Google Gen AI SDK (@google/genai) dengan Gemini 2.5 Flash.\n• Ekspor Dokumen: PDFKit engine dengan sistem 2-pass running header & footer.\n• 11 Endpoint API RESTful: /api/health, /api/kira/chat, /api/kira/storytelling, /api/kira/inquiry, /api/kira/entities, /api/kira/validation-queue, /api/kira/feedback, /api/prd/pdf, dll.`
    },
    {
      num: '12',
      title: 'Metrik Keberhasilan (KPI) & Roadmap',
      desc: 'Target akurasi >=98%, CSAT >=90%, 4 fase peluncuran produk',
      content: `Metrik Utama:\n• Akurasi Fakta Budaya: Target >=98.0% (Realisasi: 98.4%)\n• Kepuasan Pengguna (CSAT): Target >=90.0% (Realisasi: 92.5%)\n• Zero Cultural Halucination: 0 Kasus\n• Latensi Respon AI: <1.5 detik\n• Efisiensi Konten Marketing: Hemat 75% waktu tim Oerip\n\nRoadmap:\n• Fase 1: Fondasi RAG & 5 Wastra (SELESAI)\n• Fase 2: Kurasi Lanjutan & Visualisasi Interaktif (AKTIF)\n• Fase 3: Augmented Reality & Virtual Fitting 3D (Q1 2027)\n• Fase 4: Global Multilingual Cultural Engine (Q2 2027)`
    }
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/api/prd/download';
    link.download = 'PRD_KIRA_Oerip_Indonesia_v1.0.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdf = () => {
    window.open('/api/prd/pdf', '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#1C1917]"
        >
          {/* Modal Header */}
          <div className="bg-[#8B2E1C] text-[#FAF7F2] px-5 sm:px-7 py-4 flex items-center justify-between relative border-b border-[#5C1D10]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20 shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-400/25 text-amber-200 px-2 py-0.5 rounded-full font-bold">
                    Official Specification
                  </span>
                  <span className="text-[10px] text-white/80">PRD v1.0 • 9 Halaman Resmi</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                  Product Requirement Document (PRD) KIRA
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-white/80 hover:text-white cursor-pointer"
                title="Tutup Modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Header Tabs */}
          <div className="px-5 sm:px-7 py-2.5 bg-white border-b border-[#E7DFD5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#8B2E1C] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <BookOpen size={13} />
                <span>Ringkasan & Struktur</span>
              </button>
              <button
                onClick={() => setActiveTab('reader')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'reader'
                    ? 'bg-[#8B2E1C] text-white shadow-2xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Eye size={13} />
                <span>Baca Naskah Spesifikasi</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-xl bg-[#8B2E1C] hover:bg-[#732415] text-white font-semibold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-98"
                title="Unduh File PDF Resmi"
              >
                <Download size={13} />
                <span>Unduh PDF (~44 KB)</span>
              </button>
              <button
                onClick={handleOpenPdf}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] border border-[#DCD3C5] text-[#1C1917] font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                title="Buka PDF di Tab Baru"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Buka Tab</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-xs sm:text-sm">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* Fast Summary Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DFD5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#8B2E1C] font-bold text-xs">
                      <CheckCircle2 size={16} />
                      <span>Dokumen Resmi Telah Disusun Rapi & Siap Cetak (A4 Standard)</span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Format PDF telah disempurnakan dengan tata letak eksekutif 9 halaman: Cover megah, Daftar Isi dengan histori revisi, 12 Bagian Spesifikasi Sistem, Lembar Pengesahan Dian Oerip, Matriks Kepatuhan UU PDP & UNESCO, serta Komitmen Keberlanjutan.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#78716C]">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#8B2E1C]" />
                        September 2026
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Award size={12} className="text-[#B88438]" />
                        Status: APPROVED
                      </span>
                      <span>•</span>
                      <span className="font-medium text-[#1E3A2B]">9 Halaman • Zero Duplikasi / Blank Page</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={handleDownload}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#8B2E1C] hover:bg-[#732415] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Download size={15} />
                      <span>Unduh File PDF</span>
                    </button>
                  </div>
                </div>

                {/* Metadata Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#E7DFD5] shadow-2xs">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-medium">Klien / Brand</span>
                    <span className="font-serif font-bold text-xs text-[#1C1917] mt-0.5 block">Oerip Indonesia</span>
                    <span className="text-[10px] text-[#57534E]">Dian Erra Kumalasari</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E7DFD5] shadow-2xs">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-medium">Model AI</span>
                    <span className="font-serif font-bold text-xs text-[#1C1917] mt-0.5 block">Gemini 2.5 Flash</span>
                    <span className="text-[10px] text-[#57534E]">RAG Grounding Ketat</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E7DFD5] shadow-2xs">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-medium">Akurasi Budaya</span>
                    <span className="font-serif font-bold text-xs text-[#1E3A2B] mt-0.5 block">98.4% (Target &ge;98%)</span>
                    <span className="text-[10px] text-[#57534E]">Zero-Halusinasi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E7DFD5] shadow-2xs">
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-medium">Format Dokumen</span>
                    <span className="font-serif font-bold text-xs text-[#8B2E1C] mt-0.5 block">9 Halaman PDF</span>
                    <span className="text-[10px] text-[#57534E]">Ukuran ~44 KB</span>
                  </div>
                </div>

                {/* Table of Contents Preview */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
                      <BookOpen size={16} className="text-[#8B2E1C]" />
                      <span>12 Bagian Spesifikasi & Lembar Pengesahan</span>
                    </h4>
                    <span className="text-[11px] text-[#78716C]">Klik naskah untuk membaca langsung</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sections.map((sec, idx) => (
                      <div
                        key={sec.num}
                        onClick={() => {
                          setSelectedSectionIdx(idx);
                          setActiveTab('reader');
                        }}
                        className="p-3 rounded-xl bg-white border border-[#E7DFD5] hover:border-[#8B2E1C]/60 hover:shadow-2xs transition-all flex items-start gap-2.5 cursor-pointer group"
                      >
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E7DFD5] text-[#8B2E1C] group-hover:bg-[#8B2E1C] group-hover:text-white transition-colors shrink-0 mt-0.5">
                          {sec.num}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs text-[#1C1917] group-hover:text-[#8B2E1C] transition-colors truncate">
                            {sec.title}
                          </div>
                          <div className="text-[11px] text-[#78716C] leading-snug line-clamp-1">{sec.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-[#A8A29E] group-hover:text-[#8B2E1C] transition-colors shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Governance Callout */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DCD3C5] flex items-start gap-3">
                  <ShieldCheck size={22} className="text-[#1E3A2B] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#57534E] leading-relaxed space-y-1">
                    <p className="font-semibold text-[#1C1917]">
                      Persetujuan Resmi & Kepatuhan Etika Perlindungan Penenun
                    </p>
                    <p>
                      Dokumen ini menjadi acuan tunggal standar operasional KIRA bagi Oerip Indonesia. File PDF memuat tanda tangan Founder Dian Erra Kumalasari, Lead AI Solutions Architect, serta Matriks Kepatuhan Regulasi UU PDP No. 27/2022 dan Rekomendasi Etika AI UNESCO.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Reader Tab: Full readable document inside app */
              <div className="flex flex-col md:flex-row gap-5 h-[60vh]">
                {/* Section Selector Sidebar */}
                <div className="w-full md:w-64 shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-[#E7DFD5] pr-0 md:pr-4 pb-3 md:pb-0 gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-[#A8A29E]" />
                    <input
                      type="text"
                      placeholder="Cari bagian spesifikasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#E7DFD5] focus:outline-hidden focus:border-[#8B2E1C]"
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                    {filteredSections.map((sec) => {
                      const origIdx = sections.findIndex((s) => s.num === sec.num);
                      const isSelected = origIdx === selectedSectionIdx;
                      return (
                        <button
                          key={sec.num}
                          onClick={() => setSelectedSectionIdx(origIdx)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B2E1C] text-white font-semibold shadow-2xs'
                              : 'bg-white hover:bg-[#F5EFE6] text-[#1C1917] border border-[#E7DFD5]'
                          }`}
                        >
                          <span
                            className={`font-mono text-[10px] font-bold px-1 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'text-[#8B2E1C]'
                            }`}
                          >
                            {sec.num}
                          </span>
                          <span className="truncate flex-1">{sec.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section Content Display */}
                <div className="flex-1 overflow-y-auto p-4 bg-white border border-[#E7DFD5] rounded-2xl space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#8B2E1C] font-mono text-xs font-bold">
                      <span>BAGIAN {sections[selectedSectionIdx].num}</span>
                      <span>•</span>
                      <span>DOKUMEN RESMI KIRA</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-0.5">
                      {sections[selectedSectionIdx].title}
                    </h3>
                    <p className="text-xs text-[#78716C] mt-0.5">{sections[selectedSectionIdx].desc}</p>
                    <div className="h-0.5 w-16 bg-[#B88438] mt-2" />
                  </div>

                  <div className="text-xs text-[#3D3835] leading-relaxed whitespace-pre-line space-y-2">
                    {sections[selectedSectionIdx].content}
                  </div>

                  <div className="pt-4 border-t border-[#E7DFD5] flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>
                      Bagian {selectedSectionIdx + 1} dari {sections.length}
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedSectionIdx > 0 && (
                        <button
                          onClick={() => setSelectedSectionIdx((prev) => prev - 1)}
                          className="px-2.5 py-1 rounded-lg border border-[#E7DFD5] hover:bg-[#FAF7F2] text-[#1C1917] cursor-pointer"
                        >
                          &larr; Bagian Sebelumnya
                        </button>
                      )}
                      {selectedSectionIdx < sections.length - 1 && (
                        <button
                          onClick={() => setSelectedSectionIdx((prev) => prev + 1)}
                          className="px-2.5 py-1 rounded-lg bg-[#8B2E1C] hover:bg-[#732415] text-white cursor-pointer font-medium"
                        >
                          Bagian Selanjutnya &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 sm:px-7 py-3.5 bg-white border-t border-[#E7DFD5] flex items-center justify-between">
            <span className="text-[11px] text-[#78716C]">
              Dokumen: <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#8B2E1C] font-semibold">PRD_KIRA_Oerip_Indonesia.pdf</code> (9 Halaman)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-[#8B2E1C] hover:bg-[#732415] text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <Download size={14} />
                <span>Unduh File PDF</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
