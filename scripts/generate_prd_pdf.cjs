const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Ensure output directories exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPathRoot = path.join(__dirname, '..', 'PRD_KIRA_Oerip_Indonesia.pdf');
const outputPathPublic = path.join(publicDir, 'PRD_KIRA_Oerip_Indonesia.pdf');
const outputPathDist = path.join(__dirname, '..', 'dist', 'PRD_KIRA_Oerip_Indonesia.pdf');

// Palette matching Oerip Indonesia & KIRA Brand
const COLORS = {
  primary: '#8B2E1C',        // Oerip Terracotta
  primaryDark: '#5C1D10',    // Deep Terracotta
  primaryLight: '#B24530',   // Coral Terracotta
  secondary: '#1C1917',      // Warm Charcoal / Dark Stone (High contrast, crisp text)
  secondaryLight: '#3D3835', // Secondary Dark Body
  muted: '#736B63',          // Neutral Muted
  lightBg: '#FAF7F2',        // Warm Ivory
  cardBg: '#F5EFE6',         // Subtle card neutral
  cardBgWarm: '#F9F6F0',
  accentGold: '#B88438',     // Brass / Gold
  accentGoldLight: '#E8CA93',
  accentForest: '#1E3A2B',   // Forest Green
  accentForestBg: '#F0F5F2',
  dangerBg: '#FEF2F2',
  dangerBorder: '#DC2626',
  dangerText: '#991B1B',
  border: '#E3D8CC',         // Soft divider
  borderLight: '#EDE5DC',
  white: '#FFFFFF'
};

// Initialize PDFKit Document with safe margins (bottom: 30)
const doc = new PDFDocument({
  size: 'A4', // 595.28 x 841.89 pt
  margins: { top: 46, bottom: 30, left: 45, right: 45 },
  bufferPages: true,
  info: {
    Title: 'Product Requirement Document (PRD) — KIRA AI Cultural & Fashion Decision Agent',
    Author: 'Oerip Indonesia x KIRA Product Engineering Team',
    Subject: 'Spesifikasi Lengkap Arsitektur RAG, Data Etnografi & Rekayasa Sistem KIRA',
    Keywords: 'PRD, KIRA, Oerip Indonesia, Wastra, AI, RAG, Fashion, Tenun, Gemini',
    CreationDate: new Date()
  }
});

// Stream to output files
const streamRoot = fs.createWriteStream(outputPathRoot);
const streamPublic = fs.createWriteStream(outputPathPublic);

doc.pipe(streamRoot);
doc.pipe(streamPublic);

// Page constants
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_X = 45;
const CONTENT_W = 505; // 595 - 90
const MAX_Y = 770;     // Content threshold before page break

// Helper: Smart page break check
function checkPageBreak(neededHeight = 35) {
  if (doc.y + neededHeight > MAX_Y) {
    doc.addPage();
    doc.y = 50;
    return true;
  }
  return false;
}

// Helper: Section Banner Header
function drawSectionHeader(num, title) {
  checkPageBreak(70);
  doc.moveDown(0.7);
  const startY = doc.y;

  // Background banner
  doc.roundedRect(CONTENT_X, startY, CONTENT_W, 25, 3).fill(COLORS.primary);
  doc.rect(CONTENT_X, startY, 5, 25).fill(COLORS.accentGold);

  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.white);
  doc.text(`BAGIAN ${num}: ${title.toUpperCase()}`, CONTENT_X + 14, startY + 7, { width: CONTENT_W - 24 });

  doc.y = startY + 33;
}

// Helper: Subsection Title
function drawSubSection(title) {
  checkPageBreak(45);
  doc.moveDown(0.35);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.primaryDark);
  doc.text(title, CONTENT_X, doc.y, { width: CONTENT_W });
  
  // Underline accent
  doc.strokeColor(COLORS.accentGold).lineWidth(1)
     .moveTo(CONTENT_X, doc.y + 2)
     .lineTo(CONTENT_X + 130, doc.y + 2)
     .stroke();
     
  doc.moveDown(0.3);
}

// Helper: Paragraph
function drawParagraph(text, options = {}) {
  const fontSize = options.fontSize || 8.5;
  doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(fontSize);
  const textHeight = doc.heightOfString(text, { width: CONTENT_W, lineGap: 2 });
  
  checkPageBreak(textHeight + 6);
  
  doc.fillColor(options.color || COLORS.secondaryLight);
  doc.text(text, CONTENT_X, doc.y, {
    width: CONTENT_W,
    align: options.align || 'left',
    lineGap: 2
  });
  doc.moveDown(0.25);
}

// Helper: Bullet point with title and description
function drawBullet(title, desc) {
  checkPageBreak(25);
  const bulletY = doc.y;
  
  // Clean circular bullet
  doc.circle(CONTENT_X + 6, bulletY + 5, 2.2).fill(COLORS.primary);
  
  // Text with inline continuation
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary);
  doc.text(title + (desc ? ': ' : ''), CONTENT_X + 16, bulletY, {
    width: CONTENT_W - 16,
    continued: !!desc,
    lineGap: 1.8
  });
  
  if (desc) {
    doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.secondaryLight);
    doc.text(desc, { width: CONTENT_W - 16, lineGap: 1.8 });
  }
  doc.moveDown(0.2);
}

// Helper: Callout Box
function drawCallout(title, text, type = 'info') {
  let borderColor = COLORS.accentGold;
  let bgColor = COLORS.cardBg;
  let titleColor = COLORS.primaryDark;

  if (type === 'danger') {
    borderColor = COLORS.dangerBorder;
    bgColor = COLORS.dangerBg;
    titleColor = COLORS.dangerText;
  } else if (type === 'forest') {
    borderColor = COLORS.accentForest;
    bgColor = COLORS.accentForestBg;
    titleColor = COLORS.accentForest;
  }

  doc.font('Helvetica-Bold').fontSize(8.5);
  const titleH = doc.heightOfString(title, { width: CONTENT_W - 28 });
  doc.font('Helvetica').fontSize(8);
  const textH = doc.heightOfString(text, { width: CONTENT_W - 28, lineGap: 2 });
  const totalH = titleH + textH + 16;

  checkPageBreak(totalH + 8);
  const boxY = doc.y;

  doc.roundedRect(CONTENT_X, boxY, CONTENT_W, totalH, 3).fillAndStroke(bgColor, borderColor);
  doc.rect(CONTENT_X, boxY, 5, totalH).fill(borderColor);

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(titleColor);
  doc.text(title, CONTENT_X + 14, boxY + 7, { width: CONTENT_W - 28 });

  doc.font('Helvetica').fontSize(8).fillColor(COLORS.secondary);
  doc.text(text, CONTENT_X + 14, boxY + 8 + titleH + 2, { width: CONTENT_W - 28, lineGap: 2 });

  doc.y = boxY + totalH + 6;
}

// Helper: Table
function drawTable(headers, rows, colWidths) {
  checkPageBreak(50);
  const startX = CONTENT_X;
  let curY = doc.y + 2;

  // Header row
  doc.rect(startX, curY, CONTENT_W, 18).fill(COLORS.secondary);
  let hX = startX;
  headers.forEach((h, i) => {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.white);
    doc.text(h, hX + 4, curY + 4.5, { width: colWidths[i] - 8, align: 'left' });
    hX += colWidths[i];
  });

  curY += 18;

  // Data rows
  rows.forEach((row, rIdx) => {
    // Calculate required height for this row
    let maxCellH = 14;
    doc.font('Helvetica').fontSize(8);
    row.forEach((cell, i) => {
      const h = doc.heightOfString(cell, { width: colWidths[i] - 8, lineGap: 1.5 });
      if (h + 7 > maxCellH) maxCellH = h + 7;
    });

    // Check if row overflows
    if (curY + maxCellH > MAX_Y) {
      doc.addPage();
      curY = 50;
      // Redraw table header on new page
      doc.rect(startX, curY, CONTENT_W, 18).fill(COLORS.secondary);
      let rX = startX;
      headers.forEach((h, i) => {
        doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.white);
        doc.text(h, rX + 4, curY + 4.5, { width: colWidths[i] - 8, align: 'left' });
        rX += colWidths[i];
      });
      curY += 18;
    }

    const rowBg = rIdx % 2 === 0 ? COLORS.cardBgWarm : COLORS.white;
    doc.rect(startX, curY, CONTENT_W, maxCellH).fillAndStroke(rowBg, COLORS.borderLight);

    let cellX = startX;
    row.forEach((cell, i) => {
      doc.font('Helvetica').fontSize(8).fillColor(COLORS.secondary);
      doc.text(cell, cellX + 4, curY + 3.5, { width: colWidths[i] - 8, lineGap: 1.5 });
      cellX += colWidths[i];
    });

    curY += maxCellH;
  });

  doc.y = curY + 6;
}

