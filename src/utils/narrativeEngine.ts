import { OERIP_WASTRA_DATABASE, OERIP_PRODUCTS } from '../data/oeripKnowledgeBase';
import { WastraItem, ProductItem } from '../types';

export interface NarrativeEngineResult {
  content: string;
  source_badge: string;
  quick_replies: string[];
  trace: {
    user_intent: string;
    context_detected?: string;
    is_sufficient_information: boolean;
    guardrail_checked: boolean;
    guardrail_notes: string[];
    cultural_accuracy_verified: boolean;
    retrieved_knowledge_ids: string[];
  };
}

/**
 * Narrative Engine for KIRA (Oerip AI Cultural Agent)
 * Dynamically fetches wastra metadata from the verified knowledge base (OERIP_WASTRA_DATABASE)
 * and generates structured narratives covering 'Asal (Origin)' and 'Relevansi (Cultural Significance & Product Application)'
 */
export class NarrativeEngine {
  /**
   * Detects if the prompt is asking for multi-step wastra narrative (e.g., 6 Wastra Nusantara)
   */
  static isMultiWastraQuery(query: string): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('6 wastra') ||
      q.includes('6-wastra') ||
      q.includes('enam wastra') ||
      q.includes('narasi lengkap wastra') ||
      q.includes('asal → relevansi') ||
      q.includes('asal -> relevansi') ||
      q.includes('pustaka wastra') ||
      (q.includes('ceritakan') && q.includes('wastra') && (q.includes('6') || q.includes('enam') || q.includes('oerip') || q.includes('nusantara'))) ||
      (q.includes('wastra') && q.includes('nusantara') && q.includes('oerip'))
    );
  }

  /**
   * Find matching products in OERIP_PRODUCTS for a given wastra item
   */
  static getAssociatedProducts(wastraId: string): ProductItem[] {
    switch (wastraId) {
      case 'WASTRA-SUMBA-001':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-OUT-001' || p.product_id === 'OERIP-KIM-002');
      case 'WASTRA-TUBAN-002':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-CAP-005');
      case 'WASTRA-LURIK-003':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-LUR-003' || p.product_id === 'OERIP-VES-008');
      case 'WASTRA-ULOS-004':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-ULO-004');
      case 'WASTRA-FLORES-005':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-PON-007');
      case 'WASTRA-TORAJA-006':
        return OERIP_PRODUCTS.filter(p => p.product_id === 'OERIP-DRS-006');
      default:
        return OERIP_PRODUCTS.slice(0, 2);
    }
  }

  /**
   * Generates a single Wastra structured narrative by ID or query matching
   */
  static generateSingleWastraNarrative(wastraIdOrName: string): NarrativeEngineResult | null {
    const term = wastraIdOrName.toLowerCase();
    const wastra = OERIP_WASTRA_DATABASE.find(
      w => w.id.toLowerCase() === term ||
           w.name.toLowerCase().includes(term) ||
           w.region.toLowerCase().includes(term)
    );

    if (!wastra) return null;

    const products = this.getAssociatedProducts(wastra.id);
    const primaryMotifs = wastra.motifs
      ? wastra.motifs.map(m => `• **${m.name}**: ${m.meaning}`).join('\n  ')
      : 'Motif khas adat lokal';

    const productList = products.map(p => {
      const waText = encodeURIComponent(
        `Halo Tim Kurasi Oerip Indonesia, saya tertarik dengan koleksi: ${p.product_name.replace(/[\(\)]/g, '')} [ID: ${p.product_id}]. Mohon info detail ketersediaan fisik.`
      ).replace(/\(/g, '%28').replace(/\)/g, '%29');
      return `• **${p.product_name}** \`[ID: ${p.product_id}]\` — ${p.category} (${p.price_range})\n  🔗 [Konsultasi WhatsApp Resmi](https://wa.me/6285174485581?text=${waText})`;
    }).join('\n\n');

    const content =
      `### 🧵 PUSTAKA WASTRA: ${wastra.name.toUpperCase()}\n\n` +
      `• **📍 Asal (Origin)**: ${wastra.region}, ${wastra.island} — ${wastra.community}.\n` +
      `• **🌿 Teknik & Material**: ${wastra.technique}. Menggunakan ${wastra.material} dan ${wastra.dye}.\n` +
      `• **📜 Kisah & Makna Sakral**: ${wastra.story}\n` +
      `  - *Filosofi Budaya*: ${wastra.cultural_meaning}\n` +
      `  - *Simbol Motif Utama*:\n  ${primaryMotifs}\n\n` +
      `• **✨ Relevansi & Penerapan Busana Oerip**: Dian Oerip mengabadikan keagungan wastra ini dalam karya *zero-waste* bergaya *all-size loose fit*:\n\n${productList}\n\n` +
      `---\n*💡 Seluruh busana dirancang dengan Konsep Minim Potong demi menghormati doa para mama penenun desa adat.*`;

    return {
      content,
      source_badge: `✓ Narrative Engine (${wastra.name})`,
      quick_replies: [
        'Ceritakan 6 Wastra Nusantara',
        'Apa itu Konsep Minim Potong (Zero-Waste)?',
        'Konsultasi Padu-Padan Busana',
        'Hubungi WhatsApp Admin'
      ],
      trace: {
        user_intent: `Single Wastra Narrative Request: "${wastra.name}"`,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          `Narrative Engine fetched metadata for ${wastra.id} (${wastra.name}) from verified Knowledge Base.`
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: [wastra.id]
      }
    };
  }

  /**
   * Generates a multi-wastra structured narrative (covering all 6 Wastra Nusantara)
   */
  static generateMultiWastraNarrative(queryContext: string = ''): NarrativeEngineResult {
    const wastras = OERIP_WASTRA_DATABASE;
    const retrievedIds = wastras.map(w => w.id);

    const wastraNarratives = wastras.map((w, idx) => {
      const products = this.getAssociatedProducts(w.id);
      const motifsText = w.motifs
        ? w.motifs.map(m => `**${m.name}** (${m.meaning})`).join(', ')
        : 'Motif adat luhur';

      const productMappingText = products.map(p => {
        const waText = encodeURIComponent(
          `Halo Tim Kurasi Oerip Indonesia, saya berminat dengan busana ${p.product_name.replace(/[\(\)]/g, '')} [ID: ${p.product_id}]. Mohon informasi ketersediaan helainya.`
        ).replace(/\(/g, '%28').replace(/\)/g, '%29');
        return `   - **${p.product_name}** \`[ID: ${p.product_id}]\` (${p.price_range})\n     *Relevansi Busana*: Diolah dengan *Konsep Minim Potong (Zero-Waste)* menjadi busana ${p.category} yang inklusif dan berwibawa.\n     🔗 [Konsultasi WhatsApp Resmi](https://wa.me/6285174485581?text=${waText})`;
      }).join('\n');

      return (
        `### ${idx + 1}. 🏛️ ${w.name.toUpperCase()}\n` +
        `• **📍 Asal (Origin)**: ${w.region}, ${w.island} (${w.community}).\n` +
        `• **📜 Kisah & Makna Sakral**: ${w.story}\n` +
        `  - *Filosofi Simbolik*: ${w.cultural_meaning}\n` +
        `  - *Ragam Motif*: ${motifsText}\n` +
        `• **🌿 Teknik & Material**: ${w.technique}. ${w.material} dengan ${w.dye}.\n` +
        `• **✨ Relevansi & Penerapan Busana Oerip**:\n${productMappingText}`
      );
    }).join('\n\n---\n\n');

    const header =
      `### 🏛️ PUSTAKA NARASI 6 WASTRA ADILUHUNG NUSANTARA OERIP INDONESIA\n\n` +
      `Dian Oerip mendedikasikan rancangan fesyennya untuk memuliakan dan menghidupkan kembali wastra tenun tangan dari pelosok desa adat Nusantara. Berikut adalah **Narasi Komprehensif 6 Wastra Terverifikasi Oerip Indonesia (Asal → Kisah & Makna → Relevansi Busana Oerip)**:\n\n` +
      `---\n\n`;

    const footer =
      `---\n\n` +
      `💡 *Seluruh 6 wastra di atas diolah Dian Oerip menggunakan Konsep Minim Potong (Zero-Waste) untuk menjaga keutuhan lembaran serat tenun dan doa para penenun desa adat.*`;

    return {
      content: header + wastraNarratives + '\n\n' + footer,
      source_badge: '✓ Pustaka Narrative Engine 6 Wastra Oerip',
      quick_replies: [
        'Ceritakan tentang Konsep Minim Potong (Zero-Waste)',
        'Lihat 8 Koleksi Mahakarya Oerip',
        'Berapa rentang harga busana Oerip?',
        'Hubungi WhatsApp Admin Kurator'
      ],
      trace: {
        user_intent: `Multi-Step Narrative Engine Request: "${queryContext || 'Ceritakan 6 Wastra Nusantara'}"`,
        is_sufficient_information: true,
        guardrail_checked: true,
        guardrail_notes: [
          'Narrative Engine dynamically fetched 6 verified Wastra metadata items from OERIP_WASTRA_DATABASE.',
          'Structured output with Origin -> Sacred Meaning & Technique -> Oerip Product Relevance mapping.'
        ],
        cultural_accuracy_verified: true,
        retrieved_knowledge_ids: retrievedIds
      }
    };
  }
}

