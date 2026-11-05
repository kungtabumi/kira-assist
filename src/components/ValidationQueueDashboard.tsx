import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Sparkles,
  FileText,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Info,
  Check,
  BookOpen,
  Tag,
  Share2,
  ExternalLink,
  ChevronRight,
  X,
  History,
  Layers
} from 'lucide-react';
import { ValidationStatus } from '../types';

interface QueueItem {
  id: string;
  business_id: string;
  content_type: string;
  title: string;
  source: string;
  status: ValidationStatus;
  validator: string;
  date: string;
  notes: string;
}

export const ValidationQueueDashboard: React.FC = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  
  // Modal state for detailed audit
  const [activeModalItem, setActiveModalItem] = useState<QueueItem | null>(null);
  const [customValidatorName, setCustomValidatorName] = useState<string>('Dian Errakumalasari (Founder & Cultural Director)');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [checklist, setChecklist] = useState({
    motifVerified: true,
    weaverCommunityVerified: true,
    naturalDyeVerified: true,
    zeroWasteVerified: true
  });

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kira/validation-queue');
      const data = await res.json();
      if (Array.isArray(data)) {
        setQueue(data);
      }
    } catch (err) {
      console.error('Error fetching validation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: ValidationStatus,
    validatorName?: string,
    notesText?: string
  ) => {
    try {
      const defaultNotes = `Status diverifikasi sebagai ${newStatus} pada ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`;

      const res = await fetch(`/api/kira/validation-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          validator: validatorName || 'Dian Errakumalasari (Founder & Cultural Director)',
          notes: notesText && notesText.trim() ? notesText : defaultNotes
        })
      });

      if (res.ok) {
        const statusLabel =
          newStatus === 'VALIDATED'
            ? 'Tervalidasi & Dipublikasikan ke AI KIRA'
            : newStatus === 'REJECTED'
            ? 'Ditolak dari Pustaka AI'
            : 'Disimpan sebagai Draf';
            
        setActionSuccessMsg(`Item [${id}] berhasil diperbarui: ${statusLabel}`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
        
        // Close modal if active
        if (activeModalItem?.id === id) {
          setActiveModalItem(null);
        }
        
        fetchQueue();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleOpenAuditModal = (item: QueueItem) => {
    setActiveModalItem(item);
    setCustomNotes(item.notes || '');
    setChecklist({
      motifVerified: true,
      weaverCommunityVerified: true,
      naturalDyeVerified: true,
      zeroWasteVerified: true
    });
  };

  // Metrics Calculation
  const stats = useMemo(() => {
    const total = queue.length;
    const pending = queue.filter(q => q.status === 'NEEDS_REVIEW').length;
    const validated = queue.filter(q => q.status === 'VALIDATED').length;
    const draftOrRejected = queue.filter(q => q.status === 'DRAFT' || q.status === 'REJECTED').length;
    return { total, pending, validated, draftOrRejected };
  }, [queue]);

  // Filtered list
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      // Status Filter
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) {
        return false;
      }
      // Content Type Filter
      if (selectedTypeFilter !== 'ALL' && item.content_type !== selectedTypeFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        const matchesNotes = (item.notes || '').toLowerCase().includes(q);
        const matchesValidator = (item.validator || '').toLowerCase().includes(q);
        return matchesTitle || matchesId || matchesSource || matchesNotes || matchesValidator;
      }
      return true;
    });
  }, [queue, selectedStatusFilter, selectedTypeFilter, searchQuery]);

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'WASTRA':
        return {
          label: 'Wastra & Motif',
          icon: <Sparkles size={11} className="text-[#967156]" />,
          style: 'bg-[#F5F0E8] text-[#967156] border-[#EAE5DB]'
        };
      case 'PRODUCT':
        return {
          label: 'Koleksi Busana',
          icon: <Tag size={11} className="text-[#2D3E50]" />,
          style: 'bg-stone-100 text-[#2D3E50] border-stone-200'
        };
      case 'SOCIAL_MEDIA':
        return {
          label: 'Media Sosial IG',
          icon: <Share2 size={11} className="text-amber-800" />,
          style: 'bg-amber-50 text-amber-900 border-amber-200'
        };
      case 'CULTURAL_STORY':
        return {
          label: 'Cerita & Filosofi',
          icon: <BookOpen size={11} className="text-emerald-800" />,
          style: 'bg-emerald-50 text-emerald-900 border-emerald-200'
        };
      default:
        return {
          label: type,
          icon: <FileText size={11} className="text-[#685E55]" />,
          style: 'bg-stone-100 text-[#685E55] border-stone-200'
        };
    }
  };

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'VALIDATED':
        return {
          label: 'Tervalidasi Resmi',
          icon: <CheckCircle2 size={13} className="text-emerald-600" />,
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 'NEEDS_REVIEW':
        return {
          label: 'Perlu Ditinjau',
          icon: <Clock size={13} className="text-amber-600 animate-pulse" />,
          style: 'bg-amber-50 text-amber-900 border-amber-200'
        };
      case 'REJECTED':
        return {
          label: 'Ditolak / Nonaktif',
          icon: <XCircle size={13} className="text-red-600" />,
          style: 'bg-red-50 text-red-800 border-red-200'
        };
      case 'DRAFT':
        return {
          label: 'Draf Konsep',
          icon: <FileText size={13} className="text-stone-600" />,
          style: 'bg-stone-100 text-stone-700 border-stone-200'
        };
      default:
        return {
          label: status,
          icon: <AlertCircle size={13} className="text-stone-600" />,
          style: 'bg-stone-100 text-stone-700 border-stone-200'
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EAE5DB] mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-xs font-semibold tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <UserCheck size={14} className="text-emerald-700" />
            <span>Human-in-the-Loop Kurasi Oerip</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3E50] tracking-tight">
            Antrean Validasi Pengetahuan & Konten
          </h1>
          
          <p className="text-sm text-[#685E55] max-w-3xl leading-relaxed">
            Pusat otentikasi data dan fakta budaya sebelum disematkan ke basis pengetahuan AI KIRA.
            Dipimpin langsung oleh <strong>Dian Oerip (Founder & Cultural Director)</strong> dan <strong>Bagas Qolbu Cetta (CEO)</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchQueue}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F9F6F0] text-[#2D3E50] border border-[#EAE5DB] text-xs font-semibold transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data Antrean"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-[#967156]' : 'text-[#685E55]'} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-slide-in">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={15} className="text-emerald-700" />
            </div>
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8E847A] font-medium mb-2">
            <span>Total Item Terdaftar</span>
            <Layers size={16} className="text-[#967156]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3E50]">
            {stats.total}
          </div>
          <div className="text-[11px] text-[#685E55] mt-1">Wastra, Produk & Konten IG</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-2">
            <span>Menunggu Kurasi</span>
            <Clock size={16} className="text-amber-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            {stats.pending}
          </div>
          <div className="text-[11px] text-amber-800 mt-1">Butuh otorisasi kurator manusia</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold mb-2">
            <span>Tervalidasi Resmi</span>
            <ShieldCheck size={16} className="text-emerald-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">
            {stats.validated}
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">Aktif di mesin rekomendasi AI KIRA</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DB] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8E847A] font-medium mb-2">
            <span>Integritas Budaya</span>
            <Sparkles size={16} className="text-[#967156]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3E50]">
            100%
          </div>
          <div className="text-[11px] text-[#685E55] mt-1">Nol toleransi halusinasi adat</div>
        </div>
      </div>

      {/* Cultural Governance / Guardrail Notice Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F9F6F0] border border-[#EAE5DB] mb-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#EAE5DB] flex items-center justify-center shrink-0 text-[#967156] shadow-2xs">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-[#2D3E50] text-sm sm:text-base flex items-center gap-2">
                <span>Protokol Perlindungan Integritas Budaya KIRA (Anti-Halusinasi)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#685E55] leading-relaxed">
                Konten berstatus <span className="font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-300/60">NEEDS_REVIEW</span> atau <span className="font-semibold text-stone-800 bg-stone-200/70 px-2 py-0.5 rounded-md border border-stone-300">DRAFT</span> <strong>DIBLOKIR</strong> dari keluaran rekomendasi publik. Hanya entri berstatus <span className="font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300/60">VALIDATED</span> yang berhak dipakai oleh KIRA untuk memberikan panduan wastra kepada pengguna.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#EAE5DB] shadow-xs mb-6 space-y-4">
        
        {/* Row 1: Search & Type dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E847A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul konten, ID entri, sumber, atau catatan kurasi..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] text-xs text-[#2D2A26] placeholder-[#8E847A] focus:outline-none focus:border-[#967156] focus:ring-1 focus:ring-[#967156] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E847A] hover:text-[#2D2A26]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#8E847A] shrink-0 hidden sm:block" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] text-xs font-medium text-[#2D3E50] focus:outline-none focus:border-[#967156] cursor-pointer"
            >
              <option value="ALL">Semua Tipe Konten</option>
              <option value="WASTRA">Wastra & Motif</option>
              <option value="PRODUCT">Koleksi Busana</option>
              <option value="SOCIAL_MEDIA">Media Sosial IG</option>
              <option value="CULTURAL_STORY">Cerita Budaya</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status Filter Tabs (Clean horizontal scroll, no awkward multi-line break) */}
        <div className="flex items-center justify-between border-t border-[#F5F0E8] pt-3 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-[#8E847A] mr-1 hidden md:inline">Status:</span>
            {[
              { key: 'ALL', label: 'Semua Status', count: stats.total },
              { key: 'NEEDS_REVIEW', label: 'Perlu Ditinjau', count: stats.pending, badgeColor: 'bg-amber-100 text-amber-900' },
              { key: 'VALIDATED', label: 'Tervalidasi Resmi', count: stats.validated, badgeColor: 'bg-emerald-100 text-emerald-900' },
              { key: 'DRAFT', label: 'Draf', count: queue.filter(q => q.status === 'DRAFT').length },
              { key: 'REJECTED', label: 'Ditolak', count: queue.filter(q => q.status === 'REJECTED').length }
            ].map((tab) => {
              const isActive = selectedStatusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatusFilter(tab.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2D3E50] text-[#FDFBF7] shadow-xs'
                      : 'bg-[#F9F6F0] text-[#2D2A26] hover:bg-[#F5F0E8] border border-[#EAE5DB]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeColor || 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#8E847A] shrink-0 font-medium pl-2">
            Menampilkan <strong>{filteredQueue.length}</strong> dari {queue.length} item
          </div>
        </div>

      </div>

      {/* Main Validation Table Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#EAE5DB] overflow-hidden shadow-xs">
        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F9F6F0] border border-[#EAE5DB] flex items-center justify-center mx-auto mb-3 text-[#8E847A]">
              <Search size={20} />
            </div>
            <h4 className="font-serif font-bold text-[#2D3E50] text-base mb-1">
              Tidak Ada Item yang Sesuai Filter
            </h4>
            <p className="text-xs text-[#685E55] max-w-sm mx-auto mb-4">
              Coba sesuaikan kata kunci pencarian atau ubah filter status di atas untuk melihat data antrean lainnya.
            </p>
            <button
              onClick={() => {
                setSelectedStatusFilter('ALL');
                setSelectedTypeFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#2D3E50] text-white text-xs font-semibold hover:bg-[#1E2B37] transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F6F0] border-b border-[#EAE5DB] text-[#8E847A] uppercase font-semibold tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-5">ID & Tipe Konten</th>
                  <th className="py-4 px-5">Judul Konten & Catatan</th>
                  <th className="py-4 px-5">Sumber & Tanggal</th>
                  <th className="py-4 px-5">Status Validasi</th>
                  <th className="py-4 px-5">Validator Terakhir</th>
                  <th className="py-4 px-5 text-right">Otorisasi Kurator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DB]">
                {filteredQueue.map((item) => {
                  const typeBadge = getContentTypeBadge(item.content_type);
                  const statusBadge = getStatusBadge(item.status);

                  return (
                    <tr key={item.id} className="hover:bg-[#FDFBF7] transition-colors group">
                      
                      {/* ID & Content Type */}
                      <td className="py-4 px-5 whitespace-nowrap align-top">
                        <span className="font-mono font-bold text-[#2D3E50] block mb-1 text-xs">
                          {item.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${typeBadge.style}`}
                        >
                          {typeBadge.icon}
                          <span>{typeBadge.label}</span>
                        </span>
                      </td>

                      {/* Title & Notes */}
                      <td className="py-4 px-5 max-w-sm align-top">
                        <div className="font-serif font-bold text-[#2D3E50] text-sm mb-1 leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#685E55] leading-relaxed bg-[#FDFBF7] p-2 rounded-lg border border-[#EAE5DB]/60">
                          {item.notes}
                        </div>
                      </td>

                      {/* Source & Date */}
                      <td className="py-4 px-5 text-[11px] text-[#685E55] whitespace-nowrap align-top">
                        <div className="font-medium text-[#2D3E50] flex items-center gap-1 mb-0.5">
                          <span>{item.source}</span>
                        </div>
                        <div className="text-[#8E847A] flex items-center gap-1">
                          <History size={11} />
                          <span>{item.date}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border ${statusBadge.style}`}
                        >
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </span>
                      </td>

                      {/* Validator */}
                      <td className="py-4 px-5 text-[11px] text-[#685E55] align-top">
                        <div className="font-medium text-[#2D3E50]">{item.validator}</div>
                        <div className="text-[10px] text-[#8E847A]">Otoritas Kurasi Resmi</div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 whitespace-nowrap text-right align-top">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Audit / Review Modal Trigger */}
                          <button
                            onClick={() => handleOpenAuditModal(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#F9F6F0] hover:bg-[#F5F0E8] text-[#2D3E50] text-xs font-semibold border border-[#EAE5DB] transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Buka Lembar Kurasi Lengkap"
                          >
                            <Eye size={13} className="text-[#967156]" />
                            <span>Audit</span>
                          </button>

                          {/* Quick Validate Button */}
                          {item.status !== 'VALIDATED' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'VALIDATED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                              title="Setujui & Terbitkan ke Knowledge Base AI"
                            >
                              <CheckCircle2 size={13} />
                              <span>Validasi</span>
                            </button>
                          )}

                          {/* Quick Reject Button */}
                          {item.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                              className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-red-50 text-red-700 text-xs font-semibold border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Tolak entri ini"
                            >
                              <XCircle size={13} />
                              <span>Tolak</span>
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED AUDIT MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-3xl border border-[#EAE5DB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EAE5DB] bg-[#FDFBF7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                  <UserCheck size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#8E847A] tracking-wider">
                    Lembar Kurasi Budaya • {activeModalItem.id}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2D3E50]">
                    Audit Pengetahuan & Validasi
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-[#F5F0E8] hover:bg-[#EAE5DB] text-[#2D3E50] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#2D2A26]">
              
              {/* Item Overview */}
              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EAE5DB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#8E847A]">Judul Entri</span>
                  <span className="text-[10px] font-semibold text-[#967156]">{activeModalItem.content_type}</span>
                </div>
                <div className="font-serif text-base font-bold text-[#2D3E50]">
                  {activeModalItem.title}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#EAE5DB]">
                  <div>
                    <span className="text-[#8E847A] block">Sumber Informasi:</span>
                    <strong className="text-[#2D3E50]">{activeModalItem.source}</strong>
                  </div>
                  <div>
                    <span className="text-[#8E847A] block">Tanggal Masuk Antrean:</span>
                    <strong className="text-[#2D3E50]">{activeModalItem.date}</strong>
                  </div>
                </div>
              </div>

              {/* Cultural Verification Checklist */}
              <div className="space-y-2">
                <label className="font-bold text-[#2D3E50] text-xs block">
                  Daftar Periksa Kepatuhan Nilai Adat Oerip:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] cursor-pointer hover:bg-[#F9F6F0]">
                    <input
                      type="checkbox"
                      checked={checklist.motifVerified}
                      onChange={(e) => setChecklist({ ...checklist, motifVerified: e.target.checked })}
                      className="rounded text-[#967156] focus:ring-[#967156]"
                    />
                    <span className="text-xs">Motif & Falsafah Sesuai Literatur Adat</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] cursor-pointer hover:bg-[#F9F6F0]">
                    <input
                      type="checkbox"
                      checked={checklist.weaverCommunityVerified}
                      onChange={(e) => setChecklist({ ...checklist, weaverCommunityVerified: e.target.checked })}
                      className="rounded text-[#967156] focus:ring-[#967156]"
                    />
                    <span className="text-xs">Asal Desa Penenun Terverifikasi</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] cursor-pointer hover:bg-[#F9F6F0]">
                    <input
                      type="checkbox"
                      checked={checklist.naturalDyeVerified}
                      onChange={(e) => setChecklist({ ...checklist, naturalDyeVerified: e.target.checked })}
                      className="rounded text-[#967156] focus:ring-[#967156]"
                    />
                    <span className="text-xs">100% Pewarna Alam (Bebas Kimia Sintetis)</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] cursor-pointer hover:bg-[#F9F6F0]">
                    <input
                      type="checkbox"
                      checked={checklist.zeroWasteVerified}
                      onChange={(e) => setChecklist({ ...checklist, zeroWasteVerified: e.target.checked })}
                      className="rounded text-[#967156] focus:ring-[#967156]"
                    />
                    <span className="text-xs">Pola Minim Potong (Zero-Waste)</span>
                  </label>
                </div>
              </div>

              {/* Curator Signature Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2D3E50] text-xs block">
                  Tanda Tangan Otoritas Kurator:
                </label>
                <select
                  value={customValidatorName}
                  onChange={(e) => setCustomValidatorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] text-xs text-[#2D3E50] font-medium focus:outline-none focus:border-[#967156]"
                >
                  <option value="Dian Errakumalasari (Founder & Cultural Director)">
                    Dian Errakumalasari (Founder & Cultural Director)
                  </option>
                  <option value="Bagas Qolbu Cetta (CEO Oerip Indonesia)">
                    Bagas Qolbu Cetta (CEO Oerip Indonesia)
                  </option>
                  <option value="Tim Kurasi Desain & Living Heritage Oerip">
                    Tim Kurasi Desain & Living Heritage Oerip
                  </option>
                </select>
              </div>

              {/* Notes / Reason for decision */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2D3E50] text-xs block">
                  Catatan Kuratorial & Justifikasi:
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Tuliskan catatan verifikasi budaya, konteks adat, atau instruksi pembaruan..."
                  className="w-full p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE5DB] text-xs text-[#2D3E50] focus:outline-none focus:border-[#967156] resize-none"
                />
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#EAE5DB] bg-[#FDFBF7] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5F0E8] text-[#685E55] border border-[#EAE5DB] text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      activeModalItem.id,
                      'REJECTED',
                      customValidatorName,
                      customNotes
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Tolak Konten</span>
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(
                      activeModalItem.id,
                      'DRAFT',
                      customValidatorName,
                      customNotes
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText size={14} />
                  <span>Simpan Draf</span>
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(
                      activeModalItem.id,
                      'VALIDATED',
                      customValidatorName,
                      customNotes
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Setujui & Publikasikan</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