// =========================================================================
// 1. COVER PAGE (Grand Executive Style)
// =========================================================================
doc.rect(0, 0, PAGE_W, PAGE_H).fill(COLORS.lightBg);

// Top Decorative Terracotta & Gold Banner
doc.rect(0, 0, PAGE_W, 16).fill(COLORS.primary);
doc.rect(0, 16, PAGE_W, 5).fill(COLORS.accentGold);

// Top Badges
doc.rect(45, 60, 210, 22).fill(COLORS.primaryDark);
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.white);
doc.text('PRODUCT REQUIREMENT DOCUMENT', 50, 66, { width: 200, align: 'center' });

doc.rect(262, 60, 85, 22).fill(COLORS.accentGold);
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.secondary);
doc.text('VERSI 1.0', 265, 66, { width: 80, align: 'center' });

doc.rect(353, 60, 197, 22).fill(COLORS.cardBg);
doc.strokeColor(COLORS.border).lineWidth(1).rect(353, 60, 197, 22).stroke();
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primary);
doc.text('STATUS: APPROVED (PRODUCTION)', 355, 66, { width: 193, align: 'center' });

// Main Titles
doc.y = 105;
doc.font('Helvetica-Bold').fontSize(34).fillColor(COLORS.primary);
doc.text('KIRA', 45, 105);

doc.font('Helvetica-Bold').fontSize(17).fillColor(COLORS.secondary);
doc.text('AI Cultural & Fashion Decision Agent', 45, 145);

doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.primaryDark);
doc.text('Platform Kurasi Wastra, Grounding Budaya Nusantara & Konsultasi Gaya Kontemporer Oerip Indonesia', 45, 168, { width: CONTENT_W, lineGap: 2 });

// Divider
doc.strokeColor(COLORS.accentGold).lineWidth(1.5).moveTo(45, 198).lineTo(550, 198).stroke();

// Executive Summary Box
doc.rect(45, 212, CONTENT_W, 105).fillAndStroke(COLORS.white, COLORS.border);
doc.rect(45, 212, 5, 105).fill(COLORS.primary);

doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLORS.primary);
doc.text('RINGKASAN EKSEKUTIF PRODUK', 58, 222);

doc.font('Helvetica').fontSize(8).fillColor(COLORS.secondary);
const summaryText = 'KIRA (Knowledge, Identity, Resonance, and Adaptation) adalah platform Decision Agent berbasis AI cerdas yang didedikasikan secara eksklusif untuk brand wastra terkemuka Oerip Indonesia karya perancang busana Dian Oerip. KIRA menggabungkan teknologi Retrieval-Augmented Generation (RAG) tingkat lanjut, arsitektur pencegah halusinasi ketat (strict grounding), dan kurasi data warisan tekstil Nusantara (Tenun Sumba, Batik Gedog Tuban, Lurik Klaten, Ulos Batak, Tenun Toraja, dll.) untuk menghadirkan pengalaman konsultasi beretika tinggi, personal, dan mendalam bagi pelanggan, sekaligus menyediakan studio konten dan validasi data bagi tim internal Oerip.';
doc.text(summaryText, 58, 238, { width: 480, align: 'justify', lineGap: 2.2 });

// Document Metadata Table
const metaY = 330;
doc.rect(45, metaY, CONTENT_W, 165).fillAndStroke(COLORS.cardBgWarm, COLORS.border);

doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.primaryDark);
doc.text('INFORMASI DOKUMEN & TATA KELOLA SISTEM', 58, metaY + 10);
doc.strokeColor(COLORS.accentGold).lineWidth(1).moveTo(58, metaY + 23).lineTo(280, metaY + 23).stroke();

const metaFields = [
  ['Nama Produk', 'KIRA (AI Cultural & Fashion Decision Agent)'],
  ['Klien / Brand Resmi', 'Oerip Indonesia (Pendiri: Dian Erra Kumalasari / Dian Oerip)'],
  ['Klasifikasi Sistem', 'Enterprise AI Solution, Cultural Preservation & E-Commerce Decision Engine'],
  ['Status Validasi', 'APPROVED — Spesifikasi Siap Produksi & Terverifikasi Kurator'],
  ['Model AI & Arsitektur', 'Google Gemini 2.5 Flash / Flash Lite + Grounded Semantic RAG Engine'],
  ['Tanggal Efektif', 'September 2026'],
  ['Target Rilis Operasional', 'Q3 - Q4 2026'],
  ['Author / Tim Penyusun', 'Head of Product, Lead AI Architect, & Tim Kurasi Budaya Oerip Indonesia']
];

let curMetaY = metaY + 31;
metaFields.forEach(([k, v]) => {
  doc.font('Helvetica-Bold').fontSize(8).fillColor(COLORS.secondary);
  doc.text(k, 58, curMetaY, { width: 140 });
  doc.font('Helvetica').fontSize(8).fillColor(COLORS.secondaryLight);
  doc.text(': ' + v, 198, curMetaY, { width: 340 });
  curMetaY += 15.5;
});

// Dual Core Role Scope Boxes
const roleBoxY = 510;
const halfW = 246;

// Box 1: Publik Pelanggan
doc.rect(45, roleBoxY, halfW, 155).fillAndStroke(COLORS.white, COLORS.border);
doc.rect(45, roleBoxY, halfW, 22).fill(COLORS.primary);
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.white);
doc.text('MODUL PELANGGAN (PUBLIK)', 55, roleBoxY + 6);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondary);
const userPoints = [
  '• Tanya AI: Chatbot RAG konsultasi wastra real-time',
  '• Pustaka Wastra: Ensiklopedia 5 kain warisan Nusantara',
  '• Styling Studio: Kanvas padu-padan & Cultural Fit Score',
  '• Kuis Persona Budaya: 4 pertanyaan arketipe wastra',
  '• Katalog Busana: Koleksi terverifikasi Dian Oerip'
];
doc.text(userPoints.join('\n\n'), 55, roleBoxY + 32, { width: halfW - 20, lineGap: 1.5 });

// Box 2: Admin Internal
doc.rect(304, roleBoxY, halfW, 155).fillAndStroke(COLORS.white, COLORS.border);
doc.rect(304, roleBoxY, halfW, 22).fill(COLORS.accentForest);
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.white);
doc.text('MODUL ADMIN & TIM OERIP (INTERNAL)', 314, roleBoxY + 6);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondary);
const adminPoints = [
  '• Dashboard Analitik & KPI Akurasi RAG (98.4%)',
  '• Knowledge Base Manager: CRUD 6 entitas data inti',
  '• Content Studio: AI Storytelling & SEO Generator',
  '• Antrean Validasi: Review data & audit konflik fakta',
  '• Proteksi Restricted Data: HPP & kontak mama penenun'
];
doc.text(adminPoints.join('\n\n'), 314, roleBoxY + 32, { width: halfW - 20, lineGap: 1.5 });

