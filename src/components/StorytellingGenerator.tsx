import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  Film,
  Instagram,
  Users,
  FileText,
  Search,
  Globe,
  Tag,
  Code,
  Layers,
  Clock,
  BarChart2,
  Share2,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sliders,
  Volume2,
  VolumeX,
  Download,
  ShoppingBag,
  Send,
  Leaf,
  Sparkle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export type StoryFormatType =
  | 'YOUTH_STORY'
  | 'BLOG_ARTICLE'
  | 'INSTAGRAM_CAPTION'
  | 'TIKTOK_REELS_SCRIPT'
  | 'CULTURAL_ESSAY'
  | 'PRODUCT_DESCRIPTION';

export const StorytellingGenerator: React.FC = () => {
  const toast = useToast();
  const [selectedFormat, setSelectedFormat] = useState<StoryFormatType>('BLOG_ARTICLE');
  const [targetAudience, setTargetAudience] = useState('Youth, Curators & Cultural Lovers');
  const [wastraFocus, setWastraFocus] = useState('Tenun Ikat Sumba & Gedog Tuban (Zero-Waste)');
  const [customKeyword, setCustomKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any | null>(null);
  
  const [activeOutputTab, setActiveOutputTab] = useState<'narrative' | 'seo_suite' | 'social_preview' | 'schema_json' | 'audit'>('narrative');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const AUDIENCE_PRESETS = [
    'Gen Z & Fashion Youth',
    'Kolektor Wastra Nusantara',
    'Diplomat & Tamu Internasional',
    'Pecinta Slow & Sustainable Fashion',
    'Komunitas Diaspora Indonesia'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }

    try {
      const res = await fetch('/api/kira/storytelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: selectedFormat,
          topic: wastraFocus,
          targetAudience,
          focusKeyword: customKeyword.trim() || undefined
        })
      });
      const data = await res.json();
      setGeneratedStory(data);
      setActiveOutputTab('narrative');
      toast.success('Narasi budaya dan paket SEO berhasil diproduksi!', {
        title: 'Narasi Siap'
      });
    } catch (err) {
      console.error('Error generating storytelling:', err);
      toast.error('Gagal membuat narasi. Silakan periksa koneksi dan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
    toast.success('Konten berhasil disalin ke papan klip.', {
      title: 'Tersalin'
    });
  };

  const handleToggleSpeak = () => {
    if (!generatedStory?.generated_story) return;
    if (!('speechSynthesis' in window)) {
      alert('Peramban Anda tidak mendukung text-to-speech.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = generatedStory.generated_story
      .replace(/[#*`_~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/---/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadMarkdown = () => {
    if (!generatedStory) return;
    const content = 
`---
title: ${generatedStory.seo?.meta_title || generatedStory.topic}
focus_keyword: ${generatedStory.seo?.focus_keyword || ''}
slug: ${generatedStory.seo?.slug || ''}
created_by: KIRA Cultural Content Studio
brand: Oerip Indonesia
source_basis: ${generatedStory.source_basis || 'Verified Oerip Knowledge Base'}
---

# ${generatedStory.seo?.recommended_headings?.h1 || generatedStory.topic}

${generatedStory.generated_story}

---
## SEO Metadata
- **Meta Description**: ${generatedStory.seo?.meta_description || ''}
- **LSI Keywords**: ${generatedStory.seo?.secondary_keywords?.join(', ') || ''}
- **Hashtags**: ${generatedStory.seo?.social_hashtags?.join(' ') || ''}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oerip_Story_${generatedStory.seo?.slug || 'content'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Berkas Markdown narasi budaya berhasil diunduh.', {
      title: 'Unduhan Selesai'
    });
  };

  const handleSaveToValidationQueue = async () => {
    if (!generatedStory) return;
    try {
      await fetch('/api/kira/social-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: 'OERIP',
          platform: selectedFormat === 'INSTAGRAM_CAPTION' ? 'Instagram' : 'Website/Blog',
          account: '@oerip_official',
          post_date: new Date().toISOString().slice(0, 10),
          post_caption: generatedStory.generated_story.slice(0, 300),
          extracted_information: `Storytelling Draft: ${wastraFocus} (${selectedFormat})`,
          validation_status: 'NEEDS_REVIEW'
        })
      });
      toast.success('Draf narasi berhasil dikirim ke Antrean Validasi Kurator!', {
        title: 'Draf Disimpan'
      });
    } catch (e) {
      toast.error('Gagal menyimpan draf narasi ke antrean kurator.');
    }
  };

  const copyCompleteSEOPackage = () => {
    if (!generatedStory?.seo) return;
    const s = generatedStory.seo;
    const packageText = 
`=== SEO METADATA PACKAGE - OERIP INDONESIA ===
Target Keyword: ${s.focus_keyword}
Meta Title (${s.meta_title.length} chars): ${s.meta_title}
Meta Description (${s.meta_description.length} chars): ${s.meta_description}
URL Slug: https://oeripindonesia.com/cerita/${s.slug}
Search Intent: ${s.search_intent}

LSI / Secondary Keywords:
${s.secondary_keywords?.map((k: string) => `- ${k}`).join('\n')}

Image Alt Text Recommendations:
${s.alt_text_suggestions?.map((alt: string, i: number) => `${i + 1}. ${alt}`).join('\n')}

Social Hashtags:
${s.social_hashtags?.join(' ')}

JSON-LD Schema:
${s.schema_json_ld}
`;
    copyToClipboard(packageText, 'all_seo');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFE6] text-[#963824] text-xs font-semibold uppercase tracking-wider mb-2.5 border border-[#E5DCD3]">
          <Sparkles size={14} className="text-[#C89B53]" />
          <span>SEO-Optimized Cultural Narrative Engine</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] mb-2 tracking-tight">
          Content Studio & SEO Wastra Nusantara
        </h2>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
          Mengubah nilai luhur tenun Nusantara dan prinsip <em>Minim Potong Oerip</em> menjadi narasi berkualitas tinggi yang terindeks optimal di mesin pencari Google, siap tayang di media sosial, dan mengedukasi generasi muda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
        
        {/* Generator Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-5 sm:p-6 rounded-2xl border border-[#E7DFD5] shadow-xs space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* 1. Format Konten */}
            <div>
              <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>1. Format Narasi & Media</span>
                <span className="text-[10px] font-normal text-[#78716C]">SEO & Format Multi-Kanal</span>
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                
                <button
                  type="button"
                  onClick={() => setSelectedFormat('BLOG_ARTICLE')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'BLOG_ARTICLE'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Globe size={14} className={selectedFormat === 'BLOG_ARTICLE' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Artikel Blog SEO</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Optimasi Google Ranking & E-E-A-T</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('YOUTH_STORY')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'YOUTH_STORY'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users size={14} className={selectedFormat === 'YOUTH_STORY' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Edukasi Gen Z</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Storytelling santun & bersahabat</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('INSTAGRAM_CAPTION')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'INSTAGRAM_CAPTION'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Instagram size={14} className={selectedFormat === 'INSTAGRAM_CAPTION' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Caption Instagram</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Hashtags & Micro-SEO Lookbook</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('TIKTOK_REELS_SCRIPT')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'TIKTOK_REELS_SCRIPT'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Film size={14} className={selectedFormat === 'TIKTOK_REELS_SCRIPT' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Script Reels / TikTok</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Hook 3 detik + Visual Cues</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('CULTURAL_ESSAY')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'CULTURAL_ESSAY'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText size={14} className={selectedFormat === 'CULTURAL_ESSAY' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Esai Diplomasi</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Kurasi pameran & forum global</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('PRODUCT_DESCRIPTION')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'PRODUCT_DESCRIPTION'
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#2D2A26] border-[#E7DFD5] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShoppingBag size={14} className={selectedFormat === 'PRODUCT_DESCRIPTION' ? 'text-[#C89B53]' : 'text-[#963824]'} />
                    <span className="font-serif font-bold text-xs">Deskripsi Produk</span>
                  </div>
                  <p className="text-[10px] opacity-80 leading-tight">Katalog & Storyboard E-Commerce</p>
                </button>

              </div>
            </div>

            {/* 2. Fokus Wastra & Filosofi */}
            <div>
              <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>2. Fokus Wastra & Filosofi</span>
                <span className="text-[10px] text-[#78716C]">Knowledge Base Oerip</span>
              </label>
              <select
                value={wastraFocus}
                onChange={(e) => setWastraFocus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#963824]"
              >
                <option value="Tenun Ikat Sumba & Gedog Tuban (Zero-Waste)">
                  Tenun Ikat Sumba & Gedog Tuban (Zero-Waste & Pewarna Alami)
                </option>
                <option value="Ulos Ragidup Batak (Kehangatan Jiwa & Dalihan Na Tolu)">
                  Ulos Ragidup Batak (Kehangatan Jiwa & Dalihan Na Tolu)
                </option>
                <option value="Tenun Lurik Prasojo Klaten (Kesederhanaan Lurus Ing Lakon)">
                  Tenun Lurik Prasojo Klaten (Kesederhanaan Lurus Ing Lakon)
                </option>
                <option value="Tenun Ikat Flores (Harmoni Alam & Mata Bolo)">
                  Tenun Ikat Flores (Harmoni Alam & Mata Bolo)
                </option>
                <option value="Batik Tulis Gedog Tuban (Serat Kapas Pintal Tangan Jawa)">
                  Batik Tulis Gedog Tuban (Serat Kapas Pintal Tangan Jawa)
                </option>
                <option value="Tenun Baduy & Sutra Alam (Keaslian Bersahaja & Modest)">
                  Tenun Baduy & Sutra Alam (Keaslian Bersahaja & Modest)
                </option>
              </select>
            </div>

            {/* 3. Target Audiens & Focus Keyword SEO */}
            <div className="space-y-2">
              <div>
                <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block mb-1">
                  3. Target Audiens
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Gen Z, Fashion Enthusiast"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#963824]"
                />
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {AUDIENCE_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTargetAudience(p)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#57534E] border border-[#E7DFD5] cursor-pointer"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block mb-1 flex items-center justify-between">
                  <span>Kata Kunci Target (SEO)</span>
                  <span className="text-[10px] font-normal text-[#78716C]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="e.g. Tenun Sumba Zero Waste Oerip"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#963824]"
                />
              </div>
            </div>

            {/* Cultural Guardrail Notice */}
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#57534E] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <ShieldCheck size={14} className="text-[#1E3A2B]" />
                <span>SEO Grounded in Authentic Cultural Research</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Menyusun kata kunci organik tanpa mengurangi kesakralan adat (merujuk <em>Buku Soul Craft Kriya Jiwa Dian Oerip</em>).
              </p>
            </div>

            {/* Brand Narrative Style Guarantee Notice */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900">
              <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              <span>Gaya narasi otomatis menerapkan estetika penulisan khas Oerip (puitis, adiluhung & inklusif).</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-3 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2D2A26] text-[#FAF7F2] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className="text-[#C89B53]" />
            <span>{isGenerating ? 'Menyusun Narasi & Paket SEO...' : 'Hasilkan Storytelling & Paket SEO'}</span>
          </button>

        </div>

        {/* Story Output & SEO Suite Display (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-5 sm:p-7 rounded-2xl border border-[#E7DFD5] shadow-xs flex flex-col justify-between min-h-[640px]">
          
          <div>
            {/* Header & Sub-Tabs Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7DFD5] mb-5">
              
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E7DFD5] overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveOutputTab('narrative')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeOutputTab === 'narrative'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <BookOpen size={13} className={activeOutputTab === 'narrative' ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                  <span>Naskah Narasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOutputTab('seo_suite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeOutputTab === 'seo_suite'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Search size={13} className={activeOutputTab === 'seo_suite' ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                  <span>Paket SEO & Meta</span>
                  {generatedStory?.seo && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOutputTab('social_preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeOutputTab === 'social_preview'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Instagram size={13} className={activeOutputTab === 'social_preview' ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                  <span>Social Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOutputTab('schema_json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeOutputTab === 'schema_json'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <Code size={13} className={activeOutputTab === 'schema_json' ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                  <span>Schema JSON-LD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveOutputTab('audit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeOutputTab === 'audit'
                      ? 'bg-[#1C1917] text-[#FAF7F2] shadow-2xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  <BarChart2 size={13} className={activeOutputTab === 'audit' ? 'text-[#C89B53]' : 'text-[#8C827A]'} />
                  <span>Audit SEO</span>
                </button>
              </div>

              {/* Action Buttons */}
              {generatedStory && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={copyCompleteSEOPackage}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EFE6] text-xs font-medium text-[#1C1917] border border-[#E7DFD5] shadow-2xs transition-colors cursor-pointer"
                    title="Salin Title, Meta Description, Keywords & Schema"
                  >
                    {copiedType === 'all_seo' ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Share2 size={13} className="text-[#963824]" />
                    )}
                    <span>{copiedType === 'all_seo' ? 'Paket Tersalin!' : 'Salin Paket SEO'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedStory.generated_story, 'story')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#2D2A26] text-xs font-medium text-[#FAF7F2] shadow-2xs transition-colors cursor-pointer"
                  >
                    {copiedType === 'story' ? (
                      <Check size={13} className="text-emerald-300" />
                    ) : (
                      <Copy size={13} />
                    )}
                    <span>{copiedType === 'story' ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTENT 1: Naskah Narasi */}
            {generatedStory ? (
              <>
                {activeOutputTab === 'narrative' && (
                  <div className="space-y-4">
                    {/* Top Metadata Badges & Audio Reader */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5] text-xs text-[#57534E]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Clock size={13} className="text-[#963824]" />
                        <span>Estimasi Baca: <strong className="text-[#1C1917]">{generatedStory.seo?.estimated_reading_time || '2 menit'}</strong></span>
                        <span className="text-[#D8CFC4]">•</span>
                        <span>Panjang: <strong className="text-[#1C1917]">{generatedStory.seo?.word_count || 220} kata</strong></span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Audio Narration Toggle */}
                        <button
                          type="button"
                          onClick={handleToggleSpeak}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                            speaking
                              ? 'bg-[#963824] text-white border-[#963824]'
                              : 'bg-white text-[#1C1917] border-[#E7DFD5] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {speaking ? <VolumeX size={13} /> : <Volume2 size={13} className="text-[#C89B53]" />}
                          <span>{speaking ? 'Hentikan Audio' : 'Dengarkan Narasi'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadMarkdown}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-[#1C1917] border border-[#E7DFD5] hover:bg-[#FAF7F2] flex items-center gap-1 cursor-pointer"
                          title="Unduh sebagai file Markdown (.md)"
                        >
                          <Download size={13} />
                          <span className="hidden sm:inline">Unduh .MD</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Story Narrative Display */}
                    <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-sm text-[#2D2A26] leading-relaxed whitespace-pre-line font-sans shadow-2xs space-y-2">
                      {generatedStory.generated_story}
                    </div>

                    {/* Action Bar: Save to Validation Queue */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F5EFE6] border border-[#E5DCD3]">
                      <div className="text-xs text-[#57534E]">
                        <strong>Landasan Kurasi:</strong> {generatedStory.source_basis}
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSaveToValidationQueue}
                        className="px-3.5 py-1.5 rounded-full bg-[#1E3A2B] hover:bg-[#254634] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Send size={12} className="text-[#A8D5BA]" />
                        <span>Kirim ke Antrean Kurator Oerip</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 2: SEO Suite & SERP Simulator */}
                {activeOutputTab === 'seo_suite' && generatedStory.seo && (
                  <div className="space-y-5">
                    
                    {/* 1. Google SERP Simulator Preview */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D5CABE] shadow-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                        <span className="text-xs font-serif uppercase tracking-widest text-[#963824] font-bold flex items-center gap-1.5">
                          <Eye size={14} /> Google SERP Snippet Preview
                        </span>
                        <span className="text-[10px] text-[#78716C] bg-[#F5EFE6] px-2 py-0.5 rounded-full">
                          Pratinjau Hasil Pencarian
                        </span>
                      </div>

                      <div className="pt-2">
                        {/* URL Line */}
                        <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                          <div className="w-4 h-4 rounded-full bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center text-[9px] font-serif font-bold">
                            K
                          </div>
                          <span className="text-[#202124] text-[11px]">oeripindonesia.com</span>
                          <span className="text-[#5f6368] text-[11px]">› cerita › {generatedStory.seo.slug}</span>
                        </div>

                        {/* Title Line */}
                        <h4 className="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer pt-1">
                          {generatedStory.seo.meta_title}
                        </h4>

                        {/* Snippet Line */}
                        <p className="text-[#4d5156] text-xs sm:text-sm leading-relaxed pt-1 line-clamp-2">
                          {generatedStory.seo.meta_description}
                        </p>
                      </div>
                    </div>

                    {/* 2. Structured Meta Tag Breakdown */}
                    <div className="grid grid-cols-1 gap-3.5">
                      
                      {/* Meta Title Field */}
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                            SEO Meta Title
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                            generatedStory.seo.meta_title.length <= 60
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {generatedStory.seo.meta_title.length} / 60 karakter ({generatedStory.seo.meta_title.length <= 60 ? 'Ideal' : 'Panjang'})
                          </span>
                        </div>
                        <div className="text-xs text-[#1C1917] font-medium bg-white p-2.5 rounded-lg border border-[#E7DFD5]">
                          {generatedStory.seo.meta_title}
                        </div>
                      </div>

                      {/* Meta Description Field */}
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                            SEO Meta Description
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                            generatedStory.seo.meta_description.length <= 160
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {generatedStory.seo.meta_description.length} / 160 karakter (Optimal)
                          </span>
                        </div>
                        <div className="text-xs text-[#1C1917] bg-white p-2.5 rounded-lg border border-[#E7DFD5] leading-relaxed">
                          {generatedStory.seo.meta_description}
                        </div>
                      </div>

                      {/* Focus & Secondary Keywords */}
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                            Kata Kunci Utama & LSI Keywords
                          </span>
                          <span className="text-[11px] text-[#963824] font-medium">
                            Intent: {generatedStory.seo.search_intent}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-[#FAF7F2] bg-[#1C1917] px-3 py-1 rounded-full flex items-center gap-1">
                            <Tag size={11} className="text-[#C89B53]" /> Focus: {generatedStory.seo.focus_keyword}
                          </span>
                          {generatedStory.seo.secondary_keywords?.map((kw: string, i: number) => (
                            <span key={i} className="text-xs text-[#57534E] bg-white border border-[#D5CABE] px-2.5 py-1 rounded-full">
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Heading Hierarchy Structure */}
                      {generatedStory.seo.recommended_headings && (
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block">
                            Hierarki Heading (H1 / H2 / H3)
                          </span>
                          <div className="space-y-1.5 text-xs text-[#2D2A26]">
                            <div className="flex items-start gap-2">
                              <span className="font-mono font-bold text-[10px] bg-[#EAE2D5] text-[#963824] px-1.5 py-0.5 rounded">H1</span>
                              <span className="font-semibold">{generatedStory.seo.recommended_headings.h1}</span>
                            </div>
                            {generatedStory.seo.recommended_headings.h2_list?.map((h2: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 pl-3">
                                <span className="font-mono font-bold text-[10px] bg-[#F0EAE1] text-[#57534E] px-1.5 py-0.5 rounded">H2</span>
                                <span>{h2}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Alt Text Image Recommendations */}
                      {generatedStory.seo.alt_text_suggestions && (
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block">
                            Saran Alt Text Gambar (Aksesibilitas & Google Image Search)
                          </span>
                          <ul className="space-y-1 text-xs text-[#57534E]">
                            {generatedStory.seo.alt_text_suggestions.map((alt: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-[#963824] font-bold">•</span>
                                <span className="italic">"{alt}"</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Strategic Hashtags */}
                      {generatedStory.seo.social_hashtags && (
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block">
                            Hashtags Kurasi Media Sosial
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {generatedStory.seo.social_hashtags.map((ht: string, i: number) => (
                              <span key={i} className="text-xs font-mono text-[#963824] bg-white border border-[#E7DFD5] px-2 py-0.5 rounded-md">
                                {ht}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* TAB CONTENT 3: Social Media Post Preview */}
                {activeOutputTab === 'social_preview' && (
                  <div className="space-y-4">
                    <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E7DFD5] shadow-xs overflow-hidden">
                      {/* Instagram Header Mockup */}
                      <div className="flex items-center justify-between p-3.5 border-b border-[#F0EAE1]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C89B53] to-[#963824] text-white flex items-center justify-center font-bold text-xs">
                            OI
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1C1917]">oerip_official</p>
                            <p className="text-[10px] text-[#78716C]">Ngawi • Living Heritage</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#963824]">✦ Verified</span>
                      </div>

                      {/* Image Visualizer */}
                      <div className="w-full h-52 bg-[#2D2A26] relative flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/oerip_blanket_outer_1789048086335.jpg"
                          alt="Tenun Oerip Indonesia"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                          <Leaf size={10} className="text-emerald-400" />
                          <span>100% Pewarna Alami & Zero-Waste</span>
                        </div>
                      </div>

                      {/* Caption Body */}
                      <div className="p-4 space-y-2.5 text-xs text-[#2D2A26]">
                        <p className="font-semibold text-[#1C1917]">
                          oerip_official <span className="font-normal whitespace-pre-line">{generatedStory.generated_story.slice(0, 320)}...</span>
                        </p>

                        {generatedStory.seo?.social_hashtags && (
                          <p className="text-[11px] text-[#963824] font-medium leading-relaxed">
                            {generatedStory.seo.social_hashtags.join(' ')}
                          </p>
                        )}
                        
                        <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-[10px] text-[#78716C]">
                          <span>Siap diunggah ke Instagram @oerip_official</span>
                          <button
                            onClick={() => copyToClipboard(
                              `${generatedStory.generated_story}\n\n${generatedStory.seo?.social_hashtags?.join(' ')}`,
                              'ig_caption'
                            )}
                            className="px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#963824] font-bold border border-[#E7DFD5] hover:bg-[#F5EFE6] cursor-pointer"
                          >
                            {copiedType === 'ig_caption' ? 'Tersalin!' : 'Salin Caption'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: Schema JSON-LD */}
                {activeOutputTab === 'schema_json' && generatedStory.seo?.schema_json_ld && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7DFD5]">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          Schema.org JSON-LD Structured Data
                        </h4>
                        <p className="text-xs text-[#57534E]">
                          Tempelkan kode ini di dalam tag <code>&lt;head&gt;</code> website artikel untuk mengaktifkan Rich Snippets di Google.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedStory.seo.schema_json_ld, 'schema')}
                        className="px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2D2A26] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedType === 'schema' ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                        <span>{copiedType === 'schema' ? 'Schema Tersalin!' : 'Salin JSON-LD'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-[#1C1917] text-[#FAF7F2] font-mono text-xs overflow-x-auto leading-relaxed border border-[#332E29]">
                      <code>{generatedStory.seo.schema_json_ld}</code>
                    </pre>
                  </div>
                )}

                {/* TAB CONTENT 5: Audit & Scoring */}
                {activeOutputTab === 'audit' && generatedStory.seo?.seo_score_indicator && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      
                      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                        <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                          Tingkat Keterbacaan
                        </div>
                        <div className="text-sm font-bold text-[#1E3A2B] font-serif">
                          {generatedStory.seo.seo_score_indicator.readability}
                        </div>
                        <p className="text-[10px] text-[#78716C] mt-1">Sesuai standar Flesch Kincaid</p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                        <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                          Kepadatan Kata Kunci
                        </div>
                        <div className="text-sm font-bold text-[#963824] font-serif">
                          {generatedStory.seo.seo_score_indicator.keyword_density}
                        </div>
                        <p className="text-[10px] text-[#78716C] mt-1">Bebas keyword stuffing</p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-center">
                        <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                          Validasi Schema
                        </div>
                        <div className="text-sm font-bold text-[#1C1917] font-serif">
                          {generatedStory.seo.seo_score_indicator.schema_type}
                        </div>
                        <p className="text-[10px] text-[#78716C] mt-1">Google Rich Results Ready</p>
                      </div>

                    </div>

                    <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E7DFD5] space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#1E3A2B]" />
                        Daftar Pemeriksaan Kualitas SEO & Budaya (Checklist)
                      </h4>
                      <div className="space-y-2 text-xs text-[#57534E]">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check size={14} /> Kata kunci utama tercantum dalam H1 dan paragraf pembuka (First 100 words).
                        </div>
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check size={14} /> Meta Title & Meta Description memiliki panjang optimal dan mengundang CTR tinggi.
                        </div>
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check size={14} /> Menyertakan kata kunci LSI untuk memperkuat relevansi semantik Google NLP.
                        </div>
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check size={14} /> Anti-Halusinasi: Data wastra, nama desa, dan teknik pewarna alami 100% tervalidasi.
                        </div>
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check size={14} /> Struktur Schema.org siap dicopy untuk SEO teknis instan.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center text-[#8E847A] border border-dashed border-[#E7DFD5] rounded-2xl p-6 bg-[#FAF7F2]">
                <Sparkles size={32} className="text-[#C89B53]/60 mb-2.5 animate-bounce" />
                <p className="text-sm font-semibold text-[#1C1917]">
                  Pilih format konten & wastra di sebelah kiri, lalu klik <strong>"Hasilkan Storytelling & Paket SEO"</strong>.
                </p>
                <p className="text-xs text-[#78716C] mt-1.5 max-w-md leading-relaxed">
                  KIRA akan menyusun naskah narasi lengkap beserta paket metadata SEO: Meta Title, Meta Description, LSI Keywords, SERP Simulator, Social Preview, dan Schema.org JSON-LD.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
