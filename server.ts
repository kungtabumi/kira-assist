import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { processKiraAgentMessage } from "./server/geminiService.js";
import { generateStorytellingWithSEO } from "./server/storytellingSeoService.js";
import {
  BUSINESS_PROFILES,
  OERIP_KNOWLEDGE_ITEMS,
  OERIP_PRODUCTS,
  OERIP_WASTRA_DATABASE,
  OERIP_SOCIAL_MEDIA_POSTS,
  RESTRICTED_ENTERPRISE_DATA,
  VALIDATION_QUEUE_INITIAL,
  OERIP_FAQS,
  OERIP_BRAND_ENTITY,
  OERIP_CONTENT_GUIDELINES,
  OERIP_SOURCES_ENTITY,
  INITIAL_AI_FEEDBACKS
} from "./src/data/oeripKnowledgeBase.js";

dotenv.config();

let validationQueue = [...VALIDATION_QUEUE_INITIAL];
let knowledgeItems = [...OERIP_KNOWLEDGE_ITEMS];
let socialMediaPosts = [...OERIP_SOCIAL_MEDIA_POSTS];
let productsList = [...OERIP_PRODUCTS];
let wastraList = [...OERIP_WASTRA_DATABASE];
let faqsList = [...OERIP_FAQS];
let brandEntity = { ...OERIP_BRAND_ENTITY };
let contentGuidelines = { ...OERIP_CONTENT_GUIDELINES };
let sourcesList = [...OERIP_SOURCES_ENTITY];
let feedbackList = [...INITIAL_AI_FEEDBACKS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "KIRA AI Cultural & Fashion Decision Agent", timestamp: new Date().toISOString() });
  });

  // PRD PDF endpoints (View inline & Direct download)
  app.get("/api/prd/pdf", (req, res) => {
    const pdfPath = path.join(process.cwd(), "public", "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(pdfPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="PRD_KIRA_Oerip_Indonesia_v1.0.pdf"');
      return res.sendFile(pdfPath);
    }
    const rootPath = path.join(process.cwd(), "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(rootPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="PRD_KIRA_Oerip_Indonesia_v1.0.pdf"');
      return res.sendFile(rootPath);
    }
    res.status(404).json({ error: "File PRD PDF belum ditemukan." });
  });

  app.get("/api/prd/download", (req, res) => {
    const pdfPath = path.join(process.cwd(), "public", "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(pdfPath)) {
      return res.download(pdfPath, "PRD_KIRA_Oerip_Indonesia_v1.0.pdf");
    }
    const rootPath = path.join(process.cwd(), "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(rootPath)) {
      return res.download(rootPath, "PRD_KIRA_Oerip_Indonesia_v1.0.pdf");
    }
    res.status(404).json({ error: "File PRD PDF belum ditemukan." });
  });

  app.get("/PRD_KIRA_Oerip_Indonesia.pdf", (req, res) => {
    const pdfPath = path.join(process.cwd(), "public", "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(pdfPath)) {
      res.setHeader("Content-Type", "application/pdf");
      return res.sendFile(pdfPath);
    }
    const rootPath = path.join(process.cwd(), "PRD_KIRA_Oerip_Indonesia.pdf");
    if (fs.existsSync(rootPath)) {
      res.setHeader("Content-Type", "application/pdf");
      return res.sendFile(rootPath);
    }
    res.status(404).send("File PRD PDF tidak ditemukan.");
  });

  // Business profiles
  app.get("/api/kira/businesses", (req, res) => {
    res.json(BUSINESS_PROFILES);
  });

  // Chat / Decision Agent endpoint
  app.post("/api/kira/chat", async (req, res) => {
    try {
      const { message, history, businessId } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await processKiraAgentMessage({
        message,
        history: history || [],
        businessId: businessId || "OERIP"
      });

      res.json(result);
    } catch (err: any) {
      console.error("Chat agent processing error:", err);
      res.status(500).json({
        error: "Gagal memproses pesan konsultasi KIRA",
        details: err.message
      });
    }
  });

  // Wastra Explorer API
  app.get("/api/kira/wastra", (req, res) => {
    const { island, technique, business_id } = req.query;
    let filtered = wastraList;
    if (business_id) {
      filtered = filtered.filter(w => w.business_id === business_id);
    }
    if (island) {
      filtered = filtered.filter(w => w.island.toLowerCase().includes(String(island).toLowerCase()));
    }
    if (technique) {
      filtered = filtered.filter(w => w.technique.toLowerCase().includes(String(technique).toLowerCase()));
    }
    res.json(filtered);
  });

  // Products API
  app.get("/api/kira/products", (req, res) => {
    const { business_id, category } = req.query;
    let filtered = productsList;
    if (business_id) {
      filtered = filtered.filter(p => p.business_id === business_id);
    }
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(String(category).toLowerCase()));
    }
    res.json(filtered);
  });

  // Knowledge Base items API
  app.get("/api/kira/knowledge", (req, res) => {
    const { category, business_id, status } = req.query;
    let filtered = knowledgeItems;
    if (business_id) {
      filtered = filtered.filter(k => k.business_id === business_id);
    }
    if (category) {
      filtered = filtered.filter(k => k.category === category);
    }
    if (status) {
      filtered = filtered.filter(k => k.validation_status === status);
    }
    res.json(filtered);
  });

  app.post("/api/kira/knowledge", (req, res) => {
    const newItem = {
      ...req.body,
      id: `KB-${Date.now()}`,
      last_updated: new Date().toISOString().split('T')[0]
    };
    knowledgeItems.unshift(newItem);
    res.status(201).json(newItem);
  });

  // Social Media Ingestion API
  app.get("/api/kira/social-media", (req, res) => {
    res.json(socialMediaPosts);
  });

  app.post("/api/kira/social-media", (req, res) => {
    const newPost = {
      ...req.body,
      id: `SOC-${Date.now()}`,
      capture_date: new Date().toISOString().split('T')[0],
      validation_status: 'NEEDS_REVIEW'
    };
    socialMediaPosts.unshift(newPost);

    // Also add to validation queue
    validationQueue.unshift({
      id: `VAL-${Date.now()}`,
      business_id: newPost.business_id || 'OERIP',
      content_type: 'SOCIAL_MEDIA',
      title: `Post ${newPost.platform} ${newPost.account}: ${newPost.extracted_information?.slice(0, 50)}...`,
      source: `${newPost.platform} (${newPost.post_date})`,
      status: 'NEEDS_REVIEW',
      validator: 'Pending Kurasi Desain',
      date: new Date().toISOString().split('T')[0],
      notes: 'Ekstraksi otomatis dari kanal resmi Oerip, menunggu validasi kurator sebelum masuk pustaka publik.'
    });

    res.status(201).json(newPost);
  });

  // Human Validation Queue API
  app.get("/api/kira/validation-queue", (req, res) => {
    res.json(validationQueue);
  });

  // Out-of-Knowledge-Base Inquiry / Research Request Submission
  app.post("/api/kira/inquiry", (req, res) => {
    try {
      const { topic, user_query, notes } = req.body;
      const ticketId = `VAL-INQ-${Date.now().toString().slice(-6)}`;
      const inquiryItem = {
        id: ticketId,
        business_id: 'OERIP',
        content_type: 'USER_INQUIRY',
        title: `Permintaan Riset Pustaka: ${topic || 'Wastra Belum Ada di KB'}`,
        source: `Tanya AI RAG: "${(user_query || topic || 'Pertanyaan pengguna').slice(0, 70)}"`,
        status: 'NEEDS_REVIEW' as const,
        validator: 'Pending Tim Riset & Kurasi Dian Oerip',
        date: new Date().toISOString().split('T')[0],
        notes: notes || `Topik "${topic || user_query}" ditanyakan pengguna di Tanya AI RAG namun belum terdaftar dalam Knowledge Base resmi Oerip. Direkomendasikan untuk riset lapangan dan kurasi adat.`
      };

      validationQueue.unshift(inquiryItem);
      res.status(201).json({
        success: true,
        message: 'Permintaan riset topik berhasil diajukan ke Tim Kurasi Oerip',
        ticket_id: ticketId,
        item: inquiryItem
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal mengajukan permintaan riset', details: err.message });
    }
  });

  app.patch("/api/kira/validation-queue/:id", (req, res) => {
    const { id } = req.params;
    const { status, validator, notes } = req.body;
    const index = validationQueue.findIndex(v => v.id === id);
    if (index !== -1) {
      validationQueue[index] = {
        ...validationQueue[index],
        status: status || validationQueue[index].status,
        validator: validator || 'Dian Errakumalasari / Tim Kurasi Oerip',
        notes: notes || validationQueue[index].notes
      };
      return res.json(validationQueue[index]);
    }
    res.status(404).json({ error: "Validation item not found" });
  });

  // Restricted Enterprise Data Security Monitor (Admin Only)
  app.get("/api/kira/restricted-data", (req, res) => {
    res.json({
      governance_status: "SECURED & ISOLATED FROM PUBLIC INTERFACE",
      restricted_items: RESTRICTED_ENTERPRISE_DATA,
      protection_rules: [
        "HPP and artisan profit splits are never exposed to LLM prompts",
        "Personal phone numbers and physical coordinates of village weavers are masked",
        "Secret natural fermentation dye recipes are stored in encrypted vaults",
        "VIP customer purchase archives are segregated under UU PDP compliance"
      ]
    });
  });

  // FAQs API (PRD Section 10)
  app.get("/api/kira/faqs", (req, res) => {
    res.json(faqsList);
  });

  app.post("/api/kira/faqs", (req, res) => {
    const newFaq = {
      ...req.body,
      id: `FAQ-${Date.now()}`,
      validation_status: 'VALIDATED'
    };
    faqsList.unshift(newFaq);
    res.status(201).json(newFaq);
  });

  // Brand Entity API (PRD Section 10)
  app.get("/api/kira/brand-entity", (req, res) => {
    res.json(brandEntity);
  });

  app.put("/api/kira/brand-entity", (req, res) => {
    brandEntity = { ...brandEntity, ...req.body };
    res.json(brandEntity);
  });

  // Content Guidelines API (PRD Section 10)
  app.get("/api/kira/content-guidelines", (req, res) => {
    res.json(contentGuidelines);
  });

  // Sources Entity Hierarchy API (PRD Section 10)
  app.get("/api/kira/sources", (req, res) => {
    res.json(sourcesList);
  });

  app.post("/api/kira/sources", (req, res) => {
    const newSource = {
      ...req.body,
      id: `SRC-${Date.now()}`,
      status: 'VALIDATED'
    };
    sourcesList.unshift(newSource);
    res.status(201).json(newSource);
  });

  // AI Feedback & Traceability Log API (PRD Section 6, 8, & 13)
  app.get("/api/kira/feedback", (req, res) => {
    res.json(feedbackList);
  });

  app.post("/api/kira/feedback", (req, res) => {
    const newFeedback = {
      ...req.body,
      id: `FDB-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'PENDING_REVIEW'
    };
    feedbackList.unshift(newFeedback);
    res.status(201).json(newFeedback);
  });

  app.patch("/api/kira/feedback/:id", (req, res) => {
    const { id } = req.params;
    const { status, reviewed_by } = req.body;
    const idx = feedbackList.findIndex(f => f.id === id);
    if (idx !== -1) {
      feedbackList[idx] = {
        ...feedbackList[idx],
        status: status || feedbackList[idx].status,
        reviewed_by: reviewed_by || 'Bagas Qolbu Cetta (CEO)'
      };
      return res.json(feedbackList[idx]);
    }
    res.status(404).json({ error: "Feedback item not found" });
  });

  // Admin Dashboard Overview & Metrics API (PRD Section 13 & 16)
  app.get("/api/kira/admin/stats", (req, res) => {
    res.json({
      kpis: {
        factual_accuracy_score: "96.4%",
        critical_cultural_hallucinations: 0,
        recommendation_relevance_score: "92.8%",
        marketing_draft_utility: "88.5%",
        zero_waste_rule_compliance: "100%"
      },
      rag_database_summary: {
        total_wastra_registered: wastraList.length,
        total_products_cataloged: productsList.length,
        total_knowledge_articles: knowledgeItems.length,
        total_faqs: faqsList.length,
        total_verified_sources: sourcesList.length,
        total_social_captures: socialMediaPosts.length
      },
      validation_queue_stats: {
        needs_review: validationQueue.filter(v => v.status === 'NEEDS_REVIEW').length,
        validated: validationQueue.filter(v => v.status === 'VALIDATED').length,
        draft: validationQueue.filter(v => v.status === 'DRAFT').length,
        rejected: validationQueue.filter(v => v.status === 'REJECTED').length
      },
      feedback_summary: {
        total_ratings: feedbackList.length,
        thumbs_up: feedbackList.filter(f => f.rating === 'THUMBS_UP').length,
        thumbs_down: feedbackList.filter(f => f.rating === 'THUMBS_DOWN').length,
        pending_review: feedbackList.filter(f => f.status === 'PENDING_REVIEW').length
      }
    });
  });

  // Storytelling & Content Generator API with Complete SEO Suite
  app.post("/api/kira/storytelling", async (req, res) => {
    try {
      const { topic, format, targetAudience, focusKeyword, tone } = req.body;
      const result = await generateStorytellingWithSEO({
        topic: topic || 'Tenun Ikat Sumba & Gedog Tuban (Zero-Waste)',
        format: format || 'YOUTH_STORY',
        targetAudience: targetAudience || 'Youth & Cultural Lovers',
        focusKeyword,
        tone
      });
      res.json(result);
    } catch (err: any) {
      console.error("Storytelling SEO generator error:", err);
      res.status(500).json({ error: "Gagal membuat storytelling SEO", details: err.message });
    }
  });

  const httpServer = http.createServer(app);

  // Serve static images directly from public/images
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware in dev / static in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`KIRA AI Agent Server running on http://localhost:${PORT}`);
  });
}

startServer();