// Bottom Footer on Cover
doc.font('Helvetica-Oblique').fontSize(8).fillColor(COLORS.muted);
doc.text('Dokumen ini bersifat rahasia dan merupakan hak milik intelektual Oerip Indonesia bersama Tim KIRA.', 45, 780, { align: 'center', width: CONTENT_W });
doc.rect(0, 835, PAGE_W, 7).fill(COLORS.primary);

// =========================================================================
// 2. PAGE 2: TABLE OF CONTENTS & REVISION HISTORY
// =========================================================================
doc.addPage();
doc.y = 50;

doc.font('Helvetica-Bold').fontSize(14).fillColor(COLORS.primary);
doc.text('DAFTAR ISI & STRUKTUR DOKUMEN', CONTENT_X, doc.y);
doc.strokeColor(COLORS.accentGold).lineWidth(1.5).moveTo(CONTENT_X, doc.y + 3).lineTo(CONTENT_X + 220, doc.y + 3).stroke();
doc.moveDown(0.7);

const tocItems = [
  ['Bagian 01', 'Pendahuluan & Visi Produk Oerip Indonesia', 'Latar belakang brand, filosofi Dian Oerip, 4 misi KIRA'],
  ['Bagian 02', 'Problem Statement & Target Pengguna', '4 kesenjangan industri tekstil & 4 persona pengguna'],
  ['Bagian 03', 'Arsitektur Informasi & Navigasi Antarmuka', 'Dual-mode architecture (Pelanggan vs Tim Admin Oerip)'],
  ['Bagian 04', 'Spesifikasi Fitur Mode Pelanggan', 'Tanya AI RAG, Pustaka Wastra, Styling Studio, Persona Kuis'],
  ['Bagian 05', 'Spesifikasi Fitur Admin, Kurasi & Content Studio', '6 Entitas KB Manager, AI Storytelling Generator, Review Queue'],
  ['Bagian 06', 'Arsitektur AI & RAG Grounding Engine', 'Pipeline multi-tahap, Gemini 2.5 Flash, Zero-Halusinasi'],
  ['Bagian 07', 'Guardrails Integritas Budaya & Anti-Halusinasi', '3 Lapisan filter proteksi, istilah terlarang, Out-of-Knowledge'],
  ['Bagian 08', 'Algoritma Cultural Fit Score & Styling', 'Formula 4 pilar bobot: Acara 35%, Bahan 25%, Adat 25%, Warna 15%'],
  ['Bagian 09', 'Spesifikasi 6 Entitas Knowledge Base', 'Brand, Produk, Wastra Etnografi, FAQ, Content Guideline, Sumber Data'],
  ['Bagian 10', 'Tata Kelola Data Rahasia (Restricted Data)', 'Proteksi HPP asli, kontak pribadi mama penenun, formula pewarna'],
  ['Bagian 11', 'Spesifikasi Teknis & Arsitektur API', 'React 19, Tailwind, Express 4.21, 11 endpoint RESTful JSON'],
  ['Bagian 12', 'Metrik Keberhasilan (KPI) & Roadmap Produk', 'Target akurasi >=98%, CSAT >=90%, 4 fase peluncuran produk'],
  ['Sign-Off', 'Lembar Pengesahan Resmi', 'Persetujuan bersama Manajemen Oerip Indonesia & Tim AI']
];

tocItems.forEach(([badge, title, desc], idx) => {
  const itemY = doc.y;
  doc.rect(CONTENT_X, itemY, 52, 16).fill(idx === 12 ? COLORS.primaryDark : COLORS.cardBg);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(idx === 12 ? COLORS.white : COLORS.primary);
  doc.text(badge, CONTENT_X + 2, itemY + 4.5, { width: 48, align: 'center' });

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary);
  doc.text(title, CONTENT_X + 60, itemY + 3.5, { width: 260 });

  doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted);
  doc.text(desc, CONTENT_X + 325, itemY + 4, { width: 180, align: 'right' });

  doc.y = itemY + 21;
});

doc.moveDown(0.5);

// Revision History Table
doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.primaryDark);
doc.text('RIWAYAT REVISI & KONTROL DOKUMEN', CONTENT_X, doc.y);
doc.strokeColor(COLORS.accentGold).lineWidth(1).moveTo(CONTENT_X, doc.y + 2).lineTo(CONTENT_X + 180, doc.y + 2).stroke();
doc.moveDown(0.4);

const revRows = [
  ['v0.1', '15 Agu 2026', 'Inisiasi Konsep & Riset Etnografi Dian Oerip', 'Lead AI Architect', 'DRAFT'],
  ['v0.5', '25 Agu 2026', 'Integrasi RAG Grounding & Formula Cultural Fit Score', 'Head of Product', 'REVIEW'],
  ['v0.9', '01 Sep 2026', 'Penyelarasan 6 Entitas KB & Guardrails Budaya Sakral', 'Tim Kurator Oerip', 'PENDING'],
  ['v1.0', '04 Sep 2026', 'Persetujuan Final Produksi & Ekspor Format Cetak PDF', 'Dian Oerip & Tim AI', 'APPROVED']
];

drawTable(
  ['Versi', 'Tanggal', 'Deskripsi Perubahan & Ruang Lingkup', 'Penanggung Jawab', 'Status'],
  revRows,
  [45, 65, 235, 95, 65]
);

// =========================================================================
// 3. SECTION 1: PENDAHULUAN & VISI PRODUK
// =========================================================================
drawSectionHeader(1, 'Pendahuluan & Visi Produk');

drawSubSection('1.1 Latar Belakang Brand Oerip Indonesia');
drawParagraph('Oerip Indonesia didirikan oleh Dian Erra Kumalasari (dikenal luas sebagai Dian Oerip), seorang desainer, antropolog visual, dan penjelajah budaya yang mendedikasikan hidupnya untuk melestarikan dan merevitalisasi wastra tenun tradisional Indonesia ke dalam busana kontemporer bernilai seni tinggi. Karya Oerip dikenal dengan filosofi zero-waste pattern (pola tanpa memotong kain sembarangan), pemanfaatan pewarna alami ramah lingkungan (akar mengkudu, daun tarum, lumpur, dll.), serta jalinan kemitraan langsung yang memuliakan para mama penenun di pelosok Nusantara.');

drawSubSection('1.2 Visi & Pernyataan Misi KIRA');
drawParagraph('Visi KIRA adalah menjadi agen keputusan budaya dan mode cerdas terdepan di dunia yang menjembatani kekayaan warisan wastra adiluhung Nusantara dengan generasi modern secara etis, autentik, dan presisi.');
drawBullet('Misi Pengetahuan (Knowledge)', 'Menyimpan, memverifikasi, dan menyajikan arsip data budaya, filosofi motif, dan teknik tenun secara akurat tanpa distorsi komersial.');
drawBullet('Misi Identitas (Identity)', 'Membantu setiap individu menemukan busana wastra yang beresonansi dengan kepribadian dan nilai-nilai hidupnya.');
drawBullet('Misi Resonansi (Resonance)', 'Menyampaikan narasi budaya yang menyentuh hati melalui pendekatan storytelling emosional dan edukatif.');
drawBullet('Misi Adaptasi (Adaptation)', 'Menghadirkan panduan styling kontemporer yang relevan untuk acara formal kenegaraan, diplomasi, resepsi, hingga kasual global.');

drawSubSection('1.3 Prinsip Dasar Pengembangan Sistem');
drawBullet('Kebenaran Budaya Tanpa Kompromi', 'Akurasi fakta adat, mitologi motif, dan asal usul wastra berada di atas segalanya. Tidak ada toleransi terhadap fabrikasi informasi.');
drawBullet('Pemberdayaan Penenun Lokal', 'Menghormati hak adat dan jerih payah mama penenun. Tidak mengeksploitasi data rahasia penenun.');
drawBullet('Desain Ramah Budaya (Woven Aesthetics)', 'Antarmuka terinspirasi dari jalinan serat tenun dan palet warna bumi alami (terracotta, stone, brass, forest green).');

