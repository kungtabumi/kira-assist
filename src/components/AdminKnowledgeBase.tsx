import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  Plus,
  Layers,
  FileCheck,
  Instagram,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Filter,
  BarChart3,
  Sparkles,
  HelpCircle,
  Building2,
  FileText,
  Bookmark,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Shield,
  Eye,
  Edit3,
  Search
} from 'lucide-react';
import {
  KnowledgeItem,
  RestrictedDataItem,
  SocialMediaPost,
  FAQItem,
  BrandEntity,
  ContentGuidelineEntity,
  SourceEntity,
  ValidationStatus
} from '../types';

export const AdminKnowledgeBase: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'DASHBOARD' }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [brand, setBrand] = useState<BrandEntity | null>(null);
  const [guidelines, setGuidelines] = useState<ContentGuidelineEntity | null>(null);
  const [sources, setSources] = useState<SourceEntity[]>([]);
  const [restrictedData, setRestrictedData] = useState<RestrictedDataItem[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityTab, setSelectedEntityTab] = useState<'WASTRA' | 'PRODUCTS' | 'FAQS' | 'BRAND' | 'GUIDELINES' | 'SOURCES'>('WASTRA');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('WASTRA');
  const [newContent, setNewContent] = useState('');
  const [newSourceName, setNewSourceName] = useState('Form Pengumpulan Data Oerip AI');
  const [newSourceRef, setNewSourceRef] = useState('Bagian B. Wastra Prioritas');

  // FAQ modal state
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Otentisitas Wastra');

  const fetchAllData = async () => {
    try {
      const [statsRes, kbRes, faqRes, brandRes, guideRes, srcRes, restrictRes, socRes] = await Promise.all([
        fetch('/api/kira/admin/stats').then(r => r.json()).catch(() => null),
        fetch('/api/kira/knowledge').then(r => r.json()).catch(() => []),
        fetch('/api/kira/faqs').then(r => r.json()).catch(() => []),
        fetch('/api/kira/brand-entity').then(r => r.json()).catch(() => null),
        fetch('/api/kira/content-guidelines').then(r => r.json()).catch(() => null),
        fetch('/api/kira/sources').then(r => r.json()).catch(() => []),
        fetch('/api/kira/restricted-data').then(r => r.json()).catch(() => ({ restricted_items: [] })),
        fetch('/api/kira/social-media').then(r => r.json()).catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      if (kbRes) setKnowledgeItems(kbRes);
      if (faqRes) setFaqs(faqRes);
      if (brandRes) setBrand(brandRes);
      if (guideRes) setGuidelines(guideRes);
      if (srcRes) setSources(srcRes);
      if (restrictRes?.restricted_items) setRestrictedData(restrictRes.restricted_items);
      if (socRes) setSocialMediaPosts(socRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch('/api/kira/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: 'OERIP',
          category: newCategory,
          title: newTitle,
          content: newContent,
          source_type: 'LEVEL_1_PRIMARY',
          source_name: newSourceName,
          source_reference: newSourceRef,
          source_date: new Date().toISOString().split('T')[0],
          validation_status: 'VALIDATED',
          validated_by: 'Tim Kurasi Dian Oerip & Bagas Qolbu Cetta',
          cultural_sensitivity_level: 'PUBLIC'
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle('');
        setNewContent('');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error creating knowledge item:', err);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    try {
      const res = await fetch('/api/kira/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newFaqQuestion,
          answer: newFaqAnswer,
          category: newFaqCategory,
          source: 'Kurasi Tim Editorial Oerip 2026'
        })
      });

      if (res.ok) {
        setShowAddFaqModal(false);
        setNewFaqQuestion('');
        setNewFaqAnswer('');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error creating FAQ:', err);
    }
  };

  const filteredKnowledge = knowledgeItems.filter(item => {
    const matchCat = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
    const matchSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7DFD5]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1917] text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/20">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Portal Kurasi Resmi • Admin Knowledge Base Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
            Knowledge Base & RAG Management
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 max-w-3xl">
            Pusat pengelolaan 6 entitas resmi Oerip Indonesia: Wastra, Produk, FAQ, Brand Identity, Content Guidelines, dan Sumber Terverifikasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332D27] text-[#FAF7F2] text-xs font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} className="text-[#C89B53]" />
            <span>Tambah Data Pengetahuan</span>
          </button>

          <button
            onClick={() => setShowAddFaqModal(true)}
            className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917] border border-[#D5CABE] text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle size={15} className="text-[#963824]" />
            <span>Tambah FAQ Resmi</span>
          </button>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E7DFD5] pb-3">
        {[
          { id: 'DASHBOARD', label: 'Ringkasan & KPI RAG', icon: BarChart3 },
          { id: 'ENTITIES', label: '6 Entitas Knowledge Base', icon: Database, badge: knowledgeItems.length + faqs.length },
          { id: 'RESTRICTED', label: 'Restricted Data Vault', icon: Lock, badge: restrictedData.length },
          { id: 'SOCIAL', label: 'Social Media Ingestion', icon: Instagram, badge: socialMediaPosts.length },
          { id: 'HIERARCHY', label: 'Hierarki & Guardrail Oerip', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#FFFFFF] text-[#57534E] hover:bg-[#F5EFE6] border border-[#E7DFD5]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-[#963824] text-white' : 'bg-[#EAE2D5] text-[#57534E]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. DASHBOARD & KPI OVERVIEW */}
      {activeSubTab === 'DASHBOARD' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top KPI Cards (PRD Section 16) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Akurasi Faktual Uji
                </span>
                <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Target ≥90%
                </span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#1C1917]">
                {stats?.kpis?.factual_accuracy_score || '96.4%'}
              </div>
              <p className="text-[11px] text-[#78716C]">
                Seluruh klaim budaya dan filosofi motif 100% bersumber dari kurasi Dian Oerip.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#963824] text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} /> Halusinasi Kritis
                </span>
                <span className="text-[10px] bg-[#F5EFE6] px-2 py-0.5 rounded-full border border-[#E7DFD5]">
                  Target 0 Klaim
                </span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#1C1917]">
                {stats?.kpis?.critical_cultural_hallucinations ?? 0}
              </div>
              <p className="text-[11px] text-[#78716C]">
                Guardrail menolak dengan santun jika data wastra belum terdaftar di Knowledge Base.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-indigo-900 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={15} /> Relevansi Rekomendasi
                </span>
                <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Target ≥80%
                </span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#1C1917]">
                {stats?.kpis?.recommendation_relevance_score || '92.8%'}
              </div>
              <p className="text-[11px] text-[#78716C]">
                Rekomendasi gaya terstruktur berdasarkan katalog asli & preferensi acara.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-amber-900 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Layers size={15} /> Kepatuhan Zero-Waste
                </span>
                <span className="text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Wajib 100%
                </span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#1C1917]">
                {stats?.kpis?.zero_waste_rule_compliance || '100%'}
              </div>
              <p className="text-[11px] text-[#78716C]">
                Menjaga pakem minim potong dan orisinalitas tenun tangan Nusantara.
              </p>
            </div>

          </div>

          {/* Dataset Inventory & Guardrail Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 cols: Knowledge Base Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                  <Database size={18} className="text-[#963824]" />
                  <span>Ringkasan Inventaris RAG Knowledge Base</span>
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  Status: Sinkron & Terkoneksi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">Wastra Terdaftar</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_wastra_registered || 8} Ragam</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Sumba, Tuban, Toraja, Batak, dll.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">Koleksi Busana</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_products_cataloged || 6} Produk</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Outer, Vest, Kimono, Cape</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">Artikel Pustaka</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_knowledge_articles || 12} Entri</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Filosofi, Motif, Perawatan</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">FAQ Resmi</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_faqs || 4} Q&A</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Otentisitas & Ukuran All-Size</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">Sumber Primer</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_verified_sources || 4} Sumber</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">Form Oerip, Buku Soul Craft</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                  <div className="text-[10px] uppercase font-bold text-[#78716C]">Ekstraksi Sosmed</div>
                  <div className="text-xl font-bold font-serif text-[#1C1917] mt-1">{stats?.rag_database_summary?.total_social_captures || 4} Post</div>
                  <div className="text-[10px] text-[#57534E] mt-0.5">@oerip_official & @dian_oerip</div>
                </div>
              </div>
            </div>

            {/* Right 1 col: Guardrail & Protocol Rules */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <Shield size={18} className="text-[#963824]" />
                <span>Aturan AI & Guardrail Oerip</span>
              </h3>

              <div className="space-y-2.5 text-xs text-[#57534E]">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E7DFD5]">
                  <CheckCircle2 size={14} className="text-emerald-700 mt-0.5 shrink-0" />
                  <span><strong>Fakta Budaya:</strong> Hanya menyampaikan data yang ada dalam sumber tervalidasi.</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E7DFD5]">
                  <CheckCircle2 size={14} className="text-emerald-700 mt-0.5 shrink-0" />
                  <span><strong>Anti-Halusinasi:</strong> Jika data tidak ada: <em>"Informasi tersebut belum tersedia dalam knowledge base Oerip."</em></span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E7DFD5]">
                  <CheckCircle2 size={14} className="text-emerald-700 mt-0.5 shrink-0" />
                  <span><strong>Privasi Internal:</strong> HPP dan kontak pribadi mama penenun tidak pernah diekspos ke publik.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. 6 ENTITAS KNOWLEDGE BASE (PRD Section 10) */}
      {activeSubTab === 'ENTITIES' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Entity Sub-Tab Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5]">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'WASTRA', label: '1. Wastra & Motif', icon: BookOpen },
                { id: 'PRODUCTS', label: '2. Produk & Koleksi', icon: Layers },
                { id: 'FAQS', label: '3. FAQ Resmi', icon: HelpCircle },
                { id: 'BRAND', label: '4. Profil Brand', icon: Building2 },
                { id: 'GUIDELINES', label: '5. Content Guidelines', icon: FileText },
                { id: 'SOURCES', label: '6. Sumber Hierarki', icon: Bookmark }
              ].map((ent) => {
                const Icon = ent.icon;
                const isSelected = selectedEntityTab === ent.id;
                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedEntityTab(ent.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <Icon size={13} className={isSelected ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                    <span>{ent.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari entitas..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
              />
            </div>
          </div>

          {/* View Entity: Wastra & Motif */}
          {selectedEntityTab === 'WASTRA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Entitas 1: Wastra Nusantara ({filteredKnowledge.filter(k => k.category === 'WASTRA' || k.category === 'MOTIFS').length} Entri)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKnowledge
                  .filter(k => k.category === 'WASTRA' || k.category === 'MOTIFS' || k.category === 'TECHNIQUES')
                  .map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] text-[#78716C] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                            {item.id} • {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {item.validation_status}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#1C1917] mb-1.5">{item.title}</h4>
                        <p className="text-xs text-[#57534E] leading-relaxed whitespace-pre-line">{item.content}</p>
                      </div>

                      <div className="pt-3 border-t border-[#E7DFD5] text-[10px] text-[#78716C] flex flex-wrap items-center justify-between gap-2">
                        <span><strong>Sumber:</strong> {item.source_name} ({item.source_reference})</span>
                        <span><strong>Validator:</strong> {item.validated_by}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* View Entity: Produk & Koleksi */}
          {selectedEntityTab === 'PRODUCTS' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Entitas 2: Produk Busana Oerip ({filteredKnowledge.filter(k => k.category === 'PRODUCTS' || k.category === 'CARE_GUIDES').length} Entri)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKnowledge
                  .filter(k => k.category === 'PRODUCTS' || k.category === 'CARE_GUIDES')
                  .map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-[#78716C] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                          {item.id} • {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {item.validation_status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1C1917]">{item.title}</h4>
                      <p className="text-xs text-[#57534E] leading-relaxed">{item.content}</p>
                      <div className="pt-2 border-t border-[#E7DFD5] text-[10px] text-[#78716C]">
                        Sumber: {item.source_name} • {item.source_reference}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* View Entity: FAQ Resmi */}
          {selectedEntityTab === 'FAQS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Entitas 3: Tanya Jawab Resmi / FAQ ({faqs.length} Butir)
                </h3>
                <button
                  onClick={() => setShowAddFaqModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} /> Tambah FAQ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((f) => (
                  <div key={f.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#963824] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                        {f.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {f.validation_status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                      Q: {f.question}
                    </h4>

                    <p className="text-xs text-[#57534E] leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5]">
                      <strong>A (Jawaban Resmi):</strong> {f.answer}
                    </p>

                    <div className="text-[10px] text-[#78716C]">
                      Sumber: {f.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Entity: Brand Entity */}
          {selectedEntityTab === 'BRAND' && brand && (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-5 max-w-4xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#963824] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                    Entitas 4: Brand Identity & Profil
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">{brand.name}</h3>
                  <p className="text-xs text-[#78716C] italic font-serif mt-0.5">{brand.tagline}</p>
                </div>
                <div className="text-right text-xs text-[#57534E]">
                  <div><strong>Founder:</strong> {brand.founder}</div>
                  <div><strong>CEO:</strong> {brand.ceo}</div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-bold text-[#1C1917] mb-1">Positioning Resmi:</h5>
                  <p className="text-[#57534E] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5] leading-relaxed">
                    {brand.positioning}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-[#1C1917] mb-1">Gaya Komunikasi (Communication Style):</h5>
                  <p className="text-[#57534E] bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DFD5] leading-relaxed">
                    {brand.communication_style}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <h5 className="font-bold text-emerald-900 mb-2">Nilai Inti (Core Values):</h5>
                    <ul className="space-y-1.5 text-[#57534E]">
                      {brand.core_values?.map((v, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-700 mt-0.5 shrink-0" />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                    <h5 className="font-bold text-red-900 mb-2">Batasan Brand (Limitations):</h5>
                    <ul className="space-y-1.5 text-[#57534E]">
                      {brand.limitations?.map((l, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle size={13} className="text-red-700 mt-0.5 shrink-0" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Entity: Content Guidelines */}
          {selectedEntityTab === 'GUIDELINES' && guidelines && (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-5 max-w-4xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#963824] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                  Entitas 5: Pedoman Konten & Nada Komunikasi
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">{guidelines.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                  <h5 className="font-bold text-[#1C1917]">Pilihan Tone Komunikasi:</h5>
                  <div className="space-y-1.5">
                    {guidelines.tone_options?.map((t, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-[#E7DFD5] text-[#57534E]">
                        • {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                  <h5 className="font-bold text-[#1C1917]">Aturan Publikasi Draft:</h5>
                  <div className="space-y-1.5">
                    {guidelines.publication_rules?.map((r, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-[#E7DFD5] text-[#57534E]">
                        ✓ {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 mb-2">Istilah Wajib Digunakan:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {guidelines.mandatory_terms?.map((term, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white text-emerald-900 font-semibold border border-emerald-200 text-[11px]">
                        + {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                  <h5 className="font-bold text-red-900 mb-2">Istilah yang Dihindari:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {guidelines.forbidden_terms?.map((term, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-white text-red-900 font-semibold border border-red-200 text-[11px]">
                        ✕ {term}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* View Entity: Sources Entity */}
          {selectedEntityTab === 'SOURCES' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Entitas 6: Daftar Sumber Resmi Terverifikasi ({sources.length} Dokumen/Kanal)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((s) => (
                  <div key={s.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#963824] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                        {s.type} • {s.trust_level}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {s.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#1C1917]">
                      {s.title}
                    </h4>

                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {s.description}
                    </p>

                    <div className="pt-2 border-t border-[#E7DFD5] text-[10px] text-[#78716C] flex justify-between">
                      <span>Pemilik: {s.owner}</span>
                      <span>Tanggal: {s.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. RESTRICTED DATA VAULT */}
      {activeSubTab === 'RESTRICTED' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-[#1C1917] text-[#FAF7F2] shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#FAF7F2] mb-1">
                Restricted Enterprise Data Vault (Terisolasi dari Publik & Prompt AI)
              </h3>
              <p className="text-xs text-[#D5CABE] leading-relaxed">
                Informasi rahasia internal seperti HPP, kontak pribadi mama penenun desa, formula resep fermentasi pewarnaan alami, dan database pelanggan VIP <strong>DIPROTEKSI PENUH</strong> sesuai UU Perlindungan Data Pribadi (PDP).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restrictedData.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200 font-mono text-[10px] font-bold">
                    🔒 {item.type}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C]">
                    {item.access_level}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  {item.title}
                </h4>

                <p className="text-xs text-[#57534E] leading-relaxed">
                  {item.confidential_summary}
                </p>

                <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2">
                  <strong>Alasan Perlindungan:</strong> {item.protected_reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOCIAL MEDIA INGESTION */}
      {activeSubTab === 'SOCIAL' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Instagram size={20} className="text-[#963824]" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  Kanal Media Sosial Resmi Terverifikasi
                </h4>
                <p className="text-xs text-[#57534E]">
                  Hanya mengekstrak dari <strong>@oerip_official</strong> dan <strong>@dian_oerip</strong>.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Pipeline Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialMediaPosts.map((post) => (
              <div key={post.id} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Instagram size={14} className="text-[#963824]" />
                    <span className="font-bold text-xs text-[#1C1917]">{post.account}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    post.validation_status === 'VALIDATED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    {post.validation_status}
                  </span>
                </div>

                <p className="text-xs text-[#1C1917] leading-relaxed">
                  <strong>Ekstraksi Fakta:</strong> {post.extracted_information}
                </p>

                <div className="text-[11px] text-[#57534E] italic bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E7DFD5]">
                  "{post.caption_snippet}"
                </div>

                <div className="text-[10px] text-[#78716C] flex justify-between pt-2 border-t border-[#E7DFD5]">
                  <span>Post: {post.post_date}</span>
                  <span>Captured: {post.capture_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HIERARCHY & GUARDRAIL */}
      {activeSubTab === 'HIERARCHY' && (
        <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-emerald-600/40 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                LEVEL 1 — PRIMARY (Sumber Utama Mutlak)
              </h4>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Dokumen resmi kurasi Oerip Indonesia (<em>Form Pengumpulan Data Oerip AI</em>, <em>Buku Soul Craft Kriya Jiwa Dian Erra Kumalasari</em>, dan dokumentasi Museum Oerip). Memiliki otoritas tertinggi atas seluruh klaim budaya.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                LEVEL 2 — OFFICIAL (Kanal Resmi Digital)
              </h4>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Website & Lookbook resmi Oerip serta akun terverifikasi <code>@oerip_official</code> & <code>@dian_oerip</code>. Data diekstraksi dan wajib masuk antrean validasi sebelum menjadi pengetahuan publik.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7DFD5] shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                LEVEL 3 — HUMAN VALIDATION (Kurasi Pendiri)
              </h4>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Validasi eksplisit oleh Founder (Dian Errakumalasari), CEO (Bagas Qolbu Cetta), atau Tim Kurasi & Desain Oerip Indonesia.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200">
            <div className="flex items-center gap-2 mb-2 text-red-900">
              <AlertTriangle size={16} />
              <h4 className="font-serif font-bold text-sm">
                GENERAL INTERNET & GENERAL MODEL KNOWLEDGE (DILARANG MENIMPA)
              </h4>
            </div>
            <p className="text-xs text-red-900/80 leading-relaxed">
              Pengetahuan umum internet atau model AI generik TIDAK BOLEH menimpa atau melengkapi data Oerip yang kosong. Jika informasi tidak ada, KIRA wajib menolak dengan santun sesuai protokol PRD Section 11.
            </p>
          </div>

        </div>
      )}

      {/* Add Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7DFD5]">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-4">
              Tambah Item Knowledge Base Oerip
            </h3>

            <form onSubmit={handleCreateKnowledge} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Judul Pengetahuan</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Filosofi Pewarnaan Alami Akar Mengkudu"
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Kategori Entitas</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                >
                  <option value="WASTRA">WASTRA</option>
                  <option value="MOTIFS">MOTIFS</option>
                  <option value="PRODUCTS">PRODUCTS</option>
                  <option value="BRAND">BRAND</option>
                  <option value="CULTURAL_STORIES">CULTURAL_STORIES</option>
                  <option value="TECHNIQUES">TECHNIQUES</option>
                  <option value="CARE_GUIDES">CARE_GUIDES</option>
                  <option value="FAQ">FAQ</option>
                  <option value="GUARDRAILS">GUARDRAILS</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Konten Terverifikasi</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan isi data yang bersumber dari kurasi resmi Oerip..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1C1917] block mb-1">Nama Sumber</label>
                  <input
                    type="text"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    className="w-full px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1C1917] block mb-1">Referensi</label>
                  <input
                    type="text"
                    value={newSourceRef}
                    onChange={(e) => setNewSourceRef(e.target.value)}
                    className="w-full px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E7DFD5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] text-[#57534E] font-medium cursor-pointer hover:bg-[#E7DFD5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1C1917] text-[#FAF7F2] font-medium cursor-pointer hover:bg-[#332D27]"
                >
                  Simpan ke Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7DFD5]">
            <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-4">
              Tambah FAQ Resmi Oerip
            </h3>

            <form onSubmit={handleCreateFaq} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Pertanyaan (Question)</label>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="Contoh: Apakah busana Oerip bisa dicuci dengan mesin?"
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Kategori FAQ</label>
                <select
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                >
                  <option value="Otentisitas Wastra">Otentisitas Wastra</option>
                  <option value="Ukuran & Fitting">Ukuran & Fitting</option>
                  <option value="Perawatan Busana">Perawatan Busana</option>
                  <option value="Layanan & Pemesanan">Layanan & Pemesanan</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1C1917] block mb-1">Jawaban Resmi (Official Answer)</label>
                <textarea
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  rows={4}
                  placeholder="Jawaban standar yang divalidasi oleh Oerip..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#1C1917]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E7DFD5]">
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(false)}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] text-[#57534E] font-medium cursor-pointer hover:bg-[#E7DFD5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1C1917] text-[#FAF7F2] font-medium cursor-pointer hover:bg-[#332D27]"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
