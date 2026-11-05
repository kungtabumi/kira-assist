export type AppMode = 'USER' | 'ADMIN';

export type UserTabType =
  | 'landing'
  | 'consultation'
  | 'wastra'
  | 'products'
  | 'styling'
  | 'persona';

export type AdminTabType =
  | 'dashboard'
  | 'knowledge_base'
  | 'content_studio'
  | 'validation_feedback';

export type ActiveTabType = UserTabType | AdminTabType;

export type KnowledgeCategory =
  | 'BRAND'
  | 'PRODUCTS'
  | 'WASTRA'
  | 'MOTIFS'
  | 'CULTURAL_STORIES'
  | 'TECHNIQUES'
  | 'MATERIALS'
  | 'CARE_GUIDES'
  | 'FAQ'
  | 'CUSTOMER_NEEDS'
  | 'CONTENT'
  | 'CONTENT_GUIDELINE'
  | 'SOCIAL_MEDIA'
  | 'SOURCES'
  | 'VALIDATION'
  | 'GUARDRAILS'
  | 'RESTRICTED';

export type ValidationStatus =
  | 'DRAFT'
  | 'NEEDS_REVIEW'
  | 'VALIDATED'
  | 'REJECTED'
  | 'ARCHIVED';

export type SourceHierarchy =
  | 'LEVEL_1_PRIMARY'      // Uploaded official Oerip document/database
  | 'LEVEL_2_OFFICIAL'     // Official Oerip website/catalog & verified social media
  | 'LEVEL_3_HUMAN_VALIDATED' // Information explicitly validated by Oerip team
  | 'CONFLICTING_REVIEW';  // Conflicting info requiring human check

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  source: string;
  validation_status: ValidationStatus;
}

export interface BrandEntity {
  id: string;
  name: string;
  founder: string;
  ceo: string;
  tagline: string;
  positioning: string;
  communication_style: string;
  core_values: string[];
  limitations: string[];
}

export interface ContentGuidelineEntity {
  id: string;
  title: string;
  tone_options: string[];
  mandatory_terms: string[];
  forbidden_terms: string[];
  publication_rules: string[];
}

export interface SourceEntity {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'BOOK' | 'LOOKBOOK' | 'SOCIAL_MEDIA' | 'INTERVIEW';
  owner: string;
  date: string;
  trust_level: 'LEVEL_1_PRIMARY' | 'LEVEL_2_OFFICIAL' | 'LEVEL_3_HUMAN_VALIDATED';
  status: ValidationStatus;
  description: string;
}

export interface AIFeedbackItem {
  id: string;
  timestamp: string;
  user_query: string;
  ai_response_snippet: string;
  rating: 'THUMBS_UP' | 'THUMBS_DOWN';
  feedback_category?: string;
  user_note?: string;
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'RESOLVED';
  reviewed_by?: string;
}

export interface KnowledgeItem {
  id: string;
  business_id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  source_type: SourceHierarchy;
  source_name: string;
  source_reference: string;
  source_date: string;
  validation_status: ValidationStatus;
  validated_by?: string;
  last_updated: string;
  cultural_sensitivity_level?: 'PUBLIC' | 'CULTURAL_RESPECT' | 'SACRED_RESTRICTED' | 'CONFIDENTIAL';
}

export interface ProductItem {
  product_id: string;
  business_id: string;
  product_name: string;
  category: string;
  description: string;
  textile: string;
  textile_origin: string;
  technique: string;
  material: string;
  motif: string;
  colors: string[];
  size: string;
  silhouette: string;
  occasion: string[];
  styling_notes: string;
  cultural_story: string;
  care_instruction: string;
  price_range: string;
  price_note: string;
  availability: string;
  image: string;
  official_source: string;
  validation_status: ValidationStatus;
  validated_by: string;
  last_verified: string;
}