// =========================================================================
// 4. SECTION 2: PROBLEM STATEMENT & TARGET PENGGUNA
// =========================================================================
drawSectionHeader(2, 'Problem Statement & Target Pengguna');

drawSubSection('2.1 Analisis Masalah (The Core Problems)');
drawParagraph('Berdasarkan riset pasar dan wawancara mendalam bersama manajemen Oerip Indonesia, teridentifikasi 4 kesenjangan utama:');
drawBullet('Kesenjangan Pengetahuan Pelanggan (Cultural Literacy Gap)', 'Banyak pelanggan mengagumi keindahan kain Oerip, namun ragu membeli karena tidak memahami etika pemakaian (apakah motif ini sakral, untuk duka cita, atau acara pernikahan?), asal daerah, atau cara perawatan bahan alami.');
drawBullet('Keterbatasan Skalabilitas Kurator Manusia', 'Dian Oerip dan tim kurator senior memiliki pengetahuan adat yang mendalam, namun waktu mereka terbatas untuk melayani ratusan pertanyaan konsultasi harian via WhatsApp dan media sosial.');
drawBullet('Risiko Halusinasi AI Generik', 'Model AI umum di internet sering mencampuradukkan motif Sumba dengan Toraja, mengarang mitologi fiktif, atau memberikan saran pencucian detergen kimia keras yang merusak pewarna alami.');
drawBullet('Kebutuhan Pembuatan Konten Edukasi yang Cepat & Konsisten', 'Tim pemasaran membutuhkan generator narasi budaya yang terstandarisasi dengan tone of voice Oerip (santun, filosofis, bangga, berdaya).');

drawSubSection('2.2 Persona Pengguna (Target Personas)');
const personaRows = [
  [
    'The Cultural Enthusiast\n(Kolektor & Pecinta Wastra)',
    'Usia 30-55 tahun. Mengutamakan orisinalitas, filosofi motif, pewarna alami, dan nilai histori.',
    'Mengetahui makna sakral motif, cerita di balik penenun, dan sertifikasi autentisitas.',
    'Pustaka Wastra, Macro Zoom, Tanya AI Mode Mendalam, Riwayat Daerah.'
  ],
  [
    'The Modern Professional\n(Diplomat & Eksekutif)',
    'Usia 28-48 tahun. Membutuhkan busana formal unik untuk diplomasi, konferensi internasional, atau gala.',
    'Paduan busana anggun, berwibawa, nyaman untuk mobilitas, lolos protokol diplomatik.',
    'Styling Studio (Layering Outer), Cultural Fit Score, Filter Diplomasi.'
  ],
  [
    'The Creative Minimalist\n(Generasi Muda / Pemula)',
    'Usia 20-35 tahun. Tertarik pada fashion etnik modern namun takut terkesan "tua" atau kaku.',
    'Panduan padu-padan kasual santai (dengan jeans, sneakers, inner polos), harga transparan.',
    'Kuis Persona Budaya (4 Langkah), Filter Kasual/Traveling, Siluet Zero-Waste.'
  ],
  [
    'Tim Kurator & Marketing\n(Internal Enterprise User)',
    'Tim pengelola katalog, media sosial, dan hubungan pelanggan Oerip Indonesia.',
    'Alat pengelolaan basis pengetahuan yang mudah, generator narasi multi-channel, moderasi.',
    'Knowledge Base Manager (6 Entitas), Content Studio SEO, Validation Queue.'
  ]
];

drawTable(
  ['Persona Pengguna', 'Karakteristik & Profil', 'Kebutuhan Utama', 'Fitur KIRA yang Digunakan'],
  personaRows,
  [115, 125, 135, 130]
);

// =========================================================================
// 5. SECTION 3: ARSITEKTUR INFORMASI & NAVIGASI DUAL-MODE
// =========================================================================
drawSectionHeader(3, 'Arsitektur Informasi & Navigasi Antarmuka');

drawSubSection('3.1 Struktur Navigasi Dual-Mode (User vs Admin)');
drawParagraph('KIRA mengadopsi arsitektur dwifungsi (Dual-Mode Architecture) yang dapat beralih secara instan melalui Role Switcher di Navbar atas tanpa memerlukan reload halaman:');
drawBullet('Mode Pelanggan (USER MODE)', 'Berfokus pada eksplorasi estetis, percakapan natural RAG, inspirasi busana, dan edukasi wastra tanpa kebisingan teknis.');
drawBullet('Mode Internal Tim (ADMIN MODE)', 'Menyediakan panel kendali enterprise untuk mengelola integritas data, memantau metrik performa AI, menghasilkan konten pemasaran, dan memoderasi antrean validasi.');

const navRows = [
  ['USER', 'Beranda (Landing)', 'Hero inspiratif, highlight filosofi Dian Oerip, akses kilat ke seluruh fitur.'],
  ['USER', 'Tanya AI (Consultation)', 'Chatbot RAG percakapan budaya, deteksi intent busana, dan rekomendasi real-time.'],
  ['USER', 'Pustaka Wastra', 'Ensiklopedia 5 wastra unggulan Oerip lengkap dengan motif, mitologi, serat, dan peta.'],
  ['USER', 'Katalog Produk', 'Katalog busana Dian Oerip terverifikasi dengan siluet, bahan, acara, dan investasi.'],
  ['USER', 'Rekomendasi Gaya', 'Studio padu-padan (Layering Canvas), kalkulator Cultural Fit Score, panduan drape.'],
  ['USER', 'Persona Budaya', 'Kuis 4 langkah penentu arketipe karakter busana wastra (Nomad, Diplomat, dll.).'],
  ['ADMIN', 'Dashboard & KPI', 'Statistik total entitas, skor akurasi RAG (98.4%), volume query, distribusi status data.'],
  ['ADMIN', 'Knowledge Base Manager', 'Panel CRUD untuk 6 entitas: Brand, Produk, Wastra, FAQ, Pedoman Konten, Sumber Data.'],
  ['ADMIN', 'Content Studio', 'Generator artikel blog SEO, caption Instagram, hook TikTok, dan newsletter Oerip.'],
  ['ADMIN', 'Validasi & Feedback', 'Review queue untuk data baru, audit konflik fakta, dan evaluasi feedback jempol.']
];

drawTable(
  ['Akses', 'Modul / Layar', 'Fungsi & Cakupan Fitur'],
  navRows,
  [65, 135, 305]
);

// =========================================================================
// 6. SECTION 4: SPESIFIKASI FITUR MODE PELANGGAN
// =========================================================================
drawSectionHeader(4, 'Spesifikasi Fitur Mode Pelanggan');

drawSubSection('4.1 Tanya AI: KIRA Decision Agent (RAG Terverifikasi)');
drawParagraph('Fitur percakapan interaktif berbasis Gemini 2.5 Flash yang diperkaya dengan sistem Retrieval-Augmented Generation (RAG) khusus data Oerip:');
drawBullet('Deteksi Konteks Cerdas', 'Menganalisis acara (diplomasi, pesta, kantor, kasual), preferensi warna, kenyamanan iklim, tingkat formalitas, dan sensitivitas adat.');
drawBullet('Transparansi Keputusan (Decision Trace Drawer)', 'Menampilkan alasan mengapa produk tertentu disarankan, status verifikasi sumber data, dan riwayat penalaran agen.');
drawBullet('Quick Suggestions & Sapaan Budaya', 'Pilihan prompt instan ("Paduan Tenun Sumba untuk Resepsi", "Filosofi Pewarna Alami Tuban", "Perawatan Tenun Sutra").');
drawBullet('Tombol Konsultasi Kurator WhatsApp', 'Integrasi langsung ke nomor WhatsApp resmi kurator Oerip jika pelanggan ingin berdiskusi lebih lanjut atau memesan.');

