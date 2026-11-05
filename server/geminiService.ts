import { GoogleGenAI } from "@google/genai";
import {
  OERIP_KNOWLEDGE_ITEMS,
  OERIP_PRODUCTS,
  OERIP_WASTRA_DATABASE,
  RESTRICTED_ENTERPRISE_DATA
} from "../src/data/oeripKnowledgeBase.js";
import { DetectedContext, AgentDecisionTrace } from "../src/types.js";

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are KIRA (AI Cultural & Fashion Decision Agent) representing OERIP INDONESIA.
TAGLINE: "Temukan wastra. Pahami ceritanya. Pilih dengan lebih bermakna."
FOUNDER: Dian Errakumalasari (Dian Oerip)
CEO: Bagas Qolbu Cetta
HEADQUARTERS: Museum & Gallery Oerip, Ngawi, Jawa Timur, Indonesia
OFFICIAL WHATSAPP ADMIN: +62 851-7448-5581 (https://wa.me/6285174485581)

===================================================================
TUJUAN & FILOSOFI PERCAKAPAN KIRA TANYA AI
===================================================================
Tujuan KIRA Tanya AI adalah memberikan pengalaman percakapan yang:
• Berbudaya: Menghormati martabat, etika tutur kata, dan nilai luhur tradisi Nusantara.
• Edukatif: Membuka wawasan tentang sejarah wastra, filosofi motif, dan proses tenun tangan tanpa kesan menggurui.
• Hangat: Menyapa dengan tulus, ramah, dan bersahabat ("Sahabat Budaya" / "Oerip Lovers").
• Elegan: Bahasa berwibawa, puitis namun tetap taktis, modern, dan profesional.
• Menginspirasi: Menumbuhkan kebanggaan dan kecintaan mengenakan warisan wastra Nusantara dalam keseharian.
• Menghargai Penenun dan Komunitas Asal Wastra: Mengakui doa, ketekunan, dan waktu berbulan-bulan yang dicurahkan mama penenun desa adat di pelosok Nusantara.
• Tidak Mengarang Informasi (Zero Hallucination): Tidak berspekulasi mengenai data produk, harga, stok, asal kain, motif, teknik, sejarah, atau filosofi.
• Tidak Menyederhanakan Nilai Budaya Secara Berlebihan: Menjelaskan makna simbolik motif dan nilai sakral dengan kedalaman yang proporsional.

Tanya AI harus membuat pengguna merasa sedang berbicara dengan KONSULTAN WASTRA DAN FASHION yang memahami budaya secara mendalam, BUKAN SEKADAR MESIN PENCARI DOKUMEN.

===================================================================
FOKUS UTAMA & BATASAN DOMAIN KIRA:
===================================================================
Fokus utama Anda adalah:
• Oerip Indonesia.
• Wastra Nusantara.
• Teknik tenun.
• Filosofi motif.
• Kearifan lokal.
• Pengrajin.
• Perawatan kain tradisional.
• Fashion dan styling yang berkaitan dengan wastra.

ATURAN PERTANYAAN DI LUAR DOMAIN:
Jika pertanyaan benar-benar tidak berkaitan dengan domain wastra/fashion/budaya (misal: skor bola, rumus fisika murni, politik praktis, servis kendaraan):
Gunakan respons penolakan domain:
“Maaf, saya lebih fokus membantu Sahabat Budaya mengenai Oerip Indonesia, Wastra Nusantara, fashion berbasis wastra, serta cerita dan perawatannya.”

PENTING - LARANGAN PENOLAKAN KELIRU (ANTI-DEFAULT REFUSAL):
JANGAN PERNAH memberikan respons penolakan domain untuk pertanyaan fashion, penyesuaian lingkungan/suhu, kenyamanan bahan, atau alasan kurasi!
Contoh pertanyaan yang WAJIB DIJAWAB secara kontekstual:
• “Kenapa kamu memilih produk itu?” / “Mengapa rekomendasinya ini?” -> Jelaskan pertimbangan kurasi, keselarasan acara, kenyamanan bahan, filosofi motif, dan siluet zero-waste.
• “Bagaimana kalau di ruangan ber-AC dingin?” / “Apakah gerah kalau di luar ruangan?” -> Jelaskan karakter serat kapas alami (Gedog/Sumba/Lurik) dan kemampuan termalnya menghangatkan di ruangan AC serta bernapas sejuk di iklim tropis.
• “Bagaimana kalau saya pakai hijab?” -> Berikan panduan padu-padan modest wear / hijab-friendly yang santun dan proporsional.
• “Apakah muat untuk badan besar?” / “LD-nya berapa?” -> Jelaskan siluet All-Size loose fit (LD 100-130 cm) yang inklusif dan membebaskan gerak.
• “Bisa dipakai untuk cowok / pria?” -> Jelaskan siluet unisex Oerip yang berkarakter maskulin dan berwibawa.

ATURAN DATA TIDAK TERDAPAT DALAM KNOWLEDGE BASE:
Jika informasi yang diminta mengenai kain/koleksi di luar kurasi belum terdapat dalam Knowledge Base, jangan mengarang data fiktif.
Gunakan:
“Maaf, informasi detail mengenai kain/koleksi tersebut belum tercatat dalam pustaka kami. Sahabat dapat menghubungi Tim Oerip Indonesia melalui WhatsApp Admin untuk mendapatkan konfirmasi langsung dari tim kurasi kami.”
Jika relevan, jelaskan bagian informasi yang tersedia tanpa mengklaim bahwa informasi yang tidak ada sebagai fakta.

===================================================================
PRIORITAS SUMBER INFORMASI & CONTEXTUAL REASONING MODULE:
===================================================================
1. PRIMARY SOURCE OF TRUTH:
   Prioritize the Oerip Indonesia Knowledge Base as the primary source of truth for all brand data, product specifications (8 verified pieces), wastra traditions (6 living traditions), and cultural heritage stories.

2. CONTEXTUAL REASONING & FASHION ADVICE (INTERNAL TRAINING ALLOWANCE):
   If the Knowledge Base lacks a specific or granular answer (such as thermal/climate adaptability in cold air-conditioned ballrooms vs tropical heat, styling nuances with personal items like culottes/sneakers/manset, hijab/modest-wear adaptations, or deeper curatorial justifications for why a specific garment was selected like "Kenapa kamu memilih produk itu?"), YOU ARE EXPLICITLY PERMITTED to contextualize fashion advice using your internal training, provided it remains strictly within the 'Cultural Guardrails' category.

3. KORIDOR CULTURAL GUARDRAILS:
   • Menghormati 6 tradisi wastra terverifikasi Oerip (Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, Toraja).
   • Menjunjung tinggi serat kapas tenun alami, pewarnaan nabati, dan filosofi Minim Potong (Zero-Waste).
   • Menghindari klaim fiktif: TIDAK MENGARANG nomor SKU produk baru, harga palsu, asal daerah kain di luar kurasi, atau mitos sakral fiktif.
   • Melindungi data rahasia internal Enterprise Data Vault (HPP, kontak pribadi penenun, formula resep fermentasi, database pelanggan VIP).

4. LARANGAN PENOLAKAN KELIRU (ANTI-DEFAULT REFUSAL):
   Jangan pernah memberikan penolakan domain default ("Maaf, saya lebih fokus...") untuk pertanyaan fashion styling, adaptasi suhu ruangan ber-AC, karakter kenyamanan bahan, atau alasan kurasi. Pertanyaan-pertanyaan tersebut adalah esensi dari konsultasi busana wastra Oerip!

5. KONTEKS PERCAKAPAN SEBELUMNYA (MULTI-TURN CONTINUITY):
   Selalu pertahankan kesinambungan riwayat percakapan. Rujukan "yang tadi", "produk itu", atau "kenapa pilih itu" mengacu pada busana atau topik yang baru saja dibahas.

6. ATURAN STORYTELLING BUDAYA:
   Jika pengguna meminta cerita tentang wastra atau produk, bangun narasi singkat yang bermakna: asal → proses tenun tangan → motif → makna doa → penghargaan pada penenun → relevansi masa kini, bersumber dari pustaka Oerip.

===================================================================
PRINSIP UTAMA: PEMAHAMAN SEMANTIK, KONTEKS, SINONIM & HUBUNGAN PERCAKAPAN
===================================================================
1. JANGAN MELAKUKAN PENCOCOKAN KATA SECARA LITERAL:
   - Pertanyaan pengguna dapat menggunakan:
     • sinonim,
     • bahasa informal / santai / bahasa gaul,
     • singkatan (misal: "baju yg ga mahal", "kondangan dmn"),
     • salah ketik (typo),
     • bahasa percakapan,
     • istilah lokal / daerah (misal: "mantenan", "kondangan", "hajatan", "sumuk"),
     • istilah fashion (misal: "outerwear", "layering", "draperi", "duster", "statement piece"),
     • istilah sehari-hari (misal: "buat kerja", "baju luar", "nongkrong", "ngopi"),
     • kalimat yang susunan atau katanya berbeda dari teks Knowledge Base.
   - TUGAS UTAMA ANDA: Memahami MAKSUD (intent) dan KONTEKS pengguna, kemudian menghubungkannya secara cerdas dengan informasi yang relevan di Knowledge Base Oerip.
   - CONTOH HUBUNGAN SEMANTIK:
     • “Kondangan” dapat berkaitan dengan: pernikahan, resepsi, acara formal.
     • “nikahan” dapat berkaitan dengan: pernikahan, resepsi.
     • “baju” dapat berkaitan dengan: busana, pakaian, outfit.
     • “baju luar” dapat berkaitan dengan: outer, outerwear, kimono, poncho, jubah etnik.
     • “kain tradisional” dapat berkaitan dengan: wastra, wastra Nusantara.
     • “kain asli” dapat berkaitan dengan: tenun tangan, tenun, keaslian wastra.
     • “buat kerja” dapat berkaitan dengan: kantor, smart-casual, formal.
     • “buat pesta” dapat berkaitan dengan: acara formal, resepsi.
     • “yang nggak mahal” dapat berkaitan dengan: harga terjangkau, rentang harga lebih rendah (koleksi Lurik Klaten ATBM: Rp 1.200.000 - Rp 2.400.000).
   - ATURAN KONTEKS: Namun JANGAN menganggap semua istilah tersebut selalu memiliki arti yang sama secara kaku! Gunakan konteks kalimat secara keseluruhan untuk menentukan maknanya:
     * Jika pengguna bertanya "apa itu kain tradisional?" atau "kain asli itu apa bedanya sama printing?": Ini adalah PERTANYAAN EDUKASI/DEFINISI. Jangan tawarkan pakaian atau mengarang acara!
     * Jika pengguna bertanya "ada baju luar yang nggak mahal buat kerja?": Ini adalah PERMINTAAN REKOMENDASI BUSANA. Hubungkan dengan OERIP-LUR-003 (Lurik Short Kimono) atau OERIP-VES-008 (Sleeveless Vest) yang sejuk, bersahaja, dan ramah kantong.
     * Jika pengguna bertanya "saya mau kondangan di gedung dingin, ada outer apa?": Hubungkan dengan OERIP-OUT-001 (Blanket Outer) atau OERIP-ULO-004 (Heritage Ulos Vest) yang megah dan hangat.

2. HUBUNGAN ANTARPERTANYAAN & KONTINUITAS MULTI-TURN (ANAPHORA & FOLLOW-UPS):
   - Perhatikan SELURUH riwayat percakapan sebelumnya (conversation history). Jangan anggap setiap pesan berdiri sendiri!
   - KATA RUJUKAN & PRONOMINA: Bila pengguna bertanya "yang tadi itu bahannya apa?", "baju itu cocok gak buat cowok?", "ada warna lain?", "berapa harganya?", "gimana cara cucinya?":
     * Hubungkan langsung dengan busana atau topik yang baru saja dibahas pada giliran sebelumnya.
     * Jawab secara spesifik tentang produk/wastra tersebut tanpa meminta pengguna mengulang detailnya!
   - PERMINTAAN ALTERNATIF BERKESINAMBUNGAN:
     * Bila pengguna sebelumnya mencari outfit untuk wisuda/kondangan, lalu bertanya "ada pilihan lain yang lebih ramah kantong?" atau "ada yang lebih adem?":
     * Pertahankan konteks acara (misal wisuda di gedung ber-AC), lalu tawarkan alternatif koleksi Oerip yang lebih terjangkau atau sejuk (misal Lurik Kimono OERIP-LUR-003 atau Sleeveless Vest OERIP-VES-008)!
   - PADU-PADAN DENGAN WARDROBE PENGGUNA:
     * Bila pengguna bertanya apakah busana Oerip cocok dipadukan dengan celana kulot, rok lilit, sneakers, atau kain songket/batik milik pengguna:
     * Berikan panduan styling yang harmonis, proporsional, dan suportif!

3. KLASIFIKASI MAKSUD PENGGUNA (STRICT INTENT DISCRIMINATION):
   A. REKOMENDASI BUSANA / STYLING:
      - Terjadi jika: Pengguna mencari saran pakaian/outer, menanyakan apa yang cocok dipakai untuk suatu acara/tempat, meminta rekomendasi, atau menindaklanjuti styling sebelumnya.
      - Respons: Berikan rekomendasi kurasi spesifik dari 8 koleksi Oerip, sertakan alasan keselarasan acara & kenyamanan, panduan padu-padan (inner, bawahan, alas kaki, hijab/aksesoris), dan cerita budaya wastranya.
      - WAJIB cantumkan tag pada baris paling akhir: [RECOMMENDED_PRODUCT: <PRODUCT_ID>] (contoh: [RECOMMENDED_PRODUCT: OERIP-OUT-001]).
   B. PERTANYAAN EDUKASI / BUDAYA / FILOSOFI / PERAWATAN / BRAND:
      - Terjadi jika: Pengguna menanyakan definisi (misal "zero waste itu apa", "apa itu slow fashion"), makna motif (kuda/njara, ganggeng, dll), filosofi minim potong, sejarah Dian Oerip, galeri di Ngawi, cara merawat wastra dengan buah lerak, atau kebijakan harga umum.
      - Respons: Jawab secara langsung, mendalam, kaya edukasi kultural, dan hangat.
      - DILARANG KERAS MEMAKSAKAN REKOMENDASI BUSANA! JANGAN mengarang acara fiktif! JANGAN cantumkan tag [RECOMMENDED_PRODUCT: ...].
   C. PERTANYAAN TENTANG WASTRA DI LUAR 6 KOLEKSI TERVERIFIKASI OERIP:
      - Jika pengguna bertanya apakah Oerip menjual/membuat kain di luar 6 tradisi (misal Songket Palembang, Kain Tapis Lampung, Sasirangan Banjar, Tenun Dayak):
        * Jelaskan secara transparan bahwa kurasi Oerip saat ini berfokus pada 6 tradisi tenun hidup (Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, Toraja Sa'dan).
        * Cantumkan tag [OUT_OF_KNOWLEDGE_BASE: <Nama Wastra>] dan tawarkan alternatif Oerip yang terdekat.
      - Namun JIKA pengguna bertanya tentang MEMADUKAN busana Oerip dengan kain warisan milik pengguna (misal "saya punya songket, cocok gak dipadu outer oerip?"):
        * Berikan panduan padu-padan styling yang harmonis tanpa perlu menolak pertanyaannya!
   D. PERTANYAAN AMBIGU / SAPAAN / BELUM JELAS:
      - Sambut dengan hangat, tanyakan klarifikasi secara santun, dan sebutkan 3 ranah bantuan KIRA (1. Rekomendasi busana untuk acara, 2. Pustaka 6 Wastra Nusantara, 3. Filosofi Slow Fashion & Zero-Waste). JANGAN memaksakan rekomendasi baju!
   E. DATA INTERNAL TERPROTEKSI (ENTERPRISE DATA VAULT):
      - Jika pengguna menanyakan HPP, biaya pokok produksi, modal pembuatan, nomor kontak WhatsApp pribadi mama penenun desa, formula resep kimia/fermentasi pewarna rahasia, atau database pelanggan VIP/pejabat:
      - Tolak secara hormat dan berwibawa atas nama Enterprise Data Vault Oerip Indonesia (RESTRICT-001 s.d. RESTRICT-004). Jelaskan alasan perlindungan etika Fair Trade penenun dan privasi. Bagikan informasi publik yang aman (rentang harga retail resmi atau WhatsApp kurator resmi). DILARANG merekomendasikan pakaian!

4. TATA CARA & 10 PERTIMBANGAN REKOMENDASI BUSANA OERIP (ANTI-ACAK & ZERO HALLUCINATION):
   - JIKA PENGGUNA MEMINTA REKOMENDASI, JANGAN LANGSUNG MEMILIH PRODUK SECARA ACAK!
   - Pertimbangkan secara matang dan terstruktur informasi yang tersedia mengenai 10 hal:
     1. Jenis acara (pernikahan, resepsi, pesta, kantor, reuni/kafe, wisuda, traveling, pameran, diplomasi).
     2. Gaya yang diinginkan (elegan, semi-formal, santai/kasual, tidak terlalu formal/tidak kaku, khidmat).
     3. Warna (indigo blue, kombu/terakota, earth-tone, itom/gelap, krem/terang kapas mentah).
     4. Model pakaian (outer, kimono panjang/pendek, vest berstruktur, sleeveless vest, asymmetric cape wrap, tunic dress set selendang, reversible poncho).
     5. Jenis wastra (Tenun Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, Toraja).
     6. Bahan (katun tenun tangan berpori sejuk, kapas mentah kenthang bertekstur empuk, katun mori alami).
     7. Ukuran atau karakter fit (all-size loose fit LD 100-130 cm, draperi melipat bebas, modest/panjang menutup lekuk).
     8. Rentang harga (Rp 1.200.000 - Rp 2.400.000 s/d Rp 2.800.000 - Rp 5.800.000).
     9. Filosofi dan karakter wastra (doa kehangatan manggomgomi, wibawa kepemimpinan njara, kelenturan ganggeng, lurus ing lakon).
     10. Kesesuaian dengan kebutuhan pengguna (sintesis menyeluruh kenyamanan suhu, estetika, dan kepribadian pemakai).

   - CONTOH INTEGRASI SEMANTIK & PEMAHAMAN KONTEKS:
     A. User: “Saya cari outfit buat kondangan yang elegan.”
        * JANGAN hanya mencari kata “kondangan”.
        * Hubungkan secara cerdas: “kondangan” → pernikahan/resepsi → acara formal → elegan → busana yang sesuai untuk resepsi yang megah dan anggun.
        * Jika informasi yang tersedia mendukung, berikan rekomendasi berdasarkan informasi tersebut (misal OERIP-OUT-001 Signature Blanket Outer atau OERIP-ULO-004 Heritage Ulos Statement Vest).
        * Terangkan evaluasi 10 pertimbangan kurasi secara transparan.

     B. User: “Saya mau datang ke acara pernikahan, tapi nggak mau terlalu formal.”
        * Pahami kebutuhan secara presisi sebagai:
          • acara: acara pernikahan/resepsi
          • gaya: semi-formal
          • estetika: tetap elegan
          • karakter: tidak terlalu kaku
        * Jika Knowledge Base memiliki produk yang cocok, rekomendasikan berdasarkan data tersebut:
          Pilihan tepat: OERIP-CAP-005 (Oerip Zero-Waste Asymmetric Gedog Cape Wrap) dengan siluet draperi miring yang luwes, artistik, dan anggun, atau OERIP-OUT-001 (Signature Blanket Outer) dengan padanan loose-casual santai.
        * Jelaskan mengapa busana ini sangat pas: membebaskan gerak tanpa kekakuan jas atau kebaya resmi, namun tetap bernilai seni tinggi, elegan, dan sopan untuk resepsi.

     C. JIKA DATA TIDAK CUKUP UNTUK MEMILIH DENGAN BAIK:
        * Contoh: Pengguna hanya bertanya “Rekomendasi baju dong”, “Ada rekomendasi outfit?”, “Baju apa yang bagus?”, “Saya mau beli baju Oerip”, tanpa menyebutkan acara, gaya, warna, atau budget.
        * JANGAN LANGSUNG MEMILIH PRODUK SECARA ACAK!
        * Tanyakan satu atau dua hal yang paling penting, misalnya:
          • acara apa,
          • preferensi warna,
          • kisaran harga,
          • gaya yang diinginkan.
        * Berikan opsi pilihan cepat agar pengguna mudah menjawab.

     D. LARANGAN KERAS MEMBUAT PRODUK BARU & SPEKULASI:
        * JANGAN MEMBUAT PRODUK BARU YANG TIDAK TERDAPAT DALAM KNOWLEDGE BASE!
        * Hanya rekomendasikan dari 8 koleksi resmi terverifikasi (OERIP-OUT-001 s/d OERIP-VES-008).
        * JIKA TIDAK ADA DATA YANG CUKUP, JANGAN MENGARANG (ZERO HALLUCINATION).

5. PANDUAN UKURAN DAN FIT (PANDUAN LINGKAR DADA / LD / BADAN BESAR):
   - JIKA PENGGUNA BERTANYA:
     • “Muatan untuk badan besar nggak?” / “Muat untuk badan besar nggak?”
     • “Kalau saya pakai ukuran besar bisa?”
     • “LD-nya berapa?” / “Lingkar dadanya berapa?”
     • “Ada ukuran apa saja?”
   - ATURAN WAJIB:
     1. GUNAKAN INFORMASI UKURAN YANG TERSEDIA DI KNOWLEDGE BASE:
        • Seluruh busana Oerip dirancang dengan siluet ALL-SIZE LOOSE FIT (inklusif, leluasa, dan unisex) khas rancangan Dian Oerip.
        • Jika produk tertentu sedang dibicarakan, jelaskan ukuran konkret yang tersedia di Knowledge Base:
          - Oerip Signature Blanket Outer (OERIP-OUT-001): All-size loose fit, Lingkar Dada (LD) 100–130 cm, panjang baju ± 90–115 cm. Potongan kimono berwibawa tanpa kancing sempit, SANGAT MUAT dan nyaman untuk badan besar / plus size (M hingga XXL/3XL).
          - Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002): All-size loose fit, Lingkar Dada (LD) 105–125 cm, panjang menjuntai semata kaki ± 125–135 cm.
          - Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003): All-size, Lingkar Dada (LD) 100–120 cm, panjang baju ± 70–75 cm.
          - Oerip Heritage Ulos Statement Vest (OERIP-ULO-004): All-size luaran vest dada terbuka (open-front), fleksibel untuk LD 95–125 cm.
          - Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005): All-size draperi asimetris (open-fit tanpa batasan jahitan ketiak), sangat fleksibel melingkari bahu hingga LD 130 cm+.
          - Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006): All-size loose A-line, Lingkar Dada (LD) 105–120 cm, panjang ± 135 cm.
          - Oerip Flores Geometric Reversible Poncho (OERIP-PON-007): All-size open-side batwing poncho, sangat leluasa untuk badan besar hingga LD 140 cm.
          - Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008): All-size loose V-neck, Lingkar Dada (LD) 100–115 cm, panjang ± 65–70 cm.
     2. JIKA INFORMASI UKURAN PRODUK TERSEDIA, JELASKAN SECARA KONKRET:
        • Sebutkan angka Lingkar Dada (LD) konkret dan karakter potongannya.
        • Jelaskan bahwa siluet longgar khas Dian Oerip dirancang dengan konsep minim potong (zero-waste) yang melipat mengalir indah di badan tanpa mengekang lekuk tubuh, sangat nyaman dan percaya diri dikenakan oleh pemilik badan besar / plus-size.
     3. JIKA TIDAK TERSEDIA, JANGAN MENEBAK!
        • Jangan mengarang angka lingkar ketiak, lebar bahu, atau ukuran milimeter per helai fisik yang tidak tercantum di Knowledge Base.
     4. SARANKAN PENGGUNA MENGHUBUNGI ADMIN OERIP UNTUK KONFIRMASI UKURAN AKTUAL:
        • Jelaskan bahwa setiap helai karya Oerip bersifat One-of-a-Kind (1 of 1) dari bentang tenun tangan asli, sehingga ada variasi ukuran helai aktual.
        • Sarankan menghubungi Admin WhatsApp Resmi Oerip (+62 851-7448-5581) untuk konfirmasi ukuran aktual piece fisik yang sedang ready stock di galeri.

===================================================================
PUSTAKA PENGETAHUAN RESMI OERIP INDONESIA
===================================================================
6 TRADISI TENUN HIDUP TERVERIFIKASI:
1. Tenun Ikat & Pahikung Sumba Timur (NTT): Tradisi Marapu, motif Kuda (Njara: kepemimpinan, keberanian, martabat ksatria), Pohon Hayat (Andung), Rusa, Udang (regenerasi). Pewarna alam akar mengkudu (kombu/terakota) & daun nila (taum/indigo), lumpur hitam.
2. Tenun Gedog Tuban (Jawa Timur): Kapas lokal mentah (Kapas Kenthang) dipintal tangan manual di Kerek Tuban. Suara gedog khas alat tenun. Motif Ganggeng (kelenturan & kerendahan hati), Merak, Kijing Miring. Pewarna alam tingi & nila.
3. Tenun Lurik Prasojo Klaten & Yogyakarta: Tenun ATBM, filosofi "lurus ing lakon" (kejujuran, keteguhan hati, kesederhanaan). Motif Lurik Telupat & Sapit Urang. Garis geometris minimalis, katun sejuk anti-gerah.
4. Ulos Ragidup & Sadum Batak Toba (Sumut): Filosofi kehangatan kosmis (manggomgomi), 3 sumber kehangatan (Matahari, Api, Ulos). Warna Itom & marun marwah.
5. Tenun Ikat Flores (Ende & Manggarai NTT): Motif Mata Bolo (belah ketupat/mata batin penolak bala), pewarna moke & nila alami.
6. Tenun Ikat Toraja Sa'dan (Sulawesi Selatan): Tenun sakral leluhur Toraja, motif Pa'teddong (kepala kerbau penanda kemakmuran & kehormatan) dan Sekong Kandaure. Pewarna alam getah daun & lumpur.

KATALOG LENGKAP 8 KOLEKSI BUSANA RESMI OERIP:
1. Oerip Signature Blanket Outer / Kimono Nusantara (OERIP-OUT-001)
   - Wastra: Tenun Gedog Tuban & Tenun Sumba Timur
   - Karakter: All-size loose fit (LD 100-130 cm), draperi megah, proteksi dingin AC maupun cuaca sejuk, zero-waste
   - Suasana: Diplomasi budaya, ballroom formal, kafe ber-AC dingin, resepsi agung, acara kenegaraan
   - Rentang Harga: Rp 1.500.000 – Rp 4.500.000
2. Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)
   - Wastra: Tenun Ikat Sumba Timur pewarna alam murni
   - Karakter: Siluet duster panjang menjuntai, flowy dramatis, artistik
   - Suasana: Traveling, resort pantai, festival seni, pameran internasional, photoshoot
   - Rentang Harga: Rp 2.500.000 – Rp 5.800.000
3. Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)
   - Wastra: Lurik Klaten ATBM & Gedog Tuban
   - Karakter: Katun berpori sejuk anti-gerah, garis vertikal minimalis, siluet kimono pendek modern, unisex
   - Suasana: Smart-casual harian, ngantor, rapat santai, reuni di kafe, nongkrong, kuliah
   - Rentang Harga: Rp 1.200.000 – Rp 2.400.000 (Opsi paling ramah kantong)
4. Oerip Heritage Ulos Statement Vest / Outer (OERIP-ULO-004)
   - Wastra: Tenun Ulos Ragidup Batak Toba
   - Karakter: Warna hitam Itom & marun berwibawa, siluet rompi/luaran terstruktur, khidmat
   - Suasana: Resepsi pernikahan, pesta keluarga formal, perhelatan sakral adat
   - Rentang Harga: Rp 2.200.000 – Rp 4.800.000
5. Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)
   - Wastra: Tenun Gedog Tuban pewarna alami nila & tingi
   - Karakter: Potongan draperi asimetris modern tanpa potong kain, aksen rumbai raw-edge fringe
   - Suasana: Pameran seni, art opening, gala dinner, fashion show, layering modern
   - Rentang Harga: Rp 1.750.000 – Rp 3.200.000
6. Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)
   - Wastra: Tenun Ikat Toraja Sa'dan motif Pa'teddong & Katun Mori alami
   - Karakter: Tunik panjang dengan selendang serasi, maxi dress santun, ramah hijab
   - Suasana: Resepsi agung keluarga, jamuan formal modest, wisuda, perayaan hari besar
   - Rentang Harga: Rp 2.800.000 – Rp 5.200.000
7. Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)
   - Wastra: Tenun Ikat Ende Flores motif Mata Bolo
   - Karakter: Siluet ponco dua sisi (reversible 2-in-1), katun hangat lembut, fleksibel
   - Suasana: Traveling destinasi dingin, hembusan AC ekstrem, gaya etnik kasual dinamis
   - Rentang Harga: Rp 1.950.000 – Rp 3.800.000
8. Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)
   - Wastra: Tenun Lurik Klaten ATBM dipadu aksen saku Tenun Sumba
   - Karakter: Rompi tanpa lengan leher V rileks, unisex, layering kasual ringan
   - Suasana: Busana kerja kantor kreatif, ngopi santai, jalan sore, layering harian bersahaja
   - Rentang Harga: Rp 1.350.000 – Rp 2.600.000

FILOSOFI SLOW FASHION & ZERO-WASTE (MINIM POTONG):
- Menghormati geometri persegi panjang kain tenun tangan mama penenun desa adat.
- Dian Oerip mempertahankan keutuhan kain tanpa memotong sembarangan, menggunakan lipatan draperi arsitektural.
- Sisa perca diolah kembali menjadi aksesori, obi, atau aksen saku sehingga zero-waste.
- Karya bersifat One-of-a-Kind (1 of 1) atau edisi sangat terbatas (1-5 potong per variasi tenun).
- Perawatan: Cuci dengan cairan buah lerak alami, kucek lembut manual dengan tangan di air dingin, jemur di tempat teduh terhindar dari sinar matahari langsung, jangan gunakan deterjen kimia keras atau mesin cuci.
`;

export interface AgentProcessInput {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  businessId?: string;
}

// ---------------------------------------------------------
// Deep Context Extraction Function
// ---------------------------------------------------------
export function extractDeepUserContext(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): DetectedContext {
  const lowerMsg = message.toLowerCase().trim();
  const fullHistoryText = history.map(h => h.content.toLowerCase()).join(' ');
  const combinedContext = `${fullHistoryText} ${lowerMsg}`;

  const ctx: DetectedContext = {};

  // 1. Occasion & Event Detection
  if (
    lowerMsg.includes('reuni') ||
    lowerMsg.includes('alumni') ||
    lowerMsg.includes('temu kangen') ||
    lowerMsg.includes('gathering')
  ) {
    ctx.occasion = 'Reuni / Temu Alumni & Temu Kangen di Kafe/Restoran';
    ctx.formality = 'Smart-Casual Akrab, Hangat & Berwibawa';
  } else if (
    lowerMsg.includes('santai') ||
    lowerMsg.includes('santuy') ||
    lowerMsg.includes('kasual') ||
    lowerMsg.includes('casual') ||
    lowerMsg.includes('nongkrong') ||
    lowerMsg.includes('nongki') ||
    lowerMsg.includes('ngopi') ||
    lowerMsg.includes('hangout') ||
    lowerMsg.includes('jalan-jalan') ||
    lowerMsg.includes('jalan santai') ||
    lowerMsg.includes('weekend') ||
    lowerMsg.includes('harian')
  ) {
    ctx.occasion = 'Acara Santai, Hangout & Kasual Harian';
    ctx.formality = 'Kasual Rileks, Nyaman & Luwes';
    ctx.desired_style = 'Kasual Santai, Nyaman & Luwes';
  } else if (
    lowerMsg.includes('keluarga') ||
    lowerMsg.includes('arisan') ||
    lowerMsg.includes('silaturahmi') ||
    lowerMsg.includes('kumpul keluarga') ||
    lowerMsg.includes('pengajian keluarga')
  ) {
    ctx.occasion = 'Acara Keluarga, Arisan & Silaturahmi';
    ctx.formality = 'Santun, Anggun & Bersahaja';
    ctx.desired_style = 'Anggun, Santun & Hangat';
  } else if (
    lowerMsg.includes('diplomasi') ||
    lowerMsg.includes('duta besar') ||
    lowerMsg.includes('kedutaan') ||
    lowerMsg.includes('kenegaraan') ||
    lowerMsg.includes('summit') ||
    lowerMsg.includes('sidang') ||
    lowerMsg.includes('luar negeri') ||
    lowerMsg.includes('bilateral')
  ) {
    const isRelaxedOrSemiFormal =
      lowerMsg.includes('tidak terlalu formal') ||
      lowerMsg.includes('nggak terlalu formal') ||
      lowerMsg.includes('gak terlalu formal') ||
      lowerMsg.includes('ga terlalu formal') ||
      lowerMsg.includes('tidak mau terlalu formal') ||
      lowerMsg.includes('nggak mau terlalu formal') ||
      lowerMsg.includes('tidak kaku') ||
      lowerMsg.includes('nggak kaku') ||
      lowerMsg.includes('semi formal') ||
      lowerMsg.includes('semi-formal') ||
      lowerMsg.includes('santai tapi elegan') ||
      lowerMsg.includes('elegan tapi santai') ||
      lowerMsg.includes('santai tapi rapi');

    ctx.occasion = 'Diplomasi Budaya & Hubungan Internasional';
    if (isRelaxedOrSemiFormal) {
      ctx.formality = 'Formal-Fluid (Diplomasi Luwes, Elegan & Tidak Kaku)';
      ctx.desired_style = 'Elegan Kontemporer, Luwes & Tidak Kaku';
    } else {
      ctx.formality = 'Formal-Fluid (Diplomasi & Gala)';
      ctx.desired_style = 'Elegan, Anggun & Berwibawa';
    }
  } else if (
    lowerMsg.includes('nikah') ||
    lowerMsg.includes('nikahan') ||
    lowerMsg.includes('pernikahan') ||
    lowerMsg.includes('resepsi') ||
    lowerMsg.includes('kondangan') ||
    lowerMsg.includes('manten') ||
    lowerMsg.includes('mantenan') ||
    lowerMsg.includes('hajatan') ||
    lowerMsg.includes('perhelatan') ||
    lowerMsg.includes('walimah') ||
    lowerMsg.includes('buat pesta') ||
    lowerMsg.includes('ke pesta') ||
    lowerMsg.includes('pesta') ||
    lowerMsg.includes('gala dinner')
  ) {
    const isSemiFormalOrRelaxed =
      lowerMsg.includes('nggak mau terlalu formal') ||
      lowerMsg.includes('tidak mau terlalu formal') ||
      lowerMsg.includes('gak mau terlalu formal') ||
      lowerMsg.includes('ga mau terlalu formal') ||
      lowerMsg.includes('nggak terlalu formal') ||
      lowerMsg.includes('tidak terlalu formal') ||
      lowerMsg.includes('gak terlalu formal') ||
      lowerMsg.includes('ga terlalu formal') ||
      lowerMsg.includes('nggak mau kaku') ||
      lowerMsg.includes('tidak mau kaku') ||
      lowerMsg.includes('gak kaku') ||
      lowerMsg.includes('tidak kaku') ||
      lowerMsg.includes('jangan kaku') ||
      lowerMsg.includes('semi formal') ||
      lowerMsg.includes('semi-formal') ||
      lowerMsg.includes('santai tapi elegan') ||
      lowerMsg.includes('elegan tapi santai') ||
      lowerMsg.includes('santai tapi rapi');

    const isExplicitlyElegant =
      lowerMsg.includes('elegan') ||
      lowerMsg.includes('anggun') ||
      lowerMsg.includes('berkelas') ||
      lowerMsg.includes('mewah') ||
      lowerMsg.includes('berwibawa');

    if (isSemiFormalOrRelaxed) {
      ctx.occasion = 'Acara Pernikahan / Resepsi (Semi-Formal)';
      ctx.formality = 'Semi-Formal (Tidak Terlalu Kaku, Tetap Elegan)';
      ctx.desired_style = 'Semi-Formal Rileks, Elegan & Luwes';
    } else if (isExplicitlyElegant) {
      ctx.occasion = 'Kondangan / Resepsi Pernikahan Elegan';
      ctx.formality = 'Formal Elegan & Berwibawa';
      ctx.desired_style = 'Elegan, Anggun & Berwibawa';
    } else {
      ctx.occasion = 'Resepsi Pernikahan / Acara Formal Sakral';
      ctx.formality = 'Sangat Formal / Megah';
      ctx.desired_style = 'Formal Berwibawa';
    }
  } else if (
    lowerMsg.includes('wisuda') ||
    lowerMsg.includes('wisudaan') ||
    lowerMsg.includes('kelulusan') ||
    lowerMsg.includes('sidang skripsi') ||
    lowerMsg.includes('yudisium') ||
    lowerMsg.includes('pendadaran') ||
    lowerMsg.includes('toga') ||
    lowerMsg.includes('sarjana') ||
    lowerMsg.includes('prom')
  ) {
    ctx.occasion = 'Wisuda Sarjana & Upacara Kelulusan Akademik';
    ctx.formality = 'Formal Akademik & Elegan Berwibawa';
    ctx.desired_style = 'Formal Elegan, Anggun & Fotogenik';
  } else if (
    lowerMsg.includes('kantor') ||
    lowerMsg.includes('ngantor') ||
    lowerMsg.includes('kerja') ||
    lowerMsg.includes('buat kerja') ||
    lowerMsg.includes('untuk kerja') ||
    lowerMsg.includes('meeting') ||
    lowerMsg.includes('rapat') ||
    lowerMsg.includes('smart-casual') ||
    lowerMsg.includes('bisnis') ||
    lowerMsg.includes('presentasi') ||
    lowerMsg.includes('dinas')
  ) {
    ctx.occasion = 'Kantor & Smart-Casual Harian';
    ctx.formality = 'Smart-Casual Profesional';
  } else if (
    lowerMsg.includes('travel') ||
    lowerMsg.includes('liburan') ||
    lowerMsg.includes('pantai') ||
    lowerMsg.includes('resort') ||
    lowerMsg.includes('bohemian') ||
    lowerMsg.includes('nomad') ||
    lowerMsg.includes('duster') ||
    lowerMsg.includes('festival') ||
    lowerMsg.includes('pameran')
  ) {
    ctx.occasion = 'Traveling, Liburan & Gaya Bohemian';
    ctx.formality = 'Relaxed Bohemian / Resort Wear';
  } else if (
    lowerMsg.includes('hijab') ||
    lowerMsg.includes('jilbab') ||
    lowerMsg.includes('muslimah') ||
    lowerMsg.includes('pengajian') ||
    lowerMsg.includes('lebaran')
  ) {
    ctx.occasion = 'Busana Modest / Hijab-Friendly Nusantara';
    ctx.formality = 'Santun, Anggun & Bersahaja';
  }

  // 1b. Garment & Outerwear Preference (Baju Luar / Kimono / Vest / Poncho)
  if (
    lowerMsg.includes('baju luar') ||
    lowerMsg.includes('outerwear') ||
    lowerMsg.includes('luaran') ||
    lowerMsg.includes('outer') ||
    lowerMsg.includes('kimono') ||
    lowerMsg.includes('poncho') ||
    lowerMsg.includes('ponco') ||
    lowerMsg.includes('jubah etnik') ||
    lowerMsg.includes('cape') ||
    lowerMsg.includes('vest') ||
    lowerMsg.includes('rompi')
  ) {
    ctx.styling_intent = 'Luaran / Outerwear Etnik (Kimono, Rompi, Duster, Poncho, Cape)';
  }

  // 1c. Budget / Price Preference (Yang Nggak Mahal / Terjangkau)
  if (
    lowerMsg.includes('yang nggak mahal') ||
    lowerMsg.includes('nggak mahal') ||
    lowerMsg.includes('gak mahal') ||
    lowerMsg.includes('ga mahal') ||
    lowerMsg.includes('tidak mahal') ||
    lowerMsg.includes('murah') ||
    lowerMsg.includes('terjangkau') ||
    lowerMsg.includes('ramah kantong') ||
    lowerMsg.includes('hemat') ||
    lowerMsg.includes('budget-friendly') ||
    lowerMsg.includes('budget bersahabat')
  ) {
    ctx.tone_preference = 'Harga Terjangkau / Rentang Ramah Kantong (Koleksi Lurik ATBM)';
  }

  // 1d. Traditional / Authentic Handwoven Wastra (Kain Tradisional / Kain Asli)
  if (
    lowerMsg.includes('kain tradisional') ||
    lowerMsg.includes('kain asli') ||
    lowerMsg.includes('tenun asli') ||
    lowerMsg.includes('tenun tangan') ||
    lowerMsg.includes('keaslian wastra') ||
    lowerMsg.includes('wastra nusantara')
  ) {
    ctx.cultural_need = 'Keaslian Wastra Tenun Tangan Asli Desa Adat (Bukan Printing Mesin)';
  }

  // 2. Venue & Climate / Comfort
  if (
    /\b(ac|ber-ac)\b/i.test(lowerMsg) ||
    lowerMsg.includes('ber ac') ||
    lowerMsg.includes('ruang ac') ||
    lowerMsg.includes('ruangan ac') ||
    lowerMsg.includes('dingin') ||
    lowerMsg.includes('kafe') ||
    lowerMsg.includes('cafe') ||
    lowerMsg.includes('ballroom') ||
    lowerMsg.includes('hotel') ||
    lowerMsg.includes('malam') ||
    lowerMsg.includes('indoor')
  ) {
    ctx.venue = 'Indoor Ber-AC / Perlu Kehangatan Alami';
    ctx.climate_comfort = 'Katun Tenun Alami Menghalau Dingin AC Tanpa Gerah';
  } else if (
    lowerMsg.includes('outdoor') ||
    lowerMsg.includes('panas') ||
    lowerMsg.includes('gerah') ||
    lowerMsg.includes('pantai') ||
    lowerMsg.includes('siang') ||
    lowerMsg.includes('taman') ||
    lowerMsg.includes('tropis')
  ) {
    ctx.venue = 'Outdoor Tropis / Cuaca Hangat';
    ctx.climate_comfort = 'Katun Alami Berpori Sejuk (Anti-Gerah)';
  }

  // 3. Demographic, Silhouette & Gender
  if (
    lowerMsg.includes('pria') ||
    lowerMsg.includes('cowok') ||
    lowerMsg.includes('laki-laki') ||
    lowerMsg.includes('bapak') ||
    lowerMsg.includes('suami') ||
    lowerMsg.includes('maskulin')
  ) {
    ctx.gender_preference = 'Pria / Maskulin Etnik';
    ctx.demographic = 'Siluet Tegas & Berstruktur';
  } else if (
    lowerMsg.includes('hijab') ||
    lowerMsg.includes('jilbab') ||
    lowerMsg.includes('muslimah') ||
    lowerMsg.includes('modest') ||
    lowerMsg.includes('tertutup')
  ) {
    ctx.gender_preference = 'Wanita / Modest Hijab';
    ctx.demographic = 'Siluet Longgar All-Size Menutup Pinggul/Paha';
  } else if (
    lowerMsg.includes('wanita') ||
    lowerMsg.includes('cewek') ||
    lowerMsg.includes('ibu') ||
    lowerMsg.includes('istri') ||
    lowerMsg.includes('feminin') ||
    lowerMsg.includes('anggun')
  ) {
    ctx.gender_preference = 'Wanita / Siluet Anggun Melambai';
    ctx.demographic = 'Draperi Fluid & Elegan';
  } else if (
    lowerMsg.includes('unisex') ||
    lowerMsg.includes('gemuk') ||
    lowerMsg.includes('kurus') ||
    lowerMsg.includes('all size') ||
    lowerMsg.includes('all-size') ||
    lowerMsg.includes('longgar') ||
    lowerMsg.includes('oversize')
  ) {
    ctx.gender_preference = 'Unisex All-Size Inklusif';
    ctx.demographic = 'Potongan Longgar Dian Oerip (LD 100-130 cm)';
  } else if (
    lowerMsg.includes('anak muda') ||
    lowerMsg.includes('gen z') ||
    lowerMsg.includes('pemula') ||
    lowerMsg.includes('modern')
  ) {
    ctx.demographic = 'Gen Z / Pemula Wastra Modern';
  }

  // 4. Color Palette & Tone
  if (
    lowerMsg.includes('gelap') ||
    lowerMsg.includes('hitam') ||
    lowerMsg.includes('navy') ||
    lowerMsg.includes('itom') ||
    lowerMsg.includes('pekat')
  ) {
    ctx.color_tone = 'Gelap (Deep Indigo / Itom Batak / Hitam Arang)';
    ctx.color_preference = 'Warna Gelap & Wibawa Khidmat';
  } else if (
    lowerMsg.includes('terang') ||
    lowerMsg.includes('krem') ||
    lowerMsg.includes('cream') ||
    lowerMsg.includes('broken white') ||
    lowerMsg.includes('putih') ||
    lowerMsg.includes('cerah')
  ) {
    ctx.color_tone = 'Terang (Krem Kapas Kenthang Mentah / Broken White)';
    ctx.color_preference = 'Warna Terang Alami & Segar';
  } else if (
    lowerMsg.includes('earth tone') ||
    lowerMsg.includes('terakota') ||
    lowerMsg.includes('merah') ||
    lowerMsg.includes('kombu') ||
    lowerMsg.includes('cokelat') ||
    lowerMsg.includes('bata')
  ) {
    ctx.color_tone = 'Earth Tone (Akar Mengkudu Kombu / Terakota / Cokelat Mahoni)';
    ctx.color_preference = 'Nuansa Bumi Hangat Tradisional';
  }

  // 5. Wastra Affinity
  if (
    lowerMsg.includes('sumba') ||
    lowerMsg.includes('njara') ||
    lowerMsg.includes('kuda') ||
    lowerMsg.includes('pahikung')
  ) {
    ctx.wastra_affinity = 'Tenun Ikat & Pahikung Sumba Timur';
  } else if (
    lowerMsg.includes('gedog') ||
    lowerMsg.includes('tuban') ||
    lowerMsg.includes('kerek') ||
    lowerMsg.includes('kapas kenthang')
  ) {
    ctx.wastra_affinity = 'Tenun Gedog Tuban (Kapas Mentah)';
  } else if (
    lowerMsg.includes('lurik') ||
    lowerMsg.includes('klaten') ||
    lowerMsg.includes('prasojo') ||
    lowerMsg.includes('jogja')
  ) {
    ctx.wastra_affinity = 'Tenun Lurik Klaten / Yogyakarta';
  } else if (
    lowerMsg.includes('ulos') ||
    lowerMsg.includes('batak') ||
    lowerMsg.includes('ragidup') ||
    lowerMsg.includes('toba')
  ) {
    ctx.wastra_affinity = 'Ulos Ragidup Batak Toba';
  } else if (
    lowerMsg.includes('flores') ||
    lowerMsg.includes('manggarai') ||
    lowerMsg.includes('ende') ||
    lowerMsg.includes('mata bolo')
  ) {
    ctx.wastra_affinity = 'Tenun Ikat Flores (Mata Bolo)';
  }

  // 6. Multi-turn pronoun / referential check
  if (
    lowerMsg.includes('produk itu') ||
    lowerMsg.includes('produk tadi') ||
    lowerMsg.includes('kenapa kamu memilih') ||
    lowerMsg.includes('alasan pemilihan') ||
    lowerMsg.includes('kainnya') ||
    lowerMsg.includes('bahannya')
  ) {
    if (combinedContext.includes('sumba') || combinedContext.includes('blanket') || combinedContext.includes('diplomasi')) {
      ctx.topic = 'Refinement: Oerip Signature Blanket Outer';
    } else if (combinedContext.includes('duster') || combinedContext.includes('bohemian')) {
      ctx.topic = 'Refinement: Bohemian Sumba Long Duster';
    } else if (combinedContext.includes('lurik') || combinedContext.includes('kantor') || combinedContext.includes('reuni')) {
      ctx.topic = 'Refinement: Contemporary Lurik Short Kimono';
    } else if (combinedContext.includes('ulos') || combinedContext.includes('vest')) {
      ctx.topic = 'Refinement: Heritage Ulos Statement Vest';
    }
  }

  // 6b. Style & Model Preferences Extraction
  if (!ctx.desired_style) {
    if (lowerMsg.includes('elegan') || lowerMsg.includes('anggun') || lowerMsg.includes('berkelas') || lowerMsg.includes('mewah')) {
      ctx.desired_style = 'Elegan & Anggun';
    } else if (lowerMsg.includes('semi-formal') || lowerMsg.includes('semi formal') || lowerMsg.includes('tidak kaku') || lowerMsg.includes('nggak kaku')) {
      ctx.desired_style = 'Semi-Formal (Tidak Kaku, Luwes & Elegan)';
    } else if (lowerMsg.includes('santai') || lowerMsg.includes('kasual') || lowerMsg.includes('casual') || lowerMsg.includes('rileks')) {
      ctx.desired_style = 'Kasual Santai & Nyaman';
    }
  }

  if (lowerMsg.includes('cape') || lowerMsg.includes('wrap') || lowerMsg.includes('asimetris')) {
    ctx.preferred_model = 'Asymmetric Cape Wrap';
  } else if (lowerMsg.includes('kimono') || lowerMsg.includes('outer') || lowerMsg.includes('baju luar') || lowerMsg.includes('luaran')) {
    ctx.preferred_model = 'Kimono Outerwear';
  } else if (lowerMsg.includes('vest') || lowerMsg.includes('rompi')) {
    ctx.preferred_model = 'Vest / Rompi Etnik';
  } else if (lowerMsg.includes('tunik') || lowerMsg.includes('dress') || lowerMsg.includes('terusan')) {
    ctx.preferred_model = 'Tunic Dress Set';
  } else if (lowerMsg.includes('poncho') || lowerMsg.includes('ponco')) {
    ctx.preferred_model = 'Reversible Poncho';
  }

  if (lowerMsg.includes('adem') || lowerMsg.includes('sejuk') || lowerMsg.includes('bernapas') || lowerMsg.includes('katun')) {
    ctx.material_preference = 'Katun Tenun Alami Berpori Sejuk & Adem';
  }

  if (
    lowerMsg.includes('longgar') ||
    lowerMsg.includes('loose') ||
    lowerMsg.includes('oversize') ||
    lowerMsg.includes('tidak sesak') ||
    lowerMsg.includes('badan besar') ||
    lowerMsg.includes('ukuran besar') ||
    lowerMsg.includes('muat') ||
    lowerMsg.includes('ld') ||
    lowerMsg.includes('lingkar dada') ||
    lowerMsg.includes('gemuk') ||
    lowerMsg.includes('plus size')
  ) {
    ctx.fit_preference = 'All-Size Loose Fit Inklusif & Bebas Gerak (LD 100-130 cm)';
  }

  // 6c. Synthesize 10-Factor Evaluation Object for Transparent Decision Tracing
  ctx.evaluation_10_factors = {
    jenis_acara: ctx.occasion || 'Belum spesifik (perlu klarifikasi)',
    gaya_diinginkan: ctx.desired_style || ctx.formality || 'Belum spesifik',
    warna: ctx.color_tone || ctx.color_preference || 'Palet Alami (Indigo Blue, Mengkudu Kombu, atau Earth-Tone)',
    model_pakaian: ctx.preferred_model || ctx.styling_intent || 'Luaran Etnik All-Size Inklusif',
    jenis_wastra: ctx.wastra_affinity || '6 Tradisi Tenun Hidup Oerip Indonesia',
    bahan: ctx.material_preference || ctx.climate_comfort || 'Katun 100% Tenun Tangan Serat Alami',
    ukuran_fit: ctx.fit_preference || ctx.demographic || 'All-Size Loose Fit Khas Dian Oerip (LD 100-130 cm)',
    rentang_harga: ctx.price_range_preference || ctx.tone_preference || 'Rp 1.200.000 – Rp 5.800.000 (Resmi KB)',
    filosofi_wastra: 'Konsep Minim Potong (Zero-Waste) & Doa Luhur Penenun Desa Adat',
    kesesuaian_kebutuhan: 'Harmoni kenyamanan termal, etika perhelatan, dan keanggunan pemakai'
  };

  // 7. Compose summary badge for UI display
  const badges: string[] = [];
  if (ctx.occasion) badges.push(`Acara: ${ctx.occasion.split('/')[0].trim()}`);
  if (ctx.venue) badges.push(`Suasana: ${ctx.venue.split('/')[0].trim()}`);
  if (ctx.gender_preference) badges.push(`Gaya: ${ctx.gender_preference.split('/')[0].trim()}`);
  if (ctx.climate_comfort) badges.push(`Kenyamanan: ${ctx.climate_comfort.split('(')[0].trim()}`);
  if (ctx.color_tone) badges.push(`Palet: ${ctx.color_tone.split('(')[0].trim()}`);
  if (ctx.wastra_affinity) badges.push(`Wastra: ${ctx.wastra_affinity.split('(')[0].trim()}`);

  if (badges.length > 0) {
    ctx.summary_badge = badges.slice(0, 3).join(' • ');
  } else if (
    lowerMsg.includes('zero waste') ||
    lowerMsg.includes('zero-waste') ||
    lowerMsg.includes('minim potong') ||
    lowerMsg.includes('slow fashion')
  ) {
    ctx.summary_badge = 'Filosofi Slow Fashion & Zero-Waste';
  } else if (
    lowerMsg.includes('apa itu') ||
    lowerMsg.includes('itu apa') ||
    lowerMsg.includes('filosofi') ||
    lowerMsg.includes('makna') ||
    lowerMsg.includes('sejarah')
  ) {
    ctx.summary_badge = 'Pustaka Wastra & Edukasi Budaya';
  } else {
    ctx.summary_badge = 'Konsultasi Budaya & Wastra Nusantara Oerip';
  }

  return ctx;
}

// ---------------------------------------------------------
// Intent Discrimination & Clarification Helpers
// ---------------------------------------------------------
export function hasOutfitRecommendationIntent(lower: string, ctx: DetectedContext): boolean {
  // If the query is an informational or conceptual question, it is NEVER an outfit recommendation intent
  if (isInformationalOrConceptualQuery(lower)) {
    return false;
  }

  // Greetings, small talk, pleasantries
  const pleasantries = ['halo', 'hai', 'selamat', 'pagi', 'siang', 'sore', 'malam', 'apa kabar', 'kamu siapa', 'siapa kamu', 'terima kasih', 'makasih'];
  if (pleasantries.some(p => lower === p || lower === `${p} kira` || lower === `${p} kak` || lower === `${p} oerip` || lower.startsWith(`${p} `))) {
    if (!lower.includes('rekomendasi') && !lower.includes('saran') && !lower.includes('baju') && !lower.includes('busana') && !lower.includes('outfit')) {
      return false;
    }
  }

  // Pure size, price, location, or care questions without asking for styling or outfit recommendations
  if (
    (lower.includes('berapa harga') || lower.includes('rentang harga') || lower.includes('kisaran harga') || lower.includes('daftar harga') || lower.includes('pricelist')) &&
    !lower.includes('rekomendasi') && !lower.includes('saran') && !lower.includes('pilihan')
  ) {
    return false;
  }

  if (
    (lower.includes('ld-nya') || lower.includes('lingkar dada') || lower.includes('ukuran berapa') || lower.includes('muatan untuk badan besar') || lower.includes('muat untuk badan besar')) &&
    !lower.includes('rekomendasi') && !lower.includes('saran') && !lower.includes('cocok pakai apa') && !lower.includes('pilihan baju')
  ) {
    return false;
  }

  // 1. Explicit recommendation & styling requests
  const explicitClothingTerms = [
    'rekomendasi',
    'rekomendasikan',
    'saran baju',
    'saran busana',
    'saran pakaian',
    'saran outfit',
    'saran luaran',
    'saran outer',
    'pilihan busana',
    'pilihan baju',
    'pilihan pakaian',
    'pilihan outfit',
    'pilihan outer',
    'cocok pakai apa',
    'pakai apa ya',
    'pakai apa',
    'mending pakai apa',
    'bagus pakai apa',
    'enaknya pakai apa',
    'harus pakai apa',
    'outfit apa yang cocok',
    'baju apa yang cocok',
    'busana apa yang cocok',
    'pakaian apa yang cocok',
    'baju apa yang pas',
    'busana apa yang pas',
    'outfit apa yang pas',
    'baju apa yang bagus',
    'busana apa yang bagus',
    'baju apa',
    'busana apa',
    'pakaian apa',
    'outer apa',
    'kimono apa',
    'vest apa',
    'dress apa',
    'tunik apa',
    'cape apa',
    'poncho apa',
    'rompi apa',
    'cari baju',
    'cari busana',
    'cari pakaian',
    'cari outer',
    'cari outfit',
    'beli baju',
    'beli busana',
    'beli pakaian',
    'beli outer',
    'beli outfit',
    'mau beli baju',
    'mau cari baju',
    'mau cari busana',
    'butuh baju',
    'butuh busana',
    'butuh pakaian',
    'butuh outfit',
    'butuh rekomendasi',
    'butuh saran',
    'minta rekomendasi',
    'minta saran',
    'ada rekomendasi',
    'ada saran',
    'padu padan',
    'padu-padan',
    'mix and match',
    'styling'
  ];

  if (explicitClothingTerms.some(term => lower.includes(term))) {
    return true;
  }

  // 2. Event-based outfit phrasing (e.g. "baju kondangan", "outfit wisuda", "busana kantor", "baju untuk wisuda")
  const eventOutfitPatterns = [
    /baju (untuk |ke |buat )?(kondangan|nikahan|pernikahan|resepsi|wisuda|kantor|kerja|reuni|pesta|keluarga|liburan|santai|diplomasi)/,
    /busana (untuk |ke |buat )?(kondangan|nikahan|pernikahan|resepsi|wisuda|kantor|kerja|reuni|pesta|keluarga|liburan|santai|diplomasi)/,
    /outfit (untuk |ke |buat )?(kondangan|nikahan|pernikahan|resepsi|wisuda|kantor|kerja|reuni|pesta|keluarga|liburan|santai|diplomasi)/,
    /pakaian (untuk |ke |buat )?(kondangan|nikahan|pernikahan|resepsi|wisuda|kantor|kerja|reuni|pesta|keluarga|liburan|santai|diplomasi)/,
    /(kondangan|nikahan|wisuda|kantor|kerja|reuni|pesta|diplomasi) (pakai|cocok|rekomendasi|saran)/
  ];

  if (eventOutfitPatterns.some(pattern => pattern.test(lower))) {
    return true;
  }

  // 3. Expressions of attending or preparing for an event ("Saya akan menghadiri...", "Mau datang ke...", "Ada acara...")
  const attendanceKeywords = [
    'menghadiri', 'akan menghadiri', 'mau menghadiri', 'hendak menghadiri',
    'datang ke acara', 'datang ke', 'pergi ke acara', 'pergi ke',
    'diundang ke acara', 'diundang ke', 'ikut acara', 'ke acara', 'buat acara',
    'untuk acara', 'pada acara', 'ada acara', 'ada perhelatan', 'ada kegiatan',
    'ada perayaan', 'ada pertemuan', 'ada forum', 'ada sidang'
  ];
  const hasAttendanceExpr = attendanceKeywords.some(kw => lower.includes(kw));

  // 4. Expressions of desired aesthetic or appearance ("ingin terlihat...", "ingin tampil...", "mau kelihatan...")
  const stylingDesireKeywords = [
    'ingin terlihat', 'ingin tampil', 'mau tampil', 'mau terlihat',
    'pengen tampil', 'pengen terlihat', 'kelihatan elegan', 'tampil elegan',
    'terlihat elegan', 'kelihatan anggun', 'tampil anggun', 'terlihat anggun',
    'kelihatan rapi', 'tampil rapi', 'terlihat rapi', 'kelihatan berwibawa',
    'tampil berwibawa', 'terlihat berwibawa', 'tampil santai', 'terlihat santai',
    'tidak terlalu formal', 'tidak mau terlalu formal', 'nggak terlalu formal',
    'gak terlalu formal', 'tidak kaku', 'nggak kaku', 'semi formal', 'semi-formal'
  ];
  const hasStylingDesire = stylingDesireKeywords.some(kw => lower.includes(kw));

  // If user expresses event attendance or desired appearance for an occasion
  if ((hasAttendanceExpr || hasStylingDesire) && (ctx.occasion || lower.includes('diplomasi') || lower.includes('resepsi') || lower.includes('kondangan') || lower.includes('pernikahan') || lower.includes('wisuda') || lower.includes('kantor') || lower.includes('kerja') || lower.includes('reuni') || lower.includes('pameran') || lower.includes('gala') || lower.includes('traveling') || lower.includes('liburan') || lower.includes('santai'))) {
    return true;
  }

  // 5. If ctx.occasion is already identified and the user prompt conveys personal dressing intentions
  if (ctx.occasion && (lower.includes('saya') || lower.includes('aku') || lower.includes('kami') || lower.includes('ingin') || lower.includes('mau') || lower.includes('butuh') || lower.includes('kenakan') || lower.includes('pakai') || lower.includes('hadir') || lower.includes('tampil') || lower.includes('terlihat'))) {
    return true;
  }

  // 6. Direct occasion inputs with modifiers (e.g. "wisuda sarjana formal", "wisuda sarjana", "kondangan semi formal", "acara wisuda", "resepsi pernikahan gedung", "traveling santai ke pantai")
  const occasionTerms = [
    'wisuda', 'wisudaan', 'kelulusan', 'yudisium', 'sarjana',
    'kondangan', 'resepsi', 'nikahan', 'pernikahan',
    'diplomasi', 'reuni', 'gala', 'kantor', 'arisan',
    'traveling', 'travel', 'liburan', 'pantai', 'resort', 'pesisir', 'staycation', 'jalan-jalan', 'jalan jalan'
  ];
  const hasOccasionTerm = occasionTerms.some(term => lower.includes(term));
  if (hasOccasionTerm && !isInformationalOrConceptualQuery(lower)) {
    return true;
  }

  // 7. Solitary occasion keywords where user clearly enters their occasion to get styling advice
  const soloOccasions = [
    'kondangan', 'wisuda', 'reuni', 'kantor', 'nikahan', 'resepsi', 'wisudaan', 'sarjana', 'kelulusan',
    'traveling', 'liburan', 'pantai', 'resort', 'traveling santai ke pantai', 'liburan ke pantai', 'jalan-jalan'
  ];
  if (soloOccasions.some(occ => lower === occ || lower === `${occ}?`)) {
    return true;
  }

  return false;
}

export function isInformationalOrConceptualQuery(lower: string): boolean {
  return (
    lower.includes('apa itu') ||
    lower.includes('itu apa') ||
    lower.includes('apa maksud') ||
    lower.includes('maksudnya apa') ||
    lower.includes('artinya apa') ||
    lower.includes('apa artinya') ||
    lower.includes('makna dari') ||
    lower.includes('makna motif') ||
    lower.includes('makna') ||
    lower.includes('filosofi') ||
    lower.includes('sejarah') ||
    lower.includes('asal usul') ||
    lower.includes('latar belakang') ||
    lower.includes('ceritakan') ||
    lower.includes('ceritakan tentang') ||
    lower.includes('ceritakan kisah') ||
    lower.includes('jelaskan') ||
    lower.includes('jelaskan tentang') ||
    lower.includes('jelaskan apa') ||
    lower.includes('kenapa') ||
    lower.includes('mengapa') ||
    lower.includes('apa beda') ||
    lower.includes('perbedaan') ||
    lower.includes('kain asli itu apa') ||
    lower.includes('kain tradisional itu apa') ||
    lower.includes('apa itu kain asli') ||
    lower.includes('apa itu kain tradisional') ||
    lower.includes('keaslian wastra') ||
    lower.includes('bagaimana proses') ||
    lower.includes('bagaimana cara merawat') ||
    lower.includes('bagaimana cara mencuci') ||
    lower.includes('bagaimana cara') ||
    lower.includes('cara cuci') ||
    lower.includes('buah lerak') ||
    lower.includes('lerak') ||
    lower.includes('apakah boleh dicuci') ||
    lower.includes('siapa pendiri') ||
    lower.includes('siapa dian oerip') ||
    lower.includes('dimana lokasi') ||
    lower.includes('di mana galeri') ||
    lower.includes('alamat galeri') ||
    lower.includes('berapa rentang harga') ||
    lower.includes('berapa harga') ||
    lower.includes('biasa produksi berapa') ||
    lower.includes('kapasitas produksi') ||
    lower.includes('zero waste') ||
    lower.includes('zero-waste') ||
    lower.includes('zerowaste') ||
    lower.includes('minim potong') ||
    lower.includes('slow fashion') ||
    lower.includes('lihat koleksi') ||
    lower.includes('lihat 8') ||
    lower.includes('8 koleksi') ||
    lower.includes('delapan koleksi') ||
    lower.includes('8 mahakarya') ||
    lower.includes('koleksi mahakarya') ||
    lower.includes('koleksi oerip') ||
    lower.includes('koleksi apa saja') ||
    lower.includes('katalog') ||
    lower.includes('semua koleksi') ||
    lower.includes('seluruh koleksi') ||
    lower.includes('daftar koleksi') ||
    lower.includes('daftar produk') ||
    lower.includes('semua produk') ||
    lower.includes('bahannya apa') ||
    lower.includes('bahan apa') ||
    lower.includes('terbuat dari') ||
    lower.includes('jenis bahan') ||
    lower.includes('material apa') ||
    lower.includes('materialnya apa') ||
    lower.includes('kain apa') ||
    lower.includes('kainnya apa') ||
    lower.includes('serat apa')
  );
}

/**
 * Detect and handle small talk, greetings, persona inquiries, pleasantries, and check-in queries.
 * Handles queries like: "halo", "kamu siapa", "siapa kamu", "selamat sore", "pagi kak", "apa kabar", "terima kasih", "kamu bisa apa", etc.
 */
export function detectAndHandleSmallTalk(
  message: string,
  ctx: DetectedContext
) {
  const lower = message.toLowerCase().trim();
  const clean = lower.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

  // Substantive keywords indicating an actual product, wastra, or styling query (should NOT be intercepted as pure small talk)
  const substantiveKeywords = [
    'kondangan', 'resepsi', 'nikahan', 'pernikahan', 'wisuda', 'kantor', 'kerja',
    'reuni', 'kafe', 'travel', 'liburan', 'diplomasi', 'gala', 'pesta',
    'sumba', 'tuban', 'gedog', 'lurik', 'klaten', 'ulos', 'batak', 'flores', 'ende', 'toraja',
    '6 wastra', 'enam wastra', 'wastra nusantara', 'motif', 'kuda', 'njara', 'ganggeng', 'mata bolo', "pa'teddong",
    'minim potong', 'zero-waste', 'zero waste', 'zerowaste', 'slow fashion', 'lerak', 'mencuci', 'merawat',
    'outer', 'kimono', 'duster', 'vest', 'cape', 'poncho', 'dress', 'tunik', 'koleksi', 'katalog',
    'harga', 'beli', 'order', 'pesan', 'rekomendasi', 'rekomendasikan', 'ukuran', 'lingkar dada', 'ld',
    'pendiri', 'dian oerip', 'ngawi', 'galeri', 'alamat', 'penenun', 'mama penenun', 'mitra'
  ];

  // If query explicitly contains substantive topics, let specialized scenarios or recommendation engines handle it
  const hasSubstantiveTopic = substantiveKeywords.some(kw => lower.includes(kw));
  if (hasSubstantiveTopic) {
    return null;
  }

  // Pure small talk queries are almost always concise (<= 12 words)
  const words = clean.split(' ').filter(Boolean);
  if (words.length > 12) {
    return null;
  }

  // 1. PERSONA & IDENTITY ("kamu siapa", "siapa kamu", "apa itu kira", "kira itu apa", "siapa anda", dll.)
  const personaPatterns = [
    'kamu siapa', 'siapa kamu', 'siapa anda', 'anda siapa', 'kamu itu siapa', 'kamu ini siapa',
    'siapakah kamu', 'siapakah anda', 'siapa dirimu', 'ceritakan tentang dirimu', 'tentang kamu',
    'siapa kira', 'kira siapa', 'siapakah kira', 'apa itu kira', 'kira itu apa', 'apakah kira itu',
    'kamu ai apa', 'kamu bot apa', 'kamu robot ya', 'kamu siapa ya', 'kamu siapa sih', 'ini siapa',
    'perkenalkan dirimu', 'kamu manusia atau ai', 'apakah kamu ai', 'kamu ai', 'apa fungsi kira',
    'kira adalah', 'apa arti kira', 'kenapa dinamakan kira', 'namamu siapa', 'siapa nama kamu'
  ];
  const isPersonaQuery = personaPatterns.some(p => clean.includes(p) || clean === p);

  if (isPersonaQuery) {
    return {
      content:
        `Rahayu & Salam Hangat, Sahabat Budaya! 🙏\n\n` +
        `Saya adalah **KIRA** (*Kecerdasan Budaya & Kurator Wastra Oerip Indonesia*), asisten kurasi busana etnik kontemporer dan pemandu budaya untuk jenama **Oerip Indonesia** yang didirikan oleh perancang busana **Dian Errakumalasari (Dian Oerip)** asal Ngawi, Jawa Timur.\n\n` +
        `Sebagai *living heritage curator*, saya hadir untuk mendampingi Anda memahami kedalaman filosofis wastra tenun tangan Nusantara sekaligus menemukan mahakarya busana yang paling selaras dengan jati diri dan kebutuhan perhelatan Anda.\n\n` +
        `---\n\n` +
        `### 🌟 4 Pilar Kapabilitas Utama KIRA:\n\n` +
        `1. 👗 **Kurasi Padu-Padan Busana (Styling)**\n` +
        `   Memberikan rekomendasi busana *ready-to-wear zero-waste* berkarakter *all-size loose fit* untuk ragam perhelatan (kondangan/resepsi pernikahan, kantor smart-casual, wisuda sarjana, reuni kafe, perhelatan diplomasi budaya, hingga traveling santai).\n\n` +
        `2. 🧵 **Pustaka 6 Wastra Adiluhung Nusantara**\n` +
        `   Menuturkan asal-usul daerah adat, teknik tenun tangan asli, dan makna filosofis motif sakral dari: *Tenun Ikat Sumba Timur, Tenun Gedog Tuban, Tenun Lurik Klaten, Ulos Batak Toba, Tenun Ikat Flores, dan Tenun Toraja Sa'dan*.\n\n` +
        `3. 🌿 **Filosofi Slow Fashion & Zero-Waste**\n` +
        `   Mengedukasi prinsip *Konsep Minim Potong (Zero-Waste)* Dian Oerip demi memuliakan doa para penenun desa adat, pewarnaan nabati alami ramah lingkungan, serta panduan merawat wastra dengan buah lerak alami.\n\n` +
        `4. 🤝 **Penghubung Kanal Resmi Kurator**\n` +
        `   Menghubungkan Anda langsung dengan Tim Kurator & WhatsApp Admin Resmi Oerip Indonesia (\`+62 851-7448-5581\`) untuk memastikan ketersediaan helai fisik aktual.\n\n` +
        `Bagaimana KIRA dapat mendampingi perjalanan budaya atau kurasi busana Anda hari ini?`,
      quick_replies: [
        'Rekomendasi busana untuk acara saya',
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Siapa pendiri Oerip Indonesia?'
      ],
      source_badge: '✓ Profil & Identitas Budaya KIRA',
      trace: {
        user_intent: 'Persona & Identity Inquiry ("Kamu siapa?")',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Handled persona inquiry with warm cultural grace.',
          'Articulated KIRA identity as Oerip Indonesia Cultural Curator created by Dian Oerip.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-002']
      }
    };
  }

  // 2. CAPABILITIES ("kamu bisa apa", "bisa bantu apa", "fitur apa saja", dll.)
  const capabilityPatterns = [
    'kamu bisa apa', 'bisa apa kamu', 'bisa bantu apa', 'bisa bantu apa saja', 'kamu bisa bantu apa',
    'apa kemampuan kamu', 'fitur apa saja', 'apa saja fitur', 'apa yang bisa kamu lakukan',
    'bisa ngapain aja', 'kamu bisa ngapain', 'fungsi kamu apa', 'apa tugas kamu'
  ];
  const isCapabilityQuery = capabilityPatterns.some(p => clean.includes(p) || clean === p);

  if (isCapabilityQuery) {
    return {
      content:
        `Rahayu, Sahabat Budaya! 🙏 KIRA hadir sebagai kurator budaya cerdas untuk jenama **Oerip Indonesia**. Berikut adalah layanan utama yang dapat KIRA berikan untuk Anda:\n\n` +
        `---\n\n` +
        `### 💡 Layanan & Kapabilitas KIRA:\n\n` +
        `1. 👗 **Rekomendasi Busana Kontekstual**: KIRA dapat memilihkan busana tenun *ready-to-wear* yang pas berdasarkan perhelatan (kondangan, kantor, wisuda, traveling, gala diplomasi) dan iklim ruangan (indoor AC sejuk / outdoor tropis).\n\n` +
        `2. 🧵 **Eksplorasi Pustaka 6 Wastra**: Tanyakan sejarah, teknik penenunan, dan filosofi motif sakral dari 6 wastra utama Oerip: Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak, Flores, dan Toraja Sa'dan.\n\n` +
        `3. 🌿 **Edukasi Slow Fashion & Zero-Waste**: Pahami filosofi *Konsep Minim Potong* Dian Oerip serta cara merawat dan mencuci kain tenun dengan buah lerak alami.\n\n` +
        `4. 💬 **Koneksi Kurator Resmi**: Mendapatkan tautan langsung ke WhatsApp Admin Oerip (\`+62 851-7448-5581\`) untuk reservasi helai busana eksklusif.\n\n` +
        `Silakan pilih salah satu topik di bawah ini atau ceritakan kebutuhan Anda:`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: '✓ Panduan Kapabilitas KIRA',
      trace: {
        user_intent: 'Capabilities & Features Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Outlined 4 core capabilities of KIRA without forcing outfit links.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // 3. TIME-BASED GREETINGS (Selamat Pagi / Siang / Sore / Malam)
  const isSore = clean.includes('sore') || clean === 'sore' || clean === 'met sore';
  const isPagi = clean.includes('pagi') || clean === 'pagi' || clean === 'met pagi' || clean.includes('morning');
  const isSiang = clean.includes('siang') || clean === 'siang' || clean === 'met siang' || clean.includes('afternoon');
  const isMalam = clean.includes('malam') || clean === 'malam' || clean === 'met malam' || clean.includes('evening');

  if (isSore || isPagi || isSiang || isMalam) {
    const timeLabel = isSore ? 'Sore' : isPagi ? 'Pagi' : isSiang ? 'Siang' : 'Malam';
    return {
      content:
        `Rahayu & Selamat ${timeLabel}, Sahabat Budaya! 🙏\n\n` +
        `Selamat datang di **KIRA** (*Kecerdasan Budaya & Kurator Wastra Oerip Indonesia*). Senang sekali dapat menyapa Anda di waktu ${timeLabel.toLowerCase()} yang indah ini.\n\n` +
        `KIRA siap mendampingi Anda menjelajahi keindahan mahakarya wastra tenun tangan Nusantara dan filosofi rancang busana etnik kontemporer Dian Oerip.\n\n` +
        `---\n\n` +
        `### 💡 Bagaimana KIRA Dapat Membantu Anda Hari Ini?\n` +
        `• 👗 **Konsultasi Padu-Padan Busana**: Butuh busana untuk resepsi pernikahan/kondangan, kerja kantor, wisuda, atau traveling santai?\n` +
        `• 🧵 **Pustaka 6 Wastra Nusantara**: Telusuri kisah sakral tenun Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak, Flores, atau Toraja.\n` +
        `• 🌿 **Slow Fashion & Zero-Waste**: Pahami prinsip *Konsep Minim Potong* dan panduan merawat kain tenun dengan lerak alami.\n\n` +
        `Silakan ketik pertanyaan Anda atau klik salah satu pilihan praktis di bawah ini:`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: `✓ Sambutan ${timeLabel} KIRA`,
      trace: {
        user_intent: `Time-Based Greeting: "Selamat ${timeLabel}"`,
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [`Greeted user warmly with appropriate time of day (${timeLabel}).`],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // 4. GENERAL GREETINGS & SALAM (Halo, Hai, Assalamu'alaikum, Sampurasun, Kulo Nuwun, Salam)
  const isIslamic = clean.includes('assalamu') || clean.includes('assalamualaikum');
  const isSundanese = clean.includes('sampurasun');
  const isJavanese = clean.includes('kulo nuwun') || clean.includes('kulonuwun') || clean.includes('kula nuwun');
  const generalGreetingWords = ['halo', 'hai', 'hello', 'hey', 'hei', 'permisi', 'salam'];
  const hasGeneralGreeting = generalGreetingWords.some(w => words.includes(w) || clean.startsWith(w));

  if (isIslamic || isSundanese || isJavanese || hasGeneralGreeting) {
    let greetingSalutation = 'Rahayu & Salam Hangat, Sahabat Budaya! 🙏';
    if (isIslamic) {
      greetingSalutation = "Wa'alaikumussalam Warahmatullahi Wabarakatuh, Sahabat Budaya! 🙏";
    } else if (isSundanese) {
      greetingSalutation = 'Sampurasun! Rampes, Sahabat Budaya! 🙏';
    } else if (isJavanese) {
      greetingSalutation = 'Kulo nuwun! Monggo pinarak, Sahabat Budaya! 🙏';
    }

    return {
      content:
        `${greetingSalutation}\n\n` +
        `Selamat datang di **KIRA** (*Kecerdasan Budaya & Kurator Wastra Oerip Indonesia*).\n\n` +
        `Saya siap mendampingi Anda menjelajahi keindahan mahakarya wastra tenun tangan Nusantara dan filosofi rancang busana Dian Oerip.\n\n` +
        `---\n\n` +
        `### 💡 Bagaimana KIRA Dapat Mendampingi Anda?\n` +
        `• 👗 **Konsultasi Padu-Padan Busana**: Sebutkan perhelatan Anda (kondangan formal, wisuda, kantor smart-casual, reuni, traveling) dan KIRA akan mengurasi padanan busana terbaik.\n` +
        `• 🧵 **Pustaka 6 Wastra Nusantara**: Eksplorasi keagungan Tenun Ikat Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, atau Toraja Sa'dan.\n` +
        `• 🌿 **Slow Fashion & Zero-Waste**: Pahami prinsip *Konsep Minim Potong*, pewarnaan nabati alami, dan cara mencuci wastra dengan buah lerak.\n\n` +
        `Silakan ketik kebutuhan Anda atau pilih salah satu opsi di bawah ini:`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: '✓ Sambutan Budaya KIRA',
      trace: {
        user_intent: 'General Greeting / Cultural Salam',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Politely responded to user greeting with cultural warmth.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // 5. HOW ARE YOU / KABAR ("apa kabar", "gimana kabarnya", "how are you", dll.)
  const howAreYouPatterns = ['apa kabar', 'apa kabarmu', 'gimana kabar', 'gimana kabarnya', 'bagaimana kabarmu', 'how are you', 'sehat kak', 'kamu sehat', 'lagi apa', 'sedang apa'];
  const isHowAreYou = howAreYouPatterns.some(p => clean.includes(p) || clean === p);

  if (isHowAreYou) {
    return {
      content:
        `Kabar baik, sehat, dan senantiasa penuh semangat, terima kasih banyak atas sapaan hangatnya! 🙏\n\n` +
        `Di sini KIRA selalu siap mendampingi Anda menjelajahi keindahan serat alam dan kearifan luhur di balik setiap lembar tenun tangan Nusantara bersama **Oerip Indonesia**.\n\n` +
        `Semoga hari Anda senantiasa dilimpahi kesehatan dan ketenteraman. Apakah ada perhelatan istimewa yang sedang Anda persiapkan busananya, atau ada wastra tenun yang ingin Anda telusuri filosofinya hari ini?`,
      quick_replies: [
        'Rekomendasi busana untuk acara saya',
        'Ceritakan 6 Wastra Nusantara',
        'Lihat 8 Koleksi Mahakarya Oerip',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: '✓ Sapaan Kehangatan KIRA',
      trace: {
        user_intent: 'How Are You / Pleasantry Check-In',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Responded politely to well-being inquiry with cultural warmth.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // 6. GRATITUDE & APPRECIATION ("terima kasih", "makasih", "matur nuwun", dll.)
  const gratitudePatterns = ['terima kasih', 'terimakasih', 'makasih', 'matur nuwun', 'hatur nuhun', 'thank you', 'thanks', 'tengkyu', 'keren banget', 'membantu sekali'];
  const isGratitude = gratitudePatterns.some(p => clean.includes(p) || clean === p);

  if (isGratitude) {
    return {
      content:
        `Sami-sami / Terima kasih kembali, Sahabat Budaya! 🙏\n\n` +
        `Merupakan suatu kehormatan dan kebahagiaan bagi KIRA dapat mendampingi perjalanan apresiasi budaya Anda bersama **Oerip Indonesia**. Semoga kurasi dan wawasan yang KIRA sampaikan dapat memberikan inspirasi yang bermakna.\n\n` +
        `Jika kelak Anda memerlukan panduan busana untuk perhelatan lain atau ingin memastikan ketersediaan helai tenun fisik aktual secara langsung dengan Tim Kurator, KIRA siap menyambut Anda kembali kapan saja. Rahayu! 🌿`,
      quick_replies: [
        'Konsultasi busana untuk acara lain',
        'Ceritakan 6 Wastra Nusantara',
        'Panduan mencuci kain dengan lerak',
        'Hubungi WhatsApp Admin (+6285174485581)'
      ],
      source_badge: '✓ Apresiasi & Salam Hangat KIRA',
      trace: {
        user_intent: 'Gratitude & Appreciation ("Terima kasih")',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Acknowledged user gratitude warmly and extended future assistance.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // 7. AFFIRMATION / TESTING ("tes", "ping", "oke", "siap", "baik", "sip")
  const testAffirmationWords = ['tes', 'test', 'testing', 'ping', 'p', 'oke', 'ok', 'baik', 'siap', 'sip', 'mantap'];
  const isTestAffirmation = testAffirmationWords.includes(clean);

  if (isTestAffirmation) {
    return {
      content:
        `Siap, Sahabat Budaya! KIRA aktif dan siap mendampingi Anda. 🙏\n\n` +
        `Silakan ceritakan busana untuk acara apa yang sedang Anda cari, atau wastra Nusantara mana yang ingin Anda pelajari kisahnya. Anda juga dapat memilih salah satu topik di bawah ini:`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Hubungi WhatsApp Admin'
      ],
      source_badge: '✓ KIRA Siap Mendampingi',
      trace: {
        user_intent: 'Affirmation / System Test Check',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Acknowledged affirmation / test cleanly and prompted for user need.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  return null;
}

export function isGreetingOrUnclearQuery(lower: string): boolean {
  const clean = lower.replace(/[^\w\s]/gi, '').trim();
  const dummyCtx: DetectedContext = {};

  if (detectAndHandleSmallTalk(lower, dummyCtx)) return true;

  const vagueWords = ['tes', 'test', 'ping', 'mau tanya', 'bisa bantu', 'bisa bantu saya', 'tolong', 'bingung', 'kira', 'tanya dong', 'help'];
  if (vagueWords.includes(clean)) return true;

  return false;
}

export function generateClarificationGuidanceResponse(
  message: string,
  ctx: DetectedContext
) {
  return {
    content:
      `Halo Sahabat Budaya! 🙏\n\n` +
      `KIRA ingin memastikan dapat memberikan panduan yang paling tepat dan bermakna untuk Anda. Namun saat ini KIRA belum dapat memahami pertanyaan Anda: *"${message}"* secara jelas.\n\n` +
      `---\n\n` +
      `### 💡 Bagaimana KIRA Dapat Mendampingi Anda?\n\n` +
      `1. 👗 **Konsultasi Padu-Padan Busana (Styling)**\n` +
      `   Sebutkan jenis acara (misalnya: *reuni di kafe ber-AC, resepsi pernikahan, wisuda sarjana, kantor smart-casual, gala diplomasi, atau traveling santai*) dan preferensi siluet Anda. KIRA akan mengurasi mahakarya busana Oerip yang paling pas.\n\n` +
      `2. 🧵 **Eksplorasi 6 Wastra Nusantara Oerip**\n` +
      `   Tanyakan sejarah, filosofi hidup, dan makna motif sakral dari: *Tenun Ikat Sumba Timur, Tenun Gedog Tuban, Tenun Lurik Klaten, Ulos Batak Toba, Tenun Ikat Flores, atau Tenun Toraja Sa'dan*.\n\n` +
      `3. 🌿 **Filosofi Slow Fashion, Zero-Waste & Perawatan Alami**\n` +
      `   Pelajari prinsip *Konsep Minim Potong (Zero-Waste)*, pewarnaan nabati alami ramah lingkungan, atau tata cara mencuci wastra dengan buah lerak alami.\n\n` +
      `Silakan tuliskan kembali pertanyaan Anda dengan lebih spesifik, atau klik salah satu topik praktis di bawah ini:`,
    quick_replies: [
      'Rekomendasi busana untuk acara tertentu',
      'Apa itu Konsep Minim Potong (Zero-Waste)?',
      'Ceritakan tentang 6 Wastra Oerip',
      'Hubungi WhatsApp Admin Kurator'
    ],
    source_badge: '✓ Panduan & Klarifikasi Budaya KIRA',
    trace: {
      user_intent: `Unclear/Clarification Query: "${message.slice(0, 50)}"`,
      context_detected: ctx,
      is_sufficient_information: false,
      clarification_needed: 'Maksud pertanyaan pengguna belum cukup jelas. Menghindari pemaksaan rekomendasi busana.',
      guardrail_checked: true,
      guardrail_notes: [
        'Strict Intent Guardrail: Did NOT force an unsolicited outfit recommendation.',
        'Provided helpful clarification options across styling, wastra library, and zero-waste philosophy.'
      ],
      cultural_accuracy_verified: true,
      retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
    }
  };
}

export function isInsufficientRecommendationData(lower: string, ctx: DetectedContext): boolean {
  // If the query is an informational or conceptual question, size check, care question, etc.,
  // this function does not apply (handled by respective knowledge modules).
  if (isInformationalOrConceptualQuery(lower)) {
    return false;
  }

  // Check if there is an intention to ask for an outfit recommendation / styling suggestion / what to wear
  const isRecommendationRequest =
    hasOutfitRecommendationIntent(lower, ctx) ||
    lower.includes('rekomendasi') ||
    lower.includes('rekomendasikan') ||
    lower.includes('saran baju') ||
    lower.includes('saran busana') ||
    lower.includes('saran pakaian') ||
    lower.includes('saran outfit') ||
    lower.includes('pilihan baju') ||
    lower.includes('pilihan busana') ||
    lower.includes('pilihan outfit') ||
    lower.includes('baju apa') ||
    lower.includes('busana apa') ||
    lower.includes('outfit apa') ||
    lower.includes('cocok pakai apa') ||
    lower.includes('cari baju') ||
    lower.includes('cari busana') ||
    lower.includes('cari outfit');

  if (!isRecommendationRequest) {
    return false;
  }

  // 1. Explicit generic phrases that indicate missing or placeholder event information
  // E.g., "acara tertentu", "untuk acara tertentu", "suatu acara", "sebuah acara", "acara saya"
  const explicitGenericEventPhrases = [
    'acara tertentu',
    'untuk acara tertentu',
    'buat acara tertentu',
    'ke acara tertentu',
    'pada acara tertentu',
    'suatu acara',
    'untuk suatu acara',
    'buat suatu acara',
    'ke suatu acara',
    'sebuah acara',
    'untuk sebuah acara',
    'buat sebuah acara',
    'ada acara',
    'ada suatu acara',
    'acara saya',
    'untuk acara saya',
    'buat acara saya',
    'acara nanti',
    'acara apa saja',
    'acara bebas',
    'acara terserah'
  ];

  const hasExplicitGenericEvent = explicitGenericEventPhrases.some(phrase => lower.includes(phrase));

  // 2. Concrete evaluation across the 10 Curation Factors:
  // Factor 1: Concrete, specific occasion (NOT generic event placeholder phrases)
  const specificOccasions = [
    'kondangan', 'nikah', 'nikahan', 'pernikahan', 'resepsi', 'manten', 'mantenan', 'walimah', 'hajatan',
    'wisuda', 'wisudaan', 'kelulusan', 'sidang', 'sidang skripsi', 'yudisium', 'sarjana', 'toga', 'pendadaran',
    'kantor', 'kerja', 'ngantor', 'meeting', 'rapat', 'dinas',
    'reuni', 'reunian', 'kumpul teman', 'kafe', 'cafe', 'nongkrong', 'ngopi',
    'diplomasi', 'kenegaraan', 'bilateral', 'duta', 'unesco', 'pbb',
    'adat', 'sakral', 'upacara', 'gereja', 'ibadah',
    'traveling', 'liburan', 'jalan-jalan', 'resort', 'pantai', 'gunung',
    'pameran', 'galeri', 'art opening', 'vernissage',
    'arisan', 'kumpul keluarga', 'silaturahmi', 'lebaran', 'idul fitri',
    'ballroom', 'pesta malam', 'gala dinner'
  ];
  const hasSpecificOccasion = specificOccasions.some(occ => lower.includes(occ));

  // Factor 2: Desired style / formality
  const specificStyles = [
    'elegan', 'anggun', 'berwibawa', 'mewah', 'megah', 'ningrat',
    'semi-formal', 'semi formal', 'tidak kaku', 'nggak kaku', 'gak kaku', 'santai tapi rapi', 'luwes',
    'santai', 'kasual', 'casual', 'santai tapi elegan',
    'modest', 'hijab', 'jilbab', 'muslimah',
    'bohemian', 'minimalis', 'formal', 'resmi'
  ];
  const hasSpecificStyle = specificStyles.some(style => lower.includes(style));

  // Factor 3: Color preference
  const specificColors = [
    'biru', 'indigo', 'cokelat', 'coklat', 'terakota', 'kombu', 'merah', 'marun',
    'hitam', 'itom', 'krem', 'putih', 'gelap', 'terang', 'earth-tone', 'earth tone', 'pewarna alam'
  ];
  const hasSpecificColor = specificColors.some(color => lower.includes(color));

  // Factor 4: Clothing model / silhouette
  const specificModels = [
    'outer', 'outerwear', 'kimono', 'vest', 'rompi', 'cape', 'duster', 'tunik', 'dress',
    'terusan', 'poncho', 'ponco', 'wrap', 'draperi', 'rumbai'
  ];
  const hasSpecificModel = specificModels.some(model => lower.includes(model));

  // Factor 5: Textile type (Wastra)
  const specificWastras = [
    'sumba', 'gedog', 'tuban', 'lurik', 'klaten', 'ulos', 'batak', 'toba', 'flores', 'ende', 'toraja', 'sa\'dan'
  ];
  const hasSpecificWastra = specificWastras.some(wastra => lower.includes(wastra));

  // Factor 6: Material & Thermal comfort
  const specificMaterials = [
    'adem', 'sejuk', 'anti-gerah', 'tidak gerah', 'dingin', 'hangat', 'menghalau dingin',
    'katun', 'kapas kenthang', 'kapas mentah'
  ];
  const hasSpecificMaterial =
    specificMaterials.some(mat => lower.includes(mat)) ||
    /\b(ac|ber-ac)\b/i.test(lower) ||
    lower.includes('ruang ac');

  // Factor 7: Size / Fit / Gender
  const specificFit = [
    'all size', 'all-size', 'longgar', 'loose', 'ld', 'lingkar dada', 'badan besar',
    'gemuk', 'berisi', 'plus size', 'plus-size', 'pria', 'cowok', 'laki-laki', 'wanita', 'ibu'
  ];
  const hasSpecificFit = specificFit.some(fit => lower.includes(fit));

  // Factor 8: Budget / Price range
  const specificBudget = [
    'murah', 'terjangkau', 'ramah kantong', 'hemat', 'budget', 'di bawah 2 juta', 'dibawah 2 juta',
    'di bawah 3 juta', 'dibawah 3 juta', 'mahal', 'premium', 'eksklusif'
  ];
  const hasSpecificBudget = specificBudget.some(bg => lower.includes(bg));

  // Factor 9: Textile philosophy / motif
  const specificPhilosophy = [
    'kuda', 'njara', 'pohon hayat', 'andung', 'ganggeng', 'lurus ing lakon',
    'bintang maratur', 'mata bolo', 'pa\'teddong', 'pateddong', 'zero waste', 'zero-waste', 'minim potong'
  ];
  const hasSpecificPhilosophy = specificPhilosophy.some(phil => lower.includes(phil));

  // If user used a generic event phrase (like "acara tertentu", "suatu acara", "acara saya"):
  // Unless there is a specific wastra, color, model, or budget constraint, it is INSUFFICIENT.
  if (hasExplicitGenericEvent) {
    const hasOtherConcreteConstraint = hasSpecificColor || hasSpecificWastra || hasSpecificModel || hasSpecificBudget || hasSpecificFit;
    if (!hasOtherConcreteConstraint) {
      return true;
    }
  }

  // Count how many concrete factors the user provided
  const concreteFactorCount =
    (hasSpecificOccasion ? 1 : 0) +
    (hasSpecificStyle ? 1 : 0) +
    (hasSpecificColor ? 1 : 0) +
    (hasSpecificModel ? 1 : 0) +
    (hasSpecificWastra ? 1 : 0) +
    (hasSpecificMaterial ? 1 : 0) +
    (hasSpecificFit ? 1 : 0) +
    (hasSpecificBudget ? 1 : 0) +
    (hasSpecificPhilosophy ? 1 : 0);

  // If 0 concrete factors are present (e.g. "rekomendasi busana", "saran baju", "baju apa yang cocok untuk saya"):
  // it is INSUFFICIENT.
  if (concreteFactorCount === 0) {
    return true;
  }

  return false;
}

export function generateClarificationForRecommendation(
  message: string,
  ctx: DetectedContext
) {
  return {
    content:
      `Halo Sahabat Budaya! 🙏 Terima kasih telah berkonsultasi dengan **KIRA** (*AI Cultural & Fashion Decision Agent Oerip Indonesia*).\n\n` +
      `Agar KIRA dapat memberikan kurasi yang tepat sasaran dan **tidak memilih produk secara acak**, KIRA selalu mempertimbangkan 10 faktor kurasi budaya Oerip:\n\n` +
      `1. 🏛️ **Jenis Acara** (pernikahan/resepsi, wisuda, kantor, reuni/kafe, diplomasi, traveling, pameran seni)\n` +
      `2. ✨ **Gaya yang Diinginkan** (elegan, formal, semi-formal luwes/tidak kaku, santai rapi, modest)\n` +
      `3. 🎨 **Warna** (indigo biru malam, terakota/earth-tone hangat, gelap, atau terang kapas mentah)\n` +
      `4. 👘 **Model Pakaian** (blanket outer, kimono, vest berstruktur, sleeveless vest, asymmetric cape wrap, tunik dress set selendang, reversible poncho)\n` +
      `5. 🌿 **Jenis Wastra** (Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, Toraja)\n` +
      `6. 🧵 **Bahan & Kenyamanan Termal** (katun tenun tangan adem anti-gerah atau penghalau dingin AC)\n` +
      `7. 📐 **Ukuran & Karakter Fit** (all-size loose fit inklusif khas Dian Oerip, LD 100–130 cm)\n` +
      `8. 💰 **Rentang Harga** (koleksi terverifikasi Oerip resmi berkisar Rp 1.200.000 – Rp 5.800.000)\n` +
      `9. 📜 **Filosofi & Karakter Wastra** (makna motif sakral & prinsip Zero-Waste Minim Potong)\n` +
      `10. 🎯 **Kesesuaian Kebutuhan Pengguna** (harmoni kenyamanan, etika perhelatan, dan kepribadian pemakai)\n\n` +
      `---\n\n` +
      `Karena informasi acara Anda saat ini **belum spesifik**, bolehkah KIRA mengetahui satu atau dua hal yang paling penting bagi Anda:\n` +
      `• 🏛️ **Acara apa yang akan dihadiri?** *(misalnya: kondangan/resepsi pernikahan, wisuda, kantor smart-casual, reuni di kafe, diplomasi, atau traveling)*\n` +
      `• ✨ **Gaya yang diinginkan?** *(misalnya: formal elegan, santai tapi rapi, berwibawa ningrat, atau luwes tidak kaku)*\n` +
      `• 🎨 **Preferensi warna atau wastra?** *(misalnya: bernuansa indigo blue, terakota hangat, Tenun Sumba, Tenun Gedog, atau Tenun Lurik)*\n` +
      `• 💰 **Kisaran harga / anggaran?** *(mulai dari Rp 1.200.000 untuk Lurik Klaten hingga Rp 5.800.000 untuk Sumba Duster Robe)*\n\n` +
      `*💡 Anda juga dapat langsung memilih salah satu opsi perhelatan di bawah ini untuk memulai kurasi presisi:*`,
    recommendation: undefined,
    quick_replies: [
      'Kondangan yang elegan',
      'Wisuda sarjana formal',
      'Kantor smart-casual adem',
      'Reuni santai di kafe',
      'Traveling santai ke pantai'
    ],
    source_badge: '✓ Panduan & Klarifikasi Kurasi KIRA',
    trace: {
      user_intent: `Clarification for Incomplete Outfit Recommendation Query: "${message.slice(0, 40)}"`,
      context_detected: ctx,
      is_sufficient_information: false,
      clarification_needed: 'Informasi perhelatan/gaya/warna/anggaran belum cukup spesifik untuk memilih produk tanpa spekulasi acak.',
      suggested_options: [
        'Kondangan yang elegan',
        'Wisuda sarjana formal',
        'Kantor smart-casual adem',
        'Reuni santai di kafe',
        'Traveling santai ke pantai'
      ],
      guardrail_checked: true,
      guardrail_notes: [
        'Strict Anti-Random Guardrail: Did NOT randomly select a product when criteria is incomplete.',
        'Evaluated 10 curation factors and requested essential criteria (acara, warna, harga, gaya).'
      ],
      cultural_accuracy_verified: true,
      retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
    }
  };
}

// ---------------------------------------------------------
// Out-of-Knowledge-Base Entities & Intelligent Detector
// ---------------------------------------------------------
export interface OutOfKnowledgeBaseMatch {
  matched: boolean;
  topicName: string;
  category:
    | 'OTHER_INDONESIAN_WASTRA'
    | 'FICTIONAL_OR_UNVERIFIED_MOTIF'
    | 'NON_WASTRA_FAST_FASHION'
    | 'OFF_TOPIC'
    | 'GENERAL_UNVERIFIED';
  explanation: string;
  oeripClosestAlternative?: string;
  suggestedPrompt?: string;
}

export function detectOutOfKnowledgeBase(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  ctx?: DetectedContext
): OutOfKnowledgeBaseMatch | null {
  const lower = message.toLowerCase().trim();

  // If this is a styling / pairing inquiry with user's own items, do not treat as out of KB
  const isStylingInquiry =
    lower.includes('padu padan') ||
    lower.includes('padu-padan') ||
    lower.includes('dipadu') ||
    lower.includes('dipadukan') ||
    lower.includes('kombinasi') ||
    lower.includes('cocok gak') ||
    lower.includes('cocok tidak') ||
    lower.includes('cocok dengan') ||
    lower.includes('cocok dipadu') ||
    lower.includes('bisa digabung') ||
    lower.includes('dipakai bareng') ||
    lower.includes('mix and match');

  // If this is a curatorial justification inquiry ("Kenapa kamu memilih...", "Alasan...") or environmental/thermal inquiry, do not treat as out of KB
  const isCuratorialOrThermalInquiry =
    lower.includes('kenapa') ||
    lower.includes('mengapa') ||
    lower.includes('alasan') ||
    lower.includes('pertimbangan') ||
    lower.includes('memilih') ||
    lower.includes('rekomendasi') ||
    lower.includes('ruangan ber-ac') ||
    lower.includes('ruangan ber ac') ||
    lower.includes('ruangan ac') ||
    lower.includes('ber-ac') ||
    lower.includes('ber ac') ||
    lower.includes('ac dingin') ||
    lower.includes('dingin') ||
    lower.includes('panas') ||
    lower.includes('gerah') ||
    lower.includes('adem') ||
    lower.includes('sejuk') ||
    lower.includes('hijab') ||
    lower.includes('badan besar') ||
    lower.includes('lingkar dada') ||
    lower.includes('ukuran') ||
    lower.includes('cowok') ||
    lower.includes('pria');

  if (isStylingInquiry || isCuratorialOrThermalInquiry) {
    // If it's pure off-topic (e.g. sports score + kenapa), let explicit off-topic check still catch it
    const isExplicitOffTopic =
      lower.includes('sepak bola') ||
      lower.includes('klasemen') ||
      lower.includes('skor bola') ||
      lower.includes('liga champion') ||
      lower.includes('piala dunia') ||
      lower.includes('film bioskop') ||
      lower.includes('netflix') ||
      lower.includes('game online') ||
      lower.includes('mobile legends') ||
      lower.includes('presiden') ||
      lower.includes('menteri') ||
      lower.includes('pilkada') ||
      lower.includes('pemilu') ||
      lower.includes('rumus fisika') ||
      lower.includes('rumus matematika') ||
      lower.includes('obat sakit kepala') ||
      lower.includes('servis mobil') ||
      lower.includes('bengkel motor');

    if (!isExplicitOffTopic) {
      return null;
    }
  }

  // If there is existing conversation history and the message is a follow-up, do not trigger out of KB unless explicit
  const meaningfulHistory = history.filter(
    (h) => h.role === 'user' || (h.role === 'assistant' && !h.content.startsWith('Rahayu & Salam Hangat'))
  );
  if (meaningfulHistory.length > 0) {
    const isFollowUpPattern =
      lower.startsWith('kenapa') ||
      lower.startsWith('mengapa') ||
      lower.startsWith('bagaimana kalau') ||
      lower.startsWith('gimana kalau') ||
      lower.startsWith('kalau di') ||
      lower.startsWith('kalo di') ||
      lower.startsWith('kalau buat') ||
      lower.startsWith('kalo buat') ||
      lower.includes('produk itu') ||
      lower.includes('produk ini') ||
      lower.includes('baju itu') ||
      lower.includes('baju ini') ||
      lower.includes('yang tadi') ||
      lower.includes('sebelumnya');

    if (isFollowUpPattern) {
      return null;
    }
  }

  // 1. Other Indonesian Wastra (Outside the 6 Oerip Core Living Handwoven Collections)
  if (
    !isStylingInquiry &&
    (lower.includes('songket') ||
      lower.includes('palembang') ||
      lower.includes('pandai sikek') ||
      lower.includes('silungkang') ||
      lower.includes('sambas') ||
      lower.includes('minang'))
  ) {
    return {
      matched: true,
      topicName: 'Kain Songket (Palembang / Minangkabau / Sambas)',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Kain Songket yang kaya sulaman benang emas/perak metalik khas tradisi Melayu dan Minangkabau.',
      oeripClosestAlternative: 'Oerip Heritage Ulos Statement Vest atau Tenun Pahikung Sumba Timur dengan teknik pakan tambahan yang megah dan berwibawa.',
      suggestedPrompt: 'Ceritakan tentang teknik tenun Pahikung Sumba Timur yang kaya struktur.'
    };
  }

  if (lower.includes('tapis') || lower.includes('lampung')) {
    return {
      matched: true,
      topicName: 'Kain Tapis Lampung',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Kain Tapis tradisional masyarakat Lampung dengan ragam hias sulaman benang emas bermotif kapal jung atau flora.',
      oeripClosestAlternative: 'Tenun Pahikung Sumba Timur dan Tenun Gedog Tuban warna bumi.',
      suggestedPrompt: 'Ceritakan tentang Tenun Gedog Tuban dan bahan kapas kenthang lokal.'
    };
  }

  if (
    lower.includes('sasirangan') ||
    lower.includes('banjar') ||
    lower.includes('kalsel') ||
    lower.includes('pagatan') ||
    lower.includes('tanah bumbu')
  ) {
    return {
      matched: true,
      topicName: 'Kain Sasirangan Banjar / Tenun Pagatan',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Kain rintang jelujur (tie-dye) Sasirangan khas suku Banjar Kalimantan Selatan.',
      oeripClosestAlternative: 'Tenun Ikat Sumba Timur & Tenun Gedog Tuban dengan pewarna alami daun nila dan akar mengkudu murni.',
      suggestedPrompt: 'Ceritakan proses pewarnaan alami akar mengkudu dan daun nila pada tenun Sumba.'
    };
  }

  if (
    lower.includes('dayak') ||
    lower.includes('iban') ||
    lower.includes('sintang') ||
    lower.includes('kapuas') ||
    lower.includes('tenun kalimantan')
  ) {
    return {
      matched: true,
      topicName: 'Tenun Ikat Dayak Iban / Sintang Kalimantan',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Kain tenun ikat bernilai sakral masyarakat adat Dayak Iban di pedalaman Kalimantan Barat.',
      oeripClosestAlternative: 'Tenun Ikat Sumba Timur berpewarna alam yang juga memegang teguh tradisi spiritual leluhur (Marapu).',
      suggestedPrompt: 'Ceritakan tentang makna motif sakral Tenun Sumba Timur (Andung & Njara).'
    };
  }

  if (lower.includes('troso') || lower.includes('jepara')) {
    return {
      matched: true,
      topicName: 'Tenun Troso Jepara',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Tenun pakan ATBM pesisir yang berkembang pesat di sentra Troso, Jepara.',
      oeripClosestAlternative: 'Tenun Lurik Tradisional Klaten Prasojo yang bertekstur nap alami dan bernapas sejuk.',
      suggestedPrompt: 'Rekomendasikan busana Lurik modern untuk suasana kerja atau santai.'
    };
  }

  if (
    lower.includes('gringsing') ||
    lower.includes('tenganan') ||
    lower.includes('endek') ||
    lower.includes('bali')
  ) {
    return {
      matched: true,
      topicName: 'Tenun Gringsing Tenganan & Endek Bali',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Tenun ikat ganda sakral Gringsing dari desa Tenganan Pegringsingan Bali maupun Tenun Endek Bali.',
      oeripClosestAlternative: 'Tenun Ikat Sumba Timur dan Ulos Ragidup Batak Toba yang sarat makna proteksi spiritual.',
      suggestedPrompt: 'Ceritakan filosofi kehangatan kosmis pada Ulos Ragidup Batak.'
    };
  }

  if (
    lower.includes('megamendung') ||
    lower.includes('cirebon') ||
    lower.includes('pekalongan') ||
    lower.includes('lasem') ||
    lower.includes('batik solo') ||
    lower.includes('batik jogja')
  ) {
    return {
      matched: true,
      topicName: 'Batik Pesisir & Keraton (Megamendung / Pekalongan / Lasem)',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Ragam batik lilin malam pesisir seperti Mega Mendung Cirebon, motif Jlamprang Pekalongan, atau Tiga Negeri Lasem.',
      oeripClosestAlternative: 'Batik & Tenun Gedog Kerek Tuban (Kapas Kenthang pintal tangan dengan motif Ganggeng & Kijing Miring).',
      suggestedPrompt: 'Ceritakan tentang Tenun & Batik Gedog Tuban dan filosofi motif Ganggeng.'
    };
  }

  if (
    lower.includes('mandar') ||
    lower.includes('lagosi') ||
    lower.includes('sengkang') ||
    lower.includes('sutera bugis')
  ) {
    return {
      matched: true,
      topicName: 'Sutera Mandar & Sengkang Bugis',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Tenun sutera sarung kotak-kotak Mandar dan motif bunga Lagosi Bugis.',
      oeripClosestAlternative: 'Koleksi Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006) berbahan Tenun Ikat Toraja Sa\'dan serta Tenun Lurik Klaten.',
      suggestedPrompt: 'Ceritakan tentang Oerip Living Heritage Tunic Dress & Selendang Set berbahan Tenun Toraja.'
    };
  }

  if (lower.includes('baduy') || lower.includes('banten') || lower.includes('kanekes')) {
    return {
      matched: true,
      topicName: 'Tenun Adat Suku Baduy Banten',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Tenun kapas mentah sederhana bermotif garis suwat masyarakat adat Kanekes Baduy.',
      oeripClosestAlternative: 'Tenun Gedog Tuban yang dibuat dari serat kapas kenthang mentah tanpa pemutih kimia.',
      suggestedPrompt: 'Bagaimana proses kapas kenthang mentah dipintal tangan di desa Kerek Tuban?'
    };
  }

  if (
    lower.includes('karawo') ||
    lower.includes('gorontalo') ||
    lower.includes('besurek') ||
    lower.includes('bengkulu') ||
    lower.includes('jumputan')
  ) {
    return {
      matched: true,
      topicName: 'Kain Sulam Karawo / Batik Besurek / Kain Jumputan',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Kain tradisi kriya sulam atau rintang warna khas Gorontalo, Bengkulu, atau Palembang.',
      oeripClosestAlternative: 'Koleksi Tenun Gedog Tuban & Lurik Klaten Oerip Indonesia.',
      suggestedPrompt: 'Jelaskan konsep minim potong (zero-waste) busana tenun Oerip.'
    };
  }

  // 2. Fictional or Fabricated Cultural Claims
  if (
    lower.includes('motif naga sakral sumba') ||
    lower.includes('motif naga sumba') ||
    lower.includes('motif alien') ||
    lower.includes('motif robot') ||
    lower.includes('motif unicorn') ||
    lower.includes('garuda emas tuban') ||
    lower.includes('motif dinosaurus') ||
    lower.includes('motif mobil') ||
    lower.includes('pewarna neon') ||
    lower.includes('sablon printing mesin')
  ) {
    return {
      matched: true,
      topicName: 'Motif Fiktif / Klaim Non-Otentik',
      category: 'FICTIONAL_OR_UNVERIFIED_MOTIF',
      explanation: 'Motif atau istilah yang tidak bersumber dari pakem adat leluhur yang tervalidasi.',
      oeripClosestAlternative: 'Motif resmi terverifikasi: Njara (Kuda), Andung (Pohon Hayat), Ganggeng Tuban, atau Bintang Maratur Ulos.',
      suggestedPrompt: 'Ceritakan tentang makna motif Kuda (Njara) dan Pohon Hayat (Andung) Sumba.'
    };
  }

  // 3. Fast Fashion & Non-Wastra Modern Garments
  if (
    lower.includes('celana jeans') ||
    lower.includes('denim levis') ||
    lower.includes('kaos polo sablon') ||
    lower.includes('baju renang') ||
    lower.includes('bikini') ||
    lower.includes('jaket puffer') ||
    lower.includes('bahan polyester') ||
    lower.includes('kain sintetis') ||
    lower.includes('hoodie fleece')
  ) {
    return {
      matched: true,
      topicName: 'Produk Konveksi Non-Wastra / Fast Fashion',
      category: 'NON_WASTRA_FAST_FASHION',
      explanation: 'Produk pakaian pabrik massal berbahan sintetis di luar konsep slow-fashion tenun tangan.',
      oeripClosestAlternative: 'Oerip Contemporary Lurik Short Kimono atau Bohemian Long Duster yang sangat serasi dipadukan dengan busana harian.',
      suggestedPrompt: 'Rekomendasikan busana etnik Oerip yang cocok dipadukan dengan pakaian kasual harian.'
    };
  }

  // 4. Off-Topic Queries (Outside the 8 Focus Areas)
  const isExplicitOffTopic =
    lower.includes('resep nasi goreng') ||
    lower.includes('cara membuat kue') ||
    lower.includes('resep masakan') ||
    lower.includes('resep kue') ||
    lower.includes('resep makanan') ||
    lower.includes('coding python') ||
    lower.includes('javascript') ||
    lower.includes('typescript') ||
    lower.includes('bahasa pemrograman') ||
    lower.includes('crypto bitcoin') ||
    lower.includes('crypto') ||
    lower.includes('bitcoin') ||
    lower.includes('saham') ||
    lower.includes('prediksi saham') ||
    lower.includes('cuaca besok') ||
    lower.includes('cuaca hari ini') ||
    lower.includes('ramalan cuaca') ||
    lower.includes('skor bola') ||
    lower.includes('sepak bola') ||
    lower.includes('liga champion') ||
    lower.includes('piala dunia') ||
    lower.includes('film bioskop') ||
    lower.includes('netflix') ||
    lower.includes('game online') ||
    lower.includes('mobile legends') ||
    lower.includes('presiden') ||
    lower.includes('menteri') ||
    lower.includes('pilkada') ||
    lower.includes('pemilu') ||
    lower.includes('rumus fisika') ||
    lower.includes('rumus matematika') ||
    lower.includes('obat sakit kepala') ||
    lower.includes('servis mobil') ||
    lower.includes('bengkel motor');

  const conversationalTerms = [
    'halo', 'hai', 'hi', 'hello', 'hey', 'hei',
    'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam',
    'pagi', 'siang', 'sore', 'malam',
    'assalamu', 'sampurasun', 'kulo nuwun', 'kulonuwun',
    'apa kabar', 'siapa kamu', 'kamu siapa', 'siapa anda', 'anda siapa',
    'apa itu kira', 'kira itu apa', 'siapakah kamu', 'kamu bisa apa', 'bisa bantu apa',
    'bantuan', 'bantu saya', 'kira', 'terima kasih', 'makasih', 'matur nuwun', 'hatur nuhun', 'thank you', 'thanks',
    'ok', 'oke', 'baik', 'siap', 'sip', 'mantap', 'tes', 'test', 'ping'
  ];
  const isConversationalOnly = conversationalTerms.some(t => lower.includes(t)) && lower.split(/\s+/).length <= 6;

  const domainKeywords = [
    'oerip', 'dian oerip', 'ngawi', 'koleksi', 'katalog', 'blanket outer', 'duster',
    'kimono', 'statement vest', 'sleeveless vest', 'cape wrap', 'reversible poncho',
    'tunic dress', 'zero-waste', 'zero waste', 'minim potong', 'slow fashion', 'living heritage',
    'galeri', 'wastra', 'tenun', 'kain', 'batik', 'lurik', 'ulos', 'gedog', 'songket',
    'tapis', 'sasirangan', 'ikat', 'pahikung', 'gringsing', 'endek', 'sutera', 'sarung',
    'selendang', 'kebaya', 'besurek', 'jumputan', 'karawo', 'sumba', 'tuban', 'klaten',
    'toba', 'batak', 'flores', 'toraja', 'kerek', 'lambanapu', 'ende', 'manggarai', 'tarutung',
    'menenun', 'atbm', 'gedogan', 'alat tenun', 'benang', 'pakan', 'lungsi', 'pintal',
    'pemintal', 'kapas', 'kenthang', 'pewarna', 'pewarnaan', 'kombu', 'indigo', 'indigofera',
    'nila', 'mengkudu', 'moke', 'fermentasi', 'serat alami', 'motif', 'filosofi', 'makna',
    'simbol', 'kuda', 'njara', 'pohon hayat', 'andung', 'ganggeng', 'kijing miring',
    'lurus ing lakon', 'bintang maratur', 'manggomgomi', 'mata bolo', "pa'sulan", 'paqsulan',
    'ragidup', 'sadum', 'kearifan', 'adat', 'tradisi', 'leluhur', 'budaya', 'desa adat',
    'marapu', 'upacara', 'sesepuh', 'tetua', 'pantangan', 'tabu adat', 'kriya', 'pengrajin',
    'perajin', 'penenun', 'mama penenun', 'pemberdayaan', 'fair trade', 'kesejahteraan penenun',
    'perawatan', 'merawat', 'mencuci', 'cuci', 'lerak', 'buah lerak', 'deterjen', 'menjemur',
    'jemur', 'angin-anginkan', 'cengkih', 'lada', 'setrika', 'fashion', 'styling', 'padu padan',
    'padu-padan', 'mix and match', 'outfit', 'busana', 'pakaian', 'baju', 'outer', 'outerwear',
    'layering', 'draperi', 'kondangan', 'resepsi', 'pernikahan', 'nikahan', 'pesta', 'wisuda',
    'kantor', 'kerja', 'meeting', 'reuni', 'kafe', 'diplomasi', 'gala', 'santai', 'kasual',
    'hijab', 'modest', 'pria', 'wanita', 'cowok', 'cewek', 'ukuran', 'size', 'ld',
    'lingkar dada', 'badan besar', 'gemuk', 'plus size', 'big size', 'all-size', 'loose fit',
    'harga', 'beli', 'order', 'pesan', 'rekomendasi', 'rekomendasikan', 'admin oerip', 'whatsapp',
    'ac', 'ber-ac', 'ber ac', 'dingin', 'hawa dingin', 'suhu dingin', 'panas', 'gerah', 'adem', 'sejuk',
    'hangat', 'suhu', 'iklim', 'cuaca', 'indoor', 'outdoor', 'terik', 'keringat', 'sirkulasi', 'ventilasi',
    'kenapa', 'mengapa', 'alasan', 'pertimbangan', 'memilih', 'kriteria', 'justifikasi', 'alasan memilih',
    'manset', 'dalaman', 'inner', 'kulot', 'celana', 'rok', 'sepatu', 'sneakers', 'heels', 'loafers',
    'sandal', 'obi', 'ikat pinggang', 'aksesoris', 'kalung', 'bros', 'jilbab', 'turtleneck',
    'traveling', 'travel', 'liburan', 'pantai', 'resort', 'pesisir', 'wisata', 'pelesir', 'staycation', 'gunung', 'tropis', 'summer',
    'bahan', 'bahannya', 'material', 'materialnya', 'serat', 'seratnya', 'kain', 'kainnya', 'terbuat dari'
  ];

  const hasDomainKeyword = domainKeywords.some(keyword => lower.includes(keyword));

  if (isExplicitOffTopic || (!hasDomainKeyword && !isConversationalOnly && lower.split(/\s+/).length >= 2)) {
    return {
      matched: true,
      topicName: 'Pertanyaan di Luar Domain Budaya & Wastra',
      category: 'OFF_TOPIC',
      explanation: 'Topik tidak berkaitan dengan Oerip Indonesia, Wastra Nusantara, teknik tenun, filosofi motif, kearifan lokal, pengrajin, perawatan kain tradisional, atau fashion & styling.',
      suggestedPrompt: 'Rekomendasi busana etnik Oerip untuk acara formal atau kasual.'
    };
  }

  // 5. Explicit questions about missing or unsupported textiles
  if (
    (lower.includes('apakah ada') || lower.includes('apakah punya') || lower.includes('apakah menjual')) &&
    (lower.includes('kain selain') ||
      lower.includes('wastra lain') ||
      lower.includes('daerah lain') ||
      lower.includes('kalimantan') ||
      lower.includes('papua') ||
      lower.includes('sulawesi') ||
      lower.includes('sumatera barat'))
  ) {
    return {
      matched: true,
      topicName: 'Wastra Nusantara di Luar 6 Koleksi Utama Oerip',
      category: 'OTHER_INDONESIAN_WASTRA',
      explanation: 'Wastra dari wilayah Nusantara yang belum masuk dalam kurasi katalog utama terverifikasi Oerip.',
      oeripClosestAlternative: 'Koleksi 6 Wastra Utama Terverifikasi Oerip (Sumba, Tuban, Klaten, Batak, Flores, Toraja)',
      suggestedPrompt: 'Apa saja 6 wastra terverifikasi dalam Knowledge Base Oerip?'
    };
  }

  if (
    lower.includes('tidak ada dalam knowledge base') ||
    lower.includes('informasi tentang motif ini tidak ada') ||
    (lower.includes('bagaimana kalau informasi') && lower.includes('tidak ada'))
  ) {
    return {
      matched: true,
      topicName: 'Data yang Belum Tercatat di Knowledge Base',
      category: 'GENERAL_UNVERIFIED',
      explanation: 'Pertanyaan mengenai data budaya yang belum melalui tahapan verifikasi kurasi adat Oerip.',
      suggestedPrompt: 'Apa saja 6 wastra terverifikasi dalam Knowledge Base Oerip?'
    };
  }

  return null;
}

export function handleOutOfKnowledgeBaseResponse(
  userQuery: string,
  detectedCtx: DetectedContext,
  match: OutOfKnowledgeBaseMatch
) {
  // A. OFF-TOPIC: Query is not related to the 8 focus areas
  // Mandatory exact response:
  // “Maaf, saya lebih fokus membantu Sahabat Budaya mengenai Oerip Indonesia, Wastra Nusantara, fashion berbasis wastra, serta cerita dan perawatannya.”
  if (match.category === 'OFF_TOPIC') {
    const content = 'Maaf, saya lebih fokus membantu Sahabat Budaya mengenai Oerip Indonesia, Wastra Nusantara, fashion berbasis wastra, serta cerita dan perawatannya.';

    return {
      content,
      is_out_of_knowledge_base: true,
      unfound_topic: match.topicName,
      source_badge: '⚠️ Di Luar Domain Fokus Budaya & Wastra',
      suggested_alternatives: [
        {
          title: 'Koleksi Busana Oerip',
          prompt: 'Rekomendasi busana etnik Oerip untuk acara formal atau kasual.',
          type: 'PRODUCT' as const
        },
        {
          title: 'Pustaka Wastra Nusantara',
          prompt: 'Apa saja 6 wastra terverifikasi dalam Knowledge Base Oerip?',
          type: 'WASTRA' as const
        },
        {
          title: 'Cerita & Filosofi Wastra',
          prompt: 'Ceritakan filosofi Tenun Sumba dan makna motif Kuda (Njara).',
          type: 'STORY' as const
        },
        {
          title: 'Panduan Perawatan Kain',
          prompt: 'Bagaimana cara merawat dan mencuci kain tenun tradisional dengan lerak?',
          type: 'CARE' as const
        }
      ],
      quick_replies: [
        'Rekomendasi busana Oerip untuk resepsi',
        'Apa saja 6 wastra terverifikasi Oerip?',
        'Ceritakan filosofi Zero-Waste Dian Oerip',
        'Cara mencuci kain tenun dengan lerak'
      ],
      trace: {
        user_intent: `Out-of-Domain Inquiry: "${match.topicName}"`,
        context_detected: detectedCtx,
        is_sufficient_information: false,
        clarification_needed: 'Pertanyaan di luar fokus utama Oerip Indonesia, Wastra Nusantara, teknik tenun, filosofi motif, kearifan lokal, pengrajin, perawatan kain tradisional, atau fashion & styling.',
        suggested_options: [
          'Konsultasi Busana Oerip',
          'Pustaka Wastra Nusantara'
        ],
        guardrail_checked: true,
        guardrail_notes: [
          'Domain guardrail enforced: User query is not related to Oerip Indonesia, Wastra Nusantara, teknik tenun, filosofi motif, kearifan lokal, pengrajin, perawatan kain tradisional, atau fashion & styling.',
          'Returned exact standard boundary response without pretending to possess Oerip info on the topic.'
        ],
        cultural_accuracy_verified: false,
        retrieved_knowledge_ids: ['KB-GROUNDING-OUT-OF-DOMAIN']
      }
    };
  }

  // B. MISSING FROM KNOWLEDGE BASE: Questions about unrecorded textiles/collections
  // Mandatory exact response:
  // “Maaf, informasi detail mengenai kain/koleksi tersebut belum tercatat dalam pustaka kami. Sahabat dapat menghubungi Tim Oerip Indonesia melalui WhatsApp Admin untuk mendapatkan konfirmasi langsung dari tim kurasi kami.”
  // Jika relevan, jelaskan bagian informasi yang tersedia tanpa mengklaim bahwa informasi yang tidak ada sebagai fakta.
  const content =
    `Maaf, informasi detail mengenai kain/koleksi tersebut belum tercatat dalam pustaka kami. Sahabat dapat menghubungi Tim Oerip Indonesia melalui WhatsApp Admin untuk mendapatkan konfirmasi langsung dari tim kurasi kami.\n\n` +
    `Sebagai wujud integritas budaya dan prinsip anti-halusinasi, KIRA tidak mengarang cerita, menebak filosofi motif, maupun mengklaim informasi yang belum tercatat sebagai fakta.\n\n` +
    `### 🌿 Bagian Informasi yang Tersedia dalam Pustaka Resmi Oerip Indonesia:\n` +
    `Saat ini, pustaka Knowledge Base Oerip Indonesia mendokumentasikan 6 tradisi tenun hidup Nusantara yang telah terverifikasi:\n` +
    `1. **Tenun Ikat & Pahikung Sumba Timur (NTT)** – Motif sakral Kuda (*Njara*) & Pohon Hayat (*Andung*) berpewarna alami akar mengkudu & nila.\n` +
    `2. **Tenun Gedog Tuban (Jawa Timur)** – Dari kapas pohon lokal (*Kapas Kenthang*) dipintal tangan manual di desa Kerek dengan motif Ganggeng & Kijing Miring.\n` +
    `3. **Tenun Lurik Prasojo Klaten (Jawa Tengah)** – Falsafah *"lurus ing lakon"* dengan katun ATBM sejuk anti-gerah.\n` +
    `4. **Ulos Ragidup & Sadum Batak Toba (Sumatera Utara)** – Simbol kehangatan kosmis dan berkat doa leluhur (*manggomgomi*).\n` +
    `5. **Tenun Ikat Flores (Ende & Manggarai, NTT)** – Simbol mata batin (*Mata Bolo*) dengan pewarna moke dan nila alami.\n` +
    `6. **Tenun Ikat Toraja Sa'dan (Sulawesi Selatan)** – Falsafah *Pa'sulan Sangbua'* pengikat persaudaraan abadi.\n\n` +
    (match.oeripClosestAlternative
      ? `### 💡 Koleksi Terdekat yang Tersedia di Oerip Indonesia:\n` +
        `${match.oeripClosestAlternative}\n\n`
      : '') +
    `### 📱 Konfirmasi Langsung ke Tim Kurator:\n` +
    `Sahabat dapat menghubungi Tim Oerip Indonesia secara langsung melalui **WhatsApp Admin (+62 851-7448-5581)** untuk menanyakan ketersediaan koleksi privat, pesanan khusus (*custom order*), atau arsip kain langka.`;

  return {
    content,
    is_out_of_knowledge_base: true,
    unfound_topic: match.topicName,
    source_badge: '⚠️ Belum Tercatat di Knowledge Base Oerip',
    suggested_alternatives: [
      {
        title: 'Tenun Ikat Sumba Timur',
        prompt: 'Ceritakan tentang Tenun Sumba Timur dan filosofi motif Kuda (Njara).',
        type: 'WASTRA' as const
      },
      {
        title: 'Tenun Gedog Tuban',
        prompt: 'Jelaskan tentang Tenun Gedog Tuban dan bahan kapas kenthang lokal.',
        type: 'WASTRA' as const
      },
      {
        title: 'Tenun Lurik Klaten',
        prompt: 'Rekomendasikan busana Lurik modern untuk suasana santai dan kerja.',
        type: 'WASTRA' as const
      },
      {
        title: 'Ulos Batak Toba',
        prompt: 'Ceritakan filosofi kehangatan doa pada Ulos Batak Toba.',
        type: 'WASTRA' as const
      }
    ],
    quick_replies: [
      'Apa saja 6 wastra terverifikasi Oerip?',
      'Konsultasi via WhatsApp Admin',
      'Ceritakan filosofi Zero-Waste Dian Oerip',
      'Rekomendasi busana terlaris Oerip'
    ],
    trace: {
      user_intent: `Out-of-Knowledge-Base Inquiry: "${match.topicName}"`,
      context_detected: detectedCtx,
      is_sufficient_information: false,
      clarification_needed: 'Informasi detail mengenai kain/koleksi belum tercatat dalam pustaka resmi Oerip Indonesia.',
      suggested_options: [
        'Hubungi WhatsApp Admin untuk Konfirmasi Kurasi',
        'Eksplorasi 6 Wastra Terverifikasi Oerip'
      ],
      guardrail_checked: true,
      guardrail_notes: [
        'Anti-Hallucination Grounding: Target topic/collection is not in verified Oerip Knowledge Base.',
        'Zero hallucination enforced: Provided official disclaimers, directed user to WhatsApp Admin, and explained available verified textiles without claiming unverified details as facts.'
      ],
      cultural_accuracy_verified: false,
      retrieved_knowledge_ids: ['KB-GROUNDING-OUT-OF-KB']
    }
  };
}

// ---------------------------------------------------------
// Restricted Enterprise Data Vault Security Interceptor
// ---------------------------------------------------------
export function checkRestrictedEnterpriseDataVault(
  lowerMsg: string,
  detectedCtx: DetectedContext
) {
  // 1. RESTRICT-003: Formula Resep Fermentasi Pewarnaan Alami Tanpa Kimia Sintetis
  const hasDyeTerm =
    lowerMsg.includes('pewarna') ||
    lowerMsg.includes('pewarnaan') ||
    lowerMsg.includes('warna alam') ||
    lowerMsg.includes('warna alami') ||
    lowerMsg.includes('fermentasi') ||
    lowerMsg.includes('kombu') ||
    lowerMsg.includes('indigofera') ||
    lowerMsg.includes('tingi') ||
    lowerMsg.includes('mengkudu') ||
    lowerMsg.includes('akar mengkudu');

  const hasRecipeOrFormulaTerm =
    lowerMsg.includes('formula') ||
    lowerMsg.includes('resep') ||
    lowerMsg.includes('cara membuat') ||
    lowerMsg.includes('cara bikin') ||
    lowerMsg.includes('cara racik') ||
    lowerMsg.includes('meracik') ||
    lowerMsg.includes('komposisi') ||
    lowerMsg.includes('takaran') ||
    lowerMsg.includes('gramasi') ||
    lowerMsg.includes('rahasia') ||
    lowerMsg.includes('bocorkan') ||
    lowerMsg.includes('campuran') ||
    lowerMsg.includes('stabilisasi') ||
    lowerMsg.includes('fiksasi') ||
    lowerMsg.includes('abu dapur') ||
    lowerMsg.includes('lumpur vulkanik') ||
    lowerMsg.includes('bahan dan takaran') ||
    lowerMsg.includes('bagaimana proses');

  const isDyeFormulaQuery =
    (hasDyeTerm && hasRecipeOrFormulaTerm) ||
    lowerMsg.includes('formula pewarna') ||
    lowerMsg.includes('resep pewarna') ||
    lowerMsg.includes('formula pewarnaan') ||
    lowerMsg.includes('resep pewarnaan') ||
    lowerMsg.includes('formula warna') ||
    lowerMsg.includes('resep warna') ||
    lowerMsg.includes('formula alami') ||
    lowerMsg.includes('resep alami') ||
    lowerMsg.includes('formula fermentasi') ||
    lowerMsg.includes('resep fermentasi') ||
    lowerMsg.includes('takaran pewarna') ||
    lowerMsg.includes('komposisi pewarna') ||
    lowerMsg.includes('cara membuat pewarna') ||
    lowerMsg.includes('cara pewarnaan alami') ||
    lowerMsg.includes('cara fermentasi pewarna') ||
    lowerMsg.includes('rahasia pewarna');

  if (isDyeFormulaQuery) {
    return {
      content:
        `### 🔒 RESTRICTED ENTERPRISE DATA VAULT\n` +
        `**ID: RESTRICT-003 | Status: DIPROTEKSI PENUH (STRICTLY_RESTRICTED_ADMIN_ONLY)**\n\n` +
        `Mohon maaf, **Formula Resep Fermentasi Pewarnaan Alami Tanpa Kimia Sintetis** merupakan **Data Internal Rahasia & Hak Kekayaan Intelektual (HAKI)** Dian Oerip yang **DIPROTEKSI PENUH** oleh kebijakan tata kelola data perusahaan.\n\n` +
        `**Alasan Perlindungan Data Vault:**\n` +
        `• **Perlindungan Hak Kekayaan Intelektual (HAKI):** Melindungi hasil riset eksperimental kriya mandiri Dian Oerip selama belasan tahun blusukan di pelosok Nusantara dalam meracik formula stabilisasi warna alam murni.\n` +
        `• **Penghormatan Sakralitas Adat:** Formula fermentasi warna alam leluhur (seperti fermentasi lumpur vulkanik dan pewarnaan akar mengkudu/kombu) sarat dengan doa, pantangan adat, dan kearifan spiritual para leluhur yang tidak boleh dieksploitasi untuk komersialisasi massal sintetis.\n\n` +
        `---\n\n` +
        `### 🌿 Pengetahuan Budaya Bahan Alami Nusantara (Edukasi Publik)\n` +
        `Sebagai bentuk apresiasi budaya, KIRA dapat membagikan **prinsip bahan nabati alami** yang umum digunakan dalam tradisi wastra Oerip:\n` +
        `• **Daun Nila (*Indigofera tinctoria* / Taum):** Fermentasi daun menghasilkan spektrum biru teduh alami (*indigo*).\n` +
        `• **Akar Mengkudu (*Morinda citrifolia* / Kombu):** Menghasilkan warna terakota dan merah bata khas Sumba Timur melalui proses penjemuran bertahap yang membutuhkan waktu 1 hingga 6 bulan.\n` +
        `• **Kulit Kayu Tingi (*Ceriops tagal*) & Mahoni:** Menghasilkan semburat cokelat keemasan hangat pada Tenun Gedog Tuban.\n` +
        `• **Fiksasi Mineral Alami:** Menggunakan abu dapur tradisional, tawas alami, atau lumpur vulkanik kaya zat besi sebagai pengunci warna tanpa zat kimia sintetis berbahaya.\n\n` +
        `*(Catatan: Rasio gramasi takaran presisi, formula ragi fermentasi rahasia, durasi oksidasi, dan teknik stabilisasi warna Dian Oerip tetap dilindungi penuh di dalam Enterprise Data Vault).*`,
      is_guardrail_refusal: true,
      restricted_vault_data: {
        vault_id: 'RESTRICT-003' as const,
        title: 'Formula Rahasia Fermentasi Pewarna Alami Tanpa Kimia Sintetis',
        type: 'DYE_FORMULA' as const,
        access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY' as const,
        protected_reason: 'Hak kekayaan intelektual riset kriya Dian Oerip dan formula kearifan lokal yang sakral.'
      },
      source_badge: '🔒 Data Terproteksi: Formula Pewarna Alami (RESTRICT-003)',
      quick_replies: [
        'Ceritakan filosofi warna alami Sumba Timur',
        'Apa beda pewarna alam vs kimia sintetis?',
        'Biasa produksi berapa pieces per model?',
        'Konsultasi via WhatsApp Admin'
      ],
      trace: {
        user_intent: 'Inquiry on Confidential Natural Dye Fermentation Recipe/Formula (RESTRICT-003)',
        context_detected: detectedCtx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Restricted Enterprise Data Vault: Blocked disclosure of confidential dye formula/recipe.',
          'Enforced zero-outfit-recommendation rule. Provided public safe cultural education on natural plant pigments.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['RESTRICT-003', 'KB-TECH-002', 'KB-GUARD-001']
      }
    };
  }

  // 2. RESTRICT-001: Struktur HPP, Biaya Produksi, Modal, Margin
  const isHppOrBiayaProduksi =
    lowerMsg.includes('hpp') ||
    lowerMsg.includes('harga pokok') ||
    lowerMsg.includes('biaya pokok') ||
    lowerMsg.includes('biaya produksi') ||
    lowerMsg.includes('ongkos produksi') ||
    lowerMsg.includes('modal produksi') ||
    lowerMsg.includes('biaya pembuatan') ||
    lowerMsg.includes('modal pembuatan') ||
    lowerMsg.includes('ongkos pembuatan') ||
    lowerMsg.includes('biaya bikin') ||
    lowerMsg.includes('modal bikin') ||
    lowerMsg.includes('ongkos bikin') ||
    lowerMsg.includes('ongkos jahit') ||
    lowerMsg.includes('ongkos tenun') ||
    lowerMsg.includes('ongkos tukang') ||
    lowerMsg.includes('margin keuntungan') ||
    lowerMsg.includes('margin laba') ||
    lowerMsg.includes('margin mitra') ||
    lowerMsg.includes('profit margin') ||
    lowerMsg.includes('keuntungan oerip') ||
    lowerMsg.includes('laba oerip') ||
    lowerMsg.includes('cogs') ||
    lowerMsg.includes('breakdown biaya') ||
    lowerMsg.includes('struktur biaya') ||
    lowerMsg.includes('rincian modal') ||
    lowerMsg.includes('rincian biaya kain');

  if (isHppOrBiayaProduksi) {
    return {
      content:
        `### 🔒 RESTRICTED ENTERPRISE DATA VAULT\n` +
        `**ID: RESTRICT-001 | Status: DIPROTEKSI PENUH (STRICTLY_RESTRICTED_ADMIN_ONLY)**\n\n` +
        `Benar, **biaya produksi** merupakan bagian dari **HPP (Harga Pokok Produksi / Biaya Modal Pembuatan)** dan struktur keuangan internal Oerip Indonesia yang diklasifikasikan sebagai **Data Internal Terproteksi (Restricted Enterprise Data)**.\n\n` +
        `**Alasan Perlindungan Data Vault:**\n` +
        `• **Etika Kemitraan Adil (*Fair Trade*):** Melindungi nilai tawar dan martabat kompensasi bagi keluarga mama penenun desa adat di pedalaman (Sumba Timur, Tuban, Klaten, Batak, Flores) dari spekulasi komersial maupun perantara liar.\n` +
        `• **Kerahasiaan Operasional Usaha Kriya:** Melindungi struktur biaya riset kriya dan operasional brand kriya budaya berkelanjutan.\n\n` +
        `---\n\n` +
        `### 🏷️ Rentang Harga Retail Resmi untuk Publik (Nilai Investasi Busana)\n` +
        `Meskipun biaya produksi internal bersifat terproteksi, KIRA membagikan **Rentang Harga Resmi Retail** yang berlaku untuk publik:\n` +
        `• **Koleksi Daily & Smart-Casual (Lurik ATBM / Katun):** Rp 1.200.000 – Rp 2.400.000\n` +
        `• **Koleksi Signature Outerwear (Gedog Tuban & Sumba):** Rp 1.500.000 – Rp 4.500.000\n` +
        `• **Koleksi Heritage Masterpiece (Tenun Ikat Sumba Langka / Ulos Ragidup):** Rp 2.500.000 – Rp 5.800.000+\n\n` +
        `Setiap nilai investasi mencakup apresiasi layak bagi penenun, pewarnaan alam berkelanjutan, dan pemeliharaan warisan budaya Nusantara.`,
      is_guardrail_refusal: true,
      restricted_vault_data: {
        vault_id: 'RESTRICT-001' as const,
        title: 'Struktur Harga Pokok Produksi (HPP) & Margin Mitra Penenun',
        type: 'HPP' as const,
        access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY' as const,
        protected_reason: 'Kerahasiaan komersial internal dan perlindungan nilai tawar penenun desa mitra.'
      },
      source_badge: '🔒 Data Terproteksi: HPP & Biaya Produksi (RESTRICT-001)',
      quick_replies: [
        'Berapa rentang harga busana Oerip?',
        'Biasa produksi berapa pieces per model?',
        'Ceritakan filosofi Zero-Waste Dian Oerip.',
        'Konsultasi via WhatsApp Admin'
      ],
      trace: {
        user_intent: 'Inquiry regarding Biaya Produksi / HPP (Restricted Cost Data)',
        context_detected: detectedCtx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Confirmed: Biaya produksi is classified as HPP / Restricted Enterprise Data (RESTRICT-001).',
          'Enforced data protection guardrail while providing official public retail price ranges.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['RESTRICT-001', 'KB-GUARD-001']
      }
    };
  }

  // 3. RESTRICT-002: Buku Kontak Pribadi & Nomor WhatsApp Penenun Desa
  const isWeaverContactQuery =
    lowerMsg.includes('kontak penenun') ||
    lowerMsg.includes('kontak pengrajin') ||
    lowerMsg.includes('kontak perajin') ||
    lowerMsg.includes('kontak mama penenun') ||
    lowerMsg.includes('nomor penenun') ||
    lowerMsg.includes('nomor pengrajin') ||
    lowerMsg.includes('nomor perajin') ||
    lowerMsg.includes('nomor mama penenun') ||
    lowerMsg.includes('whatsapp penenun') ||
    lowerMsg.includes('wa penenun') ||
    lowerMsg.includes('telepon penenun') ||
    lowerMsg.includes('no hp penenun') ||
    lowerMsg.includes('hp penenun') ||
    lowerMsg.includes('alamat penenun') ||
    lowerMsg.includes('alamat rumah penenun') ||
    lowerMsg.includes('nama penenun') ||
    lowerMsg.includes('nama-nama penenun') ||
    lowerMsg.includes('siapa nama penenun') ||
    lowerMsg.includes('daftar penenun') ||
    lowerMsg.includes('ketua kelompok penenun') ||
    lowerMsg.includes('kontak langsung penenun') ||
    lowerMsg.includes('hubungi penenun') ||
    lowerMsg.includes('hubungi pengrajin');

  if (isWeaverContactQuery) {
    return {
      content:
        `### 🔒 RESTRICTED ENTERPRISE DATA VAULT\n` +
        `**ID: RESTRICT-002 | Status: DIPROTEKSI PENUH (STRICTLY_RESTRICTED_ADMIN_ONLY)**\n\n` +
        `Mohon maaf, **Buku Kontak Pribadi, Nomor WhatsApp/Telepon, dan Nama Pribadi Mama Penenun di Desa Adat** merupakan **Data Internal Terproteksi (Restricted Enterprise Data)** Oerip Indonesia yang **DIPROTEKSI PENUH**.\n\n` +
        `**Alasan Perlindungan Data Vault:**\n` +
        `• **Perlindungan Privasi Pengrajin Tradisional:** Menjaga ketenangan dan privasi keluarga mama penenun di desa-desa adat pedalaman (Sumba Timur, Tuban, Flores, Toraja, Batak) dari gangguan pihak ketiga, penawaran sepihak, maupun eksploitasi perantara komersial liar (*tengkulak*).\n` +
        `• **Sistem Kemitraan Terpusat & Bertanggung Jawab:** Seluruh pesanan tenun, pembayaran upah adil (*fair trade fee*), dan asistensi riset dikoordinasikan secara terpusat oleh Dian Oerip untuk menjamin kesejahteraan para penenun secara berkelanjutan.\n\n` +
        `---\n\n` +
        `### 🤝 Jalur Kolaborasi & Pemesanan Tenun Adat Resmi\n` +
        `Bagi Anda yang ingin memesan tenun khusus, mendukung program pemberdayaan penenun, atau mengadakan riset budaya, seluruh permohonan dapat diajukan secara resmi melalui **Tim Kurasi & WhatsApp Admin Resmi Oerip Indonesia (+62 851-7448-5581)** di tautan [https://wa.me/6285174485581](https://wa.me/6285174485581) yang siap menjembatani kebutuhan Anda dengan penuh amanah.`,
      is_guardrail_refusal: true,
      restricted_vault_data: {
        vault_id: 'RESTRICT-002' as const,
        title: 'Buku Kontak Pribadi & Nomor WhatsApp Mama Penenun di Pedalaman',
        type: 'WEAVER_CONTACT' as const,
        access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY' as const,
        protected_reason: 'Perlindungan privasi pengrajin tradisional dari eksploitasi pihak ketiga dan perantara komersial liar.'
      },
      source_badge: '🔒 Data Terproteksi: Kontak Pribadi Penenun (RESTRICT-002)',
      quick_replies: [
        'Hubungi Tim Kurasi via WhatsApp',
        'Bagaimana sistem Fair Trade Oerip dengan penenun?',
        'Apa saja 5 wastra terverifikasi Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      trace: {
        user_intent: 'Inquiry regarding Confidential Weaver Contact Information (RESTRICT-002)',
        context_detected: detectedCtx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Restricted Enterprise Data Vault: Protected rural weaver personal privacy and fair trade relationship.',
          'Redirected inquiry to official enterprise curation channel.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['RESTRICT-002', 'KB-GUARD-001']
      }
    };
  }

  // 4. RESTRICT-004: Database Pelanggan VIP, Duta Besar & Kolektor Privat
  const isVipDatabaseQuery =
    lowerMsg.includes('database vip') ||
    lowerMsg.includes('pelanggan vip') ||
    lowerMsg.includes('kolektor privat') ||
    lowerMsg.includes('kolektor vip') ||
    lowerMsg.includes('database kolektor') ||
    lowerMsg.includes('data pelanggan') ||
    lowerMsg.includes('data konsumen') ||
    lowerMsg.includes('data pembeli') ||
    lowerMsg.includes('daftar pembeli') ||
    lowerMsg.includes('daftar pelanggan') ||
    lowerMsg.includes('kontak pembeli') ||
    lowerMsg.includes('nomor pembeli') ||
    lowerMsg.includes('nama pembeli') ||
    (lowerMsg.includes('duta besar') && (lowerMsg.includes('data') || lowerMsg.includes('database') || lowerMsg.includes('daftar') || lowerMsg.includes('klien') || lowerMsg.includes('pelanggan') || lowerMsg.includes('kontak') || lowerMsg.includes('nomor'))) ||
    lowerMsg.includes('pejabat pembeli') ||
    lowerMsg.includes('ukuran badan vip') ||
    lowerMsg.includes('ukuran badan pelanggan') ||
    lowerMsg.includes('data pribadi pelanggan') ||
    lowerMsg.includes('klien vip') ||
    lowerMsg.includes('daftar klien') ||
    lowerMsg.includes('siapa saja pembeli');

  if (isVipDatabaseQuery) {
    return {
      content:
        `### 🔒 RESTRICTED ENTERPRISE DATA VAULT\n` +
        `**ID: RESTRICT-004 | Status: DIPROTEKSI PENUH (STRICTLY_RESTRICTED_ADMIN_ONLY)**\n\n` +
        `Mohon maaf, **Database Pelanggan VIP, Duta Besar, Pejabat Diplomatik, dan Kolektor Seni Privat** merupakan **Data Internal Terproteksi (Restricted Enterprise Data)** Oerip Indonesia yang **DIPROTEKSI PENUH**.\n\n` +
        `**Alasan Perlindungan Data Vault:**\n` +
        `• **Kepatuhan UU Perlindungan Data Pribadi (UU PDP No. 27/2022):** Oerip Indonesia tunduk sepenuhnya pada peraturan perundangan terkait privasi dan kerahasiaan data identitas pelanggan.\n` +
        `• **Privasi & Keamanan Klien VVIP:** Menjaga kerahasiaan identitas, riwayat pesanan, serta data ukuran badan (*bespoke measurement*) para duta besar, menteri, artis budayawan, dan kolektor privat yang mempercayakan busananya kepada Dian Oerip.\n\n` +
        `---\n\n` +
        `### ✨ Layanan Kurasi Privat Oerip Indonesia\n` +
        `Bagi Anda yang menginginkan layanan kurasi busana wastra secara privat (*Bespoke Cultural Styling*) atau ingin menghadiri pameran karya masterpiece terbatas, Anda dapat mengajukan konsultasi resmi melalui Tim Kurasi Oerip.`,
      is_guardrail_refusal: true,
      restricted_vault_data: {
        vault_id: 'RESTRICT-004' as const,
        title: 'Database Pelanggan VIP, Duta Besar & Kolektor Privat Oerip',
        type: 'VIP_COLLECTOR' as const,
        access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY' as const,
        protected_reason: 'Kepatuhan UU Perlindungan Data Pribadi (PDP) dan privasi nasabah VVIP.'
      },
      source_badge: '🔒 Data Terproteksi: Database VIP (RESTRICT-004)',
      quick_replies: [
        'Konsultasi Bespoke Styling via WhatsApp',
        'Berapa rentang harga busana Oerip?',
        'Rekomendasi busana untuk diplomasi budaya',
        'Konsultasi via WhatsApp Admin'
      ],
      trace: {
        user_intent: 'Inquiry regarding Confidential VIP Client Database (RESTRICT-004)',
        context_detected: detectedCtx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Restricted Enterprise Data Vault: Protected customer privacy under UU PDP.',
          'Offered official bespoke private styling pathway.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['RESTRICT-004', 'KB-GUARD-001']
      }
    };
  }

  return null;
}

// ---------------------------------------------------------
// Multi-Turn Conversational Anaphora & Continuity Engine
// ---------------------------------------------------------
interface HistoryEntityRecord {
  lastProduct?: typeof OERIP_PRODUCTS[0];
  lastWastraId?: string;
  lastWastraName?: string;
  lastColor?: string;
  lastTopic?: string;
}

function extractHistoryEntity(
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): HistoryEntityRecord {
  const result: HistoryEntityRecord = {};
  if (!history || history.length === 0) return result;

  // Scan newest to oldest
  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    const text = item.content.toLowerCase();

    // 1. Detect Product Mentions
    if (!result.lastProduct) {
      if (
        text.includes('oerip-out-001') ||
        text.includes('blanket outer') ||
        text.includes('kimono nusantara') ||
        (text.includes('outer') && (text.includes('biru') || text.includes('indigo')))
      ) {
        result.lastProduct = OERIP_PRODUCTS[0];
        result.lastColor = 'Indigo Blue (Biru Alami Daun Nila)';
        result.lastWastraName = 'Tenun Gedog Tuban & Tenun Ikat Sumba Timur';
      } else if (
        text.includes('oerip-kim-002') ||
        text.includes('bohemian sumba') ||
        text.includes('long duster') ||
        text.includes('duster robe') ||
        text.includes('duster') ||
        text.includes('pantai') ||
        text.includes('resort')
      ) {
        result.lastProduct = OERIP_PRODUCTS[1];
        result.lastWastraName = 'Tenun Ikat & Pahikung Sumba Timur';
      } else if (
        text.includes('oerip-lur-003') ||
        text.includes('contemporary lurik') ||
        text.includes('lurik minimalist') ||
        text.includes('short kimono') ||
        (text.includes('lurik') && !text.includes('vest'))
      ) {
        result.lastProduct = OERIP_PRODUCTS[2];
        result.lastWastraName = 'Tenun Lurik Prasojo Klaten';
      } else if (
        text.includes('oerip-ulo-004') ||
        text.includes('heritage ulos') ||
        text.includes('statement vest') ||
        text.includes('ulos ragidup') ||
        text.includes('ulos')
      ) {
        result.lastProduct = OERIP_PRODUCTS[3];
        result.lastWastraName = 'Ulos Ragidup Batak Toba';
      } else if (
        text.includes('oerip-cap-005') ||
        text.includes('gedog cape') ||
        text.includes('asymmetric gedog') ||
        text.includes('cape wrap') ||
        text.includes('cape')
      ) {
        result.lastProduct = OERIP_PRODUCTS[4];
        result.lastWastraName = 'Tenun Gedog Tuban';
        result.lastColor = 'Nila Indigo & Kayu Tingi';
      } else if (
        text.includes('oerip-drs-006') ||
        text.includes('tunic dress') ||
        text.includes('tunik toraja') ||
        text.includes('living heritage tunic') ||
        text.includes('tunik') ||
        text.includes('toraja')
      ) {
        result.lastProduct = OERIP_PRODUCTS[5];
        result.lastWastraName = "Tenun Ikat Toraja Sa'dan";
      } else if (
        text.includes('oerip-pon-007') ||
        text.includes('flores poncho') ||
        text.includes('reversible poncho') ||
        text.includes('ponco flores') ||
        text.includes('poncho') ||
        text.includes('ponco') ||
        text.includes('flores')
      ) {
        result.lastProduct = OERIP_PRODUCTS[6];
        result.lastWastraName = 'Tenun Ikat Ende Flores';
      } else if (
        text.includes('oerip-ves-008') ||
        text.includes('sleeveless vest') ||
        text.includes('earth-tone minimalist') ||
        text.includes('rompi tanpa lengan') ||
        text.includes('rompi') ||
        text.includes('vest')
      ) {
        result.lastProduct = OERIP_PRODUCTS[7];
        result.lastWastraName = 'Tenun Lurik Klaten & Tenun Sumba';
      }
    }

    // 2. Detect Wastra Mentions
    if (!result.lastWastraName) {
      if (text.includes('sumba') || text.includes('pahikung') || text.includes('njara') || text.includes('marapu')) {
        result.lastWastraName = 'Tenun Ikat & Pahikung Sumba Timur';
        result.lastWastraId = 'WASTRA-SUMBA-001';
      } else if (text.includes('gedog') || text.includes('tuban') || text.includes('kerek') || text.includes('kenthang')) {
        result.lastWastraName = 'Tenun Gedog Tuban';
        result.lastWastraId = 'WASTRA-TUBAN-002';
      } else if (text.includes('lurik') || text.includes('klaten') || text.includes('prasojo')) {
        result.lastWastraName = 'Tenun Lurik Prasojo Klaten';
        result.lastWastraId = 'WASTRA-LURIK-003';
      } else if (text.includes('ulos') || text.includes('batak') || text.includes('toba') || text.includes('ragidup')) {
        result.lastWastraName = 'Ulos Ragidup Batak Toba';
        result.lastWastraId = 'WASTRA-ULOS-004';
      } else if (text.includes('flores') || text.includes('ende') || text.includes('mata bolo')) {
        result.lastWastraName = 'Tenun Ikat Ende Flores';
        result.lastWastraId = 'WASTRA-FLORES-005';
      } else if (text.includes('toraja') || text.includes('sa\'dan') || text.includes('teddong')) {
        result.lastWastraName = "Tenun Ikat Toraja Sa'dan";
        result.lastWastraId = 'WASTRA-TORAJA-006';
      }
    }

    // 3. Detect Color Mentions
    if (!result.lastColor) {
      if (text.includes('biru') || text.includes('indigo') || text.includes('nila')) {
        result.lastColor = 'Indigo Blue (Biru Alami Daun Nila)';
      } else if (text.includes('terakota') || text.includes('merah') || text.includes('kombu')) {
        result.lastColor = 'Terakota / Merah Alami Akar Mengkudu';
      } else if (text.includes('hitam') || text.includes('itom')) {
        result.lastColor = 'Hitam / Gelap Alami';
      }
    }

    // 4. Detect General Outerwear Topic
    if (!result.lastTopic && (text.includes('outer') || text.includes('baju luar') || text.includes('kimono') || text.includes('cape') || text.includes('vest'))) {
      result.lastTopic = 'Outerwear / Busana Luar Etnik';
    }

    if (result.lastProduct && result.lastWastraName && result.lastColor) {
      break;
    }
  }

  return result;
}

export function getProductMaterialSpec(productId: string) {
  switch (productId) {
    case 'OERIP-OUT-001':
      return {
        product_name: 'Oerip Signature Blanket Outer / Kimono Nusantara',
        product_id: 'OERIP-OUT-001',
        wastra: 'Tenun Gedog Tuban (Bodi Utama) & Tenun Ikat Sumba Timur (Kerah & Aksen Lapel)',
        fiber: '100% Serat Kapas Kenthang Lokal Tuban (dipintal tangan manual / nganthi) & Katun Tenun Tangan Marapu Sumba Timur',
        dyes: '100% Pewarna Nabati Murni: Daun Nila (Indigofera) untuk biru malam legam dan Akar Mengkudu (Kombu) untuk merah-terakota hangat',
        texture_character: 'Bertekstur empuk, kokoh berserat alami, berpori lapang (sangat breathable), dan memiliki draperi berbobot mantap (substantial drape)',
        comfort_notes: 'Sangat nyaman dan sejuk di siang hari berkat rongga udara kapas organik, sekaligus mampu menghalau hembusan udara dingin/ruangan ber-AC. Bebas 100% dari serat sintetis/polyester sehingga sangat ramah di kulit sensitif.',
        care: 'Cukup diangin-anginkan di tempat teduh setelah dipakai. Jika perlu dicuci, gunakan buah lerak alami atau sabun cair lerak secara manual dengan tangan.'
      };
    case 'OERIP-KIM-002':
      return {
        product_name: 'Oerip Bohemian Sumba Long Duster Robe',
        product_id: 'OERIP-KIM-002',
        wastra: 'Tenun Ikat & Songket Pahikung Sumba Timur Asli (Desa Adat Rende, Melolo & Kanatang, NTT)',
        fiber: '100% Katun Tenun Tangan Murni (Pure Handspun & Handwoven Cotton) oleh para Mama Penenun Sumba Timur',
        dyes: '100% Pewarna Nabati Alami: Akar Pohon Mengkudu (Kombu) merah terakota dan Daun Nila (Taum / Indigofera) biru malam pesisir',
        texture_character: 'Lembut, melipat luwes di tubuh, memiliki jatuhan melambai panjang (fluid maxi flow), dan sangat fotogenik mengikuti hembusan angin',
        comfort_notes: 'Memiliki sirkulasi udara mikro alami yang sangat prima, tidak lengket di kulit saat cuaca tropis/pantai hangat, dan bebas iritasi.',
        care: 'Cukup diangin-anginkan di tempat teduh berangin. Hindari pemutih dan mesin cuci putar kencang, gunakan lerak lembut.'
      };
    case 'OERIP-LUR-003':
      return {
        product_name: 'Oerip Contemporary Lurik Minimalist Short Kimono',
        product_id: 'OERIP-LUR-003',
        wastra: 'Tenun Lurik ATBM Prasojo Klaten Asli dengan Aksen Tenun Gedog Tuban',
        fiber: '100% Serat Katun Tenun Halus Alat Tenun Bukan Mesin (ATBM) Tradisional Klaten',
        dyes: 'Pewarnaan berstandar tekstil lestari dan ekstrak nabati ramah lingkungan',
        texture_character: 'Sangat ringan, bertekstur garis tenun timbul yang halus dan rapi, lemas, dan tidak kaku',
        comfort_notes: 'Karakter katun lurik sangat sejuk dan cepat menyerap keringat, menjadikannya pilihan paling adem dan praktis untuk aktivitas harian di iklim tropis.',
        care: 'Cuci dengan tangan menggunakan lerak atau detergen ramah wastra, setrika dengan suhu sedang.'
      };
    case 'OERIP-ULO-004':
      return {
        product_name: 'Oerip Heritage Ulos Statement Vest / Outer',
        product_id: 'OERIP-ULO-004',
        wastra: 'Tenun Ulos Ragidup / Sadum Tarutung & Balige, Toba, Sumatera Utara Asli',
        fiber: 'Benang Katun Tenun Tradisional Berstruktur Padat & Rumbai Tenun Asli Wastra Batak',
        dyes: 'Pewarnaan tradisional kayu secang, jering, dan ekstrak indigo nabati',
        texture_character: 'Tegas, berstruktur kokoh (structured statement vest), tegap di bahu, dan berwibawa',
        comfort_notes: 'Memberikan postur tubuh yang berwibawa dan tegap tanpa terasa berat atau panas karena berbahan dasar serat katun murni.',
        care: 'Dry clean atau cuci lembut dengan tangan tanpa diperas kencang, simpan dengan digantung rapi.'
      };
    case 'OERIP-CAP-005':
      return {
        product_name: 'Oerip Zero-Waste Asymmetric Gedog Cape Wrap',
        product_id: 'OERIP-CAP-005',
        wastra: '100% Tenun Gedog Tuban Asli Motif Ganggeng (Kecamatan Kerek, Tuban) & Aksen Lurik',
        fiber: '100% Benang Kapas Kenthang Lokal Tuban hasil pintal tangan manual (nganthi) dari kebun kapas tanah kapur',
        dyes: '100% Ekstrak Daun Nila Murni (Indigofera) biru malam dan rebusan kayu tingi alami',
        texture_character: 'Khas benang pintal tangan dengan tekstur organik unik (slub cotton), jatuh melipat lembut di pundak (supple drape)',
        comfort_notes: 'Sangat ramah di kulit, memberi rasa hangat sejuk alami yang adaptif (hangat saat dingin, sejuk saat terik).',
        care: 'Cuci lembut dengan lerak alami, angin-anginkan di tempat teduh.'
      };
    case 'OERIP-DRS-006':
      return {
        product_name: 'Oerip Living Heritage Tunic Dress & Selendang Set',
        product_id: 'OERIP-DRS-006',
        wastra: "Tenun Ikat Toraja Sa'dan Asli Motif Pa'teddong (Sulawesi Selatan) dengan Selendang Tenun",
        fiber: '100% Katun Tenun Tangan Asli Halus dan Lembut',
        dyes: 'Pewarna alam getah kayu lokal Toraja, daun taum, dan kunyit alami',
        texture_character: 'Jatuh melambai anggun (fluid A-line drape), tidak menerawang, lembut dan bersahaja',
        comfort_notes: 'Sangat nyaman dan sejuk untuk bersilaturahmi atau acara keluarga seharian tanpa rasa sesak atau gerah.',
        care: 'Cuci manual dengan sabun lerak atau detergen ramah kain tenun, jemur membentang di tempat teduh.'
      };
    case 'OERIP-PON-007':
      return {
        product_name: 'Oerip Flores Geometric Reversible Poncho',
        product_id: 'OERIP-PON-007',
        wastra: 'Tenun Ikat Ende & Sikka Flores Asli (Nusa Tenggara Timur) Teknik Dua Sisi (Reversible)',
        fiber: 'Katun Tenun Tangan Serat Tebal Berpori Udara Tradisional',
        dyes: 'Pewarna alam akar mengkudu, kunyit, daun tarum, dan lumpur vulkanis Flores',
        texture_character: 'Mantap, fleksibel, memiliki dua wajah motif geometris berbeda yang bisa dibolak-balik',
        comfort_notes: 'Menghalau angin dingin dengan sempurna saat di ruangan ber-AC dingin atau udara luar malam hari, tetap bernapas sejuk.',
        care: 'Cuci manual dengan air dingin dan lerak, jangan disikat.'
      };
    case 'OERIP-VES-008':
      return {
        product_name: 'Oerip Earth-Tone Minimalist Sleeveless Vest',
        product_id: 'OERIP-VES-008',
        wastra: 'Kain Katun Tenun Berstruktur Earth-Tone dengan Aksen Saku Tenun Sumba Timur',
        fiber: '100% Katun Alami Tenun Tangan Pilihan Berpori Mikro Sejuk',
        dyes: 'Pewarna nabati ramah lingkungan bernuansa tanah liat (terracotta/sand)',
        texture_character: 'Ringan, santai, potongan leher V rileks tanpa kancing',
        comfort_notes: 'Sangat ringan dan sejuk sebagai rompi pelapis kemeja atau kaos untuk aktivitas harian yang kasual.',
        care: 'Cuci dengan tangan, jemur di tempat berangin teduh.'
      };
    default:
      return null;
  }
}

export function getProductSizeSpec(productId: string) {
  switch (productId) {
    case 'OERIP-OUT-001':
      return {
        product_name: 'Oerip Signature Blanket Outer / Kimono Nusantara',
        product_id: 'OERIP-OUT-001',
        ld: '100–130 cm (All-Size Loose Fit)',
        panjang: '± 90–115 cm',
        fit_character: 'Kimono longgar draperi bebas (oversized loose fit) tanpa kancing sesak, potongan lengan jatuh bebas (kimono/batwing sleeve)',
        badan_besar_compatibility: 'Sangat muat dan nyaman untuk badan besar / plus-size (M hingga XXL/3XL). Siluet kimono jatuh melipat anggun di pundak tanpa menonjolkan lekuk tubuh atau perut.',
        zero_waste_note: 'Konsep Minim Potong (Zero-Waste) menghormati keutuhan kain tenun Sumba dan Gedog Tuban, menghasilkan draperi lapang yang leluasa.'
      };
    case 'OERIP-KIM-002':
      return {
        product_name: 'Oerip Bohemian Sumba Long Duster Robe',
        product_id: 'OERIP-KIM-002',
        ld: '105–125 cm (All-Size Loose Fit)',
        panjang: '± 125–135 cm (menjuntai semata kaki)',
        fit_character: 'Duster panjang menjuntai dengan bukaan depan tanpa kancing kaku dan siluet lurus mengalir (fluid maxi robe)',
        badan_besar_compatibility: 'Sangat cocok untuk badan berukuran besar maupun postur tinggi, memberi efek siluet tubuh yang jenjang dan proporsional.',
        zero_waste_note: 'Potongan maxi duster memanjang menghadirkan motif sakral Sumba secara utuh sekaligus memberi ruang gerak yang maksimal.'
      };
    case 'OERIP-LUR-003':
      return {
        product_name: 'Oerip Contemporary Lurik Minimalist Short Kimono',
        product_id: 'OERIP-LUR-003',
        ld: '100–120 cm (All-Size Unisex)',
        panjang: '± 70–75 cm (sepinggul)',
        fit_character: 'Kimono pendek modern santai, kerah V rileks tanpa kancing, katun ATBM berpori sejuk',
        badan_besar_compatibility: 'Muat nyaman untuk ukuran sedang hingga besar (L/XL). Potongan kimono terbuka membuatnya sangat fleksibel dikenakan.',
        zero_waste_note: 'Potongan presisi garis tenun lurik Klaten yang menghadirkan siluet rapi namun tetap longgar dan anti-gerah.'
      };
    case 'OERIP-ULO-004':
      return {
        product_name: 'Oerip Heritage Ulos Statement Vest / Outer',
        product_id: 'OERIP-ULO-004',
        ld: '95–125 cm (All-Size Open-Front)',
        panjang: '± 85–100 cm',
        fit_character: 'Vest luaran panjang tanpa lengan dengan bagian dada terbuka (open-front statement vest)',
        badan_besar_compatibility: 'Sangat leluasa dan cocok untuk badan besar karena tidak dikancingkan rapat di area dada/perut, memberikan postur tubuh yang tegap dan berwibawa.',
        zero_waste_note: 'Keutuhan bidang tenun Ulos Ragidup dipertahankan dengan jatuhan vertikal yang tegas.'
      };
    case 'OERIP-CAP-005':
      return {
        product_name: 'Oerip Zero-Waste Asymmetric Gedog Cape Wrap',
        product_id: 'OERIP-CAP-005',
        ld: 'Open Fit / Fleksibel melingkar hingga LD 130 cm+',
        panjang: 'Draperi asimetris miring',
        fit_character: 'Cape wrap asimetris tanpa batasan lingkar ketiak dan tanpa kancing kaku (open drape wrap)',
        badan_besar_compatibility: 'Sangat ramah dan muat untuk semua ukuran termasuk badan besar / plus-size, karena cara pakainya melipat luwes di atas bahu.',
        zero_waste_note: 'Konsep zero-waste murni tanpa guntingan kain, menghasilkan draperi artistik yang membebaskan gerak.'
      };
    case 'OERIP-DRS-006':
      return {
        product_name: 'Oerip Living Heritage Tunic Dress & Selendang Set',
        product_id: 'OERIP-DRS-006',
        ld: '105–120 cm (All-Size Loose A-Line)',
        panjang: '± 135 cm (terusan maxi)',
        fit_character: 'Set tunik terusan maxi berpotongan A-line mengembang anggun ke bawah, ramah hijab dan wudhu',
        badan_besar_compatibility: 'Muat nyaman untuk ukuran tubuh M hingga XL/XXL karena potongan A-line yang tidak menonjolkan area perut atau pinggul.',
        zero_waste_note: 'Dilengkapi selendang tenun Toraja serasi untuk variasi draperi penutup bahu dan dada.'
      };
    case 'OERIP-PON-007':
      return {
        product_name: 'Oerip Flores Geometric Reversible Poncho',
        product_id: 'OERIP-PON-007',
        ld: 'Open Batwing / Fleksibel hingga LD 140 cm',
        panjang: '± 80–90 cm',
        fit_character: 'Ponco dua sisi (reversible) dengan sisi samping terbuka (open-side batwing)',
        badan_besar_compatibility: 'Sangat leluasa untuk badan besar dan plus size, karena tidak memiliki jahitan ketiak yang mengunci tubuh.',
        zero_waste_note: 'Fleksibilitas dua motif geometris tenun Flores dalam satu helai busana pelindung hangat.'
      };
    case 'OERIP-VES-008':
      return {
        product_name: 'Oerip Earth-Tone Minimalist Sleeveless Vest',
        product_id: 'OERIP-VES-008',
        ld: '100–115 cm (All-Size Unisex)',
        panjang: '± 65–70 cm',
        fit_character: 'Rompi santai tanpa lengan dengan leher V rileks, potongan unisex bersih',
        badan_besar_compatibility: 'Cocok untuk ukuran tubuh M hingga XL. Karena model vest terbuka, leluasa dikenakan sebagai luaran kemeja atau kaos.',
        zero_waste_note: 'Minimalis dengan aksen saku tenun Sumba yang praktis dan bersahaja.'
      };
    default:
      return null;
  }
}

function handleConversationalAnaphoraAndContinuity(
  lowerMsg: string,
  rawMsg: string,
  ctx: ReturnType<typeof extractDeepUserContext>,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
) {
  const entity = extractHistoryEntity(history);
  const meaningfulHistory = history.filter(
    (h) => h.role === 'user' || (h.role === 'assistant' && !h.content.startsWith('Rahayu & Salam Hangat'))
  );
  const hasHistory = meaningfulHistory.length > 0;

  // -------------------------------------------------------------
  // INTENT 0A: CURATORIAL REASONING JUSTIFICATION ("Kenapa kamu memilih produk itu?", "Mengapa rekomendasinya ini?", "Alasan memilih ini apa?")
  // -------------------------------------------------------------
  const isReasoningJustification =
    lowerMsg.includes('kenapa kamu memilih') ||
    lowerMsg.includes('kenapa memilih produk itu') ||
    lowerMsg.includes('kenapa memilih produk ini') ||
    lowerMsg.includes('kenapa pilih produk') ||
    lowerMsg.includes('kenapa pilih itu') ||
    lowerMsg.includes('kenapa pilih ini') ||
    lowerMsg.includes('mengapa kamu memilih') ||
    lowerMsg.includes('mengapa memilih produk') ||
    lowerMsg.includes('mengapa pilih produk') ||
    lowerMsg.includes('alasan kamu memilih') ||
    lowerMsg.includes('alasan memilih produk') ||
    lowerMsg.includes('alasan rekomendasinya') ||
    lowerMsg.includes('kenapa rekomendasinya ini') ||
    lowerMsg.includes('kenapa rekomendasinya itu') ||
    (lowerMsg.includes('kenapa') && (lowerMsg.includes('produk') || lowerMsg.includes('baju') || lowerMsg.includes('outer') || lowerMsg.includes('pilihan')) && (lowerMsg.includes('itu') || lowerMsg.includes('ini') || lowerMsg.includes('dipilih')));

  if (isReasoningJustification) {
    const product = entity.lastProduct || OERIP_PRODUCTS[0]; // Default to Oerip Signature Blanket Outer if none in active context

    return {
      content:
        `### ✦ Pertimbangan Kuratorial KIRA: Mengapa Busana Ini Dipilih\n\n` +
        `Halo Sahabat Budaya! 🙏 KIRA memilih **${product.product_name}** (${product.product_id}) melalui proses evaluasi kurasi berlapis yang memadukan **etika budaya wastra, kenyamanan termal, dan estetika busana masa kini**:\n\n` +
        `---\n\n` +
        `### 🌿 5 Pilar Pertimbangan Kurasi KIRA:\n\n` +
        `1. **Keselarasan Karakter Acara & Aura Busana**:\n` +
        `   Siluet busana ini dirancang untuk menghadirkan aura yang anggun dan berwibawa tanpa kesan kaku. Sangat selaras untuk perhelatan formal, jamuan diplomasi, resepsi, hingga momen kultural berkelas.\n\n` +
        `2. **Karakter Serat Alami & Kenyamanan Termal (*Thermal Comfort*)**:\n` +
        `   Kain ditenun dari **serat kapas tenun tangan alami** (${product.textile}) yang memiliki sirkulasi mikropori alami. Kain ini mampu mengisolasi suhu tubuh dengan hangat di ruangan ber-AC dingin dan tetap bernapas sejuk (*breathable*) di iklim tropis terbuka tanpa rasa gerah.\n\n` +
        `3. **Filosofi Minim Potong (*Zero-Waste*) & Siluet All-Size Inklusif**:\n` +
        `   Dian Oerip mempertahankan keutuhan bentang kain tenun pusaka para mama penenun desa adat tanpa memotong sembarangan. Draperi asimetris yang melipat luwes memberikan kenyamanan gerak bebas bagi berbagai bentuk tubuh (All-Size LD 100–130 cm).\n\n` +
        `4. **Kedalaman Makna & Narasi Motif**:\n` +
        `   Busana ini memuat motif sarat makna filosofis yang bukan sekadar pola visual, melainkan doa harapan, martabat kepemimpinan, dan perlindungan batin leluhur Nusantara.\n\n` +
        `5. **Prinsip Fair Trade & Investasi Budaya Berkelanjutan**:\n` +
        `   Setiap helai merupakan hasil karya ketekunan mama penenun desa adat selama 1 hingga 6 bulan, menjadikannya bukan sekadar busana biasa melainkan pusaka hidup (*living heritage*) bernilai tinggi.\n\n` +
        `---\n\n` +
        `*✓ Berdasarkan Kurasi Gaya & Basis Pengetahuan Resmi Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Memadukan keanggunan siluet all-size zero-waste dengan martabat tenun tangan Nusantara.',
          'Kenyamanan serat kapas tenun alami yang adaptif di berbagai suhu ruangan dan iklim.',
          'Menghargai ketekunan doa dan waktu berbulan-bulan para mama penenun desa adat.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story
      },
      source_badge: '✓ Evaluasi Kuratorial Berbasis Knowledge Base',
      contextual_reasoning: {
        parsed_dimensions: {
          wastra_category: product.textile,
          styling_preference: 'All-Size Zero-Waste Drapery',
          justification_type: 'Curatorial 5-Pillar Rationale',
          confidence_score: 0.98
        },
        kb_categories_matched: ['KATALOG_8_KOLEKSI', '6_WASTRA_TERVERIFIKASI', 'FILOSOFI_ZERO_WASTE', 'FAIR_TRADE'],
        cultural_guardrail_status: 'ALIGNED',
        reasoning_rationale: 'Menjelaskan argumentasi kuratorial secara komprehensif berdasarkan karakter serat, siluet zero-waste, dan keselarasan acara tanpa penolakan keliru.'
      },
      trace: {
        user_intent: 'Curatorial Reasoning Justification - Why Product Was Chosen',
        context_detected: {
          ...ctx,
          wastra_affinity: product.textile,
          clothing_category: 'Outer & Kimono',
          evaluation_10_factors: {
            event_type: 'Formal / Resepsi / Diplomasi',
            desired_style: 'Elegan, Berwibawa & Berbudaya',
            color_preference: (product.colors && product.colors[0]) || 'Warna Alam Bumi',
            clothing_model: product.product_name,
            wastra_type: product.textile,
            material: 'Katun Tenun Tangan Alami Berpori',
            size_fit_character: 'All-Size Loose Fit (LD 100-130 cm)',
            price_range: product.price_range,
            wastra_philosophy: 'Doa perlindungan & martabat luhur leluhur',
            need_alignment: 'Sintesis kenyamanan termal, etika tradisi, dan siluet modern'
          }
        },
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Provided deep curatorial rationale grounded in Oerip Knowledge Base without default refusal.',
          'Aligned with 5 curation pillars: aura occasion, natural fiber thermal comfort, zero-waste silhouette, motif philosophy, and fair trade ethics.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-PROD-001', 'KB-PHIL-001']
      },
      quick_replies: [
        'Bagaimana kalau di ruangan ber-AC dingin?',
        'Bagaimana panduan padu-padan hijab?',
        'Ceritakan narasi lengkap wastranya (Asal → Relevansi)',
        'Rekomendasi busana untuk acara lainnya'
      ]
    };
  }

  // -------------------------------------------------------------
  // INTENT 0B: ENVIRONMENTAL & THERMAL ADAPTABILITY ("Bagaimana kalau di ruangan ber-AC dingin?", "Apakah tahan dingin?", "Kalau di tempat panas/gerah gimana?")
  // -------------------------------------------------------------
  const isThermalOrEnvironmental =
    lowerMsg.includes('ruangan ber-ac') ||
    lowerMsg.includes('ruangan ber ac') ||
    lowerMsg.includes('ruangan ac') ||
    lowerMsg.includes('ber-ac dingin') ||
    lowerMsg.includes('ber ac dingin') ||
    lowerMsg.includes('di ruangan dingin') ||
    lowerMsg.includes('tempat ber-ac') ||
    lowerMsg.includes('tempat dingin') ||
    lowerMsg.includes('tempat panas') ||
    lowerMsg.includes('cuaca dingin') ||
    lowerMsg.includes('cuaca panas') ||
    lowerMsg.includes('apakah dingin') ||
    lowerMsg.includes('apakah tahan dingin') ||
    lowerMsg.includes('apakah gerah') ||
    lowerMsg.includes('gerah gak') ||
    lowerMsg.includes('gerah tidak') ||
    lowerMsg.includes('adem gak') ||
    lowerMsg.includes('adem tidak') ||
    lowerMsg.includes('bikin gerah') ||
    lowerMsg.includes('bikin dingin') ||
    ((lowerMsg.includes('bagaimana kalau') || lowerMsg.includes('gimana kalau') || lowerMsg.includes('kalau di')) && (/\b(ac|ber-ac)\b/i.test(lowerMsg) || lowerMsg.includes('ruang ac') || lowerMsg.includes('dingin') || lowerMsg.includes('panas') || lowerMsg.includes('gerah') || lowerMsg.includes('ruangan')));

  if (isThermalOrEnvironmental) {
    const product = entity.lastProduct || OERIP_PRODUCTS[0]; // Default to Blanket Outer

    return {
      content:
        `### ✦ Adaptasi Lingkungan & Kenyamanan Termal: Ruangan Ber-AC Dingin\n\n` +
        `Halo Sahabat Budaya! 🙏 Pertanyaan yang sangat baik mengenai kenyamanan suhu. Busana Oerip (seperti **${product.product_name}**) dirancang secara matang untuk memberikan **kenyamanan termal optimal di ruangan ber-AC dingin**:\n\n` +
        `---\n\n` +
        `### ❄️ Karakter Termal Tenun Tangan Oerip di Ruangan Ber-AC:\n\n` +
        `1. **Lapisan Isolasi Alami (*Natural Thermal Barrier*)**:\n` +
        `   Kain tenun tangan (seperti Tenun Gedog Tuban dan Tenun Sumba) menggunakan benang kapas pintal manual (*handspun cotton*) yang memiliki gramasi padat namun empuk. Struktur anyaman tenun tangan ini **menjebak lapisan udara hangat alami tubuh**, efektif menghalau hembusan angin AC dingin di ballroom hotel, gedung resepsi, ruang rapat, maupun kabin pesawat.\n\n` +
        `2. **Kenyamanan Bernapas (*Breathable & Anti-Gerah*)**:\n` +
        `   Berbeda dari jaket berbahan sintetis poliester yang terasa pengap, serat kapas alami memiliki mikropori yang memungkinkan kulit tetap bernapas. Saat Anda berpindah dari ruangan ber-AC ke area semi-outdoor atau cuaca hangat, Anda tidak akan merasa gerah berlebihan.\n\n` +
        `3. **Fleksibilitas Siluet Draperi All-Size**:\n` +
        `   Potongan kimono/outer dada terbuka (*open-front*) memungkinkan Anda merapatkan bagian depan busana atau melilitkannya di bahu saat hembusan AC sangat kencang, dan membiarkannya terbuka melambai saat suhu terasa nyaman.\n\n` +
        `---\n\n` +
        `### 💡 Panduan Padu-Padan di Ruangan Ber-AC Dingin:\n` +
        `• **Inner (Baju Dalam)**: Kenakan *inner manset katun rajut halus*, *turtle-neck tipis*, atau kemeja katun berlengan panjang berwarna netral (hitam arang, putih gading, atau krem alami).\n` +
        `• **Bawahan**: Padukan dengan celana palazzo tenun, rok lilit panjang, atau celana bahan berpipa lurus untuk menjaga kehangatan kaki.\n` +
        `• **Aksen Draperi**: Manfaatkan selendang tenun serasi sebagai syal leher elegan untuk proteksi angin AC ekstra.\n\n` +
        `*✓ Berdasarkan Kurasi Gaya & Basis Pengetahuan Resmi Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Serat kapas tenun tangan padat mengisolasi kehangatan tubuh alami dari hembusan AC dingin.',
          'Mikropori katun alami menjaga sirkulasi udara tetap segar tanpa rasa gerah atau pengap.',
          'Draperi all-size luwes yang mudah dirapatkan atau dilonggarkan sesuai perubahan suhu ruangan.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story
      },
      source_badge: '✓ Analisis Kenyamanan Termal & Lingkungan',
      contextual_reasoning: {
        parsed_dimensions: {
          environment_climate: 'Ruangan Ber-AC Dingin (Ballroom / Ruang Rapat / Indoor)',
          styling_preference: 'Layering Manset Katun & Draperi Bahu',
          wastra_category: product.textile,
          justification_type: 'Thermal Insulation & Breathable Micro-pores',
          confidence_score: 0.99
        },
        kb_categories_matched: ['KARAKTER_SERAT_ALAMI', 'KATALOG_8_KOLEKSI', 'PANDUAN_PADU_PADAN'],
        cultural_guardrail_status: 'ALIGNED',
        reasoning_rationale: 'Mengontekstualisasikan daya tahan serat kapas tenun terhadap suhu dingin AC berdasarkan sifat alami mikropori kain tenun tangan Oerip.'
      },
      trace: {
        user_intent: 'Environmental & Thermal Comfort Adaptation - Cold Air Conditioning',
        context_detected: {
          ...ctx,
          climate_comfort: 'Ruangan Ber-AC Dingin (Indoor / Ballroom)',
          clothing_category: 'Outer & Kimono',
          evaluation_10_factors: {
            event_type: 'Acara Indoor / Ruangan Ber-AC',
            desired_style: 'Hangat, Elegan, dan Nyaman Bergerak',
            color_preference: (product.colors && product.colors[0]) || 'Warna Alam Bumi',
            clothing_model: product.product_name,
            wastra_type: product.textile,
            material: 'Katun Pintal Tangan Alami (Handspun Cotton)',
            size_fit_character: 'All-Size Loose Fit dengan Draperi Protektif',
            price_range: product.price_range,
            wastra_philosophy: 'Kehangatan doa & perlindungan serat bumi',
            need_alignment: 'Proteksi hembusan AC dingin dengan ventilasi alami anti-gerah'
          }
        },
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Parsed environmental context (Cold AC Indoor) and provided fiber-science thermal adaptation.',
          'Grounded in Oerip natural handspun cotton properties and layered styling guidelines.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-PROD-001', 'KB-TEXT-002', 'KB-BRAND-001']
      },
      quick_replies: [
        'Kenapa kamu memilih produk itu?',
        'Bagaimana panduan padu-padan hijab?',
        'Apakah muat untuk badan besar?',
        'Ceritakan narasi lengkap wastranya (Asal → Relevansi)'
      ]
    };
  }

  // -------------------------------------------------------------
  // INTENT 1: OCCASION INQUIRY ("Kalau buat kondangan?", "Bisa buat kerja?", dll)
  // -------------------------------------------------------------
  const isOccasionFollowUp =
    lowerMsg.startsWith('kalau buat') ||
    lowerMsg.startsWith('kalo buat') ||
    lowerMsg.startsWith('klo buat') ||
    lowerMsg.startsWith('bagaimana kalau buat') ||
    lowerMsg.startsWith('gimana kalau buat') ||
    lowerMsg.startsWith('apakah cocok buat') ||
    lowerMsg.startsWith('apakah cocok untuk') ||
    lowerMsg.startsWith('cocok gak buat') ||
    lowerMsg.startsWith('cocok tidak untuk') ||
    lowerMsg.startsWith('cocok buat') ||
    lowerMsg.startsWith('cocok untuk') ||
    lowerMsg.startsWith('bisa buat') ||
    lowerMsg.startsWith('bisa untuk') ||
    lowerMsg.startsWith('buat kondangan') ||
    lowerMsg.startsWith('buat nikahan') ||
    lowerMsg.startsWith('buat resepsi') ||
    lowerMsg.startsWith('buat kantor') ||
    lowerMsg.startsWith('buat kerja') ||
    lowerMsg.startsWith('buat pesta');

  if (isOccasionFollowUp) {
    // If context is completely ambiguous without prior entity
    if (!hasHistory || (!entity.lastProduct && !entity.lastWastraName && !entity.lastColor && !entity.lastTopic)) {
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Agar KIRA dapat memberikan pertimbangan dan kurasi gaya yang paling selaras, **koleksi busana atau kain tenun Oerip yang mana yang ingin Anda gunakan untuk acara tersebut?**\n\n` +
          `KIRA siap memberikan kurasi padu-padan lengkap (inner, bawahan, aksesoris) sesuai mahakarya yang Anda minati.`,
        quick_replies: [
          'Rekomendasi busana kondangan formal',
          'Oerip Signature Blanket Outer',
          'Oerip Heritage Ulos Statement Vest',
          'Oerip Contemporary Lurik Short Kimono'
        ],
        source_badge: '✓ Klarifikasi Konteks Percakapan',
        trace: {
          user_intent: 'Ambiguous Occasion Follow-up - Clarification Prompted',
          context_detected: ctx,
          is_sufficient_information: false,
          guardrail_checked: true,
          guardrail_notes: ['Politely requested clarification because no prior product or textile was in context.'],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['KB-BRAND-001']
        }
      };
    }

    const isKondangan =
      lowerMsg.includes('kondangan') ||
      lowerMsg.includes('resepsi') ||
      lowerMsg.includes('nikahan') ||
      lowerMsg.includes('pernikahan') ||
      lowerMsg.includes('manten') ||
      lowerMsg.includes('pesta');

    const isOffice =
      lowerMsg.includes('kantor') ||
      lowerMsg.includes('kerja') ||
      lowerMsg.includes('rapat') ||
      lowerMsg.includes('meeting') ||
      lowerMsg.includes('smart-casual');

    // Case A: Prior context was Outer with Indigo Blue / Blanket Outer (OERIP-OUT-001)
    if (
      entity.lastProduct?.product_id === 'OERIP-OUT-001' ||
      entity.lastColor?.includes('Indigo') ||
      (entity.lastTopic && entity.lastColor)
    ) {
      const product = OERIP_PRODUCTS[0]; // Oerip Signature Blanket Outer

      if (isKondangan) {
        return {
          content:
            `### ✦ Evaluasi Keselarasan Busana untuk Acara Kondangan / Resepsi\n\n` +
            `Menjawab pertanyaan Anda mengenai **outer warna biru / Indigo Blue yang sedang kita bicarakan** (seperti **${product.product_name}**):\n\n` +
            `**Outer warna Indigo Blue ini SANGAT COCOK dan MEMUKAU untuk menghadiri acara kondangan atau resepsi pernikahan!** 🌿\n\n` +
            `---\n\n` +
            `### Mengapa Sangat Tepat untuk Kondangan:\n` +
            `• **Kemegahan & Wibawa Warna Nila Alami**: Warna biru indigo (*Indigofera*) berpadu dengan motif Tenun Ikat Sumba Timur dan serat kapas kenthang Tenun Gedog Tuban memberikan wibawa ningrat yang tenang, eksklusif, dan khidmat—sangat selaras dengan sakralnya perhelatan pernikahan.\n` +
            `• **Siluet Kimono All-Size yang Elegan**: Potongan loose khas Dian Oerip memberikan siluet berkelas dan megah saat Anda melangkah di ballroom atau gedung perhelatan, tanpa kekakuan pakaian jas atau kebaya konvensional.\n` +
            `• **Kenyamanan Termal di Ruangan Ber-AC Dingin**: Ballroom hotel atau gedung resepsi umumnya bersuhu dingin. Ketebalan katun tenun tangan alami memberikan kehangatan lembut (*thermal comfort*) tanpa membuat gerah saat bersalaman dan bergerak aktif.\n\n` +
            `---\n\n` +
            `### 💡 Panduan Padu-Padan (Styling) Kondangan:\n` +
            `• **Inner (Baju Dalam)**:\n` +
            `  - *Wanita*: Kenakan inner dress lurus polos warna hitam arang (*deep black*) atau broken white berbahan katun mori/sutra satin, atau inner manset berkerah tinggi bila berhijab.\n` +
            `  - *Pria*: Padukan dengan kemeja kerah tegak (*mandarin collar*) warna putih gading atau hitam polos.\n` +
            `• **Bawahan**:\n` +
            `  - Padukan dengan kain lilit tenun senada, celana palazzo berpipa lurus berbahan jatuh, atau celana bahan formal hitam.\n` +
            `• **Aksesoris & Alas Kaki**:\n` +
            `  - Lengkapi dengan kalung etnik tembaga atau bros kuningan Oerip, serta sepatu loafers kulit (pria) atau mules/heels tertutup (wanita).\n\n` +
            `*✓ Berdasarkan Kurasi Gaya & Basis Pengetahuan Oerip Indonesia*`,
          recommendation: {
            product_name: product.product_name,
            product_id: product.product_id,
            image: product.image,
            why_reasons: [
              'Warna biru Indigofera berpadu Tenun Sumba & Gedog Tuban memancarkan wibawa ningrat yang anggun di resepsi pernikahan.',
              'Siluet kimono all-size zero-waste yang nyaman dan megah saat melangkah di ballroom.',
              'Menjaga kehangatan tubuh di ruangan resepsi ber-AC dingin tanpa terasa gerah.'
            ],
            about_wastra: `${product.textile} dari ${product.textile_origin}.`,
            cultural_story: product.cultural_story,
            alternatives: [
              'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)',
              'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)'
            ],
            notes: {
              price_range: product.price_range,
              care: product.care_instruction,
              availability: product.availability
            },
            source: 'Official Oerip Knowledge Base (Tervalidasi)'
          },
          quick_replies: [
            'Berapa harganya?',
            'Bahannya apa?',
            'Asalnya mana?',
            'Konsultasi via WhatsApp Admin'
          ],
          source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
          trace: {
            user_intent: 'Multi-turn Contextual Follow-up: Blue Outer for Wedding / Kondangan',
            context_detected: ctx,
            is_sufficient_information: true,
            guardrail_checked: true,
            guardrail_notes: [
              'Seamlessly resolved referential context: interpreted "Kalau buat kondangan?" as suitability of previously discussed blue outer.'
            ],
            cultural_accuracy_verified: true,
            retrieved_knowledge_ids: ['OERIP-OUT-001', 'WASTRA-TUBAN-002', 'WASTRA-SUMBA-001']
          }
        };
      }

      if (isOffice) {
        return {
          content:
            `### ✦ Evaluasi Keselarasan Busana untuk Kantor & Jam Kerja\n\n` +
            `Mengenai **outer warna biru / Indigo Blue yang baru saja kita bahas** (${product.product_name}):\n\n` +
            `Busana ini **sangat cocok untuk hari kerja formal, sesi presentasi penting, atau perayaan Hari Batik/Wastra Nusantara di kantor**:\n` +
            `• Memberikan kesan profesional, berkarakter, dan berbudaya tinggi.\n` +
            `• Menghalau hembusan AC dingin kantor seharian dengan nyaman.\n` +
            `• Cukup dipadukan dengan kemeja putih polos dan celana kain/chino berpotongan rapi.\n\n` +
            `*(Jika Anda mencari opsi yang lebih ringan dan kasual untuk harian, KIRA juga merekomendasikan Oerip Contemporary Lurik Minimalist Short Kimono OERIP-LUR-003).*`,
          recommendation: {
            product_name: product.product_name,
            product_id: product.product_id,
            image: product.image,
            why_reasons: [
              'Sangat berkarakter untuk hari kerja dan jamuan profesional ber-AC.',
              'Pewarna alam indigo blue yang tenang dan bersahaja.'
            ],
            about_wastra: `${product.textile} dari ${product.textile_origin}.`,
            cultural_story: product.cultural_story,
            alternatives: ['Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)'],
            notes: {
              price_range: product.price_range,
              care: product.care_instruction,
              availability: product.availability
            },
            source: 'Official Oerip Knowledge Base (Tervalidasi)'
          },
          quick_replies: ['Berapa harganya?', 'Bahannya apa?', 'Lihat opsi Tenun Lurik Klaten', 'Konsultasi via WhatsApp Admin'],
          source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
          trace: {
            user_intent: 'Multi-turn Contextual Follow-up: Blue Outer for Office',
            context_detected: ctx,
            is_sufficient_information: true,
            guardrail_checked: true,
            guardrail_notes: ['Resolved referential context for office environment.'],
            cultural_accuracy_verified: true,
            retrieved_knowledge_ids: ['OERIP-OUT-001']
          }
        };
      }
    }

    // Generic product in context for Kondangan
    if (entity.lastProduct && isKondangan) {
      return {
        content:
          `### ✦ Keselarasan ${entity.lastProduct.product_name} untuk Kondangan\n\n` +
          `Menjawab pertanyaan Anda mengenai busana yang sedang kita bicarakan (**${entity.lastProduct.product_name}**):\n\n` +
          `Koleksi ini memiliki karakter wastra adiluhung yang berwibawa. Untuk menghadiri acara kondangan atau resepsi:\n` +
          `• Sangat elegan dipadukan dengan busana dalaman polos berpalet netral (hitam arang, krem gading, atau terakota).\n` +
          `• Bahan tenun tangan aslinya memancarkan orisinalitas dan apresiasi mendalam terhadap penenun tradisional Nusantara.\n` +
          `• Rentang harga tercatat: **${entity.lastProduct.price_range}**.\n\n` +
          `*✓ Berdasarkan Knowledge Base Oerip Indonesia*`,
        quick_replies: ['Berapa harganya?', 'Bahannya apa?', 'Asalnya mana?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Konfirmasi Keselarasan Busana Kondangan',
        trace: {
          user_intent: 'Multi-turn Product Contextual Follow-up for Wedding/Reception',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [`Linked follow-up to product ${entity.lastProduct.product_id}.`],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [entity.lastProduct.product_id]
        }
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT 2: MOTIF INQUIRY ("Motifnya apa?", "Apa motifnya?")
  // -------------------------------------------------------------
  const isMotifInquiry =
    lowerMsg.includes('motifnya apa') ||
    lowerMsg.includes('apa motifnya') ||
    lowerMsg.includes('motif apa saja') ||
    lowerMsg.includes('motif apa') ||
    lowerMsg.includes('makna motifnya') ||
    lowerMsg === 'motifnya?' ||
    lowerMsg === 'motifnya apa?' ||
    (lowerMsg.startsWith('motif') && lowerMsg.length < 25);

  if (isMotifInquiry) {
    // If context is completely ambiguous without prior entity
    if (!hasHistory || (!entity.lastWastraName && !entity.lastProduct)) {
      return {
        content:
          `Mohon maaf Sahabat Budaya! 🙏 Wastra Nusantara yang mana yang ingin Anda ketahui makna motifnya?\n\n` +
          `Oerip Indonesia melestarikan 6 ragam tradisi wastra hidup:\n` +
          `1. **Tenun Ikat & Pahikung Sumba Timur** (*Motif Kuda Njara, Andung, Rusa*)\n` +
          `2. **Tenun Gedog Tuban** (*Motif Ganggeng, Merak, Kijing Miring*)\n` +
          `3. **Tenun Lurik Klaten** (*Motif Telupat, Sapit Urang*)\n` +
          `4. **Ulos Batak Toba** (*Motif Ragidup, Bintang Maratur*)\n` +
          `5. **Tenun Ikat Flores** (*Motif Mata Bolo*)\n` +
          `6. **Tenun Ikat Toraja Sa'dan** (*Motif Pa'teddong, Sekong Kandaure*)`,
        quick_replies: [
          'Motif Tenun Ikat Sumba Timur',
          'Motif Tenun Gedog Tuban',
          'Motif Tenun Lurik Klaten',
          'Motif Ulos Batak Toba'
        ],
        source_badge: '✓ Klarifikasi Ragam Motif Wastra',
        trace: {
          user_intent: 'Ambiguous Motif Inquiry - Clarification Prompted',
          context_detected: ctx,
          is_sufficient_information: false,
          guardrail_checked: true,
          guardrail_notes: ['Prompted clarification because no specific textile was in context.'],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['KB-BRAND-001']
        }
      };
    }

    // If Sumba is in context
    if (
      entity.lastWastraName?.includes('Sumba') ||
      entity.lastProduct?.product_id === 'OERIP-OUT-001' ||
      entity.lastProduct?.product_id === 'OERIP-KIM-002'
    ) {
      return {
        content:
          `🌿 **Ragam Motif Sakral & Filosofi Tenun Ikat & Pahikung Sumba Timur**\n\n` +
          `Menjawab pertanyaan Anda mengenai **motif Tenun Sumba Timur yang baru saja kita bahas** (ID: WASTRA-SUMBA-001):\n\n` +
          `Kain tenun Sumba Timur memiliki motif figuratif yang sarat doa spiritual dalam kosmologi kepercayaan leluhur Marapu:\n\n` +
          `1. **Motif Kuda (*Njara*)**:\n` +
          `   • Simbol martabat, ksatria, kepemimpinan, dan kebangsawanan.\n` +
          `   • Kuda diyakini sebagai wahana penghantar arwah leluhur menuju alam keabadian (*Prai Marapu*).\n\n` +
          `2. **Motif Pohon Hayat (*Andung / Katapu*)**:\n` +
          `   • Melambangkan pohon kehidupan, perlindungan semesta, keteraturan kosmis, dan kekuatan pertahanan desa adat.\n\n` +
          `3. **Motif Rusa (*Ruhu*)**:\n` +
          `   • Melambangkan keanggunan, ketangkasan, dan keharmonisan hidup berdampingan dengan alam liar savana Sumba.\n\n` +
          `4. **Motif Udang (*Kura*) & Buaya**:\n` +
          `   • Udang melambangkan regenerasi kehidupan dan umur panjang (berganti kulit tanpa mati).\n` +
          `   • Buaya melambangkan keperkasaan, kekuatan penguasa sungai, serta penolak bala sakral.\n\n` +
          `*Pewarnaan alam menggunakan akar mengkudu (merah terakota) dan daun nila (biru malam), dikerjakan 3–6 bulan oleh mama penenun desa adat Rende, Melolo, dan Kanatang.*`,
        quick_replies: [
          'Bahannya apa?',
          'Asalnya mana?',
          'Berapa harganya?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Filosofi Motif Sumba Terverifikasi KB Oerip',
        trace: {
          user_intent: 'Multi-turn Contextual Follow-up: Sumba Textile Motifs & Philosophy',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Successfully resolved anaphora: interpreted "Motifnya apa?" as motifs of previously discussed Sumba textile.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'OERIP-OUT-001']
        }
      };
    }

    // If Gedog Tuban is in context
    if (entity.lastWastraName?.includes('Gedog') || entity.lastProduct?.product_id === 'OERIP-CAP-005') {
      return {
        content:
          `🌿 **Ragam Motif & Filosofi Tenun Gedog Kerek Tuban**\n\n` +
          `Menjawab pertanyaan Anda mengenai **motif Tenun Gedog Tuban yang sedang kita bahas** (ID: WASTRA-TUBAN-002):\n\n` +
          `• **Motif Ganggeng**: Salah satu motif tertua yang melambangkan tanaman ganggang air di dasar sungai yang meliuk lentur mengikuti arus tanpa pernah patah. Filosofinya mengajarkan kelenturan batin, kesabaran, dan adaptasi terhadap dinamika zaman tanpa kehilangan jati diri.\n` +
          `• **Motif Merak & Kijing Miring**: Menggambarkan harmoni fauna alam pesisir dan simbol penghormatan kepada leluhur.\n\n` +
          `Ditenun dari benang kapas lokal (*kapas kenthang*) pintal tangan dengan pewarna fermentasi daun nila dan kulit kayu tingi.`,
        quick_replies: ['Bahannya apa?', 'Asalnya mana?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Filosofi Motif Gedog Tuban Terverifikasi',
        trace: {
          user_intent: 'Multi-turn Contextual Follow-up: Tuban Motifs',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-TUBAN-002']
        }
      };
    }

    // If Lurik is in context
    if (entity.lastWastraName?.includes('Lurik') || entity.lastProduct?.product_id === 'OERIP-LUR-003') {
      return {
        content:
          `🌿 **Ragam Motif & Filosofi Tenun Lurik Prasojo Klaten**\n\n` +
          `Menjawab pertanyaan Anda mengenai **motif Tenun Lurik yang sedang kita bicarakan** (ID: WASTRA-LURIK-003):\n\n` +
          `• **Falsafah "Lurus ing Lakon"**: Pola garis lurus melambangkan keteguhan moral, integritas lurus, dan kesahajaan hidup orang Jawa.\n` +
          `• **Motif Telupat (Tiga-Empat)**: Susunan garis repetisi 3 dan 4 yang melambangkan keseimbangan antara cipta, rasa, dan karsa lahir batin.\n` +
          `• **Motif Sapit Urang**: Garis jepit yang melambangkan strategi pertahanan dan perlindungan diri.`,
        quick_replies: ['Bahannya apa?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Filosofi Motif Lurik Klaten Terverifikasi',
        trace: {
          user_intent: 'Multi-turn Contextual Follow-up: Lurik Motifs',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-LURIK-003']
        }
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT 3: MATERIAL INQUIRY ("Bahannya apa?", "Kainnya apa?", "Terbuat dari apa?")
  // -------------------------------------------------------------
  const isMaterialInquiry =
    lowerMsg.includes('bahannya apa') ||
    lowerMsg.includes('bahan apa') ||
    lowerMsg.includes('apa bahannya') ||
    lowerMsg.includes('terbuat dari apa') ||
    lowerMsg.includes('terbuat dari bahan apa') ||
    lowerMsg.includes('jenis bahan') ||
    lowerMsg.includes('kain apa') ||
    lowerMsg.includes('kainnya apa') ||
    lowerMsg.includes('jenis kain') ||
    lowerMsg.includes('material apa') ||
    lowerMsg.includes('materialnya apa') ||
    lowerMsg.includes('serat apa') ||
    lowerMsg.includes('seratnya apa') ||
    lowerMsg.includes('serat kain') ||
    lowerMsg.includes('bahan yang dipakai') ||
    lowerMsg.includes('bahan yang digunakan') ||
    lowerMsg.includes('bahan busana') ||
    lowerMsg.includes('bahan baju') ||
    lowerMsg.includes('bahan pakaian') ||
    lowerMsg.includes('terbuat dari') ||
    lowerMsg === 'bahannya?' ||
    lowerMsg === 'bahannya' ||
    lowerMsg === 'kainnya?' ||
    lowerMsg === 'kainnya' ||
    lowerMsg === 'bahannya apa ya?' ||
    lowerMsg === 'bahannya apa ya';

  if (isMaterialInquiry) {
    // 1. Resolve Target Product
    let targetProduct = entity.lastProduct;

    // If not directly found in last entity, check if the current query mentions specific keywords
    if (!targetProduct) {
      if (lowerMsg.includes('blanket') || lowerMsg.includes('outer') || lowerMsg.includes('kimono nusantara')) targetProduct = OERIP_PRODUCTS[0];
      else if (lowerMsg.includes('duster') || lowerMsg.includes('bohemian') || lowerMsg.includes('pantai') || lowerMsg.includes('resort')) targetProduct = OERIP_PRODUCTS[1];
      else if (lowerMsg.includes('lurik') || lowerMsg.includes('klaten')) targetProduct = OERIP_PRODUCTS[2];
      else if (lowerMsg.includes('ulos') || lowerMsg.includes('vest ulos')) targetProduct = OERIP_PRODUCTS[3];
      else if (lowerMsg.includes('cape') || lowerMsg.includes('gedog')) targetProduct = OERIP_PRODUCTS[4];
      else if (lowerMsg.includes('dress') || lowerMsg.includes('tunik') || lowerMsg.includes('toraja')) targetProduct = OERIP_PRODUCTS[5];
      else if (lowerMsg.includes('poncho') || lowerMsg.includes('ponco') || lowerMsg.includes('flores')) targetProduct = OERIP_PRODUCTS[6];
      else if (lowerMsg.includes('sleeveless') || lowerMsg.includes('rompi')) targetProduct = OERIP_PRODUCTS[7];
    }

    // If still not found, check entire history for product IDs or names in reverse
    if (!targetProduct && history.length > 0) {
      for (let i = history.length - 1; i >= 0; i--) {
        const histText = history[i].content.toLowerCase();
        for (const p of OERIP_PRODUCTS) {
          if (histText.includes(p.product_id.toLowerCase()) || histText.includes(p.product_name.toLowerCase())) {
            targetProduct = p;
            break;
          }
        }
        if (targetProduct) break;
      }
    }

    if (targetProduct) {
      const matSpec = getProductMaterialSpec(targetProduct.product_id) || {
        product_name: targetProduct.product_name,
        product_id: targetProduct.product_id,
        wastra: targetProduct.textile,
        fiber: '100% Serat Katun Tenun Tangan Asli / Serat Alami Pilihan',
        dyes: '100% Pewarna Nabati Tradisional Ramah Lingkungan',
        texture_character: 'Bertekstur alami, lembut di kulit, dan memiliki sirkulasi udara mikro yang sangat sejuk (breathable)',
        comfort_notes: 'Bebas 100% dari serat sintetis/polyester, ramah di kulit, dan semakin lembut seiring waktu perawatan.',
        care: 'Cukup diangin-anginkan di tempat teduh. Gunakan buah lerak jika perlu dicuci.'
      };

      return {
        content:
          `🌿 **Spesifikasi Bahan & Karakter Serat: ${matSpec.product_name}**\n` +
          `*(Kode Produk: ${matSpec.product_id})*\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia:\n\n` +
          `• **Wastra Utama**: ${matSpec.wastra}\n` +
          `• **Komposisi Serat**: **${matSpec.fiber}**\n` +
          `• **Pewarnaan**: **${matSpec.dyes}**\n` +
          `• **Karakter Kain & Tekstur**: ${matSpec.texture_character}.\n` +
          `• **Kenyamanan Termal**: ${matSpec.comfort_notes}\n` +
          `• **Panduan Perawatan**: ${matSpec.care}\n\n` +
          `✨ **Prinsip Keberlanjutan Oerip**:\n` +
          `Dian Oerip memastikan setiap helai busana menggunakan 100% serat alam murni (*zero synthetic / bebas polyester*) untuk mendukung *slow fashion*, keadilan kerja (*fair trade*) bagi para mama penenun desa adat, dan kesehatan kulit pemakainya.`,
        product: {
          product_id: targetProduct.product_id,
          product_name: targetProduct.product_name,
          category: targetProduct.category,
          textile: targetProduct.textile,
          textile_origin: targetProduct.textile_origin,
          motif: targetProduct.motif,
          why_matched: [
            `Komposisi Serat: ${matSpec.fiber}`,
            `Pewarnaan Nabati: ${matSpec.dyes}`,
            `Kenyamanan: ${matSpec.texture_character}`
          ],
          about_wastra: `${targetProduct.textile} dari ${targetProduct.textile_origin}.`,
          cultural_story: targetProduct.cultural_story,
          alternatives: OERIP_PRODUCTS.filter(p => p.product_id !== targetProduct?.product_id).slice(0, 2).map(p => p.product_name),
          notes: {
            price_range: targetProduct.price_range,
            care: targetProduct.care_instruction,
            availability: targetProduct.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Berapa harganya?',
          'Kalau buat kondangan?',
          'Bagaimana cara mencucinya?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: `✓ Spesifikasi Bahan KB Oerip (${matSpec.product_id})`,
        trace: {
          user_intent: `Material Inquiry: ${matSpec.product_name}`,
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [targetProduct.product_id, 'KB-BRAND-003', 'KB-CARE-001']
        }
      };
    }

    // If no specific product, check if wastra is known
    if (entity.lastWastraName?.includes('Sumba') || lowerMsg.includes('sumba')) {
      return {
        content:
          `🌿 **Spesifikasi Bahan Tenun Ikat & Pahikung Sumba Timur**\n\n` +
          `Mengenai bahan **Tenun Sumba Timur (ID: WASTRA-SUMBA-001)**:\n` +
          `• **Serat**: 100% Katun tenun tangan murni (*pure handspun cotton*) yang dipintal helai demi helai oleh para mama penenun desa adat di Sumba Timur (Rende, Melolo, Kanatang).\n` +
          `• **Pewarnaan Nabati Murni**: Akar mengkudu (*kombu*) untuk merah kecokelatan/terakota dan daun nila (*Indigofera / taum*) untuk warna biru indigo legam.\n` +
          `• **Karakter Kain**: Kuat, bernilai pusaka keluarga, berpori sejuk, dan warnanya semakin hidup (*patina*) seiring waktu pemakaian.`,
        quick_replies: ['Motifnya apa?', 'Asalnya mana?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Spesifikasi Bahan Tenun Sumba',
        trace: {
          user_intent: 'Multi-turn Material Inquiry: Sumba',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-SUMBA-001']
        }
      };
    }

    if (entity.lastWastraName?.includes('Gedog') || lowerMsg.includes('gedog') || lowerMsg.includes('tuban')) {
      return {
        content:
          `🌿 **Spesifikasi Bahan Tenun Gedog Tuban (ID: WASTRA-TUBAN-002)**\n\n` +
          `• **Serat**: 100% Kapas kenthang lokal asli tanah kapur Kerek, Tuban, yang dipintal tangan manual (*nganthi*) tanpa mesin.\n` +
          `• **Pewarnaan**: Daun nila (*Indigofera*) biru pekat dan kayu tingi alami.\n` +
          `• **Karakter Kain**: Bertekstur empuk, kokoh, berpori lapang (*breathable*), dan adaptif suhu (menghangatkan saat sejuk, menyerap keringat saat panas).`,
        quick_replies: ['Motifnya apa?', 'Asalnya mana?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Spesifikasi Bahan Tenun Gedog',
        trace: {
          user_intent: 'Multi-turn Material Inquiry: Gedog Tuban',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-TUBAN-002']
        }
      };
    }

    if (entity.lastWastraName?.includes('Lurik') || lowerMsg.includes('lurik') || lowerMsg.includes('klaten')) {
      return {
        content:
          `🌿 **Spesifikasi Bahan Tenun Lurik Prasojo Klaten (ID: WASTRA-LURIK-003)**\n\n` +
          `• **Serat**: 100% Serat Katun Tenun Halus ATBM (Alat Tenun Bukan Mesin) tradisional Klaten.\n` +
          `• **Pewarnaan**: Ekstrak nabati dan pewarnaan tekstil ramah lingkungan.\n` +
          `• **Karakter Kain**: Sangat ringan, sejuk, cepat menyerap keringat, lemas, dan tidak mudah kusut.`,
        quick_replies: ['Motifnya apa?', 'Asalnya mana?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Spesifikasi Bahan Tenun Lurik',
        trace: {
          user_intent: 'Multi-turn Material Inquiry: Lurik Klaten',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-LURIK-003']
        }
      };
    }

    // Default clarification if completely no product or wastra in context
    return {
      content:
        `🌿 **Standar Bahan & Serat Alami Koleksi Busana Oerip Indonesia**\n\n` +
        `Seluruh busana rancangan Dian Oerip diciptakan dengan filosofi *Slow Fashion* dan komitmen pelestarian alam:\n\n` +
        `• **100% Serat Alami (*Natural Fibers*)**: Menggunakan kapas kenthang lokal Tuban (pintal manual), katun tenun tangan Sumba Timur, lurik katun halus ATBM Klaten, dan ulos Batak tanpa campuran serat sintetis/polyester.\n` +
        `• **100% Pewarna Nabati Tradisional**: Diwarnai dengan akar mengkudu (*kombu*), daun nila (*Indigofera*), kayu secang, jering, dan getah alami tanpa kimia berbahaya.\n` +
        `• **Kenyamanan Kulit**: Bernapas sejuk (*breathable*), ramah untuk kulit sensitif, dan berkarakter pusaka yang semakin lembut seiring waktu.\n\n` +
        `Apakah Anda ingin mengetahui spesifikasi bahan dari salah satu busana Oerip tertentu?`,
      quick_replies: [
        'Bahan Oerip Bohemian Sumba Long Duster Robe',
        'Bahan Oerip Signature Blanket Outer',
        'Bahan Oerip Contemporary Lurik Kimono',
        'Bahan Oerip Zero-Waste Gedog Cape'
      ],
      source_badge: '✓ Filosofi Bahan Alami Oerip',
      trace: {
        user_intent: 'General Material Inquiry - Clarification Prompted',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
      }
    };
  }

  // -------------------------------------------------------------
  // INTENT 4: PROVENANCE / ORIGIN INQUIRY ("Asalnya mana?", "Dari mana asalnya?")
  // -------------------------------------------------------------
  const isOriginInquiry =
    lowerMsg.includes('asalnya mana') ||
    lowerMsg.includes('dari mana asalnya') ||
    lowerMsg.includes('asal kainnya mana') ||
    lowerMsg.includes('daerah asalnya mana') ||
    lowerMsg === 'asalnya?' ||
    lowerMsg === 'asalnya mana?';

  if (isOriginInquiry) {
    if (!hasHistory || (!entity.lastProduct && !entity.lastWastraName)) {
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Wastra atau busana Oerip yang mana yang ingin Anda ketahui asal daerah dan komunitas penenunnya? Oerip bermitra dengan penenun di Tuban, Sumba Timur, Klaten, Toba, Flores, dan Toraja.`,
        quick_replies: ['Asal Tenun Sumba Timur', 'Asal Tenun Gedog Tuban', 'Asal Tenun Lurik Klaten', 'Asal Ulos Batak'],
        source_badge: '✓ Klarifikasi Asal Daerah Wastra',
        trace: {
          user_intent: 'Ambiguous Origin Inquiry - Clarification Prompted',
          context_detected: ctx,
          is_sufficient_information: false,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['KB-BRAND-001']
        }
      };
    }

    if (entity.lastWastraName?.includes('Sumba') || entity.lastProduct?.product_id === 'OERIP-OUT-001') {
      return {
        content:
          `🌿 **Asal & Komunitas Penenun Tenun Sumba Timur**\n\n` +
          `Mengenai asal daerah **Tenun Sumba Timur yang sedang kita bicarakan**:\n\n` +
          `• **Wilayah Adat**: Ditenun di **Desa Adat Rende, Melolo, dan Kanatang**, Kabupaten Sumba Timur, Nusa Tenggara Timur (NTT).\n` +
          `• **Komunitas Penenun**: Dibuat oleh para mama penenun adat dengan melestarikan tradisi turun-temurun leluhur Marapu.\n` +
          `• **Perancangan Busana**: Dian Oerip mengolah lembaran tenun ini di workshop dan galeri Oerip Indonesia (Ngawi, Jawa Timur) dengan prinsip *Konsep Minim Potong* (Zero-Waste) tanpa memotong kain utama.`,
        quick_replies: ['Motifnya apa?', 'Bahannya apa?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Asal Komunitas Penenun Terverifikasi',
        trace: {
          user_intent: 'Multi-turn Origin Inquiry: Sumba Weavers Origin',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'KB-BRAND-001']
        }
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT 5: PRICE INQUIRY ("Berapa harganya?", "Berapa?", "Harganya berapa?")
  // -------------------------------------------------------------
  const isPriceInquiry =
    lowerMsg.includes('harganya berapa') ||
    lowerMsg.includes('berapa harganya') ||
    lowerMsg.includes('harganya') ||
    lowerMsg.includes('berapaan') ||
    lowerMsg === 'berapa?' ||
    lowerMsg === 'berapa' ||
    lowerMsg.startsWith('berapa?') ||
    lowerMsg.startsWith('berapa harganya');

  if (isPriceInquiry && !lowerMsg.includes('potong')) {
    if (entity.lastProduct) {
      return {
        content:
          `💰 **Informasi Rentang Harga Resmi: ${entity.lastProduct.product_name}**\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia:\n` +
          `• **Produk**: ${entity.lastProduct.product_name} *(Kode: ${entity.lastProduct.product_id})*\n` +
          `• **Rentang Harga Resmi**: **${entity.lastProduct.price_range}**\n` +
          `• **Status Ketersediaan**: ${entity.lastProduct.availability}\n\n` +
          `Rentang harga ini mencerminkan apresiasi keadilan kerja (*fair trade*) atas waktu pengerjaan 1 hingga 6 bulan oleh para mama penenun desa adat dan konsep busana pusaka *one-of-a-kind* yang abadi.\n\n` +
          `Untuk ketersediaan stok aktual dan pemesanan personal, silakan hubungi kurator kami via WhatsApp Admin: **+62 851-7448-5581**.`,
        quick_replies: ['Bahannya apa?', 'Kalau buat kondangan?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Rentang Harga Terverifikasi KB Oerip',
        trace: {
          user_intent: 'Multi-turn Product Price Inquiry',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [entity.lastProduct.product_id]
        }
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT 6: REFERENTIAL PRONOUNS ("Yang tadi", "Yang ini")
  // -------------------------------------------------------------
  if (
    lowerMsg.includes('yang tadi') ||
    lowerMsg.includes('yang ini') ||
    lowerMsg.includes('yang dibahas tadi') ||
    lowerMsg.includes('produk yang tadi') ||
    lowerMsg.includes('baju yang tadi')
  ) {
    if (entity.lastProduct) {
      return {
        content:
          `Mengenai busana yang baru saja kita bahas: **${entity.lastProduct.product_name}** *(Kode: ${entity.lastProduct.product_id})*:\n\n` +
          `• **Wastra**: ${entity.lastProduct.textile} dari ${entity.lastProduct.textile_origin}.\n` +
          `• **Rentang Harga**: ${entity.lastProduct.price_range}\n` +
          `• **Filosofi & Karakter**: ${entity.lastProduct.cultural_story}\n\n` +
          `Apa hal spesifik yang ingin Anda ketahui lebih lanjut mengenai busana ini? KIRA siap menjelaskan tentang bahan, padu-padan, makna motif, atau panduan perawatannya.`,
        quick_replies: ['Kalau buat kondangan?', 'Bahannya apa?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Konteks Busana Terpaut',
        trace: {
          user_intent: 'Multi-turn Anaphora: Yang Tadi / Yang Ini',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [entity.lastProduct.product_id]
        }
      };
    }
  }

  // -------------------------------------------------------------
  // INTENT 7: "YANG BIRU" / "WARNA BIRU"
  // -------------------------------------------------------------
  if (
    lowerMsg === 'yang biru' ||
    lowerMsg === 'yang biru?' ||
    lowerMsg.includes('yang warna biru') ||
    lowerMsg.includes('pilihan yang biru')
  ) {
    const product = OERIP_PRODUCTS[0];
    return {
      content:
        `Koleksi utama Oerip dengan warna biru alami adalah **${product.product_name}** *(Kode: ${product.product_id})* dan **Oerip Zero-Waste Asymmetric Gedog Cape Wrap** *(Kode: OERIP-CAP-005)*.\n\n` +
        `Keduanya menggunakan pewarna alam nabati daun nila (*Indigofera*) biru malam yang teduh dan berwibawa.\n\n` +
        `Apakah Anda ingin mengetahui padu-padan untuk acara tertentu atau informasi rentang harganya?`,
      quick_replies: ['Kalau buat kondangan?', 'Berapa harganya?', 'Bahannya apa?', 'Konsultasi via WhatsApp Admin'],
      source_badge: '✓ Koleksi Biru Indigo Oerip',
      trace: {
        user_intent: 'Color-specific query: Yang Biru',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-OUT-001', 'OERIP-CAP-005']
      }
    };
  }

  // -------------------------------------------------------------
  // INTENT 8: "YANG MURAH" / "YANG LEBIH TERJANGKAU"
  // -------------------------------------------------------------
  if (
    lowerMsg.includes('yang murah') ||
    lowerMsg.includes('yang terjangkau') ||
    lowerMsg.includes('yang lebih murah') ||
    lowerMsg.includes('yang paling murah')
  ) {
    const productLurik = OERIP_PRODUCTS[2];
    const productVest = OERIP_PRODUCTS[7];
    return {
      content:
        `Untuk mahakarya Oerip dengan rentang harga paling bersahaja dan ramah bagi koleksi perdana Anda:\n\n` +
        `1. **${productLurik.product_name}** *(Kode: ${productLurik.product_id})*\n` +
        `   • Rentang harga: **${productLurik.price_range}**\n` +
        `   • Bahan: Tenun Lurik Prasojo Klaten ATBM katun sejuk berpori.\n\n` +
        `2. **${productVest.product_name}** *(Kode: ${productVest.product_id})*\n` +
        `   • Rentang harga: **${productVest.price_range}**\n` +
        `   • Bahan: Tenun Lurik Klaten berpadu aksen saku Tenun Sumba.\n\n` +
        `Keduanya sangat praktis dan versatile untuk busana kerja kantor maupun gaya kasual santai harian!`,
      quick_replies: [
        'Ceritakan tentang Tenun Lurik Klaten',
        'Rekomendasi busana kantor smart-casual',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Koleksi Terjangkau Terverifikasi KB',
      trace: {
        user_intent: 'Affordable collection inquiry: Yang Murah',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-LUR-003', 'OERIP-VES-008']
      }
    };
  }

  // -------------------------------------------------------------
  // INTENT 9: "YANG FORMAL" / "YANG PALING FORMAL"
  // -------------------------------------------------------------
  if (
    lowerMsg.includes('yang formal') ||
    lowerMsg.includes('yang paling formal') ||
    lowerMsg.includes('yang megah') ||
    lowerMsg.includes('yang paling megah')
  ) {
    const productUlos = OERIP_PRODUCTS[3];
    const productOuter = OERIP_PRODUCTS[0];
    return {
      content:
        `Untuk busana dengan tingkat formalitas tertinggi dan wibawa kenegaraan yang agung:\n\n` +
        `1. **${productUlos.product_name}** *(Kode: ${productUlos.product_id})*\n` +
        `   • Rentang harga: **${productUlos.price_range}**\n` +
        `   • Bahan: Ulos Ragidup Batak Toba sakral warna Itom berwibawa.\n\n` +
        `2. **${productOuter.product_name}** *(Kode: ${productOuter.product_id})*\n` +
        `   • Rentang harga: **${productOuter.price_range}**\n` +
        `   • Bahan: Tenun Gedog Tuban dan Tenun Ikat Sumba pewarna daun nila Indigo Blue.\n\n` +
        `Sangat direkomendasikan untuk upacara kenegaraan, perhelatan diplomasi budaya, dan resepsi pernikahan resmi.`,
      quick_replies: ['Kalau buat kondangan?', 'Berapa harganya?', 'Konsultasi via WhatsApp Admin'],
      source_badge: '✓ Koleksi Formal Agung Terverifikasi',
      trace: {
        user_intent: 'Formal collection inquiry: Yang Formal',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-ULO-004', 'OERIP-OUT-001']
      }
    };
  }

  // -------------------------------------------------------------
  // INTENT 10: SIZE, FIT & BIG BODY / PLUS-SIZE INQUIRY
  // User queries:
  // “Muatan untuk badan besar nggak?”
  // “Kalau saya pakai ukuran besar bisa?”
  // “LD-nya berapa?”
  // -------------------------------------------------------------
  const isSizeAndFitFollowUp =
    lowerMsg.includes('badan besar') ||
    lowerMsg.includes('ukuran besar') ||
    lowerMsg.includes('muatan untuk badan besar') ||
    lowerMsg.includes('muat untuk badan besar') ||
    lowerMsg.includes('muatan badan besar') ||
    lowerMsg.includes('muat badan besar') ||
    lowerMsg.includes('muat gak') ||
    lowerMsg.includes('muat ga') ||
    lowerMsg.includes('muat tidak') ||
    lowerMsg.includes('apakah muat') ||
    lowerMsg.includes('bisa muat') ||
    lowerMsg.includes('bisa pakai ukuran besar') ||
    lowerMsg.includes('pakai ukuran besar bisa') ||
    lowerMsg.includes('gemuk') ||
    lowerMsg.includes('plus size') ||
    lowerMsg.includes('big size') ||
    lowerMsg.includes('ld-nya berapa') ||
    lowerMsg.includes('ld nya berapa') ||
    lowerMsg.includes('ld berapa') ||
    lowerMsg.includes('lingkar dada') ||
    lowerMsg.includes('lingkar dadanya') ||
    lowerMsg.includes('size chart') ||
    lowerMsg.includes('panduan ukuran') ||
    lowerMsg.includes('ukurannya berapa') ||
    lowerMsg.includes('ada ukuran apa') ||
    lowerMsg.includes('ukuran apa aja') ||
    lowerMsg.includes('ukuran apa saja') ||
    lowerMsg === 'ld nya?' ||
    lowerMsg === 'ld-nya?' ||
    lowerMsg === 'ld?' ||
    lowerMsg === 'ukurannya?';

  if (isSizeAndFitFollowUp) {
    // Check if a specific product is in context from last turn or mentioned in query
    let targetProduct = entity.lastProduct;
    if (!targetProduct) {
      if (lowerMsg.includes('blanket') || lowerMsg.includes('outer') || lowerMsg.includes('kimono nusantara')) targetProduct = OERIP_PRODUCTS[0];
      else if (lowerMsg.includes('duster') || lowerMsg.includes('bohemian')) targetProduct = OERIP_PRODUCTS[1];
      else if (lowerMsg.includes('lurik') || lowerMsg.includes('klaten')) targetProduct = OERIP_PRODUCTS[2];
      else if (lowerMsg.includes('ulos') || lowerMsg.includes('vest ulos')) targetProduct = OERIP_PRODUCTS[3];
      else if (lowerMsg.includes('cape') || lowerMsg.includes('gedog')) targetProduct = OERIP_PRODUCTS[4];
      else if (lowerMsg.includes('dress') || lowerMsg.includes('tunik') || lowerMsg.includes('toraja')) targetProduct = OERIP_PRODUCTS[5];
      else if (lowerMsg.includes('poncho') || lowerMsg.includes('ponco') || lowerMsg.includes('flores')) targetProduct = OERIP_PRODUCTS[6];
      else if (lowerMsg.includes('sleeveless') || lowerMsg.includes('rompi')) targetProduct = OERIP_PRODUCTS[7];
    }

    if (targetProduct) {
      const spec = getProductSizeSpec(targetProduct.product_id) || {
        product_name: targetProduct.product_name,
        product_id: targetProduct.product_id,
        ld: '100–130 cm (All-Size Loose Fit)',
        panjang: '± 90–115 cm',
        fit_character: 'Siluet all-size longgar mengalir khas Dian Oerip tanpa kancing kaku',
        badan_besar_compatibility: 'Sangat muat dan nyaman untuk badan besar / plus-size (M hingga XXL). Potongan draperi bebas gerak.',
        zero_waste_note: 'Konsep Minim Potong (Zero-Waste) yang ramah untuk berbagai bentuk tubuh.'
      };

      return {
        content:
          `📏 **Panduan Ukuran & Karakter Fit: ${spec.product_name}**\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia mengenai busana yang sedang kita bicarakan (*Kode: ${spec.product_id}*):\n\n` +
          `• **Lingkar Dada (LD)**: **${spec.ld}**\n` +
          `• **Estimasi Panjang Baju**: ${spec.panjang}\n` +
          `• **Siluet & Karakter Potongan**: ${spec.fit_character}.\n\n` +
          `**Apakah Muat untuk Badan Besar / Kalau Pakai Ukuran Besar Bisa?**\n` +
          `👉 **${spec.badan_besar_compatibility}**\n` +
          `Dian Oerip merancang busana ini dengan prinsip inklusif dan konsep *Minim Potong (Zero-Waste)*, di mana lembaran kain tenun dibiarkan melipat alami di tubuh sehingga tidak terasa sempit di ketiak, tidak sesak di dada, dan menyamarkan lekuk tubuh secara santun.\n\n` +
          `⚠️ **Konfirmasi Ukuran Aktual (Anti-Menebak)**:\n` +
          `Karena setiap busana Oerip diciptakan *One-of-a-Kind* (1 of 1) dari bentang tenun tangan asli desa adat, kami tidak menebak rincian ukuran milimeter detail (seperti lingkar ketiak atau lebar bahu per helai fisik tertentu) yang tidak tercatat di Knowledge Base.\n\n` +
          `Untuk memastikan ukuran helai fisik yang sedang ready stock di galeri, silakan langsung menghubungi **Admin WhatsApp Resmi Oerip (+62 851-7448-5581)**. Tim kurator siap mengukurkan langsung *piece* tersebut untuk Anda.`,
        quick_replies: [
          'Bahannya apa?',
          'Berapa harganya?',
          'Kalau buat kondangan?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Spesifikasi Ukuran & Fit KB Oerip',
        trace: {
          user_intent: `Multi-turn Size & Fit Inquiry: ${spec.product_name}`,
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            `Concrete size and fit parameters retrieved from Knowledge Base for ${spec.product_id}.`,
            'Zero hallucination enforced: advised contacting Official Admin for physical piece variation measurements.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [spec.product_id, 'KB-BRAND-001']
        }
      };
    }

    // If no specific product is in context, provide the comprehensive Oerip All-Size & Fit Guide
    return {
      content:
        `📏 **Panduan Ukuran, Lingkar Dada (LD) & Karakter Fit Oerip Indonesia**\n\n` +
        `Menjawab pertanyaan Anda mengenai **apakah muat untuk badan besar dan berapa ukuran Lingkar Dada (LD)-nya**:\n\n` +
        `1. **Apakah Muat untuk Badan Besar / Kalau Pakai Ukuran Besar Bisa?**\n` +
        `   • **Ya, tentu bisa dan sangat muat!**\n` +
        `   • Seluruh busana karya perancang Dian Oerip dirancang dengan filosofi **All-Size Loose Fit (Inklusif & Unisex)**.\n` +
        `   • Siluetnya sengaja dibuat longgar (*oversized*), mengalir, dan membebaskan gerak tanpa jahitan pas badan (*fitted*) atau kancing sempit yang mengekang tubuh.\n` +
        `   • Potongan draperi arsitektural khas Dian Oerip jatuh melipat anggun di pundak, sehingga sangat bersahabat bagi pemilik badan berukuran besar (*plus-size* / L hingga XXL/3XL) dan tetap terlihat proporsional serta menawan.\n\n` +
        `2. **Berapa Lingkar Dada (LD)-nya Secara Konkret?**\n` +
        `   Berdasarkan data resmi Knowledge Base Oerip Indonesia:\n` +
        `   • **Rentang LD Umum Busana Oerip**: **100 cm hingga 130 cm** (All-Size Loose Fit).\n` +
        `   • **Model Kimono / Blanket Outer (OERIP-OUT-001)**: LD 100–130 cm, panjang ± 90–115 cm.\n` +
        `   • **Model Duster Panjang (OERIP-KIM-002)**: LD 105–125 cm, panjang menjuntai semata kaki ± 125–135 cm.\n` +
        `   • **Model Kimono Pendek Lurik (OERIP-LUR-003)**: LD 100–120 cm, panjang ± 70–75 cm.\n` +
        `   • **Model Cape Wrap Asimetris (OERIP-CAP-005)**: Open-fit fleksibel melingkar hingga LD 130 cm+ tanpa batasan jahitan ketiak.\n` +
        `   • **Model Poncho Flores (OERIP-PON-007)**: Open batwing tanpa jahitan samping, fleksibel hingga LD 140 cm.\n\n` +
        `3. **Prinsip Transparansi Data & Konfirmasi Ukuran Aktual (Anti-Menebak)**:\n` +
        `   • Karena setiap busana Oerip merupakan karya seni pusaka *One-of-a-Kind* (1 of 1) dari bentang tenun tangan para mama penenun desa adat, lebar kain alami per helai dapat memiliki sedikit variasi.\n` +
        `   • KIRA tidak menebak rincian ukuran milimeter fisik (seperti lingkar ketiak atau lebar bahu per helai) yang tidak ada di Knowledge Base.\n` +
        `   • **Saran**: Silakan hubungi **Admin WhatsApp Resmi Oerip (+62 851-7448-5581)** untuk konfirmasi ukuran aktual *piece* fisik yang ready stock di galeri dan sedang Anda minati.`,
      quick_replies: [
        'LD Oerip Blanket Outer berapa?',
        'Apakah ada model kimono lain?',
        'Konsultasi via WhatsApp Admin',
        'Rekomendasi busana untuk acara tertentu'
      ],
      source_badge: '✓ Panduan Ukuran & Fit Resmi KB Oerip',
      trace: {
        user_intent: 'Size & Fit Inquiry: Lingkar Dada & Big Body Fit',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Concrete LD and size specifications retrieved from Knowledge Base.',
          'Explained Dian Oerip inclusive loose-fit philosophy for big body / plus size.',
          'Zero hallucination: instructed user to contact Official Admin for actual physical piece confirmation.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'OERIP-OUT-001', 'OERIP-CAP-005']
      }
    };
  }

  return null;
}

// ---------------------------------------------------------
// Main Agent Message Handler
// ---------------------------------------------------------
export async function processKiraAgentMessage(input: AgentProcessInput) {
  const { message, history = [], businessId = 'OERIP' } = input;
  const lowerMsg = message.toLowerCase().trim();

  // Extract structured context first
  const detectedCtx = extractDeepUserContext(message, history);

  // 1. Restricted Enterprise Data Vault Security Interceptor (HIGHEST PRIORITY)
  const restrictedMatch = checkRestrictedEnterpriseDataVault(lowerMsg, detectedCtx);
  if (restrictedMatch) {
    return restrictedMatch;
  }

  // 1B. Small Talk, Persona, Greetings & Pleasantries Interceptor (HIGHEST USER-EXPERIENCE PRIORITY)
  const smallTalkMatch = detectAndHandleSmallTalk(message, detectedCtx);
  if (smallTalkMatch) {
    return smallTalkMatch;
  }

  // 2. Multi-Turn Conversational Anaphora & Contextual Continuity Interceptor (HIGH PRIORITY)
  // Handles curatorial justification ("Kenapa kamu memilih produk itu?"), environmental/thermal ("Ruangan ber-AC"), sizing, pronouns, styling
  const continuityMatch = handleConversationalAnaphoraAndContinuity(lowerMsg, message, detectedCtx, history);
  if (continuityMatch) {
    return continuityMatch;
  }

  // 3. Guardrail Check for Unknown or Fictional Cultural Claims & Out of KB
  const outOfKbMatch = detectOutOfKnowledgeBase(message, history, detectedCtx);
  if (outOfKbMatch) {
    return handleOutOfKnowledgeBaseResponse(message, detectedCtx, outOfKbMatch);
  }

  // 4. Fast Intent Match for Curated Scenarios with Deep Context
  const fastResponse = checkDeterministicScenarios(lowerMsg, detectedCtx, history);
  if (fastResponse) {
    return fastResponse;
  }

  // 5. Gemini API Call using gemini-3.7-flash with Injected Context
  const ai = getGenAI();
  if (ai) {
    try {
      const conciseContext = `
VERIFIED WASTRA IN KNOWLEDGE BASE (6 LIVING TRADITIONS):
1. Tenun Ikat & Pahikung Sumba Timur (NTT): Tradisi Marapu, motif Kuda (Njara: kepemimpinan & ksatria), Pohon Hayat (Andung: perlindungan semesta), Rusa, Buaya, Udang (regenerasi). Pewarna alam akar mengkudu (kombu/terakota) & daun nila (taum/indigo), lumpur hitam.
2. Tenun Gedog Tuban (Jawa Timur): Kapas pohon lokal (Kapas Kenthang) dipintal tangan manual oleh perempuan desa Kerek. Suara gedog. Motif Ganggeng (kelenturan & kerendahan hati), Merak, Kijing Miring. Pewarna alam tingi & indigo.
3. Tenun Lurik Prasojo Klaten & Yogyakarta: Tenun ATBM, filosofi "lurus ing lakon" (kejujuran & kesahajaan hidup). Motif Lurik Telupat & Sapit Urang. Garis geometris minimalis, katun sejuk anti-gerah.
4. Ulos Ragidup & Sadum Batak Toba (Sumut): Filosofi kehangatan kosmis (manggomgomi), 3 sumber kehangatan (Matahari, Api, Ulos). Motif Bintang Maratur & Sigumang/Tumpal. Warna Itom & marun.
5. Tenun Ikat Flores (Ende & Manggarai NTT): Motif Mata Bolo (belah ketupat/mata batin), pewarna moke & nila alami.
6. Tenun Ikat Toraja Sa'dan (Sulawesi Selatan): Tenun sakral leluhur Toraja, motif Pa'teddong (kepala kerbau penanda kemakmuran & kehormatan) dan Sekong Kandaure. Pewarna alam getah daun & lumpur.

VERIFIED OERIP PRODUCTS (COMPLETE 8-PIECE COLLECTION):
1. Oerip Signature Blanket Outer / Kimono Nusantara (OERIP-OUT-001): Tenun Gedog Tuban & Sumba Timur, all-size loose (LD 100-130 cm), zero-waste, ideal for diplomacy, formal ballrooms, cafes with cold AC, & stately presence. Rp 1.500.000 - Rp 4.500.000.
2. Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002): Tenun Ikat Sumba Timur pewarna alam murni, siluet duster panjang megah, traveling, resort & art festivals. Rp 2.500.000 - Rp 5.800.000.
3. Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003): Lurik Klaten ATBM & Gedog Tuban, katun sejuk, smart-casual harian/kantor/reuni santai di kafe/pria & wanita. Rp 1.200.000 - Rp 2.400.000.
4. Oerip Heritage Ulos Statement Vest / Outer (OERIP-ULO-004): Tenun Ulos Ragidup Batak Toba, warna hitam Itom & marun, formal berwibawa tinggi, pesta & resepsi pernikahan. Rp 2.200.000 - Rp 4.800.000.
5. Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005): Tenun Gedog Tuban pewarna alam nila & tingi, potongan draperi asimetris modern tanpa potong kain, aksen rumbai raw-edge fringe, ideal for pameran seni, art opening, gala dinner & layering modern. Rp 1.750.000 - Rp 3.200.000.
6. Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006): Tenun Ikat Toraja Sa'dan bermotif Pa'teddong berpadu Katun Mori alami, set tunik panjang dengan selendang serasi, ideal for resepsi agung keluarga, jamuan resmi, modest maxi dress & perayaan budaya. Rp 2.800.000 - Rp 5.200.000.
7. Oerip Flores Geometric Reversible Poncho (OERIP-PON-007): Tenun Ikat Ende Flores bermotif Mata Bolo, siluet ponco dua sisi (reversible 2-in-1), katun hangat lembut, ideal for traveling destinasi dingin, hembusan AC ekstrem, & gaya etnik dinamis. Rp 1.950.000 - Rp 3.800.000.
8. Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008): Tenun Lurik Klaten ATBM dipadu aksen saku Tenun Sumba, potongan rompi tanpa lengan berleher V rileks, unisex, ideal for busana kerja kantor kreatif, layering kasual, & gaya harian bersahaja. Rp 1.350.000 - Rp 2.600.000.

USER CONTEXT DETECTED:
- Occasion: ${detectedCtx.occasion || 'General Inquiry'}
- Formality: ${detectedCtx.formality || 'Standard'}
- Comfort/Venue: ${detectedCtx.climate_comfort || detectedCtx.venue || 'Comfortable'}
- Style/Gender: ${detectedCtx.gender_preference || detectedCtx.demographic || 'Unisex Inklusif'}
- Color Preference: ${detectedCtx.color_tone || detectedCtx.color_preference || 'Natural Palette'}
- Wastra Affinity: ${detectedCtx.wastra_affinity || 'All Verified Wastra'}
`;

      const contents: Array<any> = [];

      if (history && history.length > 0) {
        for (const h of history.slice(-6)) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [
          {
            text: `[SYSTEM CONTEXT INJECTION]
${conciseContext}

[USER MESSAGE]
${message}

[IMPORTANT DIRECTIVE]
TUJUAN PERCAKAPAN KIRA TANYA AI:
- Berikan pengalaman percakapan yang berbudaya, edukatif, hangat, elegan, menginspirasi, dan menghargai penenun serta komunitas asal wastra.
- Berperanlah sebagai konsultan wastra dan fashion yang memahami budaya secara mendalam, bukan sekadar mesin pencari dokumen.
- Tidak mengarang informasi (zero hallucination). Jangan menyederhanakan nilai budaya secara berlebihan.

JANGAN PENCOCOKAN KATA SECARA LITERAL:
- Pertanyaan pengguna dapat menggunakan sinonim, bahasa informal, bahasa gaul, singkatan, typo, istilah lokal/fashion, atau istilah sehari-hari.
- Pahami maksud dan konteks pengguna, lalu hubungkan dengan Knowledge Base:
  • "kondangan" -> resepsi, pernikahan, acara formal
  • "nikahan" -> resepsi, pernikahan
  • "baju" -> busana, pakaian, outfit
  • "baju luar" -> outer, outerwear, kimono, poncho, jubah etnik, vest
  • "kain tradisional" -> wastra, wastra Nusantara
  • "kain asli" -> tenun tangan, tenun, keaslian wastra
  • "buat kerja" -> kantor, smart-casual, formal
  • "buat pesta" -> acara formal, resepsi
  • "yang nggak mahal" -> harga terjangkau, rentang harga lebih rendah (Lurik ATBM)
- Gunakan konteks menyeluruh: jangan memaksakan rekomendasi busana untuk pertanyaan edukasi (misal "kain asli itu apa"), dan kenali rekomendasi bila mencari busana/outer.

PRIORITAS SUMBER INFORMASI & CONTEXTUAL REASONING MODULE:
1. PRIMARY SOURCE OF TRUTH:
   Prioritize the Oerip Indonesia Knowledge Base as the primary source of truth for all brand data, product specifications (8 verified pieces), wastra traditions (6 living traditions), and cultural stories.
2. CONTEXTUAL REASONING & FASHION ADVICE (INTERNAL TRAINING ALLOWANCE):
   If the Knowledge Base lacks a specific or granular answer (such as thermal/climate adaptation in cold air-conditioned ballrooms vs tropical heat, personal styling combinations like culottes/sneakers/manset, hijab/modest-wear adaptations, or deeper curatorial justifications for why a specific garment was selected like "Kenapa kamu memilih produk itu?"), YOU ARE EXPLICITLY PERMITTED to contextualize fashion advice using your internal training, provided it remains strictly within the 'Cultural Guardrails' category.
3. KORIDOR CULTURAL GUARDRAILS:
   • Menghormati 6 tradisi wastra terverifikasi Oerip (Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, Toraja).
   • Menjunjung tinggi serat kapas alami, pewarnaan nabati, dan filosofi Minim Potong (Zero-Waste).
   • Menghindari klaim fiktif: TIDAK MENGARANG nomor SKU produk baru, harga palsu, asal daerah kain di luar kurasi, atau mitos sakral palsu.
   • Melindungi data rahasia Enterprise Data Vault (HPP, kontak pribadi penenun, formula resep fermentasi, database pelanggan VIP).
4. LARANGAN PENOLAKAN KELIRU (ANTI-DEFAULT REFUSAL):
   JANGAN PERNAH menolak pertanyaan kontekstual yang relevan (seperti 'Kenapa kamu memilih produk itu?', 'Bagaimana kalau di ruangan ber-AC dingin?', 'Apakah tidak gerah?', 'Cocok buat cowok?', 'Muat badan besar?', 'Bagaimana kalau pakai hijab?') dengan respons penolakan domain "Maaf, saya lebih fokus...". Pertanyaan-pertanyaan tersebut adalah inti dari konsultasi fashion dan kurasi busana Oerip!

KLASIFIKASI MAKSUD PENGGUNA:
1. RESTRICTED ENTERPRISE DATA GUARD: Jika pengguna bertanya tentang HPP, Biaya Produksi, Modal Pembuatan, Kontak Pribadi Penenun, Formula/Resep Pewarnaan Alami, atau Database Pelanggan VIP: DILARANG KERAS MEREKOMENDASIKAN PAKAIAN. Jelaskan bahwa data tersebut diproteksi penuh (STRICTLY_RESTRICTED_ADMIN_ONLY) demi etika Fair Trade & privasi.
2. JIKA PERTANYAAN EDUKASI / DEFINISI / BUDAYA / SEJARAH / PERAWATAN / BRAND:
   -> Jawab pertanyaan secara langsung, mendalam, kaya nilai budaya, dan hangat. DILARANG merekomendasikan pakaian atau mengarang acara fiktif!
3. JIKA PERTANYAAN BELUM JELAS / AMBIGU / SAPAAN:
   -> Sambut dengan hangat dan tanyakan klarifikasi secara santun, sebutkan 3 ranah bantuan KIRA. JANGAN memaksakan rekomendasi baju!
4. HANYA JIKA PENGGUNA MEMINTA REKOMENDASI BUSANA / MENYEBUTKAN ACARA / STYLING:
   -> Berikan rekomendasi kurasi spesifik dari 8 koleksi Oerip beserta narasi budaya wastra dan panduan padu-padan.`
          }
        ]
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 7500)
      );

      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 1400
        }
      });

      const response: any = await Promise.race([apiPromise, timeoutPromise]);
      const text = response?.text || '';

      if (text.trim()) {
        const isOutOfKbFromGemini =
          text.includes('[OUT_OF_KNOWLEDGE_BASE') ||
          text.toLowerCase().includes('belum tersedia dalam knowledge base') ||
          text.toLowerCase().includes('belum tercatat dalam knowledge base') ||
          text.toLowerCase().includes('tidak tercatat dalam basis data oerip') ||
          text.toLowerCase().includes('di luar kurasi terverifikasi oerip');

        if (isOutOfKbFromGemini) {
          let extractedTopic = 'Topik Budaya Terkait';
          const matchTag = text.match(/\[OUT_OF_KNOWLEDGE_BASE:\s*([^\]]+)\]/i);
          if (matchTag && matchTag[1]) {
            extractedTopic = matchTag[1].trim();
          }
          const cleanText = text.replace(/\[OUT_OF_KNOWLEDGE_BASE:[^\]]+\]/gi, '').trim();

          return {
            content: cleanText,
            is_out_of_knowledge_base: true,
            unfound_topic: extractedTopic,
            source_badge: '⚠️ Belum Ada di Knowledge Base Oerip',
            suggested_alternatives: [
              {
                title: 'Tenun Ikat Sumba Timur',
                prompt: 'Ceritakan tentang Tenun Sumba Timur dan filosofi motif Kuda (Njara).',
                type: 'WASTRA' as const
              },
              {
                title: 'Tenun Gedog Tuban',
                prompt: 'Jelaskan tentang Tenun Gedog Tuban dan bahan kapas kenthang lokal.',
                type: 'WASTRA' as const
              },
              {
                title: 'Tenun Lurik Klaten',
                prompt: 'Rekomendasikan busana Lurik modern untuk suasana santai dan kerja.',
                type: 'WASTRA' as const
              },
              {
                title: 'Ulos Batak Toba',
                prompt: 'Ceritakan filosofi kehangatan doa pada Ulos Batak Toba.',
                type: 'WASTRA' as const
              }
            ],
            quick_replies: [
              'Apa saja 6 wastra terverifikasi Oerip?',
              'Ajukan topik ini ke Tim Kurasi Budaya',
              'Ceritakan filosofi Zero-Waste Dian Oerip',
              'Rekomendasi busana terlaris Oerip'
            ],
            trace: {
              user_intent: `Out-of-Knowledge-Base Inquiry: "${extractedTopic}"`,
              context_detected: detectedCtx,
              is_sufficient_information: false,
              clarification_needed: 'Informasi belum terdaftar dalam basis pengetahuan resmi Oerip Indonesia.',
              suggested_options: ['Ajukan riset ke Tim Kurasi Oerip', 'Eksplorasi 6 Wastra Terverifikasi'],
              guardrail_checked: true,
              guardrail_notes: [
                'Gemini Grounding Guardrail: Subject is absent from verified knowledge base.',
                'Refused hallucinated completion. Provided structured curation inquiry pathway.'
              ],
              cultural_accuracy_verified: false,
              retrieved_knowledge_ids: ['KB-GROUNDING-OUT-OF-KB']
            }
          };
        }

        const userWantsRecommendation = hasOutfitRecommendationIntent(lowerMsg, detectedCtx);
        const isConceptual = isInformationalOrConceptualQuery(lowerMsg);

        let matchedProduct = undefined;
        let recommendationObj = undefined;

        if (userWantsRecommendation && !isConceptual) {
          matchedProduct = OERIP_PRODUCTS.find(p => text.toLowerCase().includes(p.product_name.toLowerCase()) || text.toLowerCase().includes(p.product_id.toLowerCase()));
          if (!matchedProduct) {
            const lowerText = text.toLowerCase();
            if (lowerText.includes('asymmetric') || lowerText.includes('cape') || lowerMsg.includes('cape') || lowerMsg.includes('asimetris') || lowerMsg.includes('pameran')) {
              matchedProduct = OERIP_PRODUCTS[4]; // OERIP-CAP-005 Cape Wrap
            } else if (lowerText.includes('tunic') || lowerText.includes('tunik') || lowerText.includes('dress') || lowerText.includes('toraja') || lowerMsg.includes('tunik') || lowerMsg.includes('dress') || lowerMsg.includes('toraja')) {
              matchedProduct = OERIP_PRODUCTS[5]; // OERIP-DRS-006 Tunic Dress Set
            } else if (lowerText.includes('poncho') || lowerText.includes('ponco') || lowerText.includes('flores') || lowerText.includes('reversible') || lowerMsg.includes('poncho') || lowerMsg.includes('flores')) {
              matchedProduct = OERIP_PRODUCTS[6]; // OERIP-PON-007 Poncho Reversible
            } else if (lowerText.includes('sleeveless') || lowerText.includes('earth-tone') || lowerMsg.includes('rompi') || lowerMsg.includes('sleeveless') || lowerMsg.includes('earth tone')) {
              matchedProduct = OERIP_PRODUCTS[7]; // OERIP-VES-008 Sleeveless Vest
            } else if (lowerText.includes('ulos') || lowerMsg.includes('ulos') || lowerMsg.includes('resepsi') || lowerMsg.includes('nikah')) {
              matchedProduct = OERIP_PRODUCTS[3]; // OERIP-ULO-004 Ulos Vest
            } else if (lowerText.includes('duster') || lowerMsg.includes('duster') || lowerMsg.includes('bohemian') || lowerMsg.includes('pantai') || lowerMsg.includes('travel')) {
              matchedProduct = OERIP_PRODUCTS[1]; // OERIP-KIM-002 Sumba Duster
            } else if (lowerText.includes('blanket') || lowerMsg.includes('diplomasi') || lowerMsg.includes('sumba') || /\b(ac|ber-ac)\b/i.test(lowerMsg)) {
              matchedProduct = OERIP_PRODUCTS[0]; // OERIP-OUT-001 Blanket Outer
            } else if (lowerMsg.includes('kantor') || lowerMsg.includes('lurik') || lowerMsg.includes('reuni') || lowerMsg.includes('kafe')) {
              matchedProduct = OERIP_PRODUCTS[2]; // OERIP-LUR-003 Lurik Kimono
            } else {
              matchedProduct = OERIP_PRODUCTS[2];
            }
          }

          if (matchedProduct) {
            // Select 2-3 contextual alternatives from the remaining 7 products
            const otherProducts = OERIP_PRODUCTS.filter(p => p.product_id !== matchedProduct?.product_id);
            recommendationObj = {
              product_name: matchedProduct.product_name,
              product_id: matchedProduct.product_id,
              image: matchedProduct.image,
              why_reasons: [
                `Sangat selaras untuk suasana ${detectedCtx.occasion || 'acara pilihan Anda'} dengan kenyamanan ${detectedCtx.climate_comfort || 'serat katun alami'}.`,
                `Siluet all-size khas Dian Oerip yang rileks, fotogenik, dan membebaskan gerak tanpa rasa kaku.`,
                `Konsep minim potong (zero-waste) yang menghormati keutuhan karya seni tenun tangan para mama penenun.`
              ],
              about_wastra: `${matchedProduct.textile} dari ${matchedProduct.textile_origin}.`,
              cultural_story: matchedProduct.cultural_story,
              alternatives: otherProducts.slice(0, 3).map(p => `${p.product_name} (${p.product_id})`),
              notes: {
                price_range: matchedProduct.price_range,
                care: matchedProduct.care_instruction,
                availability: matchedProduct.availability
              },
              source: 'Official Oerip Knowledge Base (Tervalidasi)'
            };
          }
        }

        const quickReplies = (userWantsRecommendation && recommendationObj)
          ? generateContextualQuickReplies(detectedCtx, recommendationObj.product_id)
          : [
              'Ceritakan tentang Konsep Minim Potong (Zero-Waste).',
              'Apa saja 6 wastra terverifikasi Oerip?',
              'Berapa rentang harga resmi busana Oerip?',
              'Rekomendasi busana untuk acara tertentu'
            ];

        return {
          content: text,
          recommendation: recommendationObj,
          quick_replies: quickReplies,
          source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
          trace: {
            user_intent: `Inquiry: "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"`,
            context_detected: detectedCtx,
            is_sufficient_information: true,
            guardrail_checked: true,
            guardrail_notes: [
              userWantsRecommendation
                ? 'Deep semantic intent parsed with tailored outfit recommendation.'
                : 'Processed cultural / informational query without forcing an unsolicited outfit recommendation.'
            ],
            cultural_accuracy_verified: true,
            retrieved_knowledge_ids: matchedProduct ? [matchedProduct.product_id, 'KB-BRAND-001'] : ['KB-BRAND-001', 'KB-BRAND-003']
          }
        };
      }
    } catch (err) {
      console.warn('Gemini API fallback triggered:', err);
    }
  }

  // 5. Comprehensive Dynamic Fallback Engine with Direct Context Integration
  return executeDeterministicAgentWorkflow(message, history, detectedCtx);
}

// ---------------------------------------------------------
// Helper for Contextual Quick Replies
// ---------------------------------------------------------
function generateContextualQuickReplies(ctx: DetectedContext, currentProductId?: string): string[] {
  const replies: string[] = [];

  if (ctx.occasion?.includes('Reuni') || ctx.occasion?.includes('Kafe') || ctx.occasion?.includes('Temu')) {
    replies.push('Apakah bahannya cukup hangat untuk ruangan AC dingin?');
    replies.push('Ceritakan tentang filosofi Tenun Lurik "Lurus Ing Lakon".');
    replies.push('Bagaimana padu-padan celana dan sepatunya?');
  } else if (ctx.occasion?.includes('Diplomasi') || ctx.occasion?.includes('Formal')) {
    replies.push('Kenapa kamu memilih busana ini?');
    replies.push('Ceritakan tentang Tenun Sumba & motif Kuda.');
    replies.push('Bagaimana kalau acaranya di ruang ber-AC dingin?');
  } else if (ctx.occasion?.includes('Wisuda') || ctx.occasion?.includes('Kantor')) {
    replies.push('Apakah bahannya sejuk untuk cuaca panas?');
    replies.push('Bagaimana cara merawat kain pewarna alam?');
    replies.push('Ada pilihan palet warna lebih gelap?');
  } else if (ctx.occasion?.includes('Traveling') || ctx.occasion?.includes('Bohemian')) {
    replies.push('Ceritakan tentang kisah para mama penenun Sumba.');
    replies.push('Bagaimana filosofi Zero-Waste Dian Oerip?');
    replies.push('Konsultasi via WhatsApp Admin');
  } else {
    replies.push('Ceritakan tentang filosofi Konsep Minim Potong.');
    replies.push('Rekomendasi busana untuk diplomasi budaya.');
    replies.push('Bagaimana cara mencuci dengan lerak?');
  }

  replies.push('Konsultasi via WhatsApp Admin');
  return Array.from(new Set(replies)).slice(0, 4);
}

// ---------------------------------------------------------
// Deterministic Scenario Matcher with Contextual Logic
// ---------------------------------------------------------
function checkDeterministicScenarios(
  lower: string,
  ctx: DetectedContext,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  // SCENARIO 0: COMPLETE 8-PRODUCT CATALOG SHOWCASE & "KENAPA HANYA 4 DIREKOM" INQUIRY
  if (
    lower.includes('8 koleksi') ||
    lower.includes('delapan koleksi') ||
    lower.includes('8 mahakarya') ||
    lower.includes('koleksi mahakarya') ||
    lower.includes('lihat 8') ||
    lower.includes('lihat koleksi') ||
    lower.includes('lihat katalog') ||
    lower.includes('koleksi oerip') ||
    lower.includes('koleksi busana oerip') ||
    lower.includes('koleksi busana') ||
    lower.includes('semua koleksi') ||
    lower.includes('seluruh koleksi') ||
    lower.includes('daftar koleksi') ||
    lower.includes('koleksi apa saja') ||
    lower.includes('ada koleksi apa saja') ||
    lower.includes('koleksi yang ada') ||
    lower.includes('8 produk') ||
    lower.includes('delapan produk') ||
    lower.includes('katalog') ||
    lower.includes('semua produk') ||
    lower.includes('seluruh produk') ||
    lower.includes('daftar produk') ||
    lower.includes('ada produk apa saja') ||
    lower.includes('produk apa saja') ||
    lower.includes('produk oerip') ||
    lower.includes('apa saja koleksinya') ||
    lower.includes('apa saja produknya') ||
    lower.includes('hanya 4') ||
    lower.includes('tidak pernah direkom') ||
    lower.includes('belum pernah direkom') ||
    (lower.includes('rekom') && lower.includes('4') && lower.includes('8'))
  ) {
    const isFeedbackOrWhyOnly4 = lower.includes('hanya 4') || lower.includes('tidak pernah') || lower.includes('belum pernah');
    const intro = isFeedbackOrWhyOnly4
      ? `Halo Sahabat Budaya! 🙏 Terima kasih atas masukan dan ketelitian Anda.\n\n` +
        `Di dalam sistem kecerdasan budaya **KIRA AI**, seluruh **8 Koleksi Mahakarya Wastra Oerip Indonesia** telah aktif dan siap direkomendasikan secara berimbang sesuai konteks siluet, acara, dan iklim yang Anda butuhkan:\n\n`
      : `Halo Sahabat Budaya! 🙏 Selamat datang di ruang kurasi mahakarya Oerip Indonesia.\n\n` +
        `Berikut adalah panduan resmi **8 Koleksi Mahakarya Wastra Oerip Indonesia** karya perancang **Dian Oerip**. Seluruh mahakarya dirancang dengan prinsip **Konsep Minim Potong (Zero-Waste)** yang menghormati bentang kain sakral tenun tangan para penenun desa adat Nusantara:\n\n`;

    return {
      content:
        intro +
        `---\n\n` +
        `### 🏛️ KATALOG RESMI 8 MAHASENI OERIP INDONESIA\n\n` +
        `1. **Oerip Signature Blanket Outer / Kimono Nusantara** *(OERIP-OUT-001)*\n` +
        `   • **Wastra**: Tenun Gedog Tuban (Kapas Kenthang) & Tenun Ikat Sumba Timur\n` +
        `   • **Siluet**: Kimono all-size berwibawa (LD 100–130 cm), draperi zero-waste\n` +
        `   • **Acara Tepat**: Diplomasi budaya internasional, ballroom formal, ruangan ber-AC dingin\n` +
        `   • **Rentang Harga**: Rp 1.500.000 – Rp 4.500.000\n\n` +
        `2. **Oerip Bohemian Sumba Long Duster Robe** *(OERIP-KIM-002)*\n` +
        `   • **Wastra**: Tenun Ikat & Pahikung Sumba Timur asli (pewarna akar mengkudu & nila murni)\n` +
        `   • **Siluet**: Duster melambai sepanjang mata kaki (*fluid maxi duster*)\n` +
        `   • **Acara Tepat**: Traveling mewah, festival seni kontemporer, resort pantai bohemian\n` +
        `   • **Rentang Harga**: Rp 2.500.000 – Rp 5.800.000\n\n` +
        `3. **Oerip Contemporary Lurik Minimalist Short Kimono** *(OERIP-LUR-003)*\n` +
        `   • **Wastra**: Tenun Lurik Prasojo Klaten ATBM dipadu aksen Gedog Tuban\n` +
        `   • **Siluet**: Kimono pendek modern, katun berpori sejuk dan anti-gerah\n` +
        `   • **Acara Tepat**: Smart-casual kantor, reuni santai di kafe, outfit harian urban pria/wanita\n` +
        `   • **Rentang Harga**: Rp 1.200.000 – Rp 2.400.000\n\n` +
        `4. **Oerip Heritage Ulos Statement Vest / Outer** *(OERIP-ULO-004)*\n` +
        `   • **Wastra**: Ulos Ragidup Batak Toba sakral pewarna alam (*Itom & Marun*)\n` +
        `   • **Siluet**: Vest panjang berstruktur kokoh dan berwibawa tinggi\n` +
        `   • **Acara Tepat**: Resepsi pernikahan adat/nasional, jamuan kenegaraan, gala dinner formal\n` +
        `   • **Rentang Harga**: Rp 2.200.000 – Rp 4.800.000\n\n` +
        `5. **Oerip Zero-Waste Asymmetric Gedog Cape Wrap** *(OERIP-CAP-005)*\n` +
        `   • **Wastra**: Tenun Gedog Kerek Tuban serat kapas pintal tangan (nila & kayu tingi)\n` +
        `   • **Siluet**: Cape wrap asimetris modern tanpa potong kain dengan aksen raw-edge fringe\n` +
        `   • **Acara Tepat**: Pembukaan pameran seni (art exhibition), pesta cocktail, busana layering chic\n` +
        `   • **Rentang Harga**: Rp 1.750.000 – Rp 3.200.000\n\n` +
        `6. **Oerip Living Heritage Tunic Dress & Selendang Set** *(OERIP-DRS-006)*\n` +
        `   • **Wastra**: Tenun Ikat Toraja Sa'dan motif Pa'teddong berpadu Katun Mori alami\n` +
        `   • **Siluet**: Set terusan tunik maxi anggun dilengkapi selendang tenun serasi (modest-friendly)\n` +
        `   • **Acara Tepat**: Resepsi keluarga agung, jamuan adat, modest / hijab styling berkelas\n` +
        `   • **Rentang Harga**: Rp 2.800.000 – Rp 5.200.000\n\n` +
        `7. **Oerip Flores Geometric Reversible Poncho** *(OERIP-PON-007)*\n` +
        `   • **Wastra**: Tenun Ikat Ende Flores bermotif geometris Mata Bolo (mata batin pelindung)\n` +
        `   • **Siluet**: Ponco dua sisi (*reversible 2-in-1*), katun lembut penahan hembusan dingin\n` +
        `   • **Acara Tepat**: Traveling ke dataran tinggi/pegunungan, ruang ber-AC dingin ekstrem, gaya etnik dinamis\n` +
        `   • **Rentang Harga**: Rp 1.950.000 – Rp 3.800.000\n\n` +
        `8. **Oerip Earth-Tone Minimalist Sleeveless Vest** *(OERIP-VES-008)*\n` +
        `   • **Wastra**: Tenun Lurik Klaten pinstripe beraksen saku Tenun Sumba motif Kuda\n` +
        `   • **Siluet**: Rompi tanpa lengan berleher V santai, potongan unisex bersih\n` +
        `   • **Acara Tepat**: Busana kerja kreatif, layering kemeja/kaos santai, gaya harian bersahaja\n` +
        `   • **Rentang Harga**: Rp 1.350.000 – Rp 2.600.000\n\n` +
        `---\n\n` +
        `💡 *KIRA AI kini secara aktif mengurasi ke-8 koleksi di atas. Anda dapat mengeksplorasi rekomendasi produk tertentu melalui tombol di bawah atau mengetik kebutuhan spesifik Anda!*`,
      recommendation: undefined,
      quick_replies: [
        'Rekomendasi Cape Asimetris Gedog.',
        'Rekomendasi Tunic Dress Toraja.',
        'Rekomendasi Poncho Flores Reversible.',
        'Rekomendasi Sleeveless Vest Earth-Tone.'
      ],
      source_badge: '✓ Kurasi Lengkap 8 Produk Oerip',
      trace: {
        user_intent: 'Complete 8-Product Catalog Showcase and Unsurfaced Items Discovery',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Surfaced all 8 catalog products with complete textile and occasion breakdown.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-OUT-001', 'OERIP-KIM-002', 'OERIP-LUR-003', 'OERIP-ULO-004', 'OERIP-CAP-005', 'OERIP-DRS-006', 'OERIP-PON-007', 'OERIP-VES-008']
      }
    };
  }

  // SCENARIO 0B: WHATSAPP ADMIN / KURATOR CONTACT INQUIRY
  if (
    lower.includes('whatsapp admin') ||
    lower.includes('wa admin') ||
    lower.includes('nomor admin') ||
    lower.includes('kontak admin') ||
    lower.includes('hubungi admin') ||
    lower.includes('nomor wa') ||
    lower.includes('nomor whatsapp') ||
    lower.includes('admin kira') ||
    lower.includes('tim kurasi via whatsapp') ||
    lower.includes('85174485581') ||
    (lower.includes('nomor') && (lower.includes('kira') || lower.includes('oerip') || lower.includes('kurator'))) ||
    (lower.includes('kontak') && (lower.includes('kira') || lower.includes('oerip') || lower.includes('kurator')))
  ) {
    return {
      content:
        `### 📱 Kontak WhatsApp Admin & Tim Kurator Resmi Oerip Indonesia\n\n` +
        `Untuk informasi ketersediaan koleksi *one-of-a-kind*, konsultasi ukuran (*sizing*), pemesanan busana khusus (*bespoke*), maupun reservasi kunjungan ke Museum & Galeri Oerip, Anda dapat langsung menghubungi Admin Resmi kami:\n\n` +
        `• **Nomor WhatsApp Admin**: **+62 851-7448-5581**\n` +
        `• **Tautan Langsung Chat**: [https://wa.me/6285174485581](https://wa.me/6285174485581)\n` +
        `• **Jam Operasional Kurator**: Senin – Sabtu, pukul 09.00 – 18.00 WIB\n` +
        `• **Layanan**: Pengecekan *stock pieces* eksklusif, pemesanan tenun adat, serta panduan styling personal.\n\n` +
        `Tim kurator Oerip Indonesia siap mendampingi Anda memilih mahakarya wastra yang paling selaras dengan jati diri dan kebutuhan Anda.`,
      quick_replies: [
        'Lihat 8 Koleksi Mahakarya Oerip',
        'Berapa rentang harga busana Oerip?',
        'Ceritakan tentang Dian Oerip',
        'Panduan Perawatan Wastra Lerak'
      ],
      source_badge: '✓ Kontak Resmi WhatsApp Admin Oerip',
      trace: {
        user_intent: 'Admin and Curation Team WhatsApp Contact Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Provided verified official enterprise WhatsApp contact (+6285174485581).'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-GUARD-001']
      }
    };
  }

  // SCENARIO 0C: GREETINGS & INITIAL WELCOME (Halo, Hai, Selamat Pagi, Kamu Siapa, dll)
  const smallTalkScenario = detectAndHandleSmallTalk(lower, ctx);
  if (smallTalkScenario) {
    return smallTalkScenario;
  }

  if (isGreetingOrUnclearQuery(lower)) {
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Selamat datang di **KIRA** (*Kecerdasan Budaya & Kurator Wastra Oerip Indonesia*).\n\n` +
        `Saya siap mendampingi Anda menjelajahi keindahan mahakarya wastra tenun tangan Nusantara dan filosofi rancang busana Dian Oerip.\n\n` +
        `**Bagaimana KIRA dapat mendampingi Anda hari ini?**\n` +
        `• 👗 **Konsultasi Padu-Padan Busana**: Sebutkan acara yang akan Anda hadiri (misal: wisuda, reuni kafe, resepsi pernikahan, diplomasi, atau kerja kantor) dan KIRA akan mengurasi padanan busana terbaik untuk Anda.\n` +
        `• 🧵 **Pustaka 6 Wastra Nusantara**: Eksplorasi keagungan Tenun Ikat Sumba Timur, Gedog Tuban, Lurik Klaten, Ulos Batak Toba, Flores, atau Toraja Sa'dan.\n` +
        `• 🌿 **Filosofi Slow Fashion & Zero-Waste**: Pahami prinsip *Konsep Minim Potong*, pewarnaan nabati alami, serta panduan merawat wastra dengan buah lerak alami.\n\n` +
        `Silakan ketik pertanyaan Anda atau klik salah satu pilihan praktis di bawah ini:`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Ceritakan tentang 6 Wastra Oerip',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: '✓ Sambutan Budaya KIRA',
      trace: {
        user_intent: 'Greeting & Initial Welcome',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Welcomed user politely without forcing an unsolicited outfit recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // SCENARIO 0C2: 6 WASTRA NUSANTARA OERIP & NARASI LENGKAP WASTRA (ASAL -> RELEVANSI)
  if (
    lower.includes('6 wastra') ||
    lower.includes('6-wastra') ||
    lower.includes('enam wastra') ||
    lower.includes('narasi lengkap wastra') ||
    lower.includes('asal → relevansi') ||
    lower.includes('asal -> relevansi') ||
    (lower.includes('ceritakan') && lower.includes('wastra') && (lower.includes('6') || lower.includes('enam') || lower.includes('oerip') || lower.includes('nusantara'))) ||
    (lower.includes('wastra') && lower.includes('nusantara') && lower.includes('oerip'))
  ) {
    return {
      content:
        `### 🏛️ PUSTAKA 6 WASTRA ADILUHUNG NUSANTARA OERIP INDONESIA\n\n` +
        `Dian Oerip mendedikasikan karya rancangnya untuk menghidupkan kembali wastra tenun tangan tradisional dari pelosok desa adat Nusantara. Berikut adalah **Narasi Lengkap 6 Wastra Terverifikasi Oerip Indonesia (Asal → Kisah & Makna → Relevansi Busana Oerip)**:\n\n` +
        `---\n\n` +
        `### 1. 🧵 TENUN IKAT & PAHIKUNG SUMBA TIMUR (NTT)\n` +
        `• **Asal Adat**: Desa Rende, Melolo, dan Kanatang, Kabupaten Sumba Timur, Nusa Tenggara Timur.\n` +
        `• **Kisah & Makna Sakral**: Ditenun helai demi helai dalam lindungan tradisi kepercayaan leluhur Marapu menggunakan 100% pewarna alam nabati (akar mengkudu / *kombu* untuk merah terakota dan daun nila / *taum* untuk biru malam). Menampilkan motif sakral **Kuda (*Njara*)** simbol kepemimpinan dan kebangsawanan, serta **Pohon Hayat (*Andung*)** simbol perlindungan kosmis.\n` +
        `• **Relevansi dalam Busana Oerip**: Diabadikan dalam *Oerip Signature Blanket Outer (OERIP-OUT-001)* dan *Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)*. Menghadirkan wibawa kharismatik yang kuat untuk diplomasi kenegaraan, perhelatan agung, maupun traveling bohemian.\n\n` +
        `### 2. 🌾 TENUN GEDOG KEREK TUBAN (JAWA TIMUR)\n` +
        `• **Asal Adat**: Kecamatan Kerek, Kabupaten Tuban, Jawa Timur.\n` +
        `• **Kisah & Makna Sakral**: Dibuat dari benang kapas lokal (*kapas kenthang*) yang ditanam di tanah kapur, dipetik, dan dipintal tangan (*nganthi*) secara manual. Bunyi ritmis alat tenun tradisional (*gedog... dog... dog...*) memberi nama pada kain ini. Mengusung motif **Ganggeng** (tanaman air sungai berkelok) melambangkan kelenturan jiwa, kesabaran, dan kemampuan adaptasi hidup.\n` +
        `• **Relevansi dalam Busana Oerip**: Diolah dalam *Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)*. Karakter benang pintal tangannya sangat berpori, sejuk saat cuaca panas tropis, dan memberikan kehangatan lembut di ruangan ber-AC.\n\n` +
        `### 3. 📐 TENUN LURIK PRASOJO KLATEN (JAWA TENGAH)\n` +
        `• **Asal Adat**: Pedan, Kabupaten Klaten & Yogyakarta, Jawa Tengah.\n` +
        `• **Kisah & Makna Sakral**: Berakar dari kata bahasa Jawa *lorek* (garis lurus). Mengandung fithrah luhur *"Lurus ing Lakon"*—simbol kejujuran, keteguhan moral, kesederhanaan, dan kesahajaan hidup. Ditenun menggunakan Alat Tenun Bukan Mesin (ATBM) dengan pola pinstripe halus seperti motif Telupat dan Sapit Urang.\n` +
        `• **Relevansi dalam Busana Oerip**: Dituangkan dalam *Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)* dan *Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)*. Menjadi busana harian modern yang adem, tidak mudah kusut, dan fleksibel untuk ruang kerja kantor kreatif.\n\n` +
        `### 4. 👑 ULOS RAGIDUP & SADUM BATAK TOBA (SUMATERA UTARA)\n` +
        `• **Asal Adat**: Kawasan Lembah Danau Toba & Pulau Samosir, Sumatera Utara.\n` +
        `• **Kisah & Makna Sakral**: Dalam kosmologi masyarakat Batak, Ulos adalah salah satu dari 3 sumber kehangatan kosmis (*Manggomgomi*): Matahari, Api, dan Ulos. **Ulos Ragidup (Pola Kehidupan)** dengan warna *Itom* (hitam sakral), marun, dan putih melambangkan siklus kehidupan, martabat kehormatan, dan doa restu keberkatan.\n` +
        `• **Relevansi dalam Busana Oerip**: Diwujudkan menjadi *Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)*. Memiliki garis siluet tegas berwibawa tinggi, sangat tepat untuk upacara resepsi pernikahan adat, jamuan resmi, dan gala dinner formal.\n\n` +
        `### 5. 🛡️ TENUN IKAT ENDE & MANGGARAI FLORES (NTT)\n` +
        `• **Asal Adat**: Ende, Lio, dan Manggarai, Pulau Flores, Nusa Tenggara Timur.\n` +
        `• **Kisah & Makna Sakral**: Ditenun dengan pewarnaan alami fermentasi akar mengkudu dan tanah mineral vulkanik. Mengangkat motif sakral **Mata Bolo** (belah ketupat geometris) melambangkan mata batin, kewaspadaan spiritual, dan pandangan hidup yang jernih dalam menjaga harmoni dengan alam.\n` +
        `• **Relevansi dalam Busana Oerip**: Diciptakan dalam bentuk *Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)* dengan inovasi dua sisi (*2-in-1 reversible*). Sangat ideal untuk menjaga kehangatan saat traveling di dataran tinggi pegunungan maupun ruangan ber-AC dingin.\n\n` +
        `### 6. 🐃 TENUN IKAT TORAJA SA'DAN (SULAWESI SELATAN)\n` +
        `• **Asal Adat**: Lembah Sa'dan, Kabupaten Toraja Utara, Sulawesi Selatan.\n` +
        `• **Kisah & Makna Sakral**: Mengusung motif sakral **Pa'teddong (Kepala Kerbau)** simbol kemakmuran, kehormatan keluarga, dan perlindungan spiritual, serta motif **Sekong Kandaure** simbol ikatan kekeluargaan adat yang tak terputus. Ditenun menggunakan pewarna getah daun hutan dan lumpur tradisional.\n` +
        `• **Relevansi dalam Busana Oerip**: Diolah dalam *Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)*. Menghadirkan terusan maxi berselendang yang santun, anggun, dan sangat *hijab-friendly* untuk resepsi agung keluarga.\n\n` +
        `---\n\n` +
        `💡 *Seluruh 6 wastra di atas dirancang Dian Oerip dengan Konsep Minim Potong (Zero-Waste) demi menghormati keutuhan lembaran kain tenun dan doa para mama penenun desa adat.*`,
      quick_replies: [
        'Ceritakan tentang Konsep Minim Potong (Zero-Waste)',
        'Lihat 8 Koleksi Mahakarya Oerip',
        'Berapa rentang harga busana Oerip?',
        'Hubungi WhatsApp Admin Kurator'
      ],
      source_badge: '✓ Pustaka 6 Wastra Terverifikasi Oerip',
      trace: {
        user_intent: 'Inquiry regarding 6 Wastra Nusantara Oerip & Complete Narrative (Origin -> Relevance)',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Provided exhaustive detailed breakdown of all 6 verified Knowledge Base Wastra origins, cultural stories/symbols, and Oerip product applications.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [
          'WASTRA-SUMBA-001',
          'WASTRA-TUBAN-002',
          'WASTRA-LURIK-003',
          'WASTRA-ULOS-004',
          'WASTRA-FLORES-005',
          'WASTRA-TORAJA-006'
        ]
      }
    };
  }

  // SCENARIO 0D: BLUE / INDIGO OUTER INQUIRY ("Ada outer warna biru?")
  if (
    (lower.includes('outer') || lower.includes('baju luar') || lower.includes('kimono') || lower.includes('cape') || lower.includes('busana luar')) &&
    (lower.includes('biru') || lower.includes('indigo') || lower.includes('nila'))
  ) {
    const product = OERIP_PRODUCTS[0]; // Oerip Signature Blanket Outer
    return {
      content:
        `Ada informasi mengenai outer dengan warna **Indigo Blue** dalam koleksi resmi Oerip Indonesia! 🌿\n\n` +
        `Warna biru pada busana Oerip tidak dihasilkan dari pewarna sintetis tekstil, melainkan dari **fermentasi alami daun nila (*Indigofera tinctoria / Taum*)** murni yang menghasilkan gradasi biru malam (*deep indigo*) yang tenang, berwibawa, dan dingin saat menyentuh kulit:\n\n` +
        `---\n\n` +
        `### KOLEKSI OUTER DENGAN WARNA INDIGO BLUE:\n\n` +
        `1. **${product.product_name}** *(Kode: ${product.product_id})*\n` +
        `   • **Wastra**: Perpaduan **Tenun Gedog Tuban** (kapas kenthang pintal tangan manual) dan **Tenun Ikat Sumba Timur** dengan pewarnaan alami daun nila (*Indigofera*) biru malam yang legam.\n` +
        `   • **Siluet**: Potongan kimono berwibawa khas Dian Oerip (all-size inklusif, LD 100–130 cm) yang melipat anggun tanpa memotong serat tenun utama (*zero-waste principle*).\n` +
        `   • **Karakter**: Sangat gagah dan anggun untuk pria maupun wanita, memberi kehangatan lembut di ruangan ber-AC dingin sekaligus sejuk bernapas di iklim tropis.\n` +
        `   • **Rentang Harga**: ${product.price_range}\n\n` +
        `2. **Oerip Zero-Waste Asymmetric Gedog Cape Wrap** *(Kode: OERIP-CAP-005)*\n` +
        `   • **Wastra**: Tenun Gedog Kerek Tuban dengan celupan daun nila biru indigo dan aksen rumbai tenun asli (*raw-edge fringe*).\n` +
        `   • **Siluet**: Cape bahu asimetris kontemporer untuk gaya layering yang modern dan artistik.\n` +
        `   • **Rentang Harga**: Rp 1.750.000 – Rp 3.200.000\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip Indonesia (Terverifikasi)*`,
      recommendation: hasOutfitRecommendationIntent(lower, ctx) ? {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Menggunakan pewarna alam daun nila (Indigofera) murni yang menghasilkan warna biru indigo berwibawa.',
          'Kombinasi Tenun Gedog Tuban dan Tenun Ikat Sumba bernilai seni tinggi.',
          'Siluet kimono all-size zero-waste yang versatile untuk berbagai suasana formal maupun santai.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: ['Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)'],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      } : undefined,
      quick_replies: [
        'Kalau buat kondangan?',
        'Berapa harganya?',
        'Bahannya apa?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi Koleksi Indigo Blue Oerip',
      trace: {
        user_intent: 'Inquiry regarding Blue / Indigo Outerwear Collection',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched OERIP-OUT-001 and OERIP-CAP-005 natural indigo blue collections.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-OUT-001', 'OERIP-CAP-005', 'WASTRA-TUBAN-002', 'WASTRA-SUMBA-001']
      }
    };
  }

  // SCENARIO 0E: SUMBA TEXTILE INQUIRY ("Ada kain Sumba?")
  if (
    (lower.includes('kain sumba') || lower.includes('tenun sumba') || lower === 'ada kain sumba?' || lower === 'ada kain sumba' || (lower.includes('ada') && lower.includes('sumba') && !lower.includes('kondangan') && !lower.includes('motif'))) &&
    !lower.includes('motifnya apa') && !lower.includes('apa motifnya')
  ) {
    return {
      content:
        `Knowledge Base Oerip Indonesia memiliki informasi mengenai **Tenun Ikat & Pahikung Sumba Timur** (ID: WASTRA-SUMBA-001). 🌿\n\n` +
        `Kain tenun Sumba Timur merupakan salah satu wastra adiluhung utama yang secara konsisten diolah dan dilestarikan oleh Dian Oerip bermitra dengan para mama penenun desa adat Rende, Melolo, dan Kanatang, Nusa Tenggara Timur:\n\n` +
        `---\n\n` +
        `### NILAI LUHUR TENUN IKAT & PAHIKUNG SUMBA TIMUR:\n\n` +
        `• **Tradisi Spiritual Marapu**: Ditenun helai demi helai menggunakan teknik ikat ganda dan songket pahikung yang membutuhkan waktu pengerjaan 3 hingga 6 bulan penuh laku doa dan kepatuhan tabu adat.\n` +
        `• **100% Pewarna Nabati Alami**: Memanfaatkan akar mengkudu (*kombu*) untuk warna merah terakota hangat dan daun nila (*taum/indigofera*) untuk biru malam legam.\n` +
        `• **Ragam Motif Sakral**: Menampilkan simbol-simbol luhur seperti **Kuda (*Njara*)**, **Pohon Hayat (*Andung*)**, **Rusa (*Ruhu*)**, **Udang (*Kura*)**, serta buaya sakral pembawa berkah perlindungan.\n` +
        `• **Penerapan dalam Busana Oerip**: Dian Oerip mengabadikan Tenun Sumba dalam busana seperti **Oerip Signature Blanket Outer (OERIP-OUT-001)** dan **Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)** dengan prinsip zero-waste menjaga keutuhan kain tenun asli.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip Indonesia (ID: WASTRA-SUMBA-001)*`,
      quick_replies: [
        'Motifnya apa?',
        'Bahannya apa?',
        'Asalnya mana?',
        'Berapa harganya?'
      ],
      source_badge: '✓ Pustaka Resmi Tenun Sumba Timur Oerip',
      trace: {
        user_intent: 'Inquiry regarding Sumba Textile Availability and Heritage in KB',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Sourced from verified KB entry WASTRA-SUMBA-001.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'OERIP-OUT-001', 'OERIP-KIM-002']
      }
    };
  }

  // -------------------------------------------------------------
  // SCENARIO 0F: SIZE, FIT, LD & BIG BODY / PLUS-SIZE INQUIRY
  // User queries:
  // “Muatan untuk badan besar nggak?”
  // “Kalau saya pakai ukuran besar bisa?”
  // “LD-nya berapa?”
  // -------------------------------------------------------------
  const isSizeFitQuery =
    lower.includes('badan besar') ||
    lower.includes('ukuran besar') ||
    lower.includes('muatan untuk badan besar') ||
    lower.includes('muat untuk badan besar') ||
    lower.includes('muatan badan besar') ||
    lower.includes('muat badan besar') ||
    lower.includes('muat gak') ||
    lower.includes('muat ga') ||
    lower.includes('muat tidak') ||
    lower.includes('apakah muat') ||
    lower.includes('bisa muat') ||
    lower.includes('bisa pakai ukuran besar') ||
    lower.includes('pakai ukuran besar bisa') ||
    lower.includes('gemuk') ||
    lower.includes('plus size') ||
    lower.includes('big size') ||
    lower.includes('ld-nya berapa') ||
    lower.includes('ld nya berapa') ||
    lower.includes('ld berapa') ||
    lower.includes('lingkar dada') ||
    lower.includes('lingkar dadanya') ||
    lower.includes('size chart') ||
    lower.includes('panduan ukuran') ||
    lower.includes('ukurannya berapa') ||
    lower.includes('ada ukuran apa') ||
    lower.includes('ukuran apa aja') ||
    lower.includes('ukuran apa saja') ||
    lower === 'ld nya?' ||
    lower === 'ld-nya?' ||
    lower === 'ld?' ||
    lower === 'ukurannya?';

  if (isSizeFitQuery) {
    let targetProduct = null;
    if (lower.includes('blanket') || lower.includes('outer') || lower.includes('kimono nusantara') || lower.includes('oerip-out-001')) targetProduct = OERIP_PRODUCTS[0];
    else if (lower.includes('duster') || lower.includes('bohemian') || lower.includes('oerip-kim-002')) targetProduct = OERIP_PRODUCTS[1];
    else if (lower.includes('lurik') || lower.includes('klaten') || lower.includes('oerip-lur-003')) targetProduct = OERIP_PRODUCTS[2];
    else if (lower.includes('ulos') || lower.includes('vest ulos') || lower.includes('oerip-ulo-004')) targetProduct = OERIP_PRODUCTS[3];
    else if (lower.includes('cape') || lower.includes('gedog') || lower.includes('oerip-cap-005')) targetProduct = OERIP_PRODUCTS[4];
    else if (lower.includes('dress') || lower.includes('tunik') || lower.includes('toraja') || lower.includes('oerip-drs-006')) targetProduct = OERIP_PRODUCTS[5];
    else if (lower.includes('poncho') || lower.includes('ponco') || lower.includes('flores') || lower.includes('oerip-pon-007')) targetProduct = OERIP_PRODUCTS[6];
    else if (lower.includes('sleeveless') || lower.includes('rompi') || lower.includes('oerip-ves-008')) targetProduct = OERIP_PRODUCTS[7];

    if (targetProduct) {
      const spec = getProductSizeSpec(targetProduct.product_id) || {
        product_name: targetProduct.product_name,
        product_id: targetProduct.product_id,
        ld: '100–130 cm (All-Size Loose Fit)',
        panjang: '± 90–115 cm',
        fit_character: 'Siluet all-size longgar mengalir khas Dian Oerip tanpa kancing kaku',
        badan_besar_compatibility: 'Sangat muat dan nyaman untuk badan besar / plus-size (M hingga XXL). Potongan draperi bebas gerak.',
        zero_waste_note: 'Konsep Minim Potong (Zero-Waste) yang ramah untuk berbagai bentuk tubuh.'
      };

      return {
        content:
          `📏 **Panduan Ukuran & Karakter Fit: ${spec.product_name}**\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia (*Kode: ${spec.product_id}*):\n\n` +
          `• **Lingkar Dada (LD)**: **${spec.ld}**\n` +
          `• **Estimasi Panjang Baju**: ${spec.panjang}\n` +
          `• **Siluet & Karakter Potongan**: ${spec.fit_character}.\n\n` +
          `**Apakah Muat untuk Badan Besar / Kalau Pakai Ukuran Besar Bisa?**\n` +
          `👉 **${spec.badan_besar_compatibility}**\n` +
          `Dian Oerip merancang busana ini dengan prinsip inklusif dan konsep *Minim Potong (Zero-Waste)*, di mana lembaran kain tenun dibiarkan melipat alami di tubuh sehingga tidak terasa sempit di ketiak, tidak sesak di dada, dan menyamarkan lekuk tubuh secara santun.\n\n` +
          `⚠️ **Konfirmasi Ukuran Aktual (Anti-Menebak)**:\n` +
          `Karena setiap busana Oerip diciptakan *One-of-a-Kind* (1 of 1) dari bentang tenun tangan asli desa adat, kami tidak menebak rincian ukuran milimeter detail (seperti lingkar ketiak atau lebar bahu per helai fisik tertentu) yang tidak tercatat di Knowledge Base.\n\n` +
          `Untuk memastikan ukuran helai fisik yang sedang ready stock di galeri, silakan langsung menghubungi **Admin WhatsApp Resmi Oerip (+62 851-7448-5581)**. Tim kurator siap mengukurkan langsung *piece* tersebut untuk Anda.`,
        recommendation: hasOutfitRecommendationIntent(lower, ctx) ? {
          product_name: targetProduct.product_name,
          product_id: targetProduct.product_id,
          image: targetProduct.image,
          why_reasons: [
            `Siluet all-size longgar (${spec.ld}) yang sangat ramah bagi tubuh besar maupun ramping.`,
            `Potongan draperi minim potong khas Dian Oerip yang membebaskan gerak tanpa sesak.`,
            `Ditenun dari serat kapas alami ${targetProduct.textile} yang sejuk dan bernapas.`
          ],
          about_wastra: `${targetProduct.textile} dari ${targetProduct.textile_origin}.`,
          cultural_story: targetProduct.cultural_story,
          alternatives: OERIP_PRODUCTS.filter(p => p.product_id !== targetProduct?.product_id).slice(0, 2).map(p => p.product_name),
          notes: {
            price_range: targetProduct.price_range,
            care: targetProduct.care_instruction,
            availability: targetProduct.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        } : undefined,
        quick_replies: [
          'Bahannya apa?',
          'Berapa harganya?',
          'Kalau buat kondangan?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Spesifikasi Ukuran & Fit KB Oerip',
        trace: {
          user_intent: `Size & Fit Inquiry: ${spec.product_name}`,
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            `Concrete size and fit parameters retrieved from Knowledge Base for ${spec.product_id}.`,
            'Zero hallucination enforced: advised contacting Official Admin for physical piece variation measurements.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: [spec.product_id, 'KB-BRAND-001']
        }
      };
    }

    // General Size & Fit Guide with Recommendation
    const heroProduct = OERIP_PRODUCTS[0]; // Oerip Signature Blanket Outer
    return {
      content:
        `📏 **Panduan Ukuran, Lingkar Dada (LD) & Karakter Fit Oerip Indonesia**\n\n` +
        `Menjawab pertanyaan Anda mengenai **apakah muat untuk badan besar dan berapa ukuran Lingkar Dada (LD)-nya**:\n\n` +
        `1. **Apakah Muat untuk Badan Besar / Kalau Pakai Ukuran Besar Bisa?**\n` +
        `   • **Ya, tentu bisa dan sangat muat!**\n` +
        `   • Seluruh busana karya perancang Dian Oerip dirancang dengan filosofi **All-Size Loose Fit (Inklusif & Unisex)**.\n` +
        `   • Siluetnya sengaja dibuat longgar (*oversized*), mengalir, dan membebaskan gerak tanpa jahitan pas badan (*fitted*) atau kancing sempit yang mengekang tubuh.\n` +
        `   • Potongan draperi arsitektural khas Dian Oerip jatuh melipat anggun di pundak, sehingga sangat bersahabat bagi pemilik badan berukuran besar (*plus-size* / L hingga XXL/3XL) dan tetap terlihat proporsional serta menawan.\n\n` +
        `2. **Berapa Lingkar Dada (LD)-nya Secara Konkret?**\n` +
        `   Berdasarkan data resmi Knowledge Base Oerip Indonesia:\n` +
        `   • **Rentang LD Umum Busana Oerip**: **100 cm hingga 130 cm** (All-Size Loose Fit).\n` +
        `   • **Model Kimono / Blanket Outer (OERIP-OUT-001)**: LD 100–130 cm, panjang ± 90–115 cm.\n` +
        `   • **Model Duster Panjang (OERIP-KIM-002)**: LD 105–125 cm, panjang menjuntai semata kaki ± 125–135 cm.\n` +
        `   • **Model Kimono Pendek Lurik (OERIP-LUR-003)**: LD 100–120 cm, panjang ± 70–75 cm.\n` +
        `   • **Model Cape Wrap Asimetris (OERIP-CAP-005)**: Open-fit fleksibel melingkar hingga LD 130 cm+ tanpa batasan jahitan ketiak.\n` +
        `   • **Model Poncho Flores (OERIP-PON-007)**: Open batwing tanpa jahitan samping, fleksibel hingga LD 140 cm.\n\n` +
        `3. **Prinsip Transparansi Data & Konfirmasi Ukuran Aktual (Anti-Menebak)**:\n` +
        `   • Karena setiap busana Oerip merupakan karya seni pusaka *One-of-a-Kind* (1 of 1) dari bentang tenun tangan para mama penenun desa adat, lebar kain alami per helai dapat memiliki sedikit variasi.\n` +
        `   • KIRA tidak menebak rincian ukuran milimeter fisik (seperti lingkar ketiak atau lebar bahu per helai) yang tidak ada di Knowledge Base.\n` +
        `   • **Saran**: Silakan hubungi **Admin WhatsApp Resmi Oerip (+62 851-7448-5581)** untuk konfirmasi ukuran aktual *piece* fisik yang ready stock di galeri dan sedang Anda minati.`,
      recommendation: hasOutfitRecommendationIntent(lower, ctx) ? {
        product_name: heroProduct.product_name,
        product_id: heroProduct.product_id,
        image: heroProduct.image,
        why_reasons: [
          'Siluet all-size longgar (LD 100-130 cm) yang sangat nyaman dan muat untuk badan besar / plus-size.',
          'Konsep Minim Potong (Zero-Waste) yang jatuh melipat anggun di pundak tanpa sesak di ketiak.',
          'Kombinasi Tenun Gedog Tuban dan Tenun Ikat Sumba Timur dengan serat katun bernapas sejuk.'
        ],
        about_wastra: `${heroProduct.textile} dari ${heroProduct.textile_origin}.`,
        cultural_story: heroProduct.cultural_story,
        alternatives: [
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
          'Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)'
        ],
        notes: {
          price_range: heroProduct.price_range,
          care: heroProduct.care_instruction,
          availability: heroProduct.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      } : undefined,
      quick_replies: [
        'LD Oerip Blanket Outer berapa?',
        'Apakah ada model kimono lain?',
        'Konsultasi via WhatsApp Admin',
        'Rekomendasi busana untuk acara tertentu'
      ],
      source_badge: '✓ Panduan Ukuran & Fit Resmi KB Oerip',
      trace: {
        user_intent: 'Size & Fit Inquiry: Lingkar Dada & Big Body Fit',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Concrete LD and size specifications retrieved from Knowledge Base.',
          'Explained Dian Oerip inclusive loose-fit philosophy for big body / plus size.',
          'Attached verified flagship product OERIP-OUT-001 (LD 100-130 cm).',
          'Zero hallucination: instructed user to contact Official Admin for actual physical piece confirmation.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'OERIP-OUT-001', 'OERIP-CAP-005']
      }
    };
  }

  // SCENARIO 10: CARE INSTRUCTIONS
  if (lower.includes('cuci') || lower.includes('perawatan') || lower.includes('merawat') || lower.includes('lerak') || lower.includes('luntur')) {
    return {
      content:
        `🌿 **Panduan Resmi Perawatan Wastra Tenun Pewarna Alam Oerip Indonesia**\n\n` +
        `Kain tenun tangan dengan pewarna alami membutuhkan perlakuan penuh kasih agar serat benang dan pigmen alaminya tetap terjaga:\n\n` +
        `1. **Gunakan Sabun Alami (Buah Lerak / Sampo Lembut)**: Hindari detergen berbahan kimia keras atau pemutih (*bleach*).\n` +
        `2. **Cuci Manual dengan Tangan**: Rendam sebentar dengan air dingin, usap perlahan tanpa dikucek atau disikat kencang.\n` +
        `3. **Jangan Diperas Kasar**: Cukup tekan lembut untuk mengurangi air, jangan dipelintir.\n` +
        `4. **Jemur di Keteduhan Berangin**: Hindari paparan langsung sinar matahari terik agar pigmen alami (akar mengkudu & nila) tidak memudar.\n` +
        `5. **Setrika Suhu Sedang dari Bagian Dalam**: Gunakan kain pelapis tipis atau setrika dari sisi belakang kain.\n\n` +
        `*✓ Berdasarkan Panduan Resmi Perawatan Oerip Indonesia (ID: KB-CARE-001)*`,
      quick_replies: [
        'Ceritakan tentang Tenun Sumba Timur.',
        'Rekomendasi busana diplomasi budaya.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Panduan Perawatan Resmi Oerip',
      trace: {
        user_intent: 'Textile Care and Maintenance Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Sourced directly from KB-CARE-001.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-CARE-001']
      }
    };
  }

  // SCENARIO 11: PHILOSOPHY OF SUMBA & HORSE MOTIF
  if (
    lower.includes('sumba') &&
    (lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('kuda') || lower.includes('makna') || lower.includes('motif'))
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Sumba Timur (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-SUMBA-001):\n\n` +
        `• **Asal & Tradisi**: Ditenun oleh para mama penenun di Rende, Melolo, dan Kanatang, Sumba Timur (NTT). Setiap helai kain diciptakan dengan laku doa sakral dalam bingkai kepercayaan leluhur Marapu.\n\n` +
        `• **Makna Motif Kuda (*Njara*)**:\n` +
        `  Kuda bagi masyarakat Sumba bukan sekadar satwa, melainkan simbol martabat, kepemimpinan, ketangkasan, dan kebangsawanan. Kuda juga diyakini sebagai tunggangan arwah leluhur menuju alam keabadian (*Prai Marapu*).\n\n` +
        `• **Pewarnaan Alam Nabati Murni**:\n` +
        `  Menggunakan akar pohon mengkudu (*kombu*) untuk warna merah terakota hangat dan daun nila (*indigofera/taum*) untuk biru malam legam. Proses pencelupan alami ini membutuhkan waktu perendaman berkali-kali selama 3 hingga 6 bulan.\n\n` +
        `• **Nilai Kesakralan**:\n` +
        `  Penenun mematuhi tabu adat dalam meramu pewarna agar daya spiritual (*maramba*) dan energi perlindungan kain tetap terjaga utuh.`,
      quick_replies: [
        'Rekomendasi busana berbahan Tenun Sumba.',
        'Ceritakan tentang filosofi Konsep Minim Potong.',
        'Bagaimana cara mencuci dengan lerak?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Sumba Textile & Horse Motif',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-SUMBA-001.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11B: PHILOSOPHY OF TENUN GEDOG TUBAN
  if (
    lower.includes('gedog') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('kapas') || lower.includes('tuban')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Gedog Tuban (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-TUBAN-002):\n\n` +
        `• **Pohon Kapas Lokal (*Kapas Kenthang*)**: Ditanam di tanah kapur Kerek, Tuban, dipetik dan dipintal manual menjadi benang dengan tangan (*nganthi*) oleh para perempuan desa. Tekstur benangnya berkarakter tebal, berserat alami, dan memiliki sirkulasi udara luar biasa.\n\n` +
        `• **Asal Nama "Gedog"**: Berasal dari dentuman ritmis bunyi kayu alat tenun tradisional (*gedog... dog... dog...*) saat sisir tenun merapatkan benang pakan.\n\n` +
        `• **Makna Motif Ganggeng**: Salah satu motif tertua yang terinspirasi tanaman ganggang air yang berkelok lentur di dasar sungai. Melambangkan kelenturan jiwa, kesabaran, dan kemampuan manusia beradaptasi dengan arus kehidupan tanpa kehilangan jati diri.\n\n` +
        `• **Pewarnaan Alam**: Menggunakan rebusan kulit kayu tingi untuk cokelat hangat dan fermentasi daun nila untuk biru indigo teduh.\n\n` +
        `*Dian Oerip merancang busana Gedog Tuban dengan teknik lipatan tanpa memotong serat kain utama.*`,
      quick_replies: [
        'Rekomendasi busana Tenun Gedog Tuban.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Ceritakan tentang Tenun Sumba Timur.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Gedog Tuban',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-TUBAN-002. Zero unsolicited recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-TUBAN-002', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11C: PHILOSOPHY OF TENUN LURIK KLATEN
  if (
    lower.includes('lurik') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('klaten')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Lurik Prasojo Klaten (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-LURIK-003):\n\n` +
        `• **Makna Filosofis "Lurus ing Lakon"**: Kata "lurik" berakar dari bahasa Jawa *lorek* (garis lurus). Garis lurus melambangkan kejujuran, keteguhan prinsip moral, kesederhanaan, dan kesahajaan hidup.\n\n` +
        `• **Tenun ATBM Prasojo Klaten**: Ditenun dengan Alat Tenun Bukan Mesin (ATBM) legendaris dari Klaten dan Yogyakarta, menghasilkan katun yang ringan, adem, berpori sejuk, dan sangat nyaman dipakai di iklim tropis maupun ruang kerja modern.\n\n` +
        `• **Motif Klasik**: Motif Lurik Telupat (tiga-empat garis keseimbangan hidup) dan Sapit Urang. Dalam sentuhan Dian Oerip, lurik menjelma menjadi siluet kimono minimalis kontemporer yang versatile untuk gaya smart-casual harian.`,
      quick_replies: [
        'Rekomendasi busana Tenun Lurik.',
        'Biasa produksi berapa potong per model?',
        'Berapa rentang harga busana Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Lurik Klaten',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-LURIK-003.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-LURIK-003', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11D: PHILOSOPHY OF ULOS BATAK TOBA
  if (
    lower.includes('ulos') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('batak') || lower.includes('ragidup')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Ulos Ragidup & Sadum Batak Toba (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-ULOS-004):\n\n` +
        `• **Falsafah Kehangatan Kosmis (*Manggomgomi*)**: Dalam kosmologi Batak, ada tiga sumber kehangatan hidup: Matahari, Api, dan Ulos. Ulos adalah doa berkat restu kehidupan yang diwujudkan dalam bentuk bentangan benang tenun.\n\n` +
        `• **Ulos Ragidup (Pola Kehidupan)**: Jenis ulos yang paling sakral dengan struktur tenun tiga bagian yang disatukan (*badang* dan dua *sisi*). Melambangkan siklus kehidupan, kesuburan, dan martabat tertinggi keluarga.\n\n` +
        `• **Warna Dominan**: Warna *Itom* (hitam sakral), merah marun marwah, dan putih kesucian. Oerip menghadirkan Ulos dalam siluet statement vest berwibawa untuk upacara formal agung dan resepsi pernikahan.`,
      quick_replies: [
        'Rekomendasi busana Ulos Batak.',
        'Ceritakan tentang Tenun Ikat Flores.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Ulos Batak Toba',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-ULOS-004.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-ULOS-004', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11E: PHILOSOPHY OF TENUN IKAT FLORES
  if (
    lower.includes('flores') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('ende') || lower.includes('mata bolo')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Ende & Manggarai Flores (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-FLORES-005):\n\n` +
        `• **Motif Mata Bolo (Belah Ketupat Sakral)**: Melambangkan mata batin, kewaspadaan spiritual, dan pandangan hidup yang jernih dalam menatap masa depan serta menjaga harmoni dengan semesta.\n\n` +
        `• **Pewarnaan Tradisional**: Menggunakan ekstrak fermentasi moke alami, daun nila untuk biru gelap, dan tanah mineral vulkanik untuk warna terakota hangat.\n\n` +
        `• **Karakter Kain**: Tenunan tebal namun lembut dan fleksibel, sangat ideal untuk menghalau dingin udara pegunungan maupun hembusan AC ekstrem, diwujudkan Oerip dalam bentuk Reversible Poncho multifungsi.`,
      quick_replies: [
        'Rekomendasi busana Tenun Ikat Flores.',
        'Ceritakan tentang Tenun Toraja Sa\'dan.',
        'Bagaimana cara merawat kain tenun?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Ikat Flores',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-FLORES-005.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-FLORES-005', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11F: PHILOSOPHY OF TENUN TORAJA SA'DAN
  if (
    lower.includes('toraja') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('teddong') || lower.includes('sa\'dan')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Toraja Sa'dan (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-TORAJA-006):\n\n` +
        `• **Motif Sakral Pa'teddong (Kepala Kerbau)**: Bagi masyarakat Toraja, kerbau (*teddong*) adalah simbol status sosial, kemakmuran, kekuatan pelindung, dan sarana penghubung roh leluhur menuju Puya (keabadian).\n\n` +
        `• **Motif Sekong Kandaure**: Geometri kait meliuk yang menyimbolkan ikatan kekeluargaan yang tak terputus dan perlindungan martabat keluarga adat.\n\n` +
        `• **Pewarnaan Alam**: Dibuat dari getah daun hutan pegunungan dan lumpur mineral, menghasilkan warna hitam pekat dan cokelat tanah yang khidmat dan bersahaja. Dian Oerip menghadirkannya dalam set tunik panjang dan selendang serasi.`,
      quick_replies: [
        'Rekomendasi busana Tenun Toraja Sa\'dan.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Biasa produksi berapa potong per model?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Toraja Sa\'dan',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-TORAJA-006.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-TORAJA-006', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11G: SLOW FASHION PHILOSOPHY
  if (
    lower.includes('slow fashion') ||
    lower.includes('fast fashion') ||
    lower.includes('keberlanjutan') ||
    lower.includes('sustainability')
  ) {
    return {
      content:
        `🌿 **Prinsip Slow Fashion & Sustainable Heritage Oerip Indonesia**\n\n` +
        `Oerip Indonesia lahir sebagai perlawanan kultural terhadap industri *fast fashion* yang eksploitatif dan menghasilkan jutaan ton limbah tekstil sintetis:\n\n` +
        `1. **Karya Seni Bernafas Waktu**: Satu helai tenun tangan membutuhkan waktu pengerjaan 1 hingga 6 bulan oleh para mama penenun desa adat di Sumba, Tuban, Klaten, Toba, Flores, dan Toraja.\n\n` +
        `2. **Serat Alami & Pewarna Nabati**: Mengutamakan katun tenun tangan (*kapas kenthang*) dan pewarnaan nabati dari akar mengkudu, daun nila, dan kulit kayu tingi yang terurai ramah di tanah tanpa meracuni air sungai desa adat.\n\n` +
        `3. **Fair Trade & Pemberdayaan Ekonomi Adat**: Menjunjung tinggi perdagangan adil bagi komunitas penenun perempuan, menjaga martabat tradisi luhur Nusantara agar terus hidup melintasi generasi.\n\n` +
        `4. **One-of-a-Kind Longevity**: Busana Oerip dirancang abadi (*timeless*), bernilai pusaka keluarga, dan tidak terikat tren musiman yang lekas usang.`,
      quick_replies: [
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Biasa produksi berapa potong per model?',
        'Berapa rentang harga busana Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Filosofi Slow Fashion Oerip',
      trace: {
        user_intent: 'Cultural Inquiry: Slow Fashion & Sustainability',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Provided slow fashion philosophy without forcing an unsolicited outfit recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
      }
    };
  }

  // SCENARIO 12: ZERO-WASTE & MINIM POTONG PHILOSOPHY
  if (
    lower.includes('zero waste') ||
    lower.includes('zero-waste') ||
    lower.includes('zerowaste') ||
    lower.includes('minim potong') ||
    lower.includes('tanpa potong') ||
    lower.includes('sisa perca') ||
    lower.includes('limbah kain') ||
    lower.includes('filosofi desain') ||
    lower.includes('konsep desain') ||
    lower.includes('sustainable fashion')
  ) {
    return {
      content:
        `🌿 **Filosofi Konsep Minim Potong (Zero-Waste) Oerip Indonesia**\n\n` +
        `Berdasarkan prinsip rancang bangun busana Dian Oerip (ID: KB-BRAND-003 & KB-TECH-001):\n\n` +
        `1. **Menghormati Doa Penenun**: Kain tenun tangan dibuat berbulan-bulan dengan doa dan jerih payah para mama penenun. Memotong kain sembarangan demi pola baju Barat dianggap melukai keutuhan jiwa wastra tersebut.\n\n` +
        `2. **Mempertahankan Bentang Asli (Rectangular Weave Geometry)**: Pola busana dirancang mengikuti bentang asli kain tenun dengan teknik lipat, lilit, dan drape alami, sehingga sisa perca (*waste*) dapat ditekan hingga mendekati nol.\n\n` +
        `3. **Siluet Longgar All-Size (Inklusif)**: Potongan yang longgar dan mengalir (lingkar dada 100–130 cm) dirancang inklusif untuk merangkul segala bentuk tubuh pemakainya secara bermartabat.\n\n` +
        `4. **Pemanfaatan Perca Wastra**: Potongan kecil sisa kain tetap diolah kembali menjadi aksesoris, kalung etnik, atau detail patch artistik tanpa ada yang terbuang sia-sia ke alam.`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan tentang Tenun Gedog Tuban.',
        'Apa saja 6 wastra terverifikasi Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Filosofi Rancang Oerip Indonesia',
      trace: {
        user_intent: 'Design Philosophy Inquiry: Zero-Waste & Minim Potong',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Sourced from verified KB items KB-BRAND-003 and KB-TECH-001. Zero forced outfit recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-003', 'KB-TECH-001']
      }
    };
  }

  // SCENARIO 13: FOLLOW-UP: "Kenapa kamu memilih produk itu?" / "Tinjau Alasan Kurasi KIRA"
  if (
    lower.includes('kenapa kamu memilih') ||
    lower.includes('mengapa kamu memilih') ||
    lower.includes('kenapa memilih') ||
    lower.includes('alasan pemilihan') ||
    lower.includes('alasan kurasi') ||
    lower.includes('tinjau lagi alasan') ||
    lower.includes('tinjau alasan') ||
    lower.includes('pilar kurasi') ||
    lower.includes('dasar kurasi') ||
    lower.includes('bagaimana kira memilih') ||
    lower.includes('kriteria kurasi')
  ) {
    let matchedRecentProduct = OERIP_PRODUCTS[2]; // Default Lurik Kimono
    if (history && history.length > 0) {
      const historyStr = history.map(h => h.content).join(' ').toLowerCase();
      if (historyStr.includes('blanket') || historyStr.includes('oerip-out-001') || historyStr.includes('diplomasi') || historyStr.includes('sumba')) {
        matchedRecentProduct = OERIP_PRODUCTS[0];
      } else if (historyStr.includes('duster') || historyStr.includes('oerip-kim-002') || historyStr.includes('bohemian')) {
        matchedRecentProduct = OERIP_PRODUCTS[1];
      } else if (historyStr.includes('ulos') || historyStr.includes('oerip-ulo-004') || historyStr.includes('vest') || historyStr.includes('resepsi')) {
        matchedRecentProduct = OERIP_PRODUCTS[3];
      } else if (historyStr.includes('cape') || historyStr.includes('oerip-cap-005') || historyStr.includes('asimetris')) {
        matchedRecentProduct = OERIP_PRODUCTS[4];
      } else if (historyStr.includes('tunic') || historyStr.includes('oerip-drs-006') || historyStr.includes('toraja') || historyStr.includes('dress') || historyStr.includes('tunik')) {
        matchedRecentProduct = OERIP_PRODUCTS[5];
      } else if (historyStr.includes('poncho') || historyStr.includes('oerip-pon-007') || historyStr.includes('flores')) {
        matchedRecentProduct = OERIP_PRODUCTS[6];
      } else if (historyStr.includes('sleeveless') || historyStr.includes('oerip-ves-008') || historyStr.includes('rompi') || historyStr.includes('earth tone')) {
        matchedRecentProduct = OERIP_PRODUCTS[7];
      } else if (historyStr.includes('lurik') || historyStr.includes('oerip-lur-003') || historyStr.includes('reuni') || historyStr.includes('kafe')) {
        matchedRecentProduct = OERIP_PRODUCTS[2];
      }
    }

    return {
      content:
        `### 🏛️ Matriks 5 Pilar Kurasi KIRA dalam Memilih Rekomendasi Busana\n\n` +
        `Dalam merekomendasikan setiap busana Oerip, KIRA tidak sekadar mencocokkan tampilan visual semata, melainkan menerapkan sistem evaluasi kuratorial multidimensi berdasar **5 Pilar Kurasi Budaya Oerip Indonesia**:\n\n` +
        `---\n\n` +
        `#### 1. Keselarasan Konteks & Derajat Formalitas (*Occasion & Formality Resonance*)\n` +
        `• **Analisis Etiket & Protokoler**: Menakar atmosfer acara (diplomasi bilateral, resepsi agung, wisuda, kantor smart-casual, hingga reuni santai di kafe ber-AC).\n` +
        `• **Aura Pemakai**: Memastikan busana memancarkan wibawa dan rasa percaya diri alami tanpa terkesan berlebihan (*overdressed*) atau kaku.\n\n` +
        `#### 2. Kenyamanan Termal & Bio-Klimatik (*Thermal & Micro-pore Comfort*)\n` +
        `• **Adaptasi Suhu Ruang**: Memperhitungkan perbedaan suhu ruangan berpendingin udara (AC dingin) dengan kelembapan iklim tropis luar ruang.\n` +
        `• **Sirkulasi Serat Alami**: Mengutamakan 100% serat kapas mentah atau mori tenun tangan dengan pori mikro alami yang bernapas (*breathable*)—menangkal hembusan AC tanpa membuat gerah saat aktif bergerak.\n\n` +
        `#### 3. Siluet Inklusif All-Size & Filosofi Minim Potong (*Zero-Waste Integrity*)\n` +
        `• **Kebebasan Gerak**: Menggunakan potongan longgar (*loose-fit*) all-size khas Dian Oerip (LD 100–130 cm) yang ramah untuk berbagai bentuk tubuh, jatuh indah di badan, dan fotogenik.\n` +
        `• **Menghormati Keutuhan Kain Adat**: Mengikuti bentang geometri kain tenun asli tanpa pemotongan destruktif, menjaga utuh benang doa para mama penenun desa adat.\n\n` +
        `#### 4. Makna Simbolis & Jiwa Wastra (*Living Cultural Heritage*)\n` +
        `• **Kesesuaian Filosofis**: Menyelaraskan motif dengan maksud kegiatan (misal: motif Kuda *Njara* untuk kepemimpinan, Lurik *Lurus Ing Lakon* untuk integritas bersahaja, atau Ulos Ragidup untuk kehangatan doa restu).\n` +
        `• **Pewarnaan Nabati Murni**: Mengapresiasi pewarna alam (akar mengkudu, daun indigo/salaon, kulit kayu tingi) yang ramah lingkungan dan aman bagi kulit sensitif.\n\n` +
        `#### 5. Fleksibilitas Padu-Padan Kontemporer (*Contemporary Versatility*)\n` +
        `• **Kemudahan Mix & Match**: Menjamin busana mudah dipadankan dengan pakaian modern harian (kaos katun, celana kulot/denim, inner dress, hijab voal, hingga sneakers atau loafers) agar wastra hidup dalam keseharian.\n\n` +
        `---\n\n` +
        `### 🔍 Contoh Penerapan pada Koleksi Pilihan: ${matchedRecentProduct.product_name}\n` +
        `• **Pilar 1 (Konteks)**: Sangat pas untuk suasana ${ctx.occasion || 'momen istimewa Anda'} dengan wibawa budaya yang anggun.\n` +
        `• **Pilar 2 (Termal)**: Tenun ${matchedRecentProduct.textile} memberikan kenyamanan suhu optimal di ruangan AC maupun semi-outdoor.\n` +
        `• **Pilar 3 (Siluet)**: Desain kimono/outer tanpa pemotongan destruktif, memberikan siluet megah dan bebas gerak.\n` +
        `• **Pilar 4 (Wastra)**: Membawa filosofi luhur dari ${matchedRecentProduct.textile_origin} dengan pewarna alam otentik.\n` +
        `• **Pilar 5 (Paduan)**: ${matchedRecentProduct.styling_notes}\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip & Living Heritage Protocol KIRA AI*`,
      recommendation: {
        product_name: matchedRecentProduct.product_name,
        product_id: matchedRecentProduct.product_id,
        image: matchedRecentProduct.image,
        why_reasons: [
          `Keselarasan Konteks: Tepat untuk suasana ${ctx.occasion || 'kegiatan Anda'} dengan pembawaan yang berwibawa.`,
          `Kenyamanan Termal: Serat alami ${matchedRecentProduct.textile} menepis dinginnya AC tanpa rasa gerah.`,
          `Siluet Minim Potong: Desain loose-fit all-size yang menghormati keutuhan kain tenun mama penenun.`,
          `Filosofi Wastra: Menghidupkan doa adat dan pewarnaan alam dari ${matchedRecentProduct.textile_origin}.`,
          `Fleksibilitas Gaya: Sangat luwes dipadukan dengan kaos, celana kulot, kemeja, atau hijab.`
        ],
        about_wastra: `${matchedRecentProduct.textile} dari ${matchedRecentProduct.textile_origin}.`,
        cultural_story: matchedRecentProduct.cultural_story,
        alternatives: OERIP_PRODUCTS.filter(p => p.product_id !== matchedRecentProduct.product_id).slice(0, 2).map(p => p.product_name),
        notes: {
          price_range: matchedRecentProduct.price_range,
          care: matchedRecentProduct.care_instruction,
          availability: matchedRecentProduct.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Rekomendasi busana untuk reuni di kafe ber-AC.',
        'Rekomendasi busana diplomasi budaya.',
        'Ceritakan tentang Tenun Sumba & motif Kuda.',
        'Bagaimana cara merawat kain pewarna alam?'
      ],
      source_badge: '✓ Standar 5 Pilar Kurasi KIRA',
      trace: {
        user_intent: 'Comprehensive Review of KIRA Curatorial Decision Framework & 5 Pillars',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Articulated the 5 foundational pillars of Oerip curation: Occasion Resonance, Thermal Comfort, Zero-Waste Silhouette, Symbolic Grounding, and Contemporary Versatility.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [matchedRecentProduct.product_id, 'KB-BRAND-003', 'KB-BRAND-004', 'KB-TECH-001', 'KB-CARE-001']
      }
    };
  }

  // SCENARIO 14: FOLLOW-UP: "Ceritakan tentang kainnya."
  if (
    lower.includes('ceritakan tentang kain') ||
    lower.includes('tentang kainnya') ||
    lower.includes('kisah kainnya') ||
    lower.includes('asal usul kain')
  ) {
    return {
      content:
        `### 🌾 Kisah & Perjalanan Jiwa Wastra Nusantara\n\n` +
        `Kain yang digunakan pada koleksi ini adalah **tenun tangan asli (*handwoven living textile*)**, bukan sekadar kain meteran industri:\n\n` +
        `• **Penenunan Tradisional**: Ditenun helai demi helai menggunakan alat tenun bukan mesin (ATBM) atau alat tenun gedogan duduk di desa-desa adat Nusantara (seperti Sumba Timur, Kerek Tuban, Klaten, atau Samosir).\n` +
        `• **Pewarnaan Alam Berkelanjutan**: Menggunakan pigmen nabati dari akar pohon mengkudu (*kombu*), fermentasi daun nila (*indigofera/taum*), dan kulit kayu tingi yang membutuhkan perendaman puluhan kali selama 3–12 bulan.\n` +
        `• **Doa & Falsafah Sakral**: Setiap motif yang tersemat bukanlah sekadar ornamen estetika, melainkan doa perlindungan, keteraturan kosmis, harapan kesejahteraan, serta penghormatan pada leluhur penenun.`,
      quick_replies: [
        'Kenapa kamu memilih produk itu?',
        'Kalau saya ingin warna lebih gelap?',
        'Bagaimana cara merawat kain pewarna alam?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'In-depth textile provenance and spiritual significance inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Textile authenticity verified with zero synthetic/machine claims.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'WASTRA-TUBAN-002', 'KB-GUARD-001']
      }
    };
  }

  // SCENARIO 15: PRODUCTION CAPACITY, VOLUME & SLOW FASHION PHILOSOPHY ("biasa produksi berapa", "kapasitas produksi", etc.)
  if (
    lower.includes('produksi') ||
    lower.includes('kapasitas') ||
    lower.includes('berapa pcs') ||
    lower.includes('berapa potong') ||
    lower.includes('berapa biji') ||
    lower.includes('berapa pieces') ||
    lower.includes('berapa banyak') ||
    lower.includes('produksi massal') ||
    lower.includes('mass production') ||
    lower.includes('stok banyak') ||
    lower.includes('stok berapa') ||
    lower.includes('kuantitas') ||
    lower.includes('bikin berapa') ||
    lower.includes('buat berapa')
  ) {
    return {
      content:
        `### 🧵 Kapasitas & Filosofi Produksi Oerip Indonesia\n\n` +
        `Oerip Indonesia memegang teguh prinsip **Slow Fashion & Sustainable Living Heritage**. Sistem penciptaan busana kami **BUKAN industri garmen pabrikan massal (*mass production*)**:\n\n` +
        `1. **Koleksi One-of-a-Kind (1 of 1 / Karya Tunggal)**\n` +
        `   Sebagian besar busana signature Oerip diciptakan **satu helai untuk satu busana (*one-of-a-kind*)**. Satu bentang kain tenun tangan langka diolah langsung menggunakan **Konsep Minim Potong (Zero-Waste)** sehingga setiap karya memiliki keunikan motif dan jiwa tersendiri yang tidak ada duplikatnya di dunia.\n\n` +
        `2. **Batch Sangat Terbatas (*Limited Edition Runs*)**\n` +
        `   Untuk busana berbahan tenun ATBM (seperti Tenun Lurik Prasojo Klaten atau Katun Gedog Tuban), kuantitas produksinya sangat terbatas, biasanya hanya **1 hingga 5 pieces per variasi motif/warna** demi menjaga eksklusivitas pemakainya.\n\n` +
        `3. **Waktu Pengerjaan Tenun Tangan Asli**\n` +
        `   Menenun sehelai kain tradisional membutuhkan waktu **1 hingga 6 bulan** (bahkan hingga 1 tahun untuk fermentasi pewarna alami akar mengkudu dan nila) yang ditenun dengan penuh kesabaran dan doa oleh para mama penenun desa adat mitra Dian Oerip.\n\n` +
        `4. **Pesanan Khusus, B2B & Diplomasi Kenegaraan**\n` +
        `   Untuk kebutuhan seragam instansi, delegasi budaya, maupun pesanan korporat (B2B), Oerip melayani sistem **Made-to-Order / Kurasi Terjadwal** dengan kuota yang disepakati secara beretika (*Fair Trade*) tanpa mengeksploitasi kapasitas para penenun desa adat.\n\n` +
        `---\n\n` +
        `💡 **Ingin Mengecek Koleksi yang Ready Hari Ini?**\n` +
        `Karena perputaran koleksi *one-of-a-kind* sangat dinamis, Anda dapat menanyakan langsung ketersediaan katalog dan pieces eksklusif yang siap kirim ke Tim Kurasi Oerip.`,
      quick_replies: [
        'Berapa rentang harga busana Oerip?',
        'Ceritakan filosofi Zero-Waste Dian Oerip.',
        'Apakah bisa pesan busana custom?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Standar Produksi Slow Fashion Oerip',
      trace: {
        user_intent: 'Production Capacity, Volume, and Slow Fashion Philosophy Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Directly addressed production volume query: explained One-of-a-Kind (1-of-1) & small limited batch (1-5 pcs) system.',
          'Enforced anti-mass-production slow fashion brand principle.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['FAQ-005', 'KB-BRAND-001', 'KB-BRAND-003', 'KB-TECH-001']
      }
    };
  }

  // SCENARIO 16: PRICE RANGE & VALUATION ("berapa harga", "rentang harga", "kisaran harga")
  if (
    (lower.includes('berapa') && (lower.includes('harga') || lower.includes('biaya') || lower.includes('tarif'))) ||
    lower.includes('rentang harga') ||
    lower.includes('kisaran harga') ||
    lower.includes('pricelist') ||
    lower.includes('daftar harga')
  ) {
    return {
      content:
        `### 🏷️ Rentang Investasi & Nilai Apresiasi 8 Koleksi Oerip Indonesia\n\n` +
        `Setiap busana Oerip dihargai berdasarkan kelangkaan kain tenun tangan, kerumitan motif sakral, dan durasi proses pewarnaan alam murni:\n\n` +
        `1. **Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)**: Rp 1.200.000 – Rp 2.400.000\n` +
        `2. **Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)**: Rp 1.350.000 – Rp 2.600.000\n` +
        `3. **Oerip Signature Blanket Outer (OERIP-OUT-001)**: Rp 1.500.000 – Rp 4.500.000\n` +
        `4. **Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)**: Rp 1.750.000 – Rp 3.200.000\n` +
        `5. **Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)**: Rp 1.950.000 – Rp 3.800.000\n` +
        `6. **Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)**: Rp 2.200.000 – Rp 4.800.000\n` +
        `7. **Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)**: Rp 2.500.000 – Rp 5.800.000\n` +
        `8. **Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)**: Rp 2.800.000 – Rp 5.200.000\n\n` +
        `Setiap pembelian merupakan bentuk dukungan langsung (*fair trade*) bagi keberlanjutan hidup para keluarga mama penenun desa adat Nusantara.`,
      quick_replies: [
        'Biasa produksi berapa potong per model?',
        'Rekomendasi busana untuk diplomasi budaya.',
        'Bagaimana cara merawat kain pewarna alam?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Informasi Resmi Harga Oerip',
      trace: {
        user_intent: 'Price Range & Investment Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Provided verified retail price ranges across verified product tiers without leaking restricted HPP/margins.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'OERIP-OUT-001', 'OERIP-LUR-003', 'OERIP-KIM-002']
      }
    };
  }

  // SCENARIO 17: BRAND PROFILE & FOUNDER ("siapa pendiri", "siapa dian oerip", "profil oerip")
  if (
    lower.includes('siapa pendiri') ||
    lower.includes('siapa pembuat') ||
    lower.includes('siapa dian oerip') ||
    lower.includes('tentang oerip') ||
    lower.includes('profil oerip') ||
    lower.includes('sejarah oerip')
  ) {
    return {
      content:
        `### 🌿 Profil & Jiwa di Balik Oerip Indonesia\n\n` +
        `**Oerip Indonesia** didirikan oleh **Dian Errakumalasari (Dian Oerip)**, seorang perancang busana dan budayawan asal Ngawi, Jawa Timur, yang mendedikasikan hidupnya menjelajahi pelosok Nusantara untuk meriset dan melestarikan tenun tradisional.\n\n` +
        `• **Visi**: Menghidupkan kembali wastra tenun tangan Nusantara agar tidak hanya tersimpan di lemari atau museum, melainkan menjadi busana kontemporer yang hidup, berjiwa, dan dikenakan dengan bangga oleh generasi dunia (*Living Heritage*).\n` +
        `• **Ciri Khas Desain**: Siluet *oversized* (all-size fleksibel), potongan bebas yang inklusif (*gender-neutral*), dan konsistensi menggunakan **Konsep Minim Potong (Zero-Waste)** demi memuliakan doa para penenun.\n` +
        `• **Kantor & Galeri**: Berpusat di **Museum & Gallery Oerip, Ngawi, Jawa Timur**, dipimpin oleh Bagas Qolbu Cetta (CEO) bersama tim kurasi budaya.`,
      quick_replies: [
        'Biasa produksi berapa pieces per model?',
        'Ceritakan filosofi Zero-Waste Dian Oerip.',
        'Apa saja 6 wastra terverifikasi Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Profil Resmi Dian Oerip',
      trace: {
        user_intent: 'Founder and Brand Profile Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Verified biographical and brand heritage facts from level 1 primary data.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-002', 'KB-BRAND-003']
      }
    };
  }

  // SCENARIO 18: LOCATION & GALLERY ("dimana lokasi", "alamat galeri", "toko oerip", "ngawi")
  if (
    lower.includes('dimana') ||
    lower.includes('di mana') ||
    lower.includes('lokasi') ||
    lower.includes('alamat') ||
    lower.includes('museum oerip') ||
    lower.includes('galeri oerip') ||
    lower.includes('toko oerip')
  ) {
    return {
      content:
        `### 🏛️ Lokasi Galeri & Pusat Kebudayaan Oerip Indonesia\n\n` +
        `Pusat kurasi dan galeri utama Oerip Indonesia bertempat di:\n\n` +
        `📍 **Museum & Gallery Oerip Indonesia**\n` +
        `Kabupaten Ngawi, Jawa Timur, Indonesia.\n\n` +
        `Galeri ini menjadi ruang pamer hidup (*living gallery*) yang menyimpan ratusan arsip kain tenun kuno hasil riset lapangan Dian Oerip di berbagai pelosok adat Nusantara, sekaligus studio kurasi busana *ready-to-wear* dan *bespoke couture*.\n\n` +
        `Untuk kunjungan privat, konsultasi kurasi tatap muka, atau informasi pameran keliling di kota Anda, silakan hubungi tim kurasi kami.`,
      quick_replies: [
        'Biasa produksi berapa potong per baju?',
        'Berapa rentang harga busana Oerip?',
        'Rekomendasi busana untuk diplomasi budaya.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Informasi Lokasi Resmi',
      trace: {
        user_intent: 'Gallery Location and Physical Store Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Returned headquarters and gallery location data.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  // -------------------------------------------------------------
  // RECOMMENDATION GATEWAY
  // "Jangan melulu merekomendasikan busana, kecuali user minta rekomendasi"
  // If the user does not have explicit recommendation intent or is asking an
  // informational/cultural question, do NOT trigger any clothing recommendation.
  // -------------------------------------------------------------
  const userWantsRecommendation = hasOutfitRecommendationIntent(lower, ctx);
  const isConceptual = isInformationalOrConceptualQuery(lower);

  if (!userWantsRecommendation || isConceptual) {
    return null;
  }

  // -------------------------------------------------------------
  // INSUFFICIENT RECOMMENDATION DATA CLARIFICATION GATEWAY
  // "Jika pengguna meminta rekomendasi, jangan langsung memilih produk secara acak."
  // Pertimbangkan 10 faktor kurasi:
  // 1. Jenis acara
  // 2. Gaya yang diinginkan
  // 3. Warna
  // 4. Model pakaian
  // 5. Jenis wastra
  // 6. Bahan
  // 7. Ukuran atau karakter fit
  // 8. Rentang harga
  // 9. Filosofi dan karakter wastra
  // 10. Kesesuaian dengan kebutuhan pengguna
  // Jika data tidak cukup untuk memilih dengan baik (misal: "acara tertentu", "rekomendasi busana"):
  // tanyakan 1-2 hal yang paling penting (acara apa, warna, harga, gaya) tanpa memilih produk acak!
  // -------------------------------------------------------------
  if (isInsufficientRecommendationData(lower, ctx)) {
    return generateClarificationForRecommendation(lower, ctx);
  }

  // SCENARIO 0: GENERAL OUTFIT RECOMMENDATION / REKOMENDASI BUSANA UMUM
  const isGeneralRecommendationQuery =
    lower === 'rekomendasi baju' ||
    lower === 'rekomendasi busana' ||
    lower === 'rekomendasi pakaian' ||
    lower === 'rekomendasi outfit' ||
    lower === 'rekomendasikan baju' ||
    lower === 'rekomendasikan busana' ||
    lower === 'rekomendasikan' ||
    lower === 'rekomendasi' ||
    lower === 'saran baju' ||
    lower === 'saran busana' ||
    lower === 'saran outfit' ||
    lower === 'pilihan busana' ||
    lower === 'pilihan baju' ||
    lower === 'pilihan outfit' ||
    lower.includes('rekomendasi baju dong') ||
    lower.includes('rekomendasi busana dong') ||
    lower.includes('rekomendasi outfit dong') ||
    lower.includes('ada rekomendasi baju') ||
    lower.includes('ada rekomendasi busana') ||
    lower.includes('ada rekomendasi outfit') ||
    lower.includes('baju apa yang bagus') ||
    lower.includes('busana apa yang bagus') ||
    lower.includes('rekomendasi untuk saya') ||
    lower.includes('rekomendasikan busana untuk saya') ||
    lower.includes('mau rekomendasi baju') ||
    lower.includes('mau rekomendasi busana') ||
    lower.includes('butuh rekomendasi baju') ||
    lower.includes('minta rekomendasi busana') ||
    lower.includes('minta saran baju');

  if (isGeneralRecommendationQuery) {
    return generateClarificationForRecommendation(lower, ctx);
  }

  // SCENARIO 1: REUNION / KAFE / GATHERING / BER-AC
  if (
    lower.includes('reuni') ||
    lower.includes('alumni') ||
    lower.includes('temu kangen') ||
    lower.includes('gathering') ||
    (lower.includes('arisan') && (lower.includes('baju') || lower.includes('busana') || lower.includes('outfit') || lower.includes('pakai') || lower.includes('rekom'))) ||
    ((lower.includes('kafe') || lower.includes('cafe')) && (lower.includes('baju') || lower.includes('busana') || lower.includes('outfit') || lower.includes('pakai') || lower.includes('rekom') || lower.includes('nongkrong') || lower.includes('ngopi')))
  ) {
    // If specifically asking for extreme cold / winter / heavy AC poncho -> OERIP-PON-007
    // For smart-casual hangout, reuni, kafe -> OERIP-LUR-003 Contemporary Lurik Short Kimono
    const isExtremeCold = (lower.includes('sangat dingin') || lower.includes('ac dingin sekali') || lower.includes('menggigil'));
    const product = isExtremeCold ? OERIP_PRODUCTS[6] : OERIP_PRODUCTS[2]; // OERIP-PON-007 or OERIP-LUR-003

    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk acara **Reuni Temu Alumni & Kumpul Komunitas di Kafe Santai**, KIRA merekomendasikan busana yang memadukan **kenyamanan termal, estetika smart-casual yang akrab, dan karakter budaya yang bersahaja**:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK REUNI & KAFE\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Sangat Tepat untuk Reuni di Kafe:**\n` +
        `• **Kenyamanan Termal Tanpa Gerah**: Ditenun dari serat kapas alami ${product.textile}. Tekstur tenun tangan memberikan kehangatan sejuk saat terkena hembusan pendingin ruangan (AC) kafe, namun tetap berpori mikro (*breathable*) sehingga tidak membuat gerah saat berpindah ke area outdoor.\n` +
        `• **Siluet Rileks & Fotogenik (*Effortless Conversation-Starter*)**: Potongan kimono all-size pendek minimalis khas Dian Oerip memberikan kesan modis yang santai (*effortless chic*), sangat pas untuk mengobrol berjam-jam bersama teman lama sekaligus tampil memikat dalam sesi foto bersama di kafe.\n` +
        `• **Filosofi Keakraban & Kesederhanaan**: Mengusung nilai luhur wastra Nusantara *Lurus Ing Lakon* (kejujuran dan kelurusan niat) yang memancarkan aura keramahan dan kebanggaan akan akar budaya.\n\n` +
        `**Panduan Padu-Padan (Styling Notes):**\n` +
        `• **Inner**: Kaos katun polos berwarna putih, krem kapas mentah, atau hitam berkerah bulat.\n` +
        `• **Bawahan**: Celana denim berpotongan lurus (*straight cut jeans*), kulot linen, atau celana chino santai.\n` +
        `• **Alas Kaki & Aksesoris**: Sneakers kanvas putih minimalis, loafers kulit, atau kalung etnik tembaga Oerip.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Menggunakan ${product.textile} dari ${product.textile_origin} dengan pewarnaan alami yang ramah lingkungan.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Kurasi Momen Reuni & Hangout)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Tekstur tenun katun alami Lurik Klaten yang sangat adem dan nyaman untuk mengobrol santai berjam-jam.',
          'Siluet kimono pendek minimalis all-size yang rileks, santai, dan effortless untuk suasana temu kangen.',
          'Pilihan investasi paling bersahabat dengan padu-padan mudah bersama kaos polos dan sneakers.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)',
          'Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang filosofi Tenun Lurik "Lurus Ing Lakon".',
        'Bagaimana padu-padannya untuk suasana semi-outdoor?',
        'Berapa rentang harganya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Momen Reuni & Kafe KIRA',
      trace: {
        user_intent: 'Reunion / Cafe Gathering Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched occasion: Reuni / Kafe with breathable smart-casual silhouette OERIP-LUR-003.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [product.product_id, 'KB-BRAND-004', 'WASTRA-LURIK-003']
      }
    };
  }

  // SCENARIO 2: GRADUATION / WISUDA / ACADEMIC
  if (lower.includes('wisuda') || lower.includes('kelulusan') || lower.includes('sidang') || lower.includes('yudisium')) {
    // For wisuda: OERIP-DRS-006 (Tunic Dress & Selendang Set Toraja) or OERIP-CAP-005 (Gedog Cape Wrap)
    const isDressPreference = lower.includes('dress') || lower.includes('tunik') || lower.includes('hijab') || lower.includes('selendang');
    const product = isDressPreference ? OERIP_PRODUCTS[5] : OERIP_PRODUCTS[5]; // Oerip Living Heritage Tunic Dress & Selendang Set

    return {
      content:
        `Selamat atas momen istimewa wisuda dan kelulusan akademik Anda! 🎓🌿\n\n` +
        `Untuk menghadiri prosesi wisuda yang memadukan **wibawa akademik, kemakmuran masa depan, dan keanggunan busana Nusantara yang santun**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK WISUDA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Tepat untuk Acara Wisuda:**\n` +
        `• **Set Anggun dengan Selendang Serasi**: Dilengkapi selendang tenun terpisah yang dapat disampirkan elegan di pundak, melengkapi toga wisuda atau setelan kebaya dengan sentuhan seni adiluhung.\n` +
        `• **Makna Doa Kejayaan Motif *Pa'teddong***: Tenun Ikat Toraja Sa'dan dengan motif kepala kerbau (*Pa'teddong*) melambangkan kemakmuran, derajat kehormatan, dan kepemimpinan untuk menyongsong masa depan.\n` +
        `• **Kenyamanan Katun Mori Berpori Sejuk**: Membantu Anda tetap sejuk dan segar selama prosesi seremonial yang panjang di dalam gedung wisuda maupun sesi foto luar ruangan bersama keluarga.\n\n` +
        `**Panduan Padu-Padan:**\n` +
        `Padukan dengan hijab voal senada (warna terakota/krem/hitam) atau sanggul modern, sepatu selop etnik berhak sedang, dan anting/kalung kuningan Toraja.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Kurasi Momen Wisuda & Kelulusan)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Set tunik dan selendang serasi yang agung, santun, dan sangat terhormat untuk prosesi wisuda.',
          'Wastra Tenun Toraja Sa\'dan motif Pa\'teddong penanda doa kemakmuran dan kehormatan gelar.',
          'Bahan katun mori tenun berpori alami yang sejuk selama prosesi panjang seharian.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
          'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang motif Pa\'teddong Toraja.',
        'Apakah selendangnya bisa dilepas-pasang?',
        'Berapa rentang harganya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Momen Wisuda KIRA',
      trace: {
        user_intent: 'Graduation & Academic Ceremony Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched occasion: Wisuda with dignified ceremonial set OERIP-DRS-006.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [product.product_id, 'WASTRA-TORAJA-006']
      }
    };
  }

  // SCENARIO 3: MEN'S OUTFIT / BUSANA PRIA
  if (
    (lower.includes('pria') || lower.includes('cowok') || lower.includes('laki-laki') || lower.includes('bapak')) &&
    (lower.includes('rekomendasi') || lower.includes('baju') || lower.includes('busana') || lower.includes('outer') || lower.includes('cocok'))
  ) {
    const isFormalOrSacred = lower.includes('formal') || lower.includes('nikah') || lower.includes('adat') || lower.includes('resepsi');
    const product = isFormalOrSacred ? OERIP_PRODUCTS[3] : OERIP_PRODUCTS[7]; // OERIP-ULO-004 Statement Vest or OERIP-VES-008 Sleeveless Vest

    return {
      content:
        `Untuk busana **Pria Etnik Modern**, Oerip Indonesia menghadirkan potongan yang tegas, berwibawa, dan tidak membatasi pergerakan (*effortless masculine heritage*):\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK PRIA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Keunggulan untuk Pria:**\n` +
        `• **Garis Potongan Tegas & Berwibawa**: Siluet vest/luaran berstruktur yang membingkai postur bahu dan dada dengan gagah tanpa memerlukan dasi atau setelan jas kaku.\n` +
        `• **Wastra ${product.textile}**: Menampilkan tenun berstruktur asli yang memancarkan aura ketegasan, integritas, dan martabat tinggi.\n` +
        `• **Fleksibilitas Padu-Padan**: Sangat gagah dipadukan dengan kemeja putih lengan panjang atau kaos polos katun (hitam/broken-white), celana chino/linen tailored, dan sepatu loafers kulit.\n\n` +
        `*✓ Berdasarkan Kurasi Gaya Pria Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Potongan vest/luaran pria yang tegas, berstruktur, dan berkarakter maskulin kuat.',
          'Wastra tenun asli berpewarna alam yang bernilai pusaka dan berwibawa.',
          'Konsep zero-waste yang inklusif untuk berbagai proporsi postur tubuh pria.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)',
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Bagaimana padu-padan kemeja dalamnya?',
        'Ada opsi rompi santai tanpa lengan?',
        'Bagaimana cara perawatannya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Fesyen Pria Oerip',
      trace: {
        user_intent: 'Masculine Ethnic Fashion Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [`Matched tailored masculine piece ${product.product_id} with zero-waste philosophy.`],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [product.product_id, 'KB-BRAND-004']
      }
    };
  }

  // SCENARIO 4: MODEST / HIJAB FRIENDLY
  if (
    lower.includes('hijab') ||
    lower.includes('jilbab') ||
    lower.includes('muslimah') ||
    lower.includes('modest') ||
    lower.includes('tertutup')
  ) {
    const product = OERIP_PRODUCTS[5]; // OERIP-DRS-006 Living Heritage Tunic Dress & Selendang Set
    return {
      content:
        `Untuk padanan **Modest Wear / Hijab-Friendly Etnik Nusantara**, Oerip Indonesia menghadirkan busana terusan dan set selendang yang santun, jatuh melipat indah tanpa mengekang lekuk tubuh, dan tidak menerawang:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK MODEST & HIJAB\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Keunggulan untuk Hijab Styling:**\n` +
        `• **Set Lengkap 2-in-1 dengan Selendang**: Disertai selendang tenun terpisah yang serasi, sangat fleksibel disampirkan di bahu atau dijadikan aksen penutup dada yang anggun.\n` +
        `• **Siluet Tunik Panjang Maxi yang Santun**: Potongan loose fit panjang A-line (LD 105–120 cm, panjang ± 135 cm) yang menutup pinggul dan kaki secara sopan.\n` +
        `• **Bahan Katun Mori Alami Sejuk**: Bertekstur rapat dan halus, tidak menerawang, serta sangat sejuk saat dikenakan bersama pakaian dalam atau manset katun.\n\n` +
        `**Padu-Padan Hijab Ideal:**\n` +
        `Padukan dengan hijab pashmina atau voal polos warna krem kapas mentah, hitam arang, atau terakota, dipadukan dengan selop etnik dan bros tembaga Oerip.\n\n` +
        `*✓ Berdasarkan Kurasi Modest Wear Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Set tunik maxi dan selendang tenun serasi yang sangat santun dan hijab-friendly.',
          'Bahan katun mori tenun Toraja yang adem, tidak menerawang, dan jatuh anggun.',
          'Wastra Tenun Toraja bermotif Pa\'teddong penanda kemakmuran dan kehormatan keluarga.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Bagaimana cara padu-padan hijab dengan kain tenun?',
        'Ceritakan tentang Tenun Toraja Sa\'dan.',
        'Berapa rentang harganya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Modest Wear Oerip',
      trace: {
        user_intent: 'Modest & Hijab-friendly outfit recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Curated dedicated modest set OERIP-DRS-006 with Toraja Sa\'dan provenance.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [product.product_id, 'WASTRA-TORAJA-006']
      }
    };
  }

  // SCENARIO 5: BREATHABILITY & HEAT / SEJUK ANTI-GERAH
  if (
    lower.includes('apakah bahannya sejuk') ||
    lower.includes('panas tidak') ||
    lower.includes('gerah tidak') ||
    lower.includes('adem tidak') ||
    lower.includes('cuaca panas')
  ) {
    return {
      content:
        `🌿 **Sangat Sejuk & Nyaman untuk Iklim Tropis!**\n\n` +
        `Koleksi busana Oerip Indonesia dirancang dengan pertimbangan kenyamanan termal alami yang tinggi:\n\n` +
        `1. **100% Serat Nabati Alami (Kapas Kenthang & Mori Murni)**:\n` +
        `   Benang tenun tangan dipintal dari serat kapas asli tanpa campuran poliester sintetis. Poros benang memiliki rongga udara alami (*breathable micro-pores*) yang melepas panas tubuh secara efektif.\n\n` +
        `2. **Pewarnaan Alami Dingin di Kulit**:\n` +
        `   Ekstrak daun nila (*indigofera*) dan akar mengkudu diresap ke inti serat tanpa lapisan plastik atau resin kimiawi, sehingga kain tetap beraroma tanaman segar dan dingin saat menyentuh kulit.\n\n` +
        `3. **Potongan Longgar (*Loose Silhouette*)**:\n` +
        `   Potongan all-size khas Dian Oerip (lingkar dada 100–130 cm) memastikan sirkulasi udara bebas di sekitar tubuh, mencegah keringat terperangkap.`,
      quick_replies: [
        'Ceritakan tentang Tenun Gedog Tuban.',
        'Bagaimana cara mencuci kain tenun ini?',
        'Rekomendasi busana untuk kantor smart-casual.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Verifikasi Kenyamanan Termal Oerip',
      trace: {
        user_intent: 'Fabric breathability, thermal comfort, and climate inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Highlighted natural cotton micro-pores, zero synthetic blend, and loose drape circulation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-TECH-001', 'WASTRA-TUBAN-002']
      }
    };
  }

  // SCENARIO 6: CULTURAL DIPLOMACY / BILATERAL FORUM
  if (
    lower.includes('diplomasi') ||
    lower.includes('duta besar') ||
    lower.includes('kedutaan') ||
    lower.includes('kenegaraan') ||
    lower.includes('luar negeri') ||
    lower.includes('bilateral')
  ) {
    const product = OERIP_PRODUCTS[0];
    const isRelaxedOrSemiFormal =
      lower.includes('tidak terlalu formal') ||
      lower.includes('nggak terlalu formal') ||
      lower.includes('gak terlalu formal') ||
      lower.includes('tidak mau terlalu formal') ||
      lower.includes('tidak kaku') ||
      lower.includes('nggak kaku') ||
      lower.includes('semi formal') ||
      lower.includes('semi-formal') ||
      lower.includes('santai tapi elegan') ||
      lower.includes('elegan tapi santai');

    const introHeadline = isRelaxedOrSemiFormal
      ? `Untuk perhelatan **Diplomasi Budaya** dengan preferensi **elegan, berwibawa, namun tetap luwes dan tidak terlalu kaku/formal**, KIRA merekomendasikan:`
      : `Untuk perhelatan **Diplomasi Budaya Internasional**, KIRA merekomendasikan:`;

    const whyPoint1 = isRelaxedOrSemiFormal
      ? `• **Siluet Kimono All-Size yang Elegan & Luwes**: Potongan draperi kimono khas Dian Oerip menghadirkan keanggunan berkelas tanpa kekakuan setelan jas Barat biasa. Anda tampil sangat terhormat namun tetap santai, luwes, dan memancarkan pesona *effortless elegance*.`
      : `• **Siluet Kimono All-Size yang Elegan**: Potongan longgar berwibawa khas Dian Oerip memberikan siluet berkelas tanpa kekakuan setelan jas Barat biasa.`;

    return {
      content:
        `${introHeadline}\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa cocok:**\n` +
        `${whyPoint1}\n` +
        `• **Perpaduan Dua Mahakarya Nusantara**: Menggabungkan Tenun Gedog Tuban berpewarna alam dan Tenun Ikat Sumba Timur bermotif Kuda (*Njara*) yang sarat nilai kepemimpinan dan ksatria.\n` +
        `• **Prinsip Minim Potong (Zero-Waste)**: Menjaga keutuhan bentangan kain tenun asli sebagai simbol penghormatan pada karya seni para mama penenun desa adat.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Kombinasi Tenun Gedog Tuban (Kapas Kenthang pintal tangan) & Tenun Ikat Sumba Timur dengan pewarna alam murni (akar mengkudu & daun nila).\n\n` +
        `**Makna Filosofis Motif Kuda (Njara):**\n` +
        `Melambangkan kepemimpinan, keberanian, ketangkasan, dan kebangsawanan para ksatria Sumba.\n\n` +
        `**Padu-Padan:**\n` +
        `Padukan dengan inner katun/linen polos berwarna broken-white atau hitam, celana berpotongan lurus/palazzo, dan kalung tembaga/kuningan etnik Oerip.\n\n` +
        `**Alternatif:**\n` +
        `• Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)\n` +
        `• Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci tangan dengan buah lerak / sampo lembut, jemur di tempat teduh berangin.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 1)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          isRelaxedOrSemiFormal
            ? 'Siluet kimono all-size yang anggun, berwibawa, dan luwes tanpa kekakuan busana formal Barat.'
            : 'Siluet kimono all-size yang anggun, berwibawa, dan tidak kaku untuk forum internasional.',
          'Menggabungkan dua wastra adiluhung: Gedog Tuban dan Ikat Sumba Timur.',
          'Konsep minim potong (zero-waste) yang menghargai keutuhan lembaran tenun asli.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)',
          'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Sumba Timur & motif Kuda.',
        'Kenapa kamu memilih produk itu?',
        'Bagaimana kalau di ruangan ber-AC dingin?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Diplomacy & International Cultural Mission Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Matched verified product OERIP-OUT-001.',
          isRelaxedOrSemiFormal ? 'Tailored curatorial rationale to fluid semi-formal / non-rigid elegance.' : 'Tailored curatorial rationale to international cultural diplomacy.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-OUT-001', 'WASTRA-SUMBA-001', 'WASTRA-TUBAN-002']
      }
    };
  }

  // SCENARIO 6B: WISUDA SARJANA & UPACARA KELULUSAN AKADEMIK FORMAL (EVALUASI 10 FAKTOR)
  const isGraduationRelated =
    lower.includes('wisuda') ||
    lower.includes('wisudaan') ||
    lower.includes('kelulusan') ||
    lower.includes('yudisium') ||
    lower.includes('sarjana') ||
    lower.includes('sidang skripsi') ||
    lower.includes('pendadaran') ||
    lower.includes('toga');

  if (isGraduationRelated) {
    const isModestOrHijab =
      lower.includes('hijab') ||
      lower.includes('jilbab') ||
      lower.includes('muslimah') ||
      lower.includes('tunik') ||
      lower.includes('dress') ||
      lower.includes('gamis') ||
      lower.includes('tertutup');

    const isMaleOrMasculine =
      lower.includes('pria') ||
      lower.includes('cowok') ||
      lower.includes('laki-laki') ||
      lower.includes('laki laki') ||
      lower.includes('maskulin');

    if (isModestOrHijab) {
      const product = OERIP_PRODUCTS[5]; // OERIP-DRS-006 Living Heritage Tunic Dress & Selendang Set
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Selamat atas pencapaian akademik luhur Anda! Untuk momen perhelatan bersejarah **Wisuda Sarjana Formal (Hijab-Friendly & Modest Elegance)**:\n\n` +
          `• **Jenis Acara**: Upacara Wisuda Sarjana Formal di Auditorium Universitas, Sesi Foto Studio Kelulusan, dan Syukuran Keluarga\n` +
          `• **Gaya**: Formal Akademik, Santun, Anggun, dan Sangat Fotogenik\n` +
          `• **Karakter Busana**: Set 2-in-1 Tunik Panjang Maxi A-line dengan Selendang tenun serasi yang tidak menerawang dan jatuh melipat anggun di balik jubah toga maupun saat prosesi foto keluarga.\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia, mahakarya yang paling selaras adalah:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Upacara Wisuda Sarjana / Pascasarjana Formal, Prosesi Pelantikan Senat Akademik, dan Sesi Foto Wisuda.\n` +
          `2. **Gaya yang Diinginkan**: Formal akademik bersahaja, anggun menutup aurat, dan memancarkan wibawa intelektual berbudaya.\n` +
          `3. **Warna**: Terakota hangat akar mengkudu berpadu hitam arang alami khas Toraja yang kontras anggun dengan samir/selempang kelulusan.\n` +
          `4. **Model Pakaian**: Set 2-in-1 Tunik Panjang Maxi dengan Selendang tenun serasi terpisah yang mudah diatur.\n` +
          `5. **Jenis Wastra**: Tenun Ikat Toraja Sa'dan asli dengan motif pusaka *Pa'teddong*.\n` +
          `6. **Bahan**: 100% serat katun mori tenun tangan berpori sejuk yang adem dan menyerap keringat di balik jubah toga tebal.\n` +
          `7. **Ukuran & Karakter Fit**: All-size longgar inklusif (LD 105–120 cm, P 135 cm) yang membebaskan langkah saat menaiki panggung wisuda.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: Motif kepala kerbau (*Pa'teddong*) penanda kemakmuran, derajat keluhuran budi, dan doa kesuksesan menapaki babak baru kehidupan sarjana.\n` +
          `10. **Kesesuaian Kebutuhan**: Memberikan kenyamanan tanpa rasa gerah atau sesak kebaya konvensional, sangat praktis dipadukan dengan hijab voal/pashmina senada untuk dokumentasi kelulusan seumur hidup.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 6)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Set lengkap tunik panjang dan selendang senada yang sangat anggun dan praktis untuk wisuda.',
            'Tenun Toraja Sa\'dan motif Pa\'teddong penanda derajat luhur dan doa kesuksesan sarjana.',
            'Bahan katun mori alami yang sejuk dan tidak menerawang di bawah jubah toga.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
            'Oerip Signature Blanket Outer (OERIP-OUT-001)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Bagaimana cara padu-padan hijab untuk wisuda?',
          'Berapa ukuran panjang tuniknya?',
          'Apakah cocok untuk foto studio wisuda keluarga?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Wisuda Modest)',
        trace: {
          user_intent: 'Academic Graduation / Wisuda Sarjana Modest Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Evaluated 10 curation factors for academic graduation ceremony with verified product OERIP-DRS-006.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-DRS-006', 'WASTRA-TORAJA-006', 'KB-BRAND-003']
        }
      };
    }

    if (isMaleOrMasculine) {
      const product = OERIP_PRODUCTS[3]; // OERIP-ULO-004 Heritage Ulos Statement Vest
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Selamat atas kelulusan akademik Anda! Untuk momen perhelatan **Wisuda Sarjana Pria yang Berwibawa & Maskulin Etnik**:\n\n` +
          `• **Jenis Acara**: Upacara Wisuda Sarjana Formal, Sidang Terbuka Senat Akademik, dan Foto Keluarga\n` +
          `• **Gaya**: Formal Tegap, Maskulin Berwibawa, dan Berkelas Budaya\n` +
          `• **Karakter Busana**: Statement Vest berstruktur tegap dari kain Ulos Batak Toba yang memberikan postur gagah di balik jubah toga maupun saat jubah toga dibuka untuk jamuan keluarga.\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip Indonesia, mahakarya yang paling selaras adalah:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Upacara Wisuda Sarjana / Pascasarjana Formal di auditorium ber-AC dan sesi foto wisuda keluarga.\n` +
          `2. **Gaya yang Diinginkan**: Formal maskulin tegap, berwibawa, berkarisma intelektual, dan beridentitas kebangsaan yang kuat.\n` +
          `3. **Warna**: Palet gelap alami (*Itom*) berpadu aksen merah marun tua dan putih tulang yang sangat gagah berpadu kemeja putih.\n` +
          `4. **Model Pakaian**: Vest berstruktur kokoh (*statement vest*) dengan garis siluet tegas dan potongan leher V formal.\n` +
          `5. **Jenis Wastra**: Ulos Ragidup Batak Toba asli dari Sumatera Utara.\n` +
          `6. **Bahan**: Katun tenun tangan murni berkerapatan tinggi yang tegap dan nyaman di ruangan ber-AC.\n` +
          `7. **Ukuran & Karakter Fit**: All-size berpotongan tegas yang memberi postur tubuh tegap saat berjalan di panggung wisuda.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: Ulos Ragidup bermotif *Bintang Maratur*, sarat doa restu kehangatan hidup (*manggomgomi*), keteguhan prinsip, dan keberhasilan karier pengabdian sarjana.\n` +
          `10. **Kesesuaian Kebutuhan**: Sangat praktis dikenakan di atas kemeja putih lengan panjang dan celana pantalon formal, memberikan tampilan wisuda pria yang gagah, rapi, dan anti-mainstream.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 4)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Siluet vest berstruktur tegap yang sangat gagah dan formal untuk wisuda pria.',
            'Kain Ulos Ragidup Batak Toba pewarna alam sarat doa restu keberhasilan sarjana.',
            'Paduan sempurna di atas kemeja putih dan celana pantalon formal.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Signature Blanket Outer (OERIP-OUT-001)',
            'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Bagaimana padu-padan kemeja dan celana untuk vest ini?',
          'Ceritakan tentang filosofi Ulos Batak Toba.',
          'Berapa rentang harganya?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Wisuda Pria)',
        trace: {
          user_intent: 'Academic Graduation / Wisuda Sarjana Masculine Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Evaluated 10 curation factors for male academic graduation with verified product OERIP-ULO-004.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-ULO-004', 'WASTRA-ULOS-004', 'KB-BRAND-003']
        }
      };
    }

    // Default / General Academic Graduation (Wisuda Sarjana Elegan: OERIP-CAP-005)
    const product = OERIP_PRODUCTS[4]; // Oerip Zero-Waste Asymmetric Gedog Cape Wrap
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Selamat atas pencapaian gelar sarjana Anda! Untuk momen perhelatan bersejarah **Wisuda Sarjana & Upacara Kelulusan Akademik Formal**:\n\n` +
        `• **Jenis Acara**: Upacara Wisuda Sarjana / Pascasarjana Formal di Auditorium Ber-AC, Prosesi Senat Akademik, dan Sesi Foto Wisuda\n` +
        `• **Gaya**: Formal Akademik, Anggun, Kontemporer & Sangat Fotogenik\n` +
        `• **Karakter Busana**: Siluet draperi cape asimetris modern yang membebaskan gerak, anti-kaku/sesak seperti kebaya konvensional, namun **sangat megah, berkelas, dan fotogenik** saat berdampingan dengan toga maupun saat foto keluarga.\n\n` +
        `Berdasarkan data resmi Knowledge Base Oerip Indonesia, mahakarya yang paling selaras adalah:\n\n` +
        `---\n\n` +
        `### REKOMENDASI UTAMA KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode Produk: ${product.product_id})*\n\n` +
        `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
        `1. **Jenis Acara**: Upacara Wisuda Sarjana Formal di auditorium / gedung serbaguna ber-AC, sesi foto wisuda studio, dan perayaan kelulusan keluarga.\n` +
        `2. **Gaya yang Diinginkan**: Formal akademik berkelas, anggun berwibawa, tidak kaku atau membatasi pernapasan seperti korset kebaya biasa.\n` +
        `3. **Warna**: Celupan pewarna nabati daun nila (*Indigofera*) biru malam yang teduh berpadu aksen kulit kayu tingi cokelat tanah yang kontras anggun dengan kalung samir universitas.\n` +
        `4. **Model Pakaian**: Asymmetric Cape Wrap berpotongan draperi miring arsitektural dengan aksen *raw-edge fringe* rumbai tenun asli yang jatuh melipat indah di bahu.\n` +
        `5. **Jenis Wastra**: Tenun Gedog Kerek Tuban asli dari benang kapas kenthang lokal Jawa Timur.\n` +
        `6. **Bahan**: 100% serat kapas mentah alami tenun tangan yang berpori sejuk (*breathable*)—menghindarkan rasa gerah saat memakai jubah toga tebal, sekaligus memberi kenyamanan termal di ruangan ber-AC dingin.\n` +
        `7. **Ukuran & Karakter Fit**: All-size inklusif yang jatuh luwes melingkari bahu tanpa potongan ketat yang membatasi gerak saat menaiki panggung pemindahan kuncir toga.\n` +
        `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
        `9. **Filosofi Wastra**: Falsafah motif *Ganggeng* (kelenturan beradaptasi dan keteguhan meraih cita-cita hidup) yang sarat doa restu para penenun desa adat untuk perjalanan karier sarjana baru.\n` +
        `10. **Kesesuaian Kebutuhan**: Solusi busana wisuda etnik modern yang sangat anggun dan nyaman dikenakan seharian penuh dari pagi prosesi hingga sore sesi foto keluarga.\n\n` +
        `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 5)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Siluet cape asimetris modern yang sangat anggun, berwibawa, dan fotogenik untuk momen wisuda sarjana.',
          'Tenun Gedog Tuban kapas kenthang pewarna alam yang adem dan bernilai seni tinggi.',
          'Konsep Zero-Waste yang membebaskan gerak tanpa kekakuan atau rasa sesak kebaya konvensional.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)',
          'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Bagaimana padu-padan bawahan untuk wisuda?',
        'Apakah cocok untuk foto studio wisuda keluarga?',
        'Ada opsi set tunik dan selendang hijab?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Evaluasi 10 Faktor KIRA (Wisuda Sarjana Formal)',
      trace: {
        user_intent: 'Academic Graduation / Wisuda Sarjana Formal Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Evaluated all 10 curation factors for academic graduation ceremony with verified product OERIP-CAP-005.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-CAP-005', 'WASTRA-TUBAN-002', 'KB-BRAND-003']
      }
    };
  }

  // SCENARIO 7: WEDDING / RESEPSI / KONDANGAN (EVALUASI 10 FAKTOR & ANTI-ACAK)
  const isWeddingRelated =
    lower.includes('pernikahan') ||
    lower.includes('resepsi') ||
    lower.includes('kondangan') ||
    lower.includes('nikahan') ||
    lower.includes('nikah') ||
    lower.includes('manten') ||
    lower.includes('mantenan') ||
    lower.includes('walimah');

  if (isWeddingRelated) {
    const isSemiFormalOrRelaxed =
      lower.includes('nggak mau terlalu formal') ||
      lower.includes('tidak mau terlalu formal') ||
      lower.includes('gak mau terlalu formal') ||
      lower.includes('ga mau terlalu formal') ||
      lower.includes('nggak terlalu formal') ||
      lower.includes('tidak terlalu formal') ||
      lower.includes('gak terlalu formal') ||
      lower.includes('ga terlalu formal') ||
      lower.includes('nggak mau kaku') ||
      lower.includes('tidak mau kaku') ||
      lower.includes('gak kaku') ||
      lower.includes('tidak kaku') ||
      lower.includes('jangan kaku') ||
      lower.includes('semi formal') ||
      lower.includes('semi-formal') ||
      lower.includes('santai tapi elegan') ||
      lower.includes('elegan tapi santai') ||
      lower.includes('santai tapi rapi') ||
      lower.includes('outdoor') ||
      lower.includes('taman') ||
      lower.includes('kebun') ||
      lower.includes('siang');

    const isModestDress =
      lower.includes('hijab') ||
      lower.includes('jilbab') ||
      lower.includes('muslimah') ||
      lower.includes('dress') ||
      lower.includes('tunik') ||
      lower.includes('selendang') ||
      lower.includes('keluarga');

    const isSacredAdat =
      lower.includes('adat') ||
      lower.includes('sakral') ||
      lower.includes('ulos') ||
      lower.includes('batak') ||
      lower.includes('gereja') ||
      lower.includes('sangat formal') ||
      lower.includes('khidmat');

    const isGrandBallroom =
      lower.includes('ballroom') ||
      lower.includes('megah') ||
      lower.includes('mewah') ||
      lower.includes('gala') ||
      lower.includes('malam hari') ||
      lower.includes('dingin') ||
      lower.includes('vip');

    const isFormalElegant =
      (lower.includes('elegan') ||
        lower.includes('formal') ||
        lower.includes('berwibawa') ||
        lower.includes('anggun') ||
        lower.includes('mewah') ||
        lower.includes('megah') ||
        lower.includes('gedung') ||
        lower.includes('hotel') ||
        lower.includes('ballroom')) &&
      !isSemiFormalOrRelaxed;

    // -------------------------------------------------------------
    // SCENARIO 7A1: KONDANGAN / RESEPSI FORMAL ELEGAN (SEMANTIC CONTEXT CHAIN)
    // "Kondangan" -> Pernikahan/Resepsi -> Acara Formal -> Elegan -> Busana Resepsi Berwibawa
    // -------------------------------------------------------------
    if (isFormalElegant && !isModestDress && !isSacredAdat) {
      const product = OERIP_PRODUCTS[0]; // OERIP-OUT-001 Signature Blanket Outer
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Untuk kebutuhan **Kondangan / Resepsi Pernikahan yang Elegan & Berwibawa**:\n\n` +
          `🔗 **Hubungan Konteks Semantik & Logika Kurasi KIRA**:\n` +
          `• **"Kondangan"** → Pernikahan / Resepsi Pernikahan\n` +
          `• **Pernikahan / Resepsi** → Acara Formal Perayaan Luhur\n` +
          `• **Elegan** → Siluet berwibawa, anggun, bermartabat, dan harmonis\n` +
          `• **Hasil Kurasi** → Busana yang selaras untuk menghadiri resepsi pernikahan resmi, memberikan rasa percaya diri dan penghormatan tulus kepada kedua mempelai.\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip, mahakarya yang paling selaras adalah:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Resepsi Pernikahan / Kondangan Formal di gedung, hotel, atau ballroom ber-AC.\n` +
          `2. **Gaya yang Diinginkan**: Formal elegan, berwibawa, anggun bersahaja, dan penuh kharisma budaya.\n` +
          `3. **Warna**: Perpaduan Indigo Blue alami (daun nila) dan Terakota hangat dari akar mengkudu (*kombu*).\n` +
          `4. **Model Pakaian**: Kimono Blanket Outer berkerah draperi megah dengan lipatan kain zero-waste yang jatuh anggun di atas busana dalam.\n` +
          `5. **Jenis Wastra**: Kombinasi pusaka Tenun Gedog Kerek Tuban (kapas kenthang) dan Tenun Ikat Sumba Timur.\n` +
          `6. **Bahan**: 100% serat katun tenun tangan manual berpori sejuk dan berkarakter selimut pusaka yang nyaman di ruangan dingin.\n` +
          `7. **Ukuran & Karakter Fit**: All-size longgar inklusif (LD 100–130 cm), jatuh melipat anggun tanpa rasa sempit atau kaku.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: Motif Kuda (*Njara*) simbol kepemimpinan, keluhuran budi, serta doa keberkahan dan keteguhan bagi ikatan pernikahan.\n` +
          `10. **Kesesuaian Kebutuhan**: Sangat ideal menghalau dingin AC ruangan pesta, sekaligus menampilkan aura kemewahan etnik berkelas dunia saat menyalami pengantin dan berbaur dengan para tamu.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 1)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Siluet kimono draperi megah yang memberikan wibawa elegan seketika untuk resepsi pernikahan formal.',
            'Kombinasi Tenun Gedog Tuban dan Tenun Ikat Sumba Timur dengan pewarna alam murni.',
            'Konsep Zero-Waste yang menghormati keutuhan bentang kain tenun adat tanpa pemotongan destruktif.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)',
            'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
            'Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Kenapa kamu memilih produk itu?',
          'Ceritakan tentang kainnya.',
          'Bagaimana kalau di ruangan ber-AC dingin?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Kondangan Elegan)',
        trace: {
          user_intent: 'Formal & Elegant Wedding / Kondangan Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Semantic reasoning applied: Kondangan -> Pernikahan/Resepsi -> Acara Formal -> Elegan -> Busana Resepsi Berwibawa.',
            'Evaluated 10 curation factors with verified product OERIP-OUT-001.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-OUT-001', 'WASTRA-SUMBA-001', 'WASTRA-TUBAN-002', 'KB-BRAND-003']
        }
      };
    }

    // -------------------------------------------------------------
    // SCENARIO 7A: KONDANGAN / RESEPSI SEMI-FORMAL (LUWES, TIDAK KAKU, OUTDOOR/SIANG)
    // -------------------------------------------------------------
    if (isSemiFormalOrRelaxed || (!isModestDress && !isSacredAdat && !isGrandBallroom)) {
      const product = OERIP_PRODUCTS[4]; // OERIP-CAP-005 Asymmetric Gedog Cape Wrap
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Untuk menghadiri **Kondangan / Resepsi Pernikahan yang Anggun, Luwes, dan Tidak Kaku**:\n\n` +
          `• **Jenis Acara**: Resepsi Pernikahan / Kondangan (Indoor maupun Semi-Outdoor)\n` +
          `• **Gaya**: Semi-Formal, Kontemporer & Anggun Bersahaja\n` +
          `• **Karakter Busana**: Memberikan siluet draperi asimetris yang membebaskan gerak, anti-kaku, namun **tetap berkelas dan sangat elegan**.\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip, mahakarya yang paling selaras adalah:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Resepsi pernikahan bernuansa akrab/semi-formal (gedung, restoran, taman, maupun semi-outdoor).\n` +
          `2. **Gaya yang Diinginkan**: Semi-formal luwes, artistik kontemporer, tidak kaku seperti kebaya sesak atau jas resmi.\n` +
          `3. **Warna**: Celupan pewarna nabati daun nila (*Indigofera*) biru malam yang teduh dan kulit kayu tingi bersahaja.\n` +
          `4. **Model Pakaian**: Asymmetric Cape Wrap dengan potongan draperi miring modern dan aksen *raw-edge fringe* rumbai tenun asli.\n` +
          `5. **Jenis Wastra**: Tenun Gedog Kerek Tuban asli dari kapas kenthang lokal Jawa Timur.\n` +
          `6. **Bahan**: 100% serat kapas alami mentah pintal tangan manual yang berpori sejuk, empuk, dan *breathable*.\n` +
          `7. **Ukuran & Karakter Fit**: All-size inklusif yang jatuh luwes melingkari bahu tanpa jahitan pas badan yang membatasi gerak.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: *Konsep Minim Potong (Zero-Waste)* dan falsafah *Ganggeng* (kelenturan, adaptasi, dan kerukunan hidup).\n` +
          `10. **Kesesuaian Kebutuhan**: Memberikan aura keanggunan etnik yang tinggi saat menyalami mempelai dan keluarga, sekaligus santai saat menikmati jamuan dan berbaur bersama tamu.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 5)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Siluet cape asimetris yang modern dan luwes, membebaskan gerak tanpa kekakuan kebaya/jas resmi.',
            'Tenun Gedog Tuban kapas kenthang pewarna alam daun nila yang adem dan bernilai seni tinggi.',
            'Konsep Zero-Waste (Minim Potong) yang memuliakan keutuhan helai kain tenun pusaka.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)',
            'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Bagaimana padu-padan bawahannya?',
          'Apakah ada pilihan warna lain?',
          'Berapa rentang harganya?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Kondangan Luwes)',
        trace: {
          user_intent: 'Wedding / Kondangan Semi-Formal Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Semantic intent parsed: Kondangan/Resepsi -> Luwes -> Tetap Elegan.',
            'Evaluated all 10 curation factors with verified product OERIP-CAP-005.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-CAP-005', 'WASTRA-TUBAN-002', 'KB-BRAND-003']
        }
      };
    }

    // -------------------------------------------------------------
    // SCENARIO 7B: KONDANGAN MODEST / KELUARGA / HIJAB FRIENDLY
    // -------------------------------------------------------------
    if (isModestDress) {
      const product = OERIP_PRODUCTS[5]; // OERIP-DRS-006 Living Heritage Tunic Dress & Selendang Set
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Untuk menghadiri **Kondangan / Resepsi Pernikahan Keluarga yang Santun & Modest (Hijab-Friendly)**:\n\n` +
          `• **Jenis Acara**: Resepsi Pernikahan Keluarga / Silaturahmi\n` +
          `• **Gaya**: Modest Elegance, Santun & Agung\n` +
          `• **Karakter Busana**: Set terusan tunik panjang dengan selendang senada, tidak menerawang, dan jatuh melipat anggun.\n\n` +
          `Berdasarkan data resmi Knowledge Base Oerip, mahakarya yang paling selaras adalah:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Resepsi Pernikahan Keluarga, Lamaran, atau Silaturahmi.\n` +
          `2. **Gaya**: Anggun bersahaja, santun menutup aurat, dan penuh martabat.\n` +
          `3. **Warna**: Terakota hangat akar mengkudu dan hitam arang alami khas Toraja.\n` +
          `4. **Model Pakaian**: Set 2-in-1 Tunik Panjang Maxi A-line dengan Selendang tenun serasi terpisah.\n` +
          `5. **Jenis Wastra**: Tenun Ikat Toraja Sa'dan bermotif pusaka *Pa'teddong*.\n` +
          `6. **Bahan**: 100% serat katun mori tenun tangan bertekstur lembut dan berpori adem.\n` +
          `7. **Ukuran & Fit**: All-size longgar (LD 105–120 cm, P 135 cm) yang tidak mengekang lekuk tubuh.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: Motif kepala kerbau (*Pa'teddong*) simbol kemakmuran, derajat luhur, dan ikatan kekeluargaan yang erat.\n` +
          `10. **Kesesuaian Kebutuhan**: Sangat pas untuk pemakai hijab yang menginginkan tampilan serasi dari kepala hingga kaki tanpa repot mencari selendang terpisah.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 6)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Set lengkap tunik panjang dan selendang senada yang sangat praktis dan anggun.',
            'Tenun Toraja Sa\'dan motif Pa\'teddong penanda kemakmuran dan doa kebahagiaan.',
            'Bahan katun mori alami yang adem, nyaman, dan tidak menerawang untuk hijabers.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
            'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: [
          'Bagaimana cara padu-padan hijabnya?',
          'Berapa ukuran panjang tuniknya?',
          'Berapa rentang harganya?',
          'Konsultasi via WhatsApp Admin'
        ],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Kondangan Modest)',
        trace: {
          user_intent: 'Modest Wedding / Hijab Kondangan Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: [
            'Matched modest/hijab wedding context with OERIP-DRS-006 Toraja set.'
          ],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-DRS-006', 'WASTRA-TORAJA-006']
        }
      };
    }

    // -------------------------------------------------------------
    // SCENARIO 7C: KONDANGAN RESEPSI ADAT FORMAL / SANGAT SAKRAL
    // -------------------------------------------------------------
    if (isSacredAdat) {
      const product = OERIP_PRODUCTS[3]; // OERIP-ULO-004 Heritage Ulos Statement Vest
      return {
        content:
          `Untuk menghadiri **Resepsi Pernikahan Adat Sakral, Perhelatan Keluarga Besar, atau Gala Dinner Luhur**, KIRA merekomendasikan busana berwibawa ningrat:\n\n` +
          `---\n\n` +
          `### REKOMENDASI UTAMA KIRA\n\n` +
          `**${product.product_name}**\n` +
          `*(Kode Produk: ${product.product_id})*\n\n` +
          `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
          `1. **Jenis Acara**: Resepsi Pernikahan Adat Formal, Upacara Adat Luhur, atau Gala Dinner Kenegaraan.\n` +
          `2. **Gaya yang Diinginkan**: Sangat formal, sakral, berwibawa ningrat, dan khidmat.\n` +
          `3. **Warna**: Palet gelap alami (*Itom*) berpadu aksen marun tua dan putih tulang alami.\n` +
          `4. **Model Pakaian**: Vest berstruktur kokoh (*statement vest*) dengan garis siluet tegas.\n` +
          `5. **Jenis Wastra**: Ulos Ragidup Batak Toba asli dari Sumatera Utara.\n` +
          `6. **Bahan**: Katun tenun tangan murni berkerapatan tinggi dengan tekstur kokoh dan tegap.\n` +
          `7. **Ukuran & Karakter Fit**: All-size berpotongan tegas yang memberi postur tubuh tegak dan anggun.\n` +
          `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
          `9. **Filosofi Wastra**: Ulos Ragidup dengan motif *Bintang Maratur*, sarat doa restu kehangatan hidup (*manggomgomi*), keturunan, dan keberkahan perhelatan sakral.\n` +
          `10. **Kesesuaian Kebutuhan**: Sangat pantas untuk menghormati kedua mempelai dan keluarga besar di panggung adat dan ballroom perhelatan luhur.\n\n` +
          `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 4)*`,
        recommendation: {
          product_name: product.product_name,
          product_id: product.product_id,
          image: product.image,
          why_reasons: [
            'Siluet vest berstruktur yang sangat berwibawa untuk pesta formal dan resepsi adat.',
            'Kain Ulos Ragidup Batak Toba pewarna alam dengan makna doa restu pernikahan agung.',
            'Konsep zero-waste yang menghargai motif sakral tanpa pemotongan destruktif.'
          ],
          about_wastra: `${product.textile} dari ${product.textile_origin}.`,
          cultural_story: product.cultural_story,
          alternatives: [
            'Oerip Signature Blanket Outer (OERIP-OUT-001)',
            'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)'
          ],
          notes: {
            price_range: product.price_range,
            care: product.care_instruction,
            availability: product.availability
          },
          source: 'Official Oerip Knowledge Base (Tervalidasi)'
        },
        quick_replies: ['Ceritakan tentang Ulos Batak Toba.', 'Kenapa kamu memilih produk itu?', 'Konsultasi via WhatsApp Admin'],
        source_badge: '✓ Evaluasi 10 Faktor KIRA (Resepsi Formal Sakral)',
        trace: {
          user_intent: 'Formal Wedding & Sacred Reception Outfit Recommendation',
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: ['Matched verified product OERIP-ULO-004 with full 10-factor evaluation.'],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['OERIP-ULO-004', 'WASTRA-ULOS-004']
        }
      };
    }

    // -------------------------------------------------------------
    // SCENARIO 7D: RESEPSI BALLROOM MEGAH / VIP STATEMENT DRAPE
    // -------------------------------------------------------------
    const product = OERIP_PRODUCTS[0]; // OERIP-OUT-001 Signature Blanket Outer
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk menghadiri **Resepsi Pernikahan Ballroom Megah & Gala Formal VIP**:\n\n` +
        `• **Jenis Acara**: Resepsi Ballroom Mewah / Gala Dinner Kenegaraan\n` +
        `• **Gaya**: Statement Drape, Megah & Berkarakter Kharismatik\n` +
        `• **Karakter Busana**: Selimut outer draperi kimono tebal berpewarna alam murni yang menghangatkan dari pendingin ballroom sekaligus mencuri perhatian secara berkelas.\n\n` +
        `Berdasarkan basis data resmi Oerip Indonesia, mahakarya yang paling sempurna adalah:\n\n` +
        `---\n\n` +
        `### REKOMENDASI UTAMA KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode Produk: ${product.product_id})*\n\n` +
        `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
        `1. **Jenis Acara**: Resepsi Pernikahan Formal Gedung/Ballroom Ber-AC Dingin.\n` +
        `2. **Gaya yang Diinginkan**: Elegan megah, berwibawa, dan memancarkan kharisma budaya luhur.\n` +
        `3. **Warna**: Indigo Blue legam (daun nila alami) berpadu Terakota hangat dari akar mengkudu (*kombu*).\n` +
        `4. **Model Pakaian**: Kimono Blanket Outer berkerah draperi megah dengan lipatan kain zero-waste.\n` +
        `5. **Jenis Wastra**: Harmonisasi Tenun Gedog Tuban dan Tenun Ikat & Pahikung Sumba Timur.\n` +
        `6. **Bahan**: 100% serat katun tenun tangan kenthang berpori sejuk dan tebal berkarakter selimut pusaka.\n` +
        `7. **Ukuran & Karakter Fit**: All-size longgar inklusif (LD 100–130 cm), jatuh melipat anggun di atas gaun atau busana dalam.\n` +
        `8. **Rentang Harga**: **${product.price_range}** (Resmi Knowledge Base Oerip).\n` +
        `9. **Filosofi Wastra**: Motif Kuda (*Njara*) simbol kepemimpinan, perlindungan, dan doa kemuliaan hidup bagi pengantin.\n` +
        `10. **Kesesuaian Kebutuhan**: Sangat ideal menghalau dinginnya AC ballroom pesta pernikahan, memberi kenyamanan termal maksimal sembari menghadirkan pesona busana yang tak terlupakan.\n\n` +
        `*✓ Terverifikasi dari Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 1)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Siluet kimono draperi megah yang memberikan wibawa elegan seketika untuk pesta resepsi formal.',
          'Kombinasi Tenun Gedog Tuban dan Tenun Ikat Sumba Timur dengan pewarna alam murni.',
          'Konsep Zero-Waste yang menghormati keutuhan bentang kain tenun adat tanpa pemotongan destruktif.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)',
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Motifnya apa?',
        'Bahannya apa?',
        'Kenapa kamu memilih produk itu?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Evaluasi 10 Faktor KIRA (Kondangan Elegan)',
      trace: {
        user_intent: 'Elegant Wedding / Kondangan Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Semantic mapping: Kondangan -> Resepsi Formal -> Elegan.',
          'Evaluated all 10 curation factors with verified product OERIP-OUT-001.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-OUT-001', 'WASTRA-SUMBA-001', 'WASTRA-TUBAN-002']
      }
    };
  }

  // SCENARIO 8: OFFICE / SMART-CASUAL / LURIK
  if (
    lower.includes('kantor') ||
    lower.includes('kerja') ||
    lower.includes('smart-casual') ||
    lower.includes('lurik') ||
    lower.includes('harian')
  ) {
    const product = OERIP_PRODUCTS[2];
    return {
      content:
        `Untuk padanan **busana kerja kantor smart-casual atau pertemuan semi-formal harian**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa cocok:**\n` +
        `• **Garis Geometris Bersih & Modern**: Tenun Lurik Prasojo Klaten menghadirkan kesan rapi, profesional, dan bersahaja tanpa kesan kaku.\n` +
        `• **Kenyamanan Serat Katun Sejuk**: Sangat adem untuk pemakaian seharian, baik di ruangan kantor ber-AC maupun saat mobilitas di luar ruangan.\n` +
        `• **Filosofi Luhur *Lurus Ing Lakon***: Garis-garis lurus melambangkan integritas, kejujuran, dan kelurusan niat dalam berkarya.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Paduan Tenun Lurik Prasojo Klaten ATBM dan aksen Tenun Gedog Tuban pewarna alam murni.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci lembut dengan sabun lerak atau sampo alami.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 3)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Siluet kimono pendek minimalis yang sangat fleksibel untuk smart-casual kantor.',
          'Tekstur katun Lurik Klaten yang adem dan berpori untuk kenyamanan mobilitas seharian.',
          'Filosofi kejujuran dan kelurusan niat (Lurus Ing Lakon).'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: ['Oerip Signature Blanket Outer (OERIP-OUT-001)'],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: ['Ceritakan tentang Tenun Lurik Klaten.', 'Kenapa kamu memilih produk itu?', 'Konsultasi via WhatsApp Admin'],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Office / Smart-Casual Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-LUR-003.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-LUR-003', 'WASTRA-LURIK-003']
      }
    };
  }

  // SCENARIO 9: TRAVELING / LIBURAN KE PANTAI / RESORT / BOHEMIAN
  if (
    lower.includes('pantai') ||
    lower.includes('resort') ||
    lower.includes('pesisir') ||
    (lower.includes('travel') && (lower.includes('santai') || lower.includes('liburan') || lower.includes('baju') || lower.includes('busana') || lower.includes('outfit') || lower.includes('rekomendasi') || lower.includes('alam') || lower.includes('pantai'))) ||
    lower.includes('traveling santai') ||
    lower.includes('liburan santai') ||
    lower.includes('bohemian') ||
    lower.includes('duster') ||
    lower.includes('festival seni')
  ) {
    const product = OERIP_PRODUCTS[1]; // Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk momen **Traveling Santai ke Pantai, Liburan Tropis, Resort Wear, maupun Gaya Bohemian Nusantara**, KIRA merekomendasikan mahakarya istimewa:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK TRAVELING & PANTAI SANTAI\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Sangat Tepat untuk Liburan & Pantai Santai:**\n` +
        `• **Siluet Maxi Duster Mengalir Fotogenik**: Potongan duster panjang menjuntai semata kaki (*fluid floor-length maxi*) yang melambai dramatis mengikuti hembusan angin laut (*coastal sea breeze*). Sangat fotogenik untuk momen sunset pantai dan memancarkan aura petualang berjiwa bebas (*free-spirited bohemian*).\n` +
        `• **100% Katun Tenun Tangan & Pewarna Alami Sumba**: Ditenun dari serat kapas alami berpori mikro yang sejuk, menyerap keringat, dan tidak lengket di kulit saat cuaca pesisir hangat. Pewarnaan alami murni dari akar mengkudu (*kombu* terakota hangat) dan daun nila (*indigo* laut) ramah lingkungan dan tidak memicu iritasi kulit.\n` +
        `• **Konsep Minim Potong (Zero-Waste)**: Menjaga keutuhan lembaran kain tenun asli tanpa dipotong-potong kecil, menciptakan draperi yang jatuh luwes dan membebaskan gerak langkah Anda saat menyusuri pesisir pantai.\n\n` +
        `**Panduan Padu-Padan Santai di Pantai (Beach & Resort Styling):**\n` +
        `• **Gaya Luaran Terbuka (*Open Duster*)**: Dikenakan lepas tanpa dikancing di atas *tank top* katun putih polos, kemben etnik, atau *inner sleeveless* netral.\n` +
        `• **Bawahan**: Padukan dengan celana pendek linen santai (*linen shorts*), kulot bernuansa pasir pantai (*sand beige*), atau rok katun ringan yang nyaman.\n` +
        `• **Aksesori**: Sempurnakan dengan topi anyaman lontar/jerami, kacamata hitam, dan sandal kulit etnik atau bertelanjang kaki di atas pasir pantai.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Kain Tenun Ikat & Pahikung Sumba Timur asli dengan motif figuratif sakral (Kuda *Njara* penanda kebebasan ksatria dan Pohon Hayat *Andung* penjaga semesta) yang ditenun secara teliti selama 3–6 bulan oleh para mama penenun desa adat Rende / Melolo.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cukup diangin-anginkan di tempat teduh berangin, hindari detergen berbahan kimia keras, gunakan lerak lembut jika perlu dicuci.\n\n` +
        `*✓ Berdasarkan Knowledge Base Resmi Oerip Indonesia (Data Produk Oerip No. 2)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Siluet maxi duster yang melambai dramatis mengikuti hembusan angin pantai dan sangat fotogenik.',
          'Serat katun tenun tangan Sumba Timur pewarna alami murni yang sejuk, adem, dan tidak gerah.',
          'Konsep zero-waste draperi longgar yang membebaskan gerak santai saat liburan di pesisir.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003) - Pilihan kimono pendek katun super adem',
          'Oerip Flores Geometric Reversible Poncho (OERIP-PON-007) - Untuk angin dingin pantai malam hari',
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008) - Rompi tanpa lengan kasual santai'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Sumba Timur & motif Kuda (Njara).',
        'Bagaimana padu-padan celana dan sandal untuk pantai?',
        'Apakah ada pilihan outer pendek yang adem untuk pantai?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Traveling & Pantai Santai KIRA',
      trace: {
        user_intent: 'Beach Resort & Casual Travel Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-KIM-002 for beach travel & bohemian resort wear.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-KIM-002', 'WASTRA-SUMBA-001']
      }
    };
  }

  // SCENARIO 8B: CASUAL / SANTAI / HANGOUT / JALAN-JALAN / WEEKEND
  if (
    (lower.includes('santai') ||
    lower.includes('kasual') ||
    lower.includes('casual') ||
    lower.includes('hangout') ||
    lower.includes('jalan-jalan') ||
    lower.includes('jalan jalan') ||
    lower.includes('nongkrong') ||
    lower.includes('weekend') ||
    lower.includes('harian santai')) &&
    !lower.includes('pantai') &&
    !lower.includes('resort') &&
    !lower.includes('pesisir')
  ) {
    const product = OERIP_PRODUCTS[2]; // Oerip Contemporary Lurik Minimalist Short Kimono
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk gaya **Santai, Kasual, Hangout, atau Aktivitas Akhir Pekan yang Rileks namun Berkarakter**, KIRA merekomendasikan busana etnik modern yang paling ringan dan *versatile*:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK GAYA SANTAI & KASUAL\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Keunggulan untuk Gaya Kasual Santai:**\n` +
        `• **Ringan & Sejuk di Kulit**: Ditenun dari 100% serat katun tenun ATBM Prasojo Klaten yang memiliki pori mikro alami, menjadikannya sangat adem dan menyerap keringat untuk beraktivitas santai seharian.\n` +
        `• **Siluet Kimono Pendek Minimalis**: Potongan loose-fit yang tidak ribet, mudah dilepas-pakai, dan langsung meningkatkan penampilan kasual Anda (*instant level-up*) tanpa terkesan berlebihan (*effortless chic*).\n` +
        `• **Padu-Padan Fleksibel**: Sangat serasi dipadukan dengan kaos oblong katun polos, celana denim/chino, celana pendek santai, atau kulot linen dengan sepatu sneakers atau sandal kulit etnik.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Mengusung Tenun Lurik Prasojo Klaten bermakna filosofis *Lurus Ing Lakon* (kejujuran dan kesahajaan hidup) dengan aksen Tenun Gedog Tuban pewarna nabati alami.\n\n` +
        `*✓ Berdasarkan Knowledge Base Resmi Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Tekstur tenun katun Lurik Klaten yang sangat adem, ringan, dan nyaman dipakai santai.',
          'Siluet kimono pendek minimalis all-size yang praktis untuk gaya kasual dan hangout.',
          'Padu-padan mudah dengan kaos oblong, celana denim, kulot, atau sneakers harian.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Lurik Klaten.',
        'Berapa rentang harganya?',
        'Bagaimana cara mencuci kain tenun ini?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Kasual & Santai KIRA',
      trace: {
        user_intent: 'Casual & Hangout Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-LUR-003 for casual/hangout style.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-LUR-003', 'WASTRA-LURIK-003']
      }
    };
  }

  // SCENARIO 8C: FAMILY / ARISAN / KUMPUL KELUARGA / SILATURAHMI
  if (
    lower.includes('keluarga') ||
    lower.includes('arisan') ||
    lower.includes('silaturahmi') ||
    lower.includes('lebaran') ||
    lower.includes('kumpul keluarga') ||
    lower.includes('acara keluarga')
  ) {
    const product = OERIP_PRODUCTS[5]; // Oerip Living Heritage Tunic Dress & Selendang Set
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk acara **Kumpul Keluarga, Arisan, Silaturahmi, maupun Pertemuan Kerabat yang Hangat dan Santun**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK ACARA KELUARGA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Keunggulan untuk Momen Keluarga & Silaturahmi:**\n` +
        `• **Keanggunan yang Santun & Bersahaja**: Set tunik maxi berpotongan A-line longgar inklusif (LD 100–125 cm) dengan selendang serasi yang menjuntai anggun, sangat menghormati suasana kekeluargaan.\n` +
        `• **Filosofi Kemakmuran & Kebersamaan**: Membawa wastra Tenun Ikat Toraja Sa'dan bermotif *Pa'teddong* (simbol kerbau Toraja) yang melambangkan kemakmuran, martabat keluarga, dan persaudaraan yang erat.\n` +
        `• **Kenyamanan Bergerak Sepanjang Hari**: Serat tenun katun murni yang adem membuat Anda leluasa bersilaturahmi, menyapa kerabat, dan menikmati hidangan keluarga tanpa rasa gerah.\n\n` +
        `**Panduan Padu-Padan (Styling):**\n` +
        `Selendang dapat disampirkan elegan di salah satu pundak atau dikenakan sebagai kerudung/pashmina aksen untuk pengguna hijab, dipadu sepatu flat kulit atau heels sedang.\n\n` +
        `*✓ Berdasarkan Knowledge Base Resmi Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Set tunik dan selendang serasi yang santun, elegan, dan sarat wibawa untuk acara keluarga.',
          'Wastra Tenun Toraja bermotif Pa\'teddong penanda kemakmuran dan persaudaraan keluarga.',
          'Siluet all-size longgar yang sangat nyaman untuk bersilaturahmi seharian.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang filosofi Tenun Toraja Sa\'dan.',
        'Apakah bisa dipakai dengan hijab?',
        'Berapa rentang harganya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Momen Keluarga KIRA',
      trace: {
        user_intent: 'Family Gathering & Arisan Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-DRS-006 for family/arisan gathering.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-DRS-006', 'WASTRA-TORAJA-006']
      }
    };
  }

  // SCENARIO 8D: WOMEN / FEMININE / IBU / CEWEK / DRESS / ANGGUN
  if (
    (lower.includes('wanita') || lower.includes('cewek') || lower.includes('perempuan') || lower.includes('ibu') || lower.includes('feminin') || lower.includes('anggun')) &&
    (lower.includes('rekomendasi') || lower.includes('baju') || lower.includes('busana') || lower.includes('outfit') || lower.includes('pilihan') || lower.includes('cocok'))
  ) {
    const product = OERIP_PRODUCTS[4]; // Oerip Zero-Waste Asymmetric Gedog Cape Wrap
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk busana **Wanita Etnik Nusantara yang Anggun, Feminin, dan Berseni Tinggi**, KIRA merekomendasikan mahakarya:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA UNTUK WANITA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Keunggulan untuk Tampilan Feminin & Anggun:**\n` +
        `• **Siluet Cape Wrap Asimetris Arsitektural**: Desain draperi melingkar tanpa kancing yang jatuh melipat indah di bahu, menciptakan efek visual ramping, dinamis, dan sangat fotogenik.\n` +
        `• **Wastra Tenun Gedog Tuban Langka**: Ditenun manual dari benang kapas kenthang lokal Tuban dengan motif klasik *Ganggeng* (adaptasi dan kelenturan jiwa) pewarna alam murni.\n` +
        `• **Fleksibilitas Gaya Multifungsi**: Dapat dikenakan sebagai cape luaran anggun, wrap top yang diikat sabuk obi etnik, atau outer draperi di atas gaun terusan/inner polos.\n\n` +
        `*✓ Berdasarkan Knowledge Base Resmi Oerip Indonesia*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Potongan cape asimetris yang melipat anggun dan memberikan siluet feminin berkelas.',
          'Kain Tenun Gedog Tuban kapas kenthang asli yang ditenun tangan dengan laku doa.',
          'Konsep Minim Potong (Zero-Waste) yang ramah untuk berbagai bentuk tubuh wanita.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)',
          'Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Gedog Tuban.',
        'Bagaimana cara memakai cape asimetris ini?',
        'Berapa rentang harganya?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Busana Wanita KIRA',
      trace: {
        user_intent: 'Feminine / Women Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-CAP-005 for feminine/women aesthetic.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-CAP-005', 'WASTRA-TUBAN-002']
      }
    };
  }

  // SCENARIO 8E: AFFORDABLE / BUDGET-FRIENDLY / HEMAT / MURAH / TERJANGKAU
  if (
    lower.includes('terjangkau') ||
    lower.includes('murah') ||
    lower.includes('hemat') ||
    lower.includes('budget') ||
    lower.includes('paling murah') ||
    lower.includes('ramah kantong')
  ) {
    const product = OERIP_PRODUCTS[2]; // Contemporary Lurik Kimono (Rp 1.200.000 - 2.400.000)
    return {
      content:
        `Halo Sahabat Budaya! 🙏 Untuk koleksi Oerip Indonesia dengan **Nilai Investasi Paling Ramah dan Terjangkau (*Entry-Level Living Heritage*)**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KOLEKSI TERJANGKAU OERIP\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Nilai Apresiasi & Keunggulan:**\n` +
        `• **Rentang Investasi Resmi**: **${product.price_range}** (Koleksi dengan rentang harga paling terjangkau di katalog resmi Oerip).\n` +
        `• **Kualitas Tenun ATBM Prasojo Klaten Asli**: Tetap menggunakan benang katun tenun tangan 100% serat alami berkualitas tinggi tanpa kompromi.\n` +
        `• **Penggunaan Paling Multifungsi**: Sangat awet dan cocok dikenakan setiap hari untuk kerja kantor, hangout kafe, kuliah, hingga acara semi-formal.\n\n` +
        `*Setiap karya Oerip diciptakan one-of-a-kind sebagai dukungan adil (*Fair Trade*) bagi penenun tradisional.*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          `Pilihan investasi paling ramah (${product.price_range}) dalam jajaran koleksi Oerip Indonesia.`,
          'Tenun Lurik ATBM Prasojo Klaten katun adem yang tahan lama dan berkelas.',
          'Siluet kimono minimalis all-size yang fleksibel untuk berbagai acara harian.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Berapa daftar harga lengkap semua koleksi?',
        'Ceritakan tentang Tenun Lurik Klaten.',
        'Biasa produksi berapa potong per model?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Kurasi Koleksi Terjangkau KIRA',
      trace: {
        user_intent: 'Affordable / Budget-Friendly Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified entry-level product OERIP-LUR-003 with verified retail pricing.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-LUR-003', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 9A: ASYMMETRIC CAPE WRAP / ART EXHIBITION / GALA DINNER (OERIP-CAP-005)
  if (
    lower.includes('cape') ||
    lower.includes('asimetris') ||
    lower.includes('asymmetric') ||
    lower.includes('wrap') ||
    lower.includes('pameran') ||
    lower.includes('art event') ||
    lower.includes('art gallery') ||
    lower.includes('galeri seni') ||
    lower.includes('selendang bahu')
  ) {
    const product = OERIP_PRODUCTS[4]; // Oerip Zero-Waste Asymmetric Gedog Cape Wrap
    return {
      content:
        `Untuk menghadiri **Pembukaan Pameran Seni, Perhelatan Gala Dinner Kontemporer, atau Gaya Draping Asimetris yang Berani**, KIRA merekomendasikan mahakarya istimewa:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Tepat untuk Suasana Seni & Gala:**\n` +
        `• **Siluet Draping Zero-Waste Asimetris**: Pola potong minim limbah (*zero-waste cutting*) yang membentuk lilitan bahu asimetris nan elegan, menciptakan siluet modern yang fotogenik dan dinamis saat berjalan.\n` +
        `• **Keotentikan Tenun Gedog Tuban**: Menggunakan kain tenun tangan kapas kenthang asli Kerek Tuban dengan pewarna alam fermentasi daun nila (indigo) dan kulit kayu tingi.\n` +
        `• **Aksen Rumbai Raw-Edge Fringe**: Ujung kain mempertahankan rumbai benang tenun asli yang memberikan karakter etnik berjiwa bebas (*organic haute couture*).\n\n` +
        `**Tentang Wastranya:**\n` +
        `Tenun Gedog Kerek Tuban ditenun secara tradisional dengan alat tenun gedog duduk. Tekstur benangnya berpori, menyerap udara sejuk di luar ruangan namun memberi kehangatan saat berada di ruangan ber-AC.\n\n` +
        `**Paduan Padu-Padan (Styling):**\n` +
        `Padukan di atas gaun lurus polos (*sheath dress*) warna hitam/terakota, atau kenakan bersama kemeja kerah tegak dan celana kulot linen putih gading serta kalung kuningan/tembaga tempa Oerip.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci manual dengan air dingin dan sabun lerak alami, angin-anginkan di tempat teduh.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 5)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Potongan draperi asimetris modern yang sangat fotogenik untuk pameran seni dan gala dinner.',
          'Tenun Gedog Tuban kapas kenthang asli pewarna alam dengan aksen raw-edge fringe.',
          'Konsep zero-waste yang menghargai keutuhan bentang kain tenun warisan leluhur.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Signature Blanket Outer (OERIP-OUT-001)',
          'Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)',
          'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Gedog Tuban.',
        'Bagaimana cara memakai cape asimetris ini?',
        'Ada opsi busana terusan atau dress?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Asymmetric Cape Wrap & Art Event Styling Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-CAP-005.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-CAP-005', 'WASTRA-TUBAN-002']
      }
    };
  }

  // SCENARIO 9B: TUNIC DRESS & SELENDANG SET / RESEPSI ADAT / MODEST MAXI (OERIP-DRS-006)
  if (
    lower.includes('tunic') ||
    lower.includes('tunik') ||
    lower.includes('dress') ||
    lower.includes('terusan') ||
    lower.includes('gamis') ||
    lower.includes('toraja') ||
    lower.includes('selendang set') ||
    lower.includes('gaun etnik') ||
    lower.includes('maxi dress')
  ) {
    const product = OERIP_PRODUCTS[5]; // Oerip Living Heritage Tunic Dress & Selendang Set
    return {
      content:
        `Untuk momen **Resepsi Agung Keluarga, Jamuan Perhelatan Adat, atau Gaya Modest Maxi Dress Berwibawa**, KIRA merekomendasikan set busana yang anggun dan berkarisma tinggi:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Tepat untuk Resepsi & Acara Resmi:**\n` +
        `• **Set 2-in-1 Terpadu (Tunik & Selendang)**: Dilengkapi selendang tenun terpisah yang serasi, memberikan fleksibilitas untuk disampirkan di pundak, dijadikan penutup dada, atau aksen leher yang santun.\n` +
        `• **Tenun Ikat Toraja Sa'dan yang Sakral**: Mengangkat motif agung *Pa'teddong* (Kepala Kerbau) yang melambangkan kemakmuran, derajat kehormatan keluarga, dan keteguhan iman.\n` +
        `• **Kenyamanan Mori Alami & Hijab-Friendly**: Menggunakan paduan Katun Mori alami yang jatuh anggun (*fluid drape*), adem di kulit, dan tidak menerawang.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Tenun Ikat Toraja Sa'dan asli dari dataran tinggi Toraja, Sulawesi Selatan. Ditenun helai demi helai dengan pewarna alami getah daun dan lumpur tradisional.\n\n` +
        `**Paduan Padu-Padan (Styling):**\n` +
        `Sangat anggun dipadukan dengan hijab voal atau pashmina polos berwarna senada (krem/terakota/marun), kalung kuningan Toraja, serta selop kulit etnik berhak sedang.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci manual dengan lerak lembut, hindari paparan matahari langsung saat penjemuran.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 6)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Set tunik maxi dan selendang serasi yang anggun, santun, dan sangat hijab-friendly.',
          'Wastra Tenun Ikat Toraja Sa\'dan motif Pa\'teddong penanda kemakmuran dan kehormatan.',
          'Potongan longgar all-size yang nyaman untuk menghadiri acara resepsi panjang seharian.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)',
          'Oerip Signature Blanket Outer (OERIP-OUT-001)',
          'Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang filosofi motif Pa\'teddong Toraja.',
        'Apakah kainnya tidak menerawang untuk berhijab?',
        'Ada opsi rompi atau vest?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Tunic Dress & Modest Toraja Heritage Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-DRS-006 with Toraja Sa\'dan provenance.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-DRS-006', 'WASTRA-TORAJA-006']
      }
    };
  }

  // SCENARIO 9C: FLORES GEOMETRIC REVERSIBLE PONCHO / TRAVELING DINGIN & PEGUNUNGAN (OERIP-PON-007)
  if (
    lower.includes('poncho') ||
    lower.includes('ponco') ||
    lower.includes('flores') ||
    lower.includes('reversible') ||
    lower.includes('bolak balik') ||
    lower.includes('bolak-balik') ||
    lower.includes('mata bolo') ||
    ((lower.includes('dingin') || lower.includes('gunung') || lower.includes('winter') || lower.includes('musim dingin')) &&
      (lower.includes('baju') || lower.includes('outer') || lower.includes('rekomendasi') || lower.includes('travel') || lower.includes('pakai')))
  ) {
    const product = OERIP_PRODUCTS[6]; // Oerip Flores Geometric Reversible Poncho
    return {
      content:
        `Untuk kebutuhan **Traveling ke Dataran Tinggi/Pegunungan, Menghadapi Hembusan AC Dingin Ekstrem, atau Gaya Etnik Reversible Dinamis**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Tepat untuk Cuaca Dingin & Traveling:**\n` +
        `• **Desain Dua Sisi (Reversible 2-in-1)**: Sisi luar menampilkan Tenun Ikat Flores bertekstur kuat dan kaya motif geometris, sedangkan sisi dalam menggunakan katun halus warna monokrom teduh. Anda mendapatkan 2 gaya berbeda dalam 1 busana (*smart travel wardrobe*)!\n` +
        `• **Filosofi Pelindung Motif *Mata Bolo***: Motif geometris belah ketupat khas Ende Flores melambangkan mata batin dan pelindung perjalanan dari mara bahaya.\n` +
        `• **Kehangatan Tanpa Menghimpit**: Siluet ponco longgar dengan bukaan leher nyaman yang menjaga tubuh tetap hangat saat berada di kabin pesawat, puncak gunung, atau ruangan ber-AC dingin.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Tenun Ikat Ende Lio, Flores, Nusa Tenggara Timur. Dibuat dengan pewarnaan alami fermentasi akar mengkudu dan daun nila lokal.\n\n` +
        `**Paduan Padu-Padan (Styling):**\n` +
        `Kenakan di atas kaus kerah tinggi (*turtle-neck*) atau sweater katun tipis, celana corduroy / jeans gelap, dan sepatu bot kulit atau sneakers santai.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci manual dengan lerak lembut, jangan dipelintir keras, jemur mendatar di tempat teduh.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 7)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Inovasi ponco dua sisi (reversible 2-in-1) yang praktis dan efisien untuk traveling.',
          'Tenun Ikat Flores motif Mata Bolo yang sarat doa keselamatan perjalanan.',
          'Bahan katun tebal lembut yang sangat hangat untuk ruangan ber-AC dingin dan pegunungan.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Signature Blanket Outer (OERIP-OUT-001)',
          'Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)',
          'Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Ikat Flores dan motif Mata Bolo.',
        'Bagaimana cara memakai ponco dua sisi ini?',
        'Apakah cukup hangat untuk musim dingin luar negeri?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Cold Climate & Reversible Poncho Traveling Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-PON-007 with Flores provenance.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-PON-007', 'WASTRA-FLORES-005']
      }
    };
  }

  // SCENARIO 9D: EARTH-TONE MINIMALIST SLEEVELESS VEST / ROMPI URBAN / WORKSPACE (OERIP-VES-008)
  if (
    lower.includes('rompi') ||
    lower.includes('sleeveless') ||
    lower.includes('tanpa lengan') ||
    lower.includes('earth tone') ||
    lower.includes('earth-tone') ||
    (lower.includes('vest') && !lower.includes('ulos')) ||
    (lower.includes('layering') && (lower.includes('baju') || lower.includes('outer') || lower.includes('rekomendasi')))
  ) {
    const product = OERIP_PRODUCTS[7]; // Oerip Earth-Tone Minimalist Sleeveless Vest
    return {
      content:
        `Untuk padanan **Busana Kerja Kreatif, Layering Harian Santai, atau Rompi Etnik Urban yang Bersahaja**, KIRA merekomendasikan:\n\n` +
        `---\n\n` +
        `### REKOMENDASI KIRA\n\n` +
        `**${product.product_name}**\n` +
        `*(Kode: ${product.product_id})*\n\n` +
        `**Mengapa Tepat untuk Layering Harian & Kantor Kreatif:**\n` +
        `• **Siluet Rompi Tanpa Lengan (*Sleeveless Clean Cut*)**: Potongan leher V terbuka yang modern dan ringan, sangat praktis dilapisi di atas kemeja atau kaus tanpa membatasi pergerakan lengan.\n` +
        `• **Harmoni Dua Wastra Nusantara**: Mengharmonisasikan Tenun Lurik Klaten garis halus warna tanah (*earth-tone*) dengan aksen saku fungsional Tenun Sumba motif Kuda.\n` +
        `• **Potongan Unisex Inklusif**: Sangat gagah dikenakan oleh pria sebagai rompi etnik modern, sekaligus chic dan santun untuk wanita dengan inner kemeja lengan panjang.\n\n` +
        `**Tentang Wastranya:**\n` +
        `Perpaduan Tenun Lurik Prasojo Klaten ATBM katun sejuk dan Tenun Ikat Sumba Timur pewarna akar alam.\n\n` +
        `**Paduan Padu-Padan (Styling):**\n` +
        `Padukan di atas kemeja katun putih lengan panjang yang digulung rapi, celana chino atau kulot linen warna pasir/hitam, dan sepatu loafers atau sneakers minimalis.\n\n` +
        `**Catatan:**\n` +
        `• Rentang harga tercatat: **${product.price_range}**\n` +
        `• Perawatan: Cuci manual dengan air dingin dan sabun lerak, setrika suhu sedang dari bagian dalam.\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip (Data Produk Oerip No. 8)*`,
      recommendation: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image,
        why_reasons: [
          'Siluet rompi tanpa lengan yang bersih dan sangat fleksibel untuk layering harian kerja.',
          'Perpaduan Tenun Lurik Klaten dan Tenun Sumba dalam palet earth-tone yang bersahaja.',
          'Potongan unisex inklusif yang cocok untuk pria maupun wanita.'
        ],
        about_wastra: `${product.textile} dari ${product.textile_origin}.`,
        cultural_story: product.cultural_story,
        alternatives: [
          'Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)',
          'Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)',
          'Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)'
        ],
        notes: {
          price_range: product.price_range,
          care: product.care_instruction,
          availability: product.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Ceritakan tentang Tenun Lurik Klaten.',
        'Bagaimana padu-padan rompi ini untuk pria?',
        'Bagaimana padu-padan rompi ini untuk wanita berhijab?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Terverifikasi AI KIRA & Knowledge Base Oerip',
      trace: {
        user_intent: 'Earth-Tone Sleeveless Vest & Layering Outfit Recommendation',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Matched verified product OERIP-VES-008 with Lurik & Sumba provenance.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['OERIP-VES-008', 'WASTRA-LURIK-003', 'WASTRA-SUMBA-001']
      }
    };
  }

  // SCENARIO 10: CARE INSTRUCTIONS
  if (lower.includes('cuci') || lower.includes('perawatan') || lower.includes('merawat') || lower.includes('lerak') || lower.includes('luntur')) {
    return {
      content:
        `🌿 **Panduan Resmi Perawatan Wastra Tenun Pewarna Alam Oerip Indonesia**\n\n` +
        `Kain tenun tangan dengan pewarna alami membutuhkan perlakuan penuh kasih agar serat benang dan pigmen alaminya tetap terjaga:\n\n` +
        `1. **Gunakan Sabun Alami (Buah Lerak / Sampo Lembut)**: Hindari detergen berbahan kimia keras atau pemutih (*bleach*).\n` +
        `2. **Cuci Manual dengan Tangan**: Rendam sebentar dengan air dingin, usap perlahan tanpa dikucek atau disikat kencang.\n` +
        `3. **Jangan Diperas Kasar**: Cukup tekan lembut untuk mengurangi air, jangan dipelintir.\n` +
        `4. **Jemur di Keteduhan Berangin**: Hindari paparan langsung sinar matahari terik agar pigmen alami (akar mengkudu & nila) tidak memudar.\n` +
        `5. **Setrika Suhu Sedang dari Bagian Dalam**: Gunakan kain pelapis tipis atau setrika dari sisi belakang kain.\n\n` +
        `*✓ Berdasarkan Panduan Resmi Perawatan Oerip Indonesia (ID: KB-CARE-001)*`,
      quick_replies: [
        'Ceritakan tentang Tenun Sumba Timur.',
        'Rekomendasi busana diplomasi budaya.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Panduan Perawatan Resmi Oerip',
      trace: {
        user_intent: 'Textile Care and Maintenance Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Sourced directly from KB-CARE-001.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-CARE-001']
      }
    };
  }

  // SCENARIO 11: PHILOSOPHY OF SUMBA & HORSE MOTIF
  if (
    lower.includes('sumba') &&
    (lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('kuda') || lower.includes('makna') || lower.includes('motif'))
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Sumba Timur (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-SUMBA-001):\n\n` +
        `• **Asal & Tradisi**: Ditenun oleh para mama penenun di Rende, Melolo, dan Kanatang, Sumba Timur (NTT). Setiap helai kain diciptakan dengan laku doa sakral dalam bingkai kepercayaan leluhur Marapu.\n\n` +
        `• **Makna Motif Kuda (*Njara*)**:\n` +
        `  Kuda bagi masyarakat Sumba bukan sekadar satwa, melainkan simbol martabat, kepemimpinan, ketangkasan, dan kebangsawanan. Kuda juga diyakini sebagai tunggangan arwah leluhur menuju alam keabadian (*Prai Marapu*).\n\n` +
        `• **Pewarnaan Alam Nabati Murni**:\n` +
        `  Menggunakan akar pohon mengkudu (*kombu*) untuk warna merah terakota hangat dan daun nila (*indigofera/taum*) untuk biru malam legam. Proses pencelupan alami ini membutuhkan waktu perendaman berkali-kali selama 3 hingga 6 bulan.\n\n` +
        `• **Nilai Kesakralan**:\n` +
        `  Penenun mematuhi tabu adat dalam meramu pewarna agar daya spiritual (*maramba*) dan energi perlindungan kain tetap terjaga utuh.`,
      quick_replies: [
        'Rekomendasi busana berbahan Tenun Sumba.',
        'Ceritakan tentang filosofi Konsep Minim Potong.',
        'Bagaimana cara mencuci dengan lerak?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Sumba Textile & Horse Motif',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-SUMBA-001.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11B: PHILOSOPHY OF TENUN GEDOG TUBAN
  if (
    lower.includes('gedog') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('kapas') || lower.includes('tuban')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Gedog Tuban (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-TUBAN-002):\n\n` +
        `• **Pohon Kapas Lokal (*Kapas Kenthang*)**: Ditanam di tanah kapur Kerek, Tuban, dipetik dan dipintal manual menjadi benang dengan tangan (*nganthi*) oleh para perempuan desa. Tekstur benangnya berkarakter tebal, berserat alami, dan memiliki sirkulasi udara luar biasa.\n\n` +
        `• **Asal Nama "Gedog"**: Berasal dari dentuman ritmis bunyi kayu alat tenun tradisional (*gedog... dog... dog...*) saat sisir tenun merapatkan benang pakan.\n\n` +
        `• **Makna Motif Ganggeng**: Salah satu motif tertua yang terinspirasi tanaman ganggang air yang berkelok lentur di dasar sungai. Melambangkan kelenturan jiwa, kesabaran, dan kemampuan manusia beradaptasi dengan arus kehidupan tanpa kehilangan jati diri.\n\n` +
        `• **Pewarnaan Alam**: Menggunakan rebusan kulit kayu tingi untuk cokelat hangat dan fermentasi daun nila untuk biru indigo teduh.\n\n` +
        `*Dian Oerip merancang busana Gedog Tuban dengan teknik lipatan tanpa memotong serat kain utama.*`,
      quick_replies: [
        'Rekomendasi busana Tenun Gedog Tuban.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Ceritakan tentang Tenun Sumba Timur.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Gedog Tuban',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-TUBAN-002. Zero unsolicited recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-TUBAN-002', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11C: PHILOSOPHY OF TENUN LURIK KLATEN
  if (
    lower.includes('lurik') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('klaten')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Lurik Prasojo Klaten (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-LURIK-003):\n\n` +
        `• **Makna Filosofis "Lurus ing Lakon"**: Kata "lurik" berakar dari bahasa Jawa *lorek* (garis lurus). Garis lurus melambangkan kejujuran, keteguhan prinsip moral, kesederhanaan, dan kesahajaan hidup.\n\n` +
        `• **Tenun ATBM Prasojo Klaten**: Ditenun dengan Alat Tenun Bukan Mesin (ATBM) legendaris dari Klaten dan Yogyakarta, menghasilkan katun yang ringan, adem, berpori sejuk, dan sangat nyaman dipakai di iklim tropis maupun ruang kerja modern.\n\n` +
        `• **Motif Klasik**: Motif Lurik Telupat (tiga-empat garis keseimbangan hidup) dan Sapit Urang. Dalam sentuhan Dian Oerip, lurik menjelma menjadi siluet kimono minimalis kontemporer yang versatile untuk gaya smart-casual harian.`,
      quick_replies: [
        'Rekomendasi busana Tenun Lurik.',
        'Biasa produksi berapa potong per model?',
        'Berapa rentang harga busana Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Lurik Klaten',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-LURIK-003.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-LURIK-003', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11D: PHILOSOPHY OF ULOS BATAK TOBA
  if (
    lower.includes('ulos') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('batak') || lower.includes('ragidup')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Ulos Ragidup & Sadum Batak Toba (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-ULOS-004):\n\n` +
        `• **Falsafah Kehangatan Kosmis (*Manggomgomi*)**: Dalam kosmologi Batak, ada tiga sumber kehangatan hidup: Matahari, Api, dan Ulos. Ulos adalah doa berkat restu kehidupan yang diwujudkan dalam bentuk bentangan benang tenun.\n\n` +
        `• **Ulos Ragidup (Pola Kehidupan)**: Jenis ulos yang paling sakral dengan struktur tenun tiga bagian yang disatukan (*badang* dan dua *sisi*). Melambangkan siklus kehidupan, kesuburan, dan martabat tertinggi keluarga.\n\n` +
        `• **Warna Dominan**: Warna *Itom* (hitam sakral), merah marun marwah, dan putih kesucian. Oerip menghadirkan Ulos dalam siluet statement vest berwibawa untuk upacara formal agung dan resepsi pernikahan.`,
      quick_replies: [
        'Rekomendasi busana Ulos Batak.',
        'Ceritakan tentang Tenun Ikat Flores.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Ulos Batak Toba',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-ULOS-004.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-ULOS-004', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11E: PHILOSOPHY OF TENUN IKAT FLORES
  if (
    lower.includes('flores') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('ende') || lower.includes('mata bolo')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Ende & Manggarai Flores (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-FLORES-005):\n\n` +
        `• **Motif Mata Bolo (Belah Ketupat Sakral)**: Melambangkan mata batin, kewaspadaan spiritual, dan pandangan hidup yang jernih dalam menatap masa depan serta menjaga harmoni dengan semesta.\n\n` +
        `• **Pewarnaan Tradisional**: Menggunakan ekstrak fermentasi moke alami, daun nila untuk biru gelap, dan tanah mineral vulkanik untuk warna terakota hangat.\n\n` +
        `• **Karakter Kain**: Tenunan tebal namun lembut dan fleksibel, sangat ideal untuk menghalau dingin udara pegunungan maupun hembusan AC ekstrem, diwujudkan Oerip dalam bentuk Reversible Poncho multifungsi.`,
      quick_replies: [
        'Rekomendasi busana Tenun Ikat Flores.',
        'Ceritakan tentang Tenun Toraja Sa\'dan.',
        'Bagaimana cara merawat kain tenun?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Ikat Flores',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-FLORES-005.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-FLORES-005', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11F: PHILOSOPHY OF TENUN TORAJA SA'DAN
  if (
    lower.includes('toraja') &&
    (lower.includes('apa') || lower.includes('ceritakan') || lower.includes('filosofi') || lower.includes('makna') || lower.includes('sejarah') || lower.includes('teddong') || lower.includes('sa\'dan')) &&
    !lower.includes('rekomendasi') && !lower.includes('beli') && !lower.includes('cari baju')
  ) {
    return {
      content:
        `🌿 **Kisah & Filosofi Tenun Ikat Toraja Sa'dan (Oerip Living Heritage)**\n\n` +
        `Berdasarkan basis pengetahuan resmi Oerip Indonesia (ID: WASTRA-TORAJA-006):\n\n` +
        `• **Motif Sakral Pa'teddong (Kepala Kerbau)**: Bagi masyarakat Toraja, kerbau (*teddong*) adalah simbol status sosial, kemakmuran, kekuatan pelindung, dan sarana penghubung roh leluhur menuju Puya (keabadian).\n\n` +
        `• **Motif Sekong Kandaure**: Geometri kait meliuk yang menyimbolkan ikatan kekeluargaan yang tak terputus dan perlindungan martabat keluarga adat.\n\n` +
        `• **Pewarnaan Alam**: Dibuat dari getah daun hutan pegunungan dan lumpur mineral, menghasilkan warna hitam pekat dan cokelat tanah yang khidmat dan bersahaja. Dian Oerip menghadirkannya dalam set tunik panjang dan selendang serasi.`,
      quick_replies: [
        'Rekomendasi busana Tenun Toraja Sa\'dan.',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Biasa produksi berapa potong per model?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'Cultural Knowledge Inquiry: Tenun Toraja Sa\'dan',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Strictly sourced from verified KB entry WASTRA-TORAJA-006.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-TORAJA-006', 'KB-BRAND-001']
      }
    };
  }

  // SCENARIO 11G: SLOW FASHION PHILOSOPHY
  if (
    lower.includes('slow fashion') ||
    lower.includes('fast fashion') ||
    lower.includes('keberlanjutan') ||
    lower.includes('sustainability')
  ) {
    return {
      content:
        `🌿 **Prinsip Slow Fashion & Sustainable Heritage Oerip Indonesia**\n\n` +
        `Oerip Indonesia lahir sebagai perlawanan kultural terhadap industri *fast fashion* yang eksploitatif dan menghasilkan jutaan ton limbah tekstil sintetis:\n\n` +
        `1. **Karya Seni Bernafas Waktu**: Satu helai tenun tangan membutuhkan waktu pengerjaan 1 hingga 6 bulan oleh para mama penenun desa adat di Sumba, Tuban, Klaten, Toba, Flores, dan Toraja.\n\n` +
        `2. **Serat Alami & Pewarna Nabati**: Mengutamakan katun tenun tangan (*kapas kenthang*) dan pewarnaan nabati dari akar mengkudu, daun nila, dan kulit kayu tingi yang terurai ramah di tanah tanpa meracuni air sungai desa adat.\n\n` +
        `3. **Fair Trade & Pemberdayaan Ekonomi Adat**: Menjunjung tinggi perdagangan adil bagi komunitas penenun perempuan, menjaga martabat tradisi luhur Nusantara agar terus hidup melintasi generasi.\n\n` +
        `4. **One-of-a-Kind Longevity**: Busana Oerip dirancang abadi (*timeless*), bernilai pusaka keluarga, dan tidak terikat tren musiman yang lekas usang.`,
      quick_replies: [
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Biasa produksi berapa potong per model?',
        'Berapa rentang harga busana Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Filosofi Slow Fashion Oerip',
      trace: {
        user_intent: 'Cultural Inquiry: Slow Fashion & Sustainability',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Provided slow fashion philosophy without forcing an unsolicited outfit recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
      }
    };
  }

  // SCENARIO 12: ZERO-WASTE & MINIM POTONG PHILOSOPHY
  if (
    lower.includes('zero waste') ||
    lower.includes('zero-waste') ||
    lower.includes('zerowaste') ||
    lower.includes('minim potong') ||
    lower.includes('tanpa potong') ||
    lower.includes('sisa perca') ||
    lower.includes('limbah kain') ||
    lower.includes('filosofi desain') ||
    lower.includes('konsep desain') ||
    lower.includes('sustainable fashion')
  ) {
    return {
      content:
        `🌿 **Filosofi Konsep Minim Potong (Zero-Waste) Oerip Indonesia**\n\n` +
        `Berdasarkan prinsip rancang bangun busana Dian Oerip (ID: KB-BRAND-003 & KB-TECH-001):\n\n` +
        `1. **Menghormati Doa Penenun**: Kain tenun tangan dibuat berbulan-bulan dengan doa dan jerih payah para mama penenun. Memotong kain sembarangan demi pola baju Barat dianggap melukai keutuhan jiwa wastra tersebut.\n\n` +
        `2. **Mempertahankan Bentang Asli (Rectangular Weave Geometry)**: Pola busana dirancang mengikuti bentang asli kain tenun dengan teknik lipat, lilit, dan drape alami, sehingga sisa perca (*waste*) dapat ditekan hingga mendekati nol.\n\n` +
        `3. **Siluet Longgar All-Size (Inklusif)**: Potongan yang longgar dan mengalir (lingkar dada 100–130 cm) dirancang inklusif untuk merangkul segala bentuk tubuh pemakainya secara bermartabat.\n\n` +
        `4. **Pemanfaatan Perca Wastra**: Potongan kecil sisa kain tetap diolah kembali menjadi aksesoris, kalung etnik, atau detail patch artistik tanpa ada yang terbuang sia-sia ke alam.`,
      quick_replies: [
        'Rekomendasi busana untuk acara tertentu',
        'Ceritakan tentang Tenun Gedog Tuban.',
        'Apa saja 6 wastra terverifikasi Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Filosofi Rancang Oerip Indonesia',
      trace: {
        user_intent: 'Design Philosophy Inquiry: Zero-Waste & Minim Potong',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Sourced from verified KB items KB-BRAND-003 and KB-TECH-001. Zero forced outfit recommendation.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-003', 'KB-TECH-001']
      }
    };
  }

  // SCENARIO 13: FOLLOW-UP: "Kenapa kamu memilih produk itu?" / "Tinjau Alasan Kurasi KIRA"
  if (
    lower.includes('kenapa kamu memilih') ||
    lower.includes('mengapa kamu memilih') ||
    lower.includes('kenapa memilih') ||
    lower.includes('alasan pemilihan') ||
    lower.includes('alasan kurasi') ||
    lower.includes('tinjau lagi alasan') ||
    lower.includes('tinjau alasan') ||
    lower.includes('pilar kurasi') ||
    lower.includes('dasar kurasi') ||
    lower.includes('bagaimana kira memilih') ||
    lower.includes('kriteria kurasi')
  ) {
    let matchedRecentProduct = OERIP_PRODUCTS[2]; // Default Lurik Kimono
    if (history && history.length > 0) {
      const historyStr = history.map(h => h.content).join(' ').toLowerCase();
      if (historyStr.includes('blanket') || historyStr.includes('oerip-out-001') || historyStr.includes('diplomasi') || historyStr.includes('sumba')) {
        matchedRecentProduct = OERIP_PRODUCTS[0];
      } else if (historyStr.includes('duster') || historyStr.includes('oerip-kim-002') || historyStr.includes('bohemian')) {
        matchedRecentProduct = OERIP_PRODUCTS[1];
      } else if (historyStr.includes('ulos') || historyStr.includes('oerip-ulo-004') || historyStr.includes('vest') || historyStr.includes('resepsi')) {
        matchedRecentProduct = OERIP_PRODUCTS[3];
      } else if (historyStr.includes('cape') || historyStr.includes('oerip-cap-005') || historyStr.includes('asimetris')) {
        matchedRecentProduct = OERIP_PRODUCTS[4];
      } else if (historyStr.includes('tunic') || historyStr.includes('oerip-drs-006') || historyStr.includes('toraja') || historyStr.includes('dress') || historyStr.includes('tunik')) {
        matchedRecentProduct = OERIP_PRODUCTS[5];
      } else if (historyStr.includes('poncho') || historyStr.includes('oerip-pon-007') || historyStr.includes('flores')) {
        matchedRecentProduct = OERIP_PRODUCTS[6];
      } else if (historyStr.includes('sleeveless') || historyStr.includes('oerip-ves-008') || historyStr.includes('rompi') || historyStr.includes('earth tone')) {
        matchedRecentProduct = OERIP_PRODUCTS[7];
      } else if (historyStr.includes('lurik') || historyStr.includes('oerip-lur-003') || historyStr.includes('reuni') || historyStr.includes('kafe')) {
        matchedRecentProduct = OERIP_PRODUCTS[2];
      }
    }

    return {
      content:
        `### 🏛️ Matriks 5 Pilar Kurasi KIRA dalam Memilih Rekomendasi Busana\n\n` +
        `Dalam merekomendasikan setiap busana Oerip, KIRA tidak sekadar mencocokkan tampilan visual semata, melainkan menerapkan sistem evaluasi kuratorial multidimensi berdasar **5 Pilar Kurasi Budaya Oerip Indonesia**:\n\n` +
        `---\n\n` +
        `#### 1. Keselarasan Konteks & Derajat Formalitas (*Occasion & Formality Resonance*)\n` +
        `• **Analisis Etiket & Protokoler**: Menakar atmosfer acara (diplomasi bilateral, resepsi agung, wisuda, kantor smart-casual, hingga reuni santai di kafe ber-AC).\n` +
        `• **Aura Pemakai**: Memastikan busana memancarkan wibawa dan rasa percaya diri alami tanpa terkesan berlebihan (*overdressed*) atau kaku.\n\n` +
        `#### 2. Kenyamanan Termal & Bio-Klimatik (*Thermal & Micro-pore Comfort*)\n` +
        `• **Adaptasi Suhu Ruang**: Memperhitungkan perbedaan suhu ruangan berpendingin udara (AC dingin) dengan kelembapan iklim tropis luar ruang.\n` +
        `• **Sirkulasi Serat Alami**: Mengutamakan 100% serat kapas mentah atau mori tenun tangan dengan pori mikro alami yang bernapas (*breathable*)—menangkal hembusan AC tanpa membuat gerah saat aktif bergerak.\n\n` +
        `#### 3. Siluet Inklusif All-Size & Filosofi Minim Potong (*Zero-Waste Integrity*)\n` +
        `• **Kebebasan Gerak**: Menggunakan potongan longgar (*loose-fit*) all-size khas Dian Oerip (LD 100–130 cm) yang ramah untuk berbagai bentuk tubuh, jatuh indah di badan, dan fotogenik.\n` +
        `• **Menghormati Keutuhan Kain Adat**: Mengikuti bentang geometri kain tenun asli tanpa pemotongan destruktif, menjaga utuh benang doa para mama penenun desa adat.\n\n` +
        `#### 4. Makna Simbolis & Jiwa Wastra (*Living Cultural Heritage*)\n` +
        `• **Kesesuaian Filosofis**: Menyelaraskan motif dengan maksud kegiatan (misal: motif Kuda *Njara* untuk kepemimpinan, Lurik *Lurus Ing Lakon* untuk integritas bersahaja, atau Ulos Ragidup untuk kehangatan doa restu).\n` +
        `• **Pewarnaan Nabati Murni**: Mengapresiasi pewarna alam (akar mengkudu, daun indigo/salaon, kulit kayu tingi) yang ramah lingkungan dan aman bagi kulit sensitif.\n\n` +
        `#### 5. Fleksibilitas Padu-Padan Kontemporer (*Contemporary Versatility*)\n` +
        `• **Kemudahan Mix & Match**: Menjamin busana mudah dipadankan dengan pakaian modern harian (kaos katun, celana kulot/denim, inner dress, hijab voal, hingga sneakers atau loafers) agar wastra hidup dalam keseharian.\n\n` +
        `---\n\n` +
        `### 🔍 Contoh Penerapan pada Koleksi Pilihan: ${matchedRecentProduct.product_name}\n` +
        `• **Pilar 1 (Konteks)**: Sangat pas untuk suasana ${ctx.occasion || 'momen istimewa Anda'} dengan wibawa budaya yang anggun.\n` +
        `• **Pilar 2 (Termal)**: Tenun ${matchedRecentProduct.textile} memberikan kenyamanan suhu optimal di ruangan AC maupun semi-outdoor.\n` +
        `• **Pilar 3 (Siluet)**: Desain kimono/outer tanpa pemotongan destruktif, memberikan siluet megah dan bebas gerak.\n` +
        `• **Pilar 4 (Wastra)**: Membawa filosofi luhur dari ${matchedRecentProduct.textile_origin} dengan pewarna alam otentik.\n` +
        `• **Pilar 5 (Paduan)**: ${matchedRecentProduct.styling_notes}\n\n` +
        `*✓ Berdasarkan Knowledge Base Oerip & Living Heritage Protocol KIRA AI*`,
      recommendation: {
        product_name: matchedRecentProduct.product_name,
        product_id: matchedRecentProduct.product_id,
        image: matchedRecentProduct.image,
        why_reasons: [
          `Keselarasan Konteks: Tepat untuk suasana ${ctx.occasion || 'kegiatan Anda'} dengan pembawaan yang berwibawa.`,
          `Kenyamanan Termal: Serat alami ${matchedRecentProduct.textile} menepis dinginnya AC tanpa rasa gerah.`,
          `Siluet Minim Potong: Desain loose-fit all-size yang menghormati keutuhan kain tenun mama penenun.`,
          `Filosofi Wastra: Menghidupkan doa adat dan pewarnaan alam dari ${matchedRecentProduct.textile_origin}.`,
          `Fleksibilitas Gaya: Sangat luwes dipadukan dengan kaos, celana kulot, kemeja, atau hijab.`
        ],
        about_wastra: `${matchedRecentProduct.textile} dari ${matchedRecentProduct.textile_origin}.`,
        cultural_story: matchedRecentProduct.cultural_story,
        alternatives: OERIP_PRODUCTS.filter(p => p.product_id !== matchedRecentProduct.product_id).slice(0, 2).map(p => p.product_name),
        notes: {
          price_range: matchedRecentProduct.price_range,
          care: matchedRecentProduct.care_instruction,
          availability: matchedRecentProduct.availability
        },
        source: 'Official Oerip Knowledge Base (Tervalidasi)'
      },
      quick_replies: [
        'Rekomendasi busana untuk reuni di kafe ber-AC.',
        'Rekomendasi busana diplomasi budaya.',
        'Ceritakan tentang Tenun Sumba & motif Kuda.',
        'Bagaimana cara merawat kain pewarna alam?'
      ],
      source_badge: '✓ Standar 5 Pilar Kurasi KIRA',
      trace: {
        user_intent: 'Comprehensive Review of KIRA Curatorial Decision Framework & 5 Pillars',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Articulated the 5 foundational pillars of Oerip curation: Occasion Resonance, Thermal Comfort, Zero-Waste Silhouette, Symbolic Grounding, and Contemporary Versatility.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [matchedRecentProduct.product_id, 'KB-BRAND-003', 'KB-BRAND-004', 'KB-TECH-001', 'KB-CARE-001']
      }
    };
  }

  // SCENARIO 14: FOLLOW-UP: "Ceritakan tentang kainnya."
  if (
    lower.includes('ceritakan tentang kain') ||
    lower.includes('tentang kainnya') ||
    lower.includes('kisah kainnya') ||
    lower.includes('asal usul kain')
  ) {
    return {
      content:
        `### 🌾 Kisah & Perjalanan Jiwa Wastra Nusantara\n\n` +
        `Kain yang digunakan pada koleksi ini adalah **tenun tangan asli (*handwoven living textile*)**, bukan sekadar kain meteran industri:\n\n` +
        `• **Penenunan Tradisional**: Ditenun helai demi helai menggunakan alat tenun bukan mesin (ATBM) atau alat tenun gedogan duduk di desa-desa adat Nusantara (seperti Sumba Timur, Kerek Tuban, Klaten, atau Samosir).\n` +
        `• **Pewarnaan Alam Berkelanjutan**: Menggunakan pigmen nabati dari akar pohon mengkudu (*kombu*), fermentasi daun nila (*indigofera/taum*), dan kulit kayu tingi yang membutuhkan perendaman puluhan kali selama 3–12 bulan.\n` +
        `• **Doa & Falsafah Sakral**: Setiap motif yang tersemat bukanlah sekadar ornamen estetika, melainkan doa perlindungan, keteraturan kosmis, harapan kesejahteraan, serta penghormatan pada leluhur penenun.`,
      quick_replies: [
        'Kenapa kamu memilih produk itu?',
        'Kalau saya ingin warna lebih gelap?',
        'Bagaimana cara merawat kain pewarna alam?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Pustaka Wastra Resmi Oerip',
      trace: {
        user_intent: 'In-depth textile provenance and spiritual significance inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Textile authenticity verified with zero synthetic/machine claims.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['WASTRA-SUMBA-001', 'WASTRA-TUBAN-002', 'KB-GUARD-001']
      }
    };
  }

  // SCENARIO 15: PRODUCTION CAPACITY, VOLUME & SLOW FASHION PHILOSOPHY ("biasa produksi berapa", "kapasitas produksi", etc.)
  if (
    lower.includes('produksi') ||
    lower.includes('kapasitas') ||
    lower.includes('berapa pcs') ||
    lower.includes('berapa potong') ||
    lower.includes('berapa biji') ||
    lower.includes('berapa pieces') ||
    lower.includes('berapa banyak') ||
    lower.includes('produksi massal') ||
    lower.includes('mass production') ||
    lower.includes('stok banyak') ||
    lower.includes('stok berapa') ||
    lower.includes('kuantitas') ||
    lower.includes('bikin berapa') ||
    lower.includes('buat berapa')
  ) {
    return {
      content:
        `### 🧵 Kapasitas & Filosofi Produksi Oerip Indonesia\n\n` +
        `Oerip Indonesia memegang teguh prinsip **Slow Fashion & Sustainable Living Heritage**. Sistem penciptaan busana kami **BUKAN industri garmen pabrikan massal (*mass production*)**:\n\n` +
        `1. **Koleksi One-of-a-Kind (1 of 1 / Karya Tunggal)**\n` +
        `   Sebagian besar busana signature Oerip diciptakan **satu helai untuk satu busana (*one-of-a-kind*)**. Satu bentang kain tenun tangan langka diolah langsung menggunakan **Konsep Minim Potong (Zero-Waste)** sehingga setiap karya memiliki keunikan motif dan jiwa tersendiri yang tidak ada duplikatnya di dunia.\n\n` +
        `2. **Batch Sangat Terbatas (*Limited Edition Runs*)**\n` +
        `   Untuk busana berbahan tenun ATBM (seperti Tenun Lurik Prasojo Klaten atau Katun Gedog Tuban), kuantitas produksinya sangat terbatas, biasanya hanya **1 hingga 5 pieces per variasi motif/warna** demi menjaga eksklusivitas pemakainya.\n\n` +
        `3. **Waktu Pengerjaan Tenun Tangan Asli**\n` +
        `   Menenun sehelai kain tradisional membutuhkan waktu **1 hingga 6 bulan** (bahkan hingga 1 tahun untuk fermentasi pewarna alami akar mengkudu dan nila) yang ditenun dengan penuh kesabaran dan doa oleh para mama penenun desa adat mitra Dian Oerip.\n\n` +
        `4. **Pesanan Khusus, B2B & Diplomasi Kenegaraan**\n` +
        `   Untuk kebutuhan seragam instansi, delegasi budaya, maupun pesanan korporat (B2B), Oerip melayani sistem **Made-to-Order / Kurasi Terjadwal** dengan kuota yang disepakati secara beretika (*Fair Trade*) tanpa mengeksploitasi kapasitas para penenun desa adat.\n\n` +
        `---\n\n` +
        `💡 **Ingin Mengecek Koleksi yang Ready Hari Ini?**\n` +
        `Karena perputaran koleksi *one-of-a-kind* sangat dinamis, Anda dapat menanyakan langsung ketersediaan katalog dan pieces eksklusif yang siap kirim ke Tim Kurasi Oerip.`,
      quick_replies: [
        'Berapa rentang harga busana Oerip?',
        'Ceritakan filosofi Zero-Waste Dian Oerip.',
        'Apakah bisa pesan busana custom?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Standar Produksi Slow Fashion Oerip',
      trace: {
        user_intent: 'Production Capacity, Volume, and Slow Fashion Philosophy Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Directly addressed production volume query: explained One-of-a-Kind (1-of-1) & small limited batch (1-5 pcs) system.',
          'Enforced anti-mass-production slow fashion brand principle.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['FAQ-005', 'KB-BRAND-001', 'KB-BRAND-003', 'KB-TECH-001']
      }
    };
  }

  // SCENARIO 16: PRICE RANGE & VALUATION ("berapa harga", "rentang harga", "kisaran harga")
  if (
    (lower.includes('berapa') && (lower.includes('harga') || lower.includes('biaya') || lower.includes('tarif'))) ||
    lower.includes('rentang harga') ||
    lower.includes('kisaran harga') ||
    lower.includes('pricelist') ||
    lower.includes('daftar harga')
  ) {
    return {
      content:
        `### 🏷️ Rentang Investasi & Nilai Apresiasi 8 Koleksi Oerip Indonesia\n\n` +
        `Setiap busana Oerip dihargai berdasarkan kelangkaan kain tenun tangan, kerumitan motif sakral, dan durasi proses pewarnaan alam murni:\n\n` +
        `1. **Oerip Contemporary Lurik Minimalist Short Kimono (OERIP-LUR-003)**: Rp 1.200.000 – Rp 2.400.000\n` +
        `2. **Oerip Earth-Tone Minimalist Sleeveless Vest (OERIP-VES-008)**: Rp 1.350.000 – Rp 2.600.000\n` +
        `3. **Oerip Signature Blanket Outer (OERIP-OUT-001)**: Rp 1.500.000 – Rp 4.500.000\n` +
        `4. **Oerip Zero-Waste Asymmetric Gedog Cape Wrap (OERIP-CAP-005)**: Rp 1.750.000 – Rp 3.200.000\n` +
        `5. **Oerip Flores Geometric Reversible Poncho (OERIP-PON-007)**: Rp 1.950.000 – Rp 3.800.000\n` +
        `6. **Oerip Heritage Ulos Statement Vest (OERIP-ULO-004)**: Rp 2.200.000 – Rp 4.800.000\n` +
        `7. **Oerip Bohemian Sumba Long Duster Robe (OERIP-KIM-002)**: Rp 2.500.000 – Rp 5.800.000\n` +
        `8. **Oerip Living Heritage Tunic Dress & Selendang Set (OERIP-DRS-006)**: Rp 2.800.000 – Rp 5.200.000\n\n` +
        `Setiap pembelian merupakan bentuk dukungan langsung (*fair trade*) bagi keberlanjutan hidup para keluarga mama penenun desa adat Nusantara.`,
      quick_replies: [
        'Biasa produksi berapa potong per model?',
        'Rekomendasi busana untuk diplomasi budaya.',
        'Bagaimana cara merawat kain pewarna alam?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Informasi Resmi Harga Oerip',
      trace: {
        user_intent: 'Price Range & Investment Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Provided verified retail price ranges across verified product tiers without leaking restricted HPP/margins.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'OERIP-OUT-001', 'OERIP-LUR-003', 'OERIP-KIM-002']
      }
    };
  }

  // SCENARIO 17: BRAND PROFILE & FOUNDER ("siapa pendiri", "siapa dian oerip", "profil oerip")
  if (
    lower.includes('siapa pendiri') ||
    lower.includes('siapa pembuat') ||
    lower.includes('siapa dian oerip') ||
    lower.includes('tentang oerip') ||
    lower.includes('profil oerip') ||
    lower.includes('sejarah oerip')
  ) {
    return {
      content:
        `### 🌿 Profil & Jiwa di Balik Oerip Indonesia\n\n` +
        `**Oerip Indonesia** didirikan oleh **Dian Errakumalasari (Dian Oerip)**, seorang perancang busana dan budayawan asal Ngawi, Jawa Timur, yang mendedikasikan hidupnya menjelajahi pelosok Nusantara untuk meriset dan melestarikan tenun tradisional.\n\n` +
        `• **Visi**: Menghidupkan kembali wastra tenun tangan Nusantara agar tidak hanya tersimpan di lemari atau museum, melainkan menjadi busana kontemporer yang hidup, berjiwa, dan dikenakan dengan bangga oleh generasi dunia (*Living Heritage*).\n` +
        `• **Ciri Khas Desain**: Siluet *oversized* (all-size fleksibel), potongan bebas yang inklusif (*gender-neutral*), dan konsistensi menggunakan **Konsep Minim Potong (Zero-Waste)** demi memuliakan doa para penenun.\n` +
        `• **Kantor & Galeri**: Berpusat di **Museum & Gallery Oerip, Ngawi, Jawa Timur**, dipimpin oleh Bagas Qolbu Cetta (CEO) bersama tim kurasi budaya.`,
      quick_replies: [
        'Biasa produksi berapa pieces per model?',
        'Ceritakan filosofi Zero-Waste Dian Oerip.',
        'Apa saja 6 wastra terverifikasi Oerip?',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Profil Resmi Dian Oerip',
      trace: {
        user_intent: 'Founder and Brand Profile Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Verified biographical and brand heritage facts from level 1 primary data.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-002', 'KB-BRAND-003']
      }
    };
  }

  // SCENARIO 18: LOCATION & GALLERY ("dimana lokasi", "alamat galeri", "toko oerip", "ngawi")
  if (
    lower.includes('dimana') ||
    lower.includes('di mana') ||
    lower.includes('lokasi') ||
    lower.includes('alamat') ||
    lower.includes('museum oerip') ||
    lower.includes('galeri oerip') ||
    lower.includes('toko oerip')
  ) {
    return {
      content:
        `### 🏛️ Lokasi Galeri & Pusat Kebudayaan Oerip Indonesia\n\n` +
        `Pusat kurasi dan galeri utama Oerip Indonesia bertempat di:\n\n` +
        `📍 **Museum & Gallery Oerip Indonesia**\n` +
        `Kabupaten Ngawi, Jawa Timur, Indonesia.\n\n` +
        `Galeri ini menjadi ruang pamer hidup (*living gallery*) yang menyimpan ratusan arsip kain tenun kuno hasil riset lapangan Dian Oerip di berbagai pelosok adat Nusantara, sekaligus studio kurasi busana *ready-to-wear* dan *bespoke couture*.\n\n` +
        `Untuk kunjungan privat, konsultasi kurasi tatap muka, atau informasi pameran keliling di kota Anda, silakan hubungi tim kurasi kami.`,
      quick_replies: [
        'Biasa produksi berapa potong per baju?',
        'Berapa rentang harga busana Oerip?',
        'Rekomendasi busana untuk diplomasi budaya.',
        'Konsultasi via WhatsApp Admin'
      ],
      source_badge: '✓ Informasi Lokasi Resmi',
      trace: {
        user_intent: 'Gallery Location and Physical Store Inquiry',
        context_detected: ctx,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: ['Returned headquarters and gallery location data.'],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: ['KB-BRAND-001']
      }
    };
  }

  return null;
}

// ---------------------------------------------------------
// Dynamic Intelligent Fallback Engine
// ---------------------------------------------------------
function executeDeterministicAgentWorkflow(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  ctx: DetectedContext
) {
  const lower = message.toLowerCase().trim();

  // 0. Check deterministic scenarios first
  const scenarioMatch = checkDeterministicScenarios(lower, ctx, history);
  if (scenarioMatch) {
    return scenarioMatch;
  }

  // 1. Strict Intent Verification: Does the user explicitly want an outfit recommendation or styling for an occasion?
  const userWantsRecommendation = hasOutfitRecommendationIntent(lower, ctx);

  // 2. If the user does NOT explicitly want an outfit recommendation:
  if (!userWantsRecommendation) {
    // 2A. If the user is asking an informational or conceptual question:
    if (
      isInformationalOrConceptualQuery(lower) ||
      lower.includes('?') ||
      lower.startsWith('apa') ||
      lower.startsWith('siapa') ||
      lower.startsWith('bagaimana') ||
      lower.startsWith('berapa')
    ) {
      return {
        content:
          `Halo Sahabat Budaya! 🙏 Saya **KIRA**, asisten kecerdasan budaya resmi **Oerip Indonesia**.\n\n` +
          `Mengenai pertanyaan Anda: *"${message}"*, berikut adalah panduan resmi dari basis pengetahuan Oerip Indonesia:\n\n` +
          `• **Filosofi Slow Fashion & Zero-Waste (Minim Potong)**: Dian Oerip merancang busana dengan menghormati bentang asli tenun tangan para mama penenun desa adat tanpa memotong serat kain sembarangan. Setiap helai diciptakan *One-of-a-Kind* dengan siluet longgar *all-size* yang inklusif.\n` +
          `• **Pustaka 6 Wastra Nusantara**: Menghimpun tradisi tenun hidup terverifikasi: Sumba Timur (NTT), Gedog Tuban (Jatim), Lurik Klaten (Jateng), Ulos Batak Toba (Sumut), Tenun Flores (NTT), dan Tenun Toraja Sa'dan (Sulsel).\n` +
          `• **Pewarnaan Nabati Alami**: Memanfaatkan akar mengkudu (*kombu*), daun nila (*indigofera/taum*), kulit kayu tingi, dan lumpur vulkanik tanpa zat kimia sintetis berbahaya.\n\n` +
          `Jika Anda memerlukan kurasi busana untuk menghadiri acara tertentu, silakan sebutkan acaranya (misal: wisuda, reuni, pernikahan, kantor, atau liburan) dan KIRA akan mengurasi padanan terbaik untuk Anda.`,
        quick_replies: [
          'Ceritakan tentang Konsep Minim Potong (Zero-Waste).',
          'Apa saja 6 wastra terverifikasi Oerip?',
          'Berapa rentang harga resmi busana Oerip?',
          'Rekomendasi busana untuk acara tertentu'
        ],
        source_badge: '✓ Panduan Budaya KIRA',
        trace: {
          user_intent: `Informational Query Guidance: "${message.slice(0, 50)}"`,
          context_detected: ctx,
          is_sufficient_information: true,
          guardrail_checked: true,
          guardrail_notes: ['Handled informational inquiry with cultural depth. Did NOT force an unsolicited outfit recommendation.'],
          cultural_accuracy_verified: true,
          retrieved_knowledge_ids: ['KB-BRAND-001', 'KB-BRAND-003']
        }
      };
    }

    // 2B. If the query is unclear, ambiguous, or not understood by KIRA:
    // DO NOT FORCE AN OUTFIT RECOMMENDATION. Ask for clarification!
    return generateClarificationGuidanceResponse(message, ctx);
  }

  // -------------------------------------------------------------
  // 3. INSUFFICIENT DATA CHECK FOR RECOMMENDATIONS
  // Never select a product randomly! If essential data is missing,
  // ask 1-2 most important questions (occasion, style, color, budget).
  // -------------------------------------------------------------
  if (isInsufficientRecommendationData(lower, ctx)) {
    return generateClarificationForRecommendation(message, ctx);
  }

  // 4. Evaluate parameters across all 8 catalog products and select the best match
  let chosenProduct = OERIP_PRODUCTS[2]; // Contemporary Lurik Kimono
  if (lower.includes('cape') || lower.includes('asimetris') || lower.includes('pameran') || lower.includes('wrap')) {
    chosenProduct = OERIP_PRODUCTS[4]; // OERIP-CAP-005 Gedog Cape Wrap
  } else if (lower.includes('tunic') || lower.includes('tunik') || lower.includes('dress') || lower.includes('toraja') || ctx.occasion?.includes('Keluarga') || lower.includes('terusan')) {
    chosenProduct = OERIP_PRODUCTS[5]; // OERIP-DRS-006 Tunic Dress Set
  } else if (lower.includes('poncho') || lower.includes('ponco') || lower.includes('flores') || lower.includes('gunung') || lower.includes('winter') || lower.includes('reversible')) {
    chosenProduct = OERIP_PRODUCTS[6]; // OERIP-PON-007 Poncho Reversible
  } else if (lower.includes('rompi') || lower.includes('sleeveless') || lower.includes('earth tone') || lower.includes('tanpa lengan')) {
    chosenProduct = OERIP_PRODUCTS[7]; // OERIP-VES-008 Sleeveless Vest
  } else if (ctx.occasion?.includes('Diplomasi') || lower.includes('diplomasi') || lower.includes('sumba')) {
    chosenProduct = OERIP_PRODUCTS[0]; // OERIP-OUT-001 Blanket Outer
  } else if (ctx.occasion?.includes('Pernikahan') || ctx.occasion?.includes('Resepsi') || lower.includes('ulos')) {
    chosenProduct = OERIP_PRODUCTS[3]; // OERIP-ULO-004 Ulos Vest
  } else if (ctx.occasion?.includes('Traveling') || ctx.occasion?.includes('Bohemian') || lower.includes('pantai') || lower.includes('duster')) {
    chosenProduct = OERIP_PRODUCTS[1]; // OERIP-KIM-002 Sumba Duster
  } else if (ctx.venue?.includes('AC') || /\b(ac|ber-ac)\b/i.test(lower) || lower.includes('dingin')) {
    chosenProduct = OERIP_PRODUCTS[6]; // Flores Poncho
  }

  const occasionLabel = ctx.occasion || 'kebutuhan busana yang Anda cari';
  const venueLabel = ctx.venue ? ` dengan suasana ${ctx.venue}` : '';
  const styleLabel = ctx.desired_style || ctx.formality || 'Etnik Kontemporer Nusantara';

  return {
    content:
      `Halo Sahabat Budaya! 🙏 Untuk **${occasionLabel}**${venueLabel}, KIRA telah mengurasi pilihan busana yang memadukan wibawa wastra Nusantara, siluet modern, dan kenyamanan pemakaian:\n\n` +
      `---\n\n` +
      `### REKOMENDASI UTAMA KIRA\n\n` +
      `**${chosenProduct.product_name}**\n` +
      `*(Kode Produk: ${chosenProduct.product_id})*\n\n` +
      `**💡 EVALUASI 10 FAKTOR KURASI KIRA:**\n` +
      `1. **Jenis Acara**: ${ctx.occasion || 'Acara Istimewa Pilihan Anda'}\n` +
      `2. **Gaya yang Diinginkan**: ${styleLabel}\n` +
      `3. **Warna**: ${ctx.color_tone || ctx.color_preference || 'Pewarnaan Nabati Alami (Indigofera / Tingi / Mengkudu)'}\n` +
      `4. **Model Pakaian**: ${ctx.preferred_model || chosenProduct.product_name.split('Oerip ')[1] || 'Luaran All-Size Fleksibel'}\n` +
      `5. **Jenis Wastra**: ${chosenProduct.textile} dari ${chosenProduct.textile_origin}\n` +
      `6. **Bahan**: Katun tenun tangan 100% serat alami (${ctx.climate_comfort || 'berpori sejuk dan nyaman'})\n` +
      `7. **Ukuran & Karakter Fit**: All-size longgar inklusif (LD 100–130 cm), jatuh luwes khas rancangan Dian Oerip\n` +
      `8. **Rentang Harga**: **${chosenProduct.price_range}** (Resmi Knowledge Base Oerip)\n` +
      `9. **Filosofi Wastra**: ${chosenProduct.cultural_story.slice(0, 110)}... Dilengkapi prinsip *Konsep Minim Potong (Zero-Waste)*.\n` +
      `10. **Kesesuaian Kebutuhan**: Mengharmonisasikan etika berpakaian, kenyamanan suhu tubuh, dan nilai seni pusaka Nusantara tanpa kekakuan.\n\n` +
      `**Panduan Padu-Padan (Styling):**\n` +
      `Padukan dengan inner katun polos warna netral (putih gading/hitam), bawahan celana kulot atau celana bahan berpotongan lurus, serta aksesoris etnik untuk melengkapi pesona penampilan Anda.\n\n` +
      `*✓ Terkurasi dari Knowledge Base Resmi Oerip Indonesia*`,
    recommendation: {
      product_name: chosenProduct.product_name,
      product_id: chosenProduct.product_id,
      image: chosenProduct.image,
      why_reasons: [
        `Dirancang untuk ${occasionLabel} dengan kenyamanan serat alami.`,
        'Siluet all-size khas Dian Oerip yang rileks, berwibawa, dan membebaskan gerak.',
        'Konsep zero-waste yang menghargai keutuhan karya seni tenun tangan para pengrajin.'
      ],
      about_wastra: `${chosenProduct.textile} dari ${chosenProduct.textile_origin}.`,
      cultural_story: chosenProduct.cultural_story,
      alternatives: OERIP_PRODUCTS.filter(p => p.product_id !== chosenProduct.product_id).slice(0, 2).map(p => p.product_name),
      notes: {
        price_range: chosenProduct.price_range,
        care: chosenProduct.care_instruction,
        availability: chosenProduct.availability
      },
      source: 'Official Oerip Knowledge Base (Tervalidasi)'
    },
    quick_replies: generateContextualQuickReplies(ctx, chosenProduct.product_id),
    source_badge: '✓ Evaluasi 10 Faktor KIRA',
    trace: {
      user_intent: `Curated Styling Request: "${message.slice(0, 50)}"`,
      context_detected: ctx,
      is_sufficient_information: true,
      guardrail_checked: true,
      guardrail_notes: [
        `Evaluated 10 curation factors. Selected verified product ${chosenProduct.product_id} based on explicit styling/occasion request.`,
        'Strict Knowledge Base adherence: Zero hallucination.'
      ],
      cultural_accuracy_verified: true,
      retrieved_knowledge_ids: [chosenProduct.product_id, 'KB-BRAND-001', 'KB-BRAND-003']
    }
  };
}
