import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Ensure directory for published landing pages exists
const PUBLISHED_DIR = path.join(process.cwd(), "published");
if (!fs.existsSync(PUBLISHED_DIR)) {
  fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
}

// Global live HTML storage
let lastActiveHtml = "";
const liveHtmlMap: Record<string, string> = {};

// Live synchronization endpoint
app.post("/api/live-sync", (req, res) => {
  const { projectId, html } = req.body;
  if (html) {
    lastActiveHtml = html;
  }
  if (projectId && html) {
    liveHtmlMap[projectId] = html;
  }
  res.json({ success: true });
});

// Serve the live, active landing page under edit
app.get("/live", (req, res) => {
  if (lastActiveHtml) {
    res.setHeader("Content-Type", "text/html");
    return res.send(lastActiveHtml);
  }
  
  // Try to find any published file as a fallback
  try {
    if (fs.existsSync(PUBLISHED_DIR)) {
      const files = fs.readdirSync(PUBLISHED_DIR);
      const htmlFiles = files.filter(f => f.endsWith(".html"));
      if (htmlFiles.length > 0) {
        res.setHeader("Content-Type", "text/html");
        return res.sendFile(path.join(PUBLISHED_DIR, htmlFiles[0]));
      }
    }
  } catch (err) {}

  return res.status(404).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1 style="font-size: 2.5rem; margin-bottom: 10px; color: #6366f1;">Belum Ada Live Preview</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 25px; max-w: 500px; line-height: 1.6;">Silakan buka editor LandingPage Generator di tab lain dan ubah salah satu form untuk memicu sinkronisasi real-time secara instan!</p>
      <a href="/" style="text-decoration: none; background: #6366f1; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 0.9rem; transition: background 0.2s;">Buka Editor Generator</a>
    </div>
  `);
});

// Endpoint to publish / host a landing page
app.post("/api/publish", (req, res) => {
  const { projectId, html } = req.body;
  if (!projectId || !html) {
    return res.status(400).json({ error: "projectId and html are required" });
  }

  try {
    // Sanitize the file name to prevent directory traversal
    const safeId = projectId.replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = path.join(PUBLISHED_DIR, `${safeId}.html`);
    
    fs.writeFileSync(filePath, html, "utf8");
    
    res.json({ 
      success: true, 
      path: `/p/${safeId}`,
      message: "Landing page hosted successfully!" 
    });
  } catch (error: any) {
    console.error("Publishing error:", error);
    res.status(500).json({ error: "Failed to publish landing page." });
  }
});

// Route to serve published landing pages directly
app.get("/p/:id", (req, res) => {
  const { id } = req.params;
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "");
  const filePath = path.join(PUBLISHED_DIR, `${safeId}.html`);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/html");
    return res.sendFile(filePath);
  } else {
    return res.status(404).send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 3rem; margin-bottom: 10px; color: #6366f1;">404</h1>
        <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 20px;">Landing page tidak ditemukan atau belum dipublikasikan.</p>
        <a href="/" style="text-decoration: none; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold;">Kembali ke Generator</a>
      </div>
    `);
  }
});

// Initialize Gemini SDK lazily to avoid crashes if API key is not set
let aiClient: GoogleGenAI | null = null;


function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or is set to placeholder in .env file.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/generate", async (req, res) => {
  const { prompt, category = "general" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Return a simulated high-quality fallback if there is no API key yet
      return res.json({
        text: getSimulatedFallback(prompt, category),
        simulated: true
      });
    }

    const systemInstruction = `You are a world-class Flutter Web Developer and UI/UX Designer.
Generate a professional response based on the prompt for an AI Generator Landing Page.
If the request is for generating layout, copy, or elements, reply in clear, production-ready copy or widgets.
If appropriate, include clean, elegant markdown formatting and relevant Flutter Dart code snippets.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "No response generated.",
      simulated: false
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while communicating with Gemini.",
      text: getSimulatedFallback(prompt, category),
      simulated: true
    });
  }
});

// Simulated fallback function when API key is missing or calls fail
function getSimulatedFallback(prompt: string, category: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (category === "widget" || lowerPrompt.includes("widget") || lowerPrompt.includes("code")) {
    return `// AI Generated Custom Widget based on prompt: "${prompt}"
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomGeneratedWidget extends StatelessWidget {
  const CustomGeneratedWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
        border: Border.all(
          color: const Color(0xFF6366F1).withOpacity(0.1),
          width: 1.5,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.auto_awesome,
                  color: Color(0xFF6366F1),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  'AI Spark Generator',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF0F172A),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Successfully processed prompt: "${prompt}". Here is your customized container with soft shadows, glassmorphic styling, and premium Material 3 design constraints.',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: const Color(0xFF64748B),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Status: Production Ready',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF06B6D4),
                ),
              ),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Export Widget'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}`;
  }

  if (category === "image" || lowerPrompt.includes("image") || lowerPrompt.includes("picture")) {
    return `### 🎨 AI Generated Illustration Details

**Concept**: Futuristic Neo-Minimalist Dashboard for SaaS Analytics
**Primary Theme**: Obsidian slate with cyan (#06B6D4) and violet (#8B5CF6) mesh glow.

*Our engine has constructed a layout specification. Since you are in preview mode, this high-fidelity layout represents the responsive grid:*

- **Top Row**: 3 KPI Cards featuring real-time telemetry from AI inference nodes.
- **Center Canvas**: Interactive Bézier spline graph representing peak concurrent API requests (stabilized at 98.4% efficiency).
- **Control Rail**: Actionable toggle switches to scale node deployments across multi-region clusters.

*Would you like to customize the colors or modify the card properties? Adjust the prompt input above to regenerate the specification!*`;
  }

  // General or text copy fallback
  return `### ✨ AI Copywriter: Generated Creative Assets

**Suggested Headline:**
"Amplify Your Imagination: The Ultimate Autonomous Workspace Powered by Next-Gen Intelligence"

**SaaS Value Proposition:**
Stop spending hours manually sketching UI scaffolding. Our generative model compiles responsive widget layouts, sets precise glassmorphic elevation, and binds states in milliseconds.

**Key Marketing Bullet Points:**
- **Dynamic Scaffolding**: LayoutBuilder adapts to any viewports with mathematically balanced margins.
- **Glassmorphic Precision**: Advanced translucent backdrops engineered using CustomPainters and BackdropFilters.
- **Performance Focused**: Built-in state management using lightweight reactive streams to prevent gratuitous re-renders.

*Feel free to copy this copy directly into your custom landing page sections!*`;
}

// Vite Server Configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