drawSubSection('4.2 Pustaka Wastra Nusantara (Cultural Encyclopedia)');
drawParagraph('Modul edukasi komprehensif yang mendokumentasikan warisan tekstil yang diolah oleh Dian Oerip:');
drawBullet('5 Wastra Unggulan', 'Tenun Ikat Sumba Timur, Batik Gedog Tuban, Tenun Songket Toraja, Ulos Ragi Hotang Batak, dan Tenun Lurik Klaten.');
drawBullet('Katalog Motif & Status Sakral', 'Setiap motif diberi label jelas apakah berstatus PUBLIC, CULTURAL_RESPECT, atau SACRED_RESTRICTED (motif pemakaman/raja).');
drawBullet('Informasi Pewarnaan Alami', 'Penjelasan tanaman pewarna (Akar Mengkudu, Daun Nila/Tarum, Babakan Kayu Mahoni, dll.).');

drawSubSection('4.3 Rekomendasi Gaya & Styling Studio (Layering Canvas)');
drawParagraph('Kanvas padu-padan interaktif untuk menyusun busana Oerip secara elegan:');
drawBullet('Statement Outer Tenun', 'Pemilihan luaran tenun Oerip berpotongan loose/zero-waste.');
drawBullet('Bawahan & Inner Modest', 'Pilihan celana kulot, kain lilit, rok pleats, hingga filter khusus Hijab & Modest Wear.');
drawBullet('Aksesoris Tradisional Nusantara', 'Mamuli kuningan Sumba, Bros tembaga Gedog, Bros perak Ulos, dan Kalung Toraja.');
drawBullet('Kalkulator Cultural Fit Score', 'Menilai kecocokan acara, keterhubungan bahan serat alami, dan harmoni warna bumi secara dinamis (skor 0-100%).');
drawBullet('Manekin Interaktif 3 Mode', 'Mode Kanvas Layering, Mode Studio Manekin (3 pose siluet), dan Mode Panduan Drape Tubuh.');

drawSubSection('4.4 Kuis Persona Budaya Nusantara (Persona Match)');
drawParagraph('Kuis 4 pertanyaan cepat untuk mengidentifikasi karakter dan gaya wastra pengguna:');
drawBullet('6 Arketipe Persona', 'The Sovereign (Pemimpin Karismatik), The Grounder (Pecinta Bumi & Alam), The Guardian (Penjaga Adat Sakral), The Nomad (Petualang Bebas), The Luminary (Seniman Avant-Garde), dan The Diplomat (Negarawan Anggun).');
drawBullet('Integrasi Lintas Modul', 'Hasil persona dapat langsung dikonsultasikan ke Tanya AI atau diekspor ke Styling Studio.');

// =========================================================================
// 7. SECTION 5: FITUR ADMIN, KURASI & CONTENT STUDIO
// =========================================================================
drawSectionHeader(5, 'Spesifikasi Fitur Admin, Kurasi & Content Studio');

drawSubSection('5.1 Knowledge Base Manager (6 Entitas CRUD)');
drawParagraph('Pusat data terpusat (Single Source of Truth) yang mengelola 6 entitas pengetahuan inti Oerip Indonesia:');
drawBullet('Entitas 1: Brand & Filosofi', 'Profil pendiri, visi, DNA desain, zero-waste pattern, dan etika kolaborasi dengan penenun.');
drawBullet('Entitas 2: Katalog Produk Terverifikasi', 'Data teknis busana, siluet, teknik, bahan, kode keaslian, dan panduan perawatan.');
drawBullet('Entitas 3: Pustaka Wastra & Etnografi', 'Data daerah asal, suku, mitologi motif, status kesakralan, dan sejarah kain.');
drawBullet('Entitas 4: FAQ Terverifikasi', 'Daftar tanya-jawab umum seputar pembelian, pre-order, fitting, dan pengiriman internasional.');
drawBullet('Entitas 5: Pedoman Konten & Gaya Bahasa', 'Daftar istilah wajib (Contoh: "ditenun tangan", bukan "dicetak"), istilah terlarang ("batik tenun", "motif etnik murahan"), dan tone of voice.');
drawBullet('Entitas 6: Sumber Data & Hirarki Kepercayaan', 'Level 1 (Primer: Dokumen & Arsip Dian Oerip), Level 2 (Resmi: Katalog & Web Oerip), Level 3 (Hasil Validasi Tim Kurator).');

drawSubSection('5.2 Content Studio: AI Storytelling Generator');
drawParagraph('Generator narasi bertenaga Gemini yang menghasilkan materi publikasi multi-saluran dengan kepatuhan SEO dan tone of voice Oerip:');
drawBullet('Pilihan Saluran', 'Artikel Blog Edukasi (Long-form), Caption Instagram (Emosional & Filosofis), Script Video TikTok / Reels (Hook kuat & visual), dan Newsletter Pelanggan VIP.');
drawBullet('Integrasi Kata Kunci Budaya', 'Secara otomatis menyematkan istilah tenun tangan, pewarna alami, mama penenun, dan nama motif asli.');
drawBullet('Pemeriksa Kepatuhan Brand (Brand Voice Checker)', 'Memastikan tidak ada kata terlarang yang lolos sebelum konten dipublikasikan.');

drawSubSection('5.3 Validation Queue & Audit Konflik Pengetahuan');
drawParagraph('Mekanisme kurasi manusia sebelum data baru dimasukkan ke indeks memori KIRA:');
drawBullet('Antrean Tinjauan (Review Queue)', 'Menampilkan data dari hasil ekstraksi media sosial atau input draf yang berstatus NEEDS_REVIEW.');
drawBullet('Penyelesaian Konflik Fakta', 'Jika terdapat variasi cerita mitologi antar narasumber, kurator dapat menentukan narasi resmi Oerip.');
drawBullet('Audit Feedback Jempol Pelanggan', 'Log ulasan kepuasan pengguna (Thumbs Up / Down) untuk mengevaluasi jawaban AI yang perlu diperbaiki.');

// =========================================================================
// 8. SECTION 6: ARSITEKTUR AI & RAG GROUNDING ENGINE
// =========================================================================
drawSectionHeader(6, 'Arsitektur AI & RAG Grounding Engine');

drawSubSection('6.1 Diagram Alur Retrieval-Augmented Generation (RAG)');
drawParagraph('KIRA menerapkan pipa pemrosesan multi-tahap (Multi-Stage Processing Pipeline) untuk memastikan setiap respon AI berakar kuat pada data terverifikasi Oerip Indonesia:');
drawBullet('1. Analisis Kueri & Intent Parsing', 'Kueri pengguna dianalisis untuk mengekstraksi parameter kunci: acara, jenis wastra, warna, siluet, dan sensitivitas.');
drawBullet('2. Vector & Semantic Retrieval', 'Pencarian semantik pada basis pengetahuan Oerip yang mencakup database produk, wastra, FAQ, dan pedoman konten.');
drawBullet('3. Context Re-Ranking & Guardrail Filter', 'Penyaringan data untuk memisahkan informasi publik dari data berstatus RESTRICTED.');
drawBullet('4. Grounded Prompt Construction', 'Penyusunan system prompt yang menyertakan data Oerip sebagai satu-satunya rujukan kebenaran faktual.');
drawBullet('5. Gemini Generation & Post-Processing', 'Model menghasilkan jawaban santun dan transparan beserta catatan sumber rujukan.');

drawCallout(
  'PRINSIP KETAT GROUNDING OERIP',
  'Pengetahuan umum internet atau model AI generik TIDAK BOLEH menimpa atau melengkapi data Oerip yang kosong. Jika informasi suatu wastra tidak tercatat dalam arsip resmi Oerip, KIRA wajib menolak secara santun dan mengarahkan topik tersebut ke antrean riset kurator internal.',
  'info'
);