export interface WastraItem {
  id: string;
  business_id: string;
  name: string;
  region: string;
  island: string;
  community: string;
  technique: string;
  material: string;
  dye: string;
  motifs: {
    name: string;
    meaning: string;
    is_sacred: boolean;
  }[];
  colors: string[];
  characteristics: string;
  cultural_meaning: string;
  historical_context: string;
  cultural_sensitivity: string;
  story: string;
  care: string;
  source: string;
  validation_status: ValidationStatus;
  validated_by: string;
  image?: string;
}

export interface SocialMediaPost {
  id: string;
  business_id: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook';
  account: string;
  post_url: string;
  post_date: string;
  extracted_information: string;
  caption_snippet: string;
  capture_date: string;
  validation_status: ValidationStatus;
  category: KnowledgeCategory;
  reviewed_by?: string;
}

export interface RestrictedDataItem {
  id: string;
  business_id: string;
  type: 'HPP' | 'WEAVER_CONTACT' | 'DYE_FORMULA' | 'VIP_COLLECTOR' | 'INTERNAL_STRATEGY';
  title: string;
  confidential_summary: string;
  access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY';
  protected_reason: string;
}

export interface AgentRecommendation {
  product_name: string;
  product_id?: string;
  image?: string;
  why_reasons: string[];
  about_wastra: string;
  cultural_story: string;
  alternatives: string[];
  notes: {
    price_range: string;
    care: string;
    availability: string;
  };
  source: string;
}

export interface DetectedContext {
  occasion?: string;
  formality?: string;
  desired_style?: string;
  preferred_model?: string;
  tone_preference?: string;
  color_preference?: string;
  color_tone?: string;
  cultural_need?: string;
  wastra_affinity?: string;
  material_preference?: string;
  fit_preference?: string;
  price_range_preference?: string;
  demographic?: string;
  gender_preference?: string;
  climate_comfort?: string;
  venue?: string;
  styling_intent?: string;
  topic?: string;
  summary_badge?: string;
  evaluation_10_factors?: {
    jenis_acara?: string;
    gaya_diinginkan?: string;
    warna?: string;
    model_pakaian?: string;
    jenis_wastra?: string;
    bahan?: string;
    ukuran_fit?: string;
    rentang_harga?: string;
    filosofi_wastra?: string;
    kesesuaian_kebutuhan?: string;
  };
}

export interface ContextualReasoningData {
  parsed_dimensions: {
    environment_climate?: string;
    styling_preference?: string;
    wastra_category?: string;
    justification_type?: string;
    confidence_score?: number;
  };
  kb_categories_matched: string[];
  cultural_guardrail_status: 'ALIGNED' | 'NEEDS_CONTEXTUALIZATION' | 'PROTECTED';
  reasoning_rationale: string;
}

export interface AgentDecisionTrace {
  user_intent: string;
  context_detected: DetectedContext;
  is_sufficient_information: boolean;
  clarification_needed?: string;
  suggested_options?: string[];
  retrieved_knowledge_ids: string[];
  guardrail_checked: boolean;
  guardrail_notes: string[];
  cultural_accuracy_verified: boolean;
  contextual_reasoning?: ContextualReasoningData;
}

export interface RestrictedVaultInfo {
  vault_id: 'RESTRICT-001' | 'RESTRICT-002' | 'RESTRICT-003' | 'RESTRICT-004';
  title: string;
  type: 'HPP' | 'WEAVER_CONTACT' | 'DYE_FORMULA' | 'VIP_COLLECTOR';
  access_level: 'STRICTLY_RESTRICTED_ADMIN_ONLY';
  protected_reason: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendation?: AgentRecommendation;
  trace?: AgentDecisionTrace;
  contextual_reasoning?: ContextualReasoningData;
  quick_replies?: string[];
  is_guardrail_refusal?: boolean;
  restricted_vault_data?: RestrictedVaultInfo;
  is_out_of_knowledge_base?: boolean;
  unfound_topic?: string;
  suggested_alternatives?: Array<{
    title: string;
    prompt: string;
    type?: 'WASTRA' | 'PRODUCT' | 'TOPIC';
  }>;
  source_badge?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  founder: string;
  city: string;
  tagline: string;
  description: string;
  is_active_pilot: boolean;
  verified_socials: string[];
}