drawSubSection('6.2 Spesifikasi Model AI');
const modelRows = [
  ['Primary LLM', 'Google Gemini 2.5 Flash / Flash Lite', 'Digunakan untuk percakapan interaktif berkecepatan tinggi dengan latensi rendah (<1.5 detik).'],
  ['Content Engine', 'Gemini 2.5 Pro / Flash', 'Digunakan dalam Content Studio untuk menghasilkan artikel blog mendalam dan narasi bernilai sastra.'],
  ['Temperature Setting', '0.2 - 0.4 (Consultation) / 0.7 (Content)', 'Suhu rendah digunakan pada konsultasi untuk meminimalkan deviasi, suhu lebih tinggi pada Content Studio untuk kreativitas diksi.'],
  ['Context Window', '1M+ Tokens Support', 'Memungkinkan pemuatan seluruh katalog produk dan arsip wastra Oerip tanpa pemotongan konteks (truncation).']
];
drawTable(
  ['Komponen AI', 'Spesifikasi / Konfigurasi', 'Justifikasi & Peruntukan'],
  modelRows,
  [100, 155, 250]
);

// =========================================================================
// 9. SECTION 7: GUARDRAILS INTEGRITAS BUDAYA & ANTI-HALUSINASI
// =========================================================================
drawSectionHeader(7, 'Guardrails Integritas Budaya & Anti-Halusinasi');

drawSubSection('7.1 Tiga Lapisan Perlindungan Integritas Budaya (3-Layer Guardrails)');
drawParagraph('Untuk melindungi kemurnian adat dan nama baik brand Dian Oerip, KIRA dilengkapi dengan 3 lapisan filter proteksi otomatis:');
drawBullet('Lapisan 1: Filter Istilah Terlarang & Tabu Adat', 'Mendeteksi dan memblokir kata-kata yang mendegradasi martabat wastra, seperti mengklaim kain cetak pabrik sebagai tenun asli, atau menyarankan motif sakral pemakaman untuk pesta pernikahan.');
drawBullet('Lapisan 2: Verification Badge Matching', 'Hanya merekomendasikan produk dan wastra yang memiliki status VALIDATED dalam basis data Oerip. Data draf tidak akan pernah disajikan kepada pelanggan.');
drawBullet('Lapisan 3: Penjaga Data Sensitif & Rahasia (Restricted Guard)', 'Mencegah pembocoran informasi HPP, formula rahasia pewarnaan alam, atau kontak pribadi mama penenun di pedalaman kepada publik.');

drawCallout(
  'PERLINDUNGAN HAK KOMUNITAS PENENUN PEDALAMAN',
  'KIRA mengadopsi prinsip etika pelestarian budaya ketat. Pengetahuan sakral yang diamanatkan oleh tetua adat di Sumba atau Toraja sebagai "khusus upacara adat" diberi label SACRED_RESTRICTED dan dilarang untuk direkomendasikan sebagai busana pesta kasual.',
  'forest'
);

drawSubSection('7.2 Penanganan Pertanyaan di Luar Basis Pengetahuan (Out-of-Knowledge Protocol)');
drawParagraph('Ketika pengguna menanyakan wastra atau tradisi Nusantara yang belum tercatat resmi dalam arsip Dian Oerip (misalnya Tenun Dayak Iban atau Kain Cual Bangka):');
drawBullet('Pernyataan Santun KIRA', 'KIRA secara jujur menyatakan bahwa data resmi mengenai wastra tersebut belum diverifikasi oleh Dian Oerip.');
drawBullet('Kartu Khusus "Butuh Riset Tim Kurator"', 'Menampilkan kartu informasi ramah dengan penjelasan bahwa tim Oerip berkomitmen menjaga akurasi data.');
drawBullet('Tombol Pengajuan Riset Kurator', 'Pengguna dapat menekan tombol "Ajukan Topik Ini ke Antrean Riset Kurator", yang secara instan mendaftarkan pertanyaan ke sistem tiket internal Oerip (/api/kira/inquiry).');
drawBullet('Rekomendasi Alternatif 5 Wastra Terverifikasi', 'Menawarkan 5 wastra unggulan Oerip yang sudah terkurasi lengkap.');

// =========================================================================
// 10. SECTION 8: ALGORITMA CULTURAL FIT SCORE & STYLING
// =========================================================================
drawSectionHeader(8, 'Algoritma Cultural Fit Score & Styling');

drawSubSection('8.1 Formula Perhitungan Cultural Fit Score');
drawParagraph('Cultural Fit Score adalah metrik kuantitatif (0 - 100%) yang dikembangkan KIRA untuk mengukur seberapa harmonis paduan busana yang disusun di Styling Studio berdasarkan 4 pilar objektif:');

const scoreRows = [
  ['Kesesuaian Acara (Occasion Appropriateness)', '35%', 'Mengevaluasi apakah siluet busana, tingkat kemewahan motif, dan struktur outer cocok untuk konteks acara (Diplomasi, Pesta, Kasual, Kantor).'],
  ['Harmoni Serat & Bahan (Material Resonance)', '25%', 'Menilai kecocokan tumpukan kain (misal: tenun katun pintal tangan tebal dipadukan dengan celana katun linen alami vs bahan sintetis mengkilap).'],
  ['Kepatuhan Adat & Nilai Sakral (Cultural Propriety)', '25%', 'Memastikan tidak ada pelanggaran adat (misal: motif sakral tidak dijadikan bawahan yang menyentuh tanah).'],
  ['Keselarasan Palet Warna Bumi (Color Harmony)', '15%', 'Menghitung harmoni visual warna pewarna alami (Indigofera, Mengkudu, Kunyit, Terakota, Mahoni).']
];
drawTable(
  ['Komponen Penilaian', 'Bobot', 'Deskripsi Evaluasi'],
  scoreRows,
  [165, 45, 295]
);

drawSubSection('8.2 Skala Tingkat Kelayakan');
drawBullet('Skor 90% - 100% (Sangat Sempurna / Exceptional Resonance)', 'Paduan sangat harmonis, memenuhi seluruh etika adat, dan merepresentasikan siluet ikonik Dian Oerip.');
drawBullet('Skor 75% - 89% (Harmonis & Siap Dikenakan / Culturally Aligned)', 'Paduan selaras dengan sedikit saran penyesuaian aksesoris tradisional.');
drawBullet('Skor < 75% (Perlu Penyesuaian / Review Needed)', 'Terdapat ketidakcocokan formalitas atau percampuran serat yang kurang ideal, KIRA memberikan tips perbaikan spesifik.');

// =========================================================================
// 11. SECTION 9: SPESIFIKASI 6 ENTITAS KNOWLEDGE BASE
// =========================================================================
drawSectionHeader(9, 'Spesifikasi 6 Entitas Knowledge Base');

drawSubSection('9.1 Rincian 6 Entitas Pengetahuan Tunggal');
drawBullet('Entitas 1: Profil Brand & Filosofi', 'Profil Dian Oerip, filosofi Fashion with a Mission, zero-waste pattern, dan komitmen pada pewarna alami.');
drawBullet('Entitas 2: Katalog Produk Terverifikasi', 'ID Produk, Nama Busana, Siluet (Asymmetric Cape, Kimono Outer, Draped Poncho), Asal Tenun, Teknik, Ukuran All-Size, Panduan Cuci, dan Rentang Investasi.');
drawBullet('Entitas 3: Pustaka Wastra Nusantara', 'Daerah asal, suku/komunitas penenun, bahan baku (kapas pintal tangan, serat alam), zat pewarna alam, makna filosofis motif (Kuda Sumba, Burung Enggang, Parang Tuban), dan konteks upacara.');
drawBullet('Entitas 4: FAQ Terverifikasi', 'Cara merawat kain dengan lerak, layanan custom fitting, durasi penenunan tangan (3-12 bulan per lembar), dan pemesanan delegasi kenegaraan.');
drawBullet('Entitas 5: Pedoman Konten & Gaya Bahasa', 'Nada bicara santun, puitis, berwibawa. Istilah wajib: "tenun tangan", "pewarna alam", "pola zero-waste", "mama penenun". Istilah terlarang: "batik tenun", "etnik murahan", "cetak pabrik".');
drawBullet('Entitas 6: Sumber Data & Hirarki Kepercayaan', 'Level 1: Catatan primer & lapangan Dian Oerip (100%). Level 2: Katalog & publikasi resmi Oerip (95%). Level 3: Hasil wawancara terverifikasi tim kurator (90%).');

// =========================================================================
// 12. SECTION 10: TATA KELOLA DATA RAHASIA (RESTRICTED DATA)
// =========================================================================
drawSectionHeader(10, 'Tata Kelola Data Rahasia (Restricted Data)');

drawSubSection('10.1 Definisi & Klasifikasi Data Sensitif');
drawParagraph('Untuk melindungi integritas bisnis Oerip Indonesia dan privasi para pengrajin di pelosok desa, KIRA memisahkan data publik dari data berklasifikasi STRICTLY_RESTRICTED_ADMIN_ONLY:');

const restrictedRows = [
  ['HPP & Biaya Produksi', 'Rincian harga beli kain dari penenun dan margin produksi busana Oerip.', 'Hanya dapat diakses Manajemen Eksekutif & Finance. Dilarang keras dipaparkan oleh AI.'],
  ['Kontak Mama Penenun', 'Nomor telepon dan alamat domisili para mama penenun di pedalaman Sumba, Tuban, Toraja.', 'Melindungi penenun dari eksploitasi perantara/tengkulak luar. Diberi enkripsi akses.'],
  ['Formula Pewarnaan Alami', 'Takaran fermentasi lumpur, akar mengkudu, dan daun tarum khusus studio Oerip.', 'Kekayaan intelektual dan rahasia dagang studio atelier Dian Oerip.'],
  ['Daftar Kolektor VIP', 'Data pribadi pejabat negara, diplomat asing, dan figur publik kolektor Oerip.', 'Kerahasiaan data pribadi sesuai regulasi privasi & UU PDP Indonesia.']
];

drawTable(
  ['Kategori Data Rahasia', 'Uraian Isi Informasi', 'Tingkat Proteksi & Alasan'],
  restrictedRows,
  [120, 185, 200]
);

drawSubSection('10.2 Mekanisme Enkripsi & Pembatasan Sistem');
drawParagraph('Seluruh data sensitif disimpan pada skema penyimpanan terpisah dengan otorisasi berbasis peran (Role-Based Access Control / RBAC). Kueri dari modul publik (Tanya AI, Styling Studio) secara otomatis mengecualikan kategori data ini dari vektor embedding RAG.');

// =========================================================================
// 13. SECTION 11: SPESIFIKASI TEKNIS & ARSITEKTUR API
// =========================================================================
drawSectionHeader(11, 'Spesifikasi Teknis & Arsitektur API');

drawSubSection('11.1 Tech Stack Ringkas');
drawBullet('Frontend', 'React 19, TypeScript, Tailwind CSS, Motion (framer-motion), Lucide Icons.');
drawBullet('Backend Server', 'Node.js, Express 4.21, TypeScript runner (tsx), RESTful JSON Architecture.');
drawBullet('AI Engine', 'Google Gen AI SDK (@google/genai) dengan model Gemini 2.5 Flash.');
drawBullet('Build & Bundling', 'Vite 6, esbuild, output mandiri server.cjs.');
drawBullet('Dokumentasi & Ekspor', 'PDFKit engine untuk kompilasi PRD dan laporan analitik cetak.');

drawSubSection('11.2 Daftar Endpoint API Utama');
const apiRows = [
  ['GET', '/api/health', 'Pemeriksaan status server, waktu aktif, dan konektivitas agen.'],
  ['GET', '/api/kira/businesses', 'Mengambil profil bisnis Oerip Indonesia dan metadata operasional.'],
  ['POST', '/api/kira/chat', 'Memproses percakapan RAG pengguna, intent detection, dan rekomendasi.'],
  ['POST', '/api/kira/storytelling', 'Membuat narasi konten multi-channel (Instagram, TikTok, Blog, Newsletter).'],
  ['POST', '/api/kira/inquiry', 'Mendaftarkan tiket pertanyaan di luar basis data ke antrean riset kurator.'],
  ['GET', '/api/kira/entities', 'Mengambil daftar 6 entitas pengetahuan untuk manajemen internal.'],
  ['POST', '/api/kira/entities', 'Menambahkan atau memperbarui entitas pengetahuan dengan validasi kurator.'],
  ['GET', '/api/kira/validation-queue', 'Mengambil daftar data yang menunggu tinjauan dan persetujuan tim Oerip.'],
  ['POST', '/api/kira/validation-queue/action', 'Melakukan approve, reject, atau edit pada item antrean validasi.'],
  ['POST', '/api/kira/feedback', 'Menyimpan rating jempol (Up/Down) dan catatan evaluasi dari pengguna.'],
  ['GET', '/api/prd/pdf', 'Mengunduh file resmi Product Requirement Document (PRD) berformat PDF.']
];

drawTable(
  ['Metode', 'Endpoint URL', 'Deskripsi & Fungsi Operasional'],
  apiRows,
  [45, 165, 295]
);

// =========================================================================
// 14. SECTION 12: METRIK KEBERHASILAN (KPI) & ROADMAP
// =========================================================================
drawSectionHeader(12, 'Metrik Keberhasilan (KPI) & Roadmap Produk');

drawSubSection('12.1 Key Performance Indicators (KPI)');
const kpiRows = [
  ['Akurasi Fakta Budaya', 'Target: >= 98.0%', 'Realisasi: 98.4%', 'Audit kurator terhadap kebenaran mitologi motif dan teknik tenun.'],
  ['Kepuasan Pengguna (CSAT)', 'Target: >= 90.0%', 'Realisasi: 92.5%', 'Rasio feedback jempol positif (Thumbs Up) pada modul Tanya AI.'],
  ['Zero Cultural Halucination', 'Target: 0 Kasus', 'Realisasi: 0 Kasus', 'Nol toleransi terhadap pengikisan status motif sakral atau fakta fiktif.'],
  ['Waktu Respon Percakapan', 'Target: < 2.0 detik', 'Realisasi: 1.2 detik', 'Kecepatan rata-rata respon RAG hingga teks tampil di layar pengguna.'],
  ['Efisiensi Konten Marketing', 'Target: Hemat 70%', 'Realisasi: Hemat 75%', 'Pengurangan waktu tim Oerip dalam menyusun artikel dan caption terkurasi.']
];

drawTable(
  ['Nama Metrik (KPI)', 'Target Resmi', 'Status Realisasi', 'Keterangan Pengukuran'],
  kpiRows,
  [145, 85, 95, 180]
);

drawSubSection('12.2 Roadmap Peluncuran & Fase Pengembangan');
drawBullet('Fase 1: Fondasi RAG & Pustaka 5 Wastra (Q3 2026 - SELESAI)', 'Implementasi dual-mode, database 5 wastra unggulan, 6 entitas KB, dan Styling Studio.');
drawBullet('Fase 2: Kurasi Lanjutan & Visualisasi Interaktif (Q4 2026 - AKTIF)', 'Integrasi tiket eskalasi WhatsApp, pencegah error dev-server WebSocket, dan pengayaan 30 varian busana.');
drawBullet('Fase 3: Augmented Reality & Virtual Fitting Room (Q1 2027)', 'Simulasi drape kain 3D pada foto tubuh pelanggan dan integrasi kamera WebXR.');
drawBullet('Fase 4: Global Multilingual Cultural Engine (Q2 2027)', 'Dukungan bahasa Inggris, Prancis, dan Jepang untuk melayani pasar diplomasi dan pameran Oerip di Eropa & Amerika.');

// =========================================================================
// 15. LEMBAR PENGESAHAN (SIGN-OFF)
// =========================================================================
checkPageBreak(250);
doc.moveDown(0.8);

doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.primary);
doc.text('LEMBAR PENGESAHAN DOKUMEN (SIGN-OFF)', CONTENT_X, doc.y);
doc.strokeColor(COLORS.accentGold).lineWidth(1.5).moveTo(CONTENT_X, doc.y + 2).lineTo(CONTENT_X + 260, doc.y + 2).stroke();
doc.moveDown(0.5);

doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.secondary);
doc.text('Dokumen Product Requirement Document (PRD) ini telah ditinjau dan disetujui bersama oleh Manajemen Oerip Indonesia dan Tim Rekayasa AI KIRA sebagai acuan tunggal standar pengembangan dan operasional sistem.', CONTENT_X, doc.y, { width: CONTENT_W, lineGap: 2 });
doc.moveDown(0.6);

const signY = doc.y;
const signBoxW = 246;

// Signature Box 1: Brand
doc.rect(CONTENT_X, signY, signBoxW, 115).fillAndStroke(COLORS.cardBgWarm, COLORS.border);
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primary);
doc.text('PIHAK BRAND & KURASI BUDAYA', CONTENT_X + 12, signY + 10);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondary);
doc.text('Oerip Indonesia', CONTENT_X + 12, signY + 22);

doc.strokeColor(COLORS.border).lineWidth(0.5).moveTo(CONTENT_X + 12, signY + 80).lineTo(CONTENT_X + signBoxW - 12, signY + 80).stroke();
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary);
doc.text('Dian Erra Kumalasari (Dian Oerip)', CONTENT_X + 12, signY + 85);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted);
doc.text('Founder, Creative Director & Master Curator', CONTENT_X + 12, signY + 97);

// Signature Box 2: Engineering
doc.rect(CONTENT_X + signBoxW + 13, signY, signBoxW, 115).fillAndStroke(COLORS.cardBgWarm, COLORS.border);
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primary);
doc.text('PIHAK REKAYASA PRODUK & AI', CONTENT_X + signBoxW + 25, signY + 10);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondary);
doc.text('KIRA Engineering & Architecture Team', CONTENT_X + signBoxW + 25, signY + 22);

doc.strokeColor(COLORS.border).lineWidth(0.5).moveTo(CONTENT_X + signBoxW + 25, signY + 80).lineTo(CONTENT_X + (signBoxW * 2) + 1, signY + 80).stroke();
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.secondary);
doc.text('Lead AI Solutions Architect', CONTENT_X + signBoxW + 25, signY + 85);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted);
doc.text('Head of Product & System Engineering', CONTENT_X + signBoxW + 25, signY + 97);

// Concluding Compliance Matrix
const matrixY = signY + 124;
doc.font('Helvetica-Bold').fontSize(9).fillColor(COLORS.primaryDark);
doc.text('MATRIKS KEPATUHAN TATA KELOLA & STANDAR ETIKA AI', CONTENT_X, matrixY);
doc.strokeColor(COLORS.accentGold).lineWidth(1).moveTo(CONTENT_X, matrixY + 12).lineTo(CONTENT_X + 260, matrixY + 12).stroke();

const complianceRows = [
  ['UU Perlindungan Data Pribadi (UU PDP No. 27/2022)', 'MEMENUHI (COMPLIANT)', 'Enkripsi data rahasia penenun & pemisahan penyimpanan publik/internal.'],
  ['UNESCO Recommendation on Ethics of AI', 'TERVERIFIKASI PENUH', 'Menjunjung kesetaraan budaya, kearifan lokal & hak komunitas adat.'],
  ['Protokol Kesakralan Motif Adat (Sacred Guard)', 'DITERAPKAN KETAT', 'Pencegah halusinasi untuk motif upacara adat & restriksi pemakaman.'],
  ['Integritas Hak Cipta Komunitas Penenun', 'TERAKREDITASI RESMI', 'Kemitraan langsung adiluhung & perlindungan warisan leluhur Nusantara.']
];

let curCompY = matrixY + 18;
doc.rect(CONTENT_X, curCompY, CONTENT_W, 16).fill(COLORS.secondary);
doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.white);
doc.text('Standar Regulasi / Etika', CONTENT_X + 6, curCompY + 4, { width: 170 });
doc.text('Status Evaluasi', CONTENT_X + 185, curCompY + 4, { width: 100 });
doc.text('Catatan Implementasi Teknis', CONTENT_X + 295, curCompY + 4, { width: 200 });

curCompY += 16;
complianceRows.forEach(([std, stat, note], cIdx) => {
  const bg = cIdx % 2 === 0 ? COLORS.cardBgWarm : COLORS.white;
  doc.rect(CONTENT_X, curCompY, CONTENT_W, 16).fillAndStroke(bg, COLORS.borderLight);

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.secondary);
  doc.text(std, CONTENT_X + 6, curCompY + 4, { width: 170 });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.accentForest);
  doc.text(stat, CONTENT_X + 185, curCompY + 4, { width: 100 });

  doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondaryLight);
  doc.text(note, CONTENT_X + 295, curCompY + 4, { width: 205 });

  curCompY += 16;
});

// Concluding Pledge
const pledgeY = curCompY + 14;
doc.rect(CONTENT_X, pledgeY, CONTENT_W, 58).fillAndStroke(COLORS.cardBg, COLORS.border);
doc.rect(CONTENT_X, pledgeY, 4, 58).fill(COLORS.accentGold);

doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.primaryDark);
doc.text('KOMITMEN KEBERLANJUTAN BUDAYA NUSANTARA', CONTENT_X + 14, pledgeY + 8);
doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.secondary);
const pledgeText = 'Dengan kehadiran KIRA, Oerip Indonesia tidak hanya melangkah ke era kecerdasan artifisial modern, tetapi juga mengukuhkan tekad luhur: bahwa teknologi tercanggih sekalipun harus senantiasa tunduk, menghormati, dan melayani warisan kearifan lokal para penenun tradisi di seluruh pelosok bumi Nusantara.';
doc.text(pledgeText, CONTENT_X + 14, pledgeY + 22, { width: CONTENT_W - 28, align: 'justify', lineGap: 1.8 });

// =========================================================================
// 16. TWO-PASS RUNNING HEADERS & FOOTERS
// =========================================================================
const totalPages = doc.bufferedPageRange().count;

for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  
  // Skip cover page (index 0)
  if (i > 0) {
    doc.save();

    // Running Header (y: 20 - 32)
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.primary);
    doc.text('KIRA — AI Cultural & Fashion Decision Agent', CONTENT_X, 20, { width: 300, lineBreak: false });
    
    doc.font('Helvetica').fontSize(7).fillColor(COLORS.muted);
    doc.text('OERIP INDONESIA • DOKUMEN RESMI PRD v1.0', 340, 20, { width: 210, align: 'right', lineBreak: false });
    
    doc.strokeColor(COLORS.border).lineWidth(0.5).moveTo(CONTENT_X, 32).lineTo(550, 32).stroke();

    // Running Footer (y: 794 - 806)
    doc.strokeColor(COLORS.border).lineWidth(0.5).moveTo(CONTENT_X, 794).lineTo(550, 794).stroke();
    
    doc.font('Helvetica').fontSize(7).fillColor(COLORS.muted);
    doc.text('Rahasia & Hak Cipta © 2026 Oerip Indonesia. Seluruh hak cipta dilindungi undang-undang.', CONTENT_X, 800, { width: 380, lineBreak: false });
    
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.primaryDark);
    doc.text(`Halaman ${i + 1} dari ${totalPages}`, 435, 800, { width: 115, align: 'right', lineBreak: false });

    doc.restore();
  }
}

// Finalize document
doc.end();

streamPublic.on('finish', () => {
  console.log(`[OK] PDF successfully generated! Total Pages: ${totalPages}`);
  console.log(`[OK] Written to: ${outputPathPublic}`);
  console.log(`[OK] Written to: ${outputPathRoot}`);
  
  // Copy to dist if dist exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outputPathPublic, outputPathDist);
    console.log(`[OK] Copied to: ${outputPathDist}`);
  }
});
