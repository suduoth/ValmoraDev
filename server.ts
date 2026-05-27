/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = 3000;

// Parse incoming JSON payloads
app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("MANDATORY WARNING: GEMINI_API_KEY environment variable is not defined. AI Assistant runs in mock diagnostic mode.");
      throw new Error("GEMINI_API_KEY environment variable is required to power the Unreal Engine Senior Mentor API");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// AI Mentor Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, activePhase, activeTask, personalityChoice } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Required array parameter 'messages' is missing" });
    }

    // Verify API key is present, fallback to simulated response if missing
    if (!process.env.GEMINI_API_KEY) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      const mockResponse = `[DIAGNOSTIC SIMULATION - NO API KEY DETECTED]\n\nHello solo developer! I see you are asking about: "${lastMsg.slice(0, 100)}...".\n\nTo unlock my real AI capabilities as a Senior Unreal Engine 5 PM, please paste your Gemini API key inside the **Secrets / Keys** panel in AI Studio.\n\nHere is a diagnostic architectural guideline for your current context:\n- **Phase Focus**: ${activePhase ? `Phase ${activePhase.id}: ${activePhase.title}` : 'General Architectural Decoupling'}\n- **Active Objective**: ${activeTask ? `${activeTask.title}` : 'None selected'}\n- **Core Rule**: Avoid building higher-order gameplay features (e.g., Inventory or Combat) until movement physics and stable world actor schemas are locked down. Keep Mover system rotations decoupled.`;
      
      return res.json({ response: mockResponse });
    }

    const ai = getGeminiClient();

    // Map personalities to instructions
    let personalityPrompt = "You are a Senior Unreal Engine 5 Technical Project Manager and Mentor.";
    if (personalityChoice === "technical-guru") {
      personalityPrompt = "You are an deep-dive Unreal Engine 5 C++ and Architecture Specialist. You write clean, optimized code snippets, detail memory layouts, avoid cyclical dependencies, and discuss engine source code structures (specifically components, gameplay tags, and the Mover system).";
    } else if (personalityChoice === "encouraging-partner") {
      personalityPrompt = "You are a supportive, high-morale game design buddy. You encourage solo game developers, celebrate milestones, break complex math down simply, and keep overwhelm to an absolute minimum.";
    }

    // Inject contextual metadata of active roadmap step to ensure dependency awareness
    let contextInstruction = `
${personalityPrompt}
You are guiding a solo game developer building a large-scale project called "Valmora" using standard Unreal Engine 5 paradigms.

CRITICAL ARCHITECTURE ENFORCEMENT RULES:
1. You are strictly sequential-phase and dependency aware.
2. The current development focus of the developer:
   ${activePhase ? `- ACTIVE PHASE: Phase ${activePhase.id} - ${activePhase.title} (Goal: ${activePhase.goal})` : '- GENERAL DEV OVERVIEW'}
   ${activeTask ? `- ACTIVE TASK: Task ${activeTask.id} - ${activeTask.title} (${activeTask.description})` : ''}
3. Always discourage implementing higher-tier features ahead of their sequential dependencies (e.g., never jump into Inventory/Combat systems during Phase 0 or 1. Focus on movement physics foundation).
4. For movement and player control, ALWAYS recommend utilizing and interfacing with the UE5 Mover system (formerly Network Physics Movement) rather than customized ticking coordinate overrides. Warn them about direct actor rotations conflicts (direct snapping of actor transforms breaks Mover interpolation).
5. Prefer using Blueprint Interfaces (BPI) + Data Assets (DA) to maintain loose architectural decoupling instead of direct casting or hard reference mappings.
6. Provide concrete, highly specific instructions. If coding, provide snippets using clean, production-ready C++ or descriptive Blueprint node layouts.
    `;

    // Process messages into Gemini contents format
    // Map roles: 'user' -> 'user', 'assistant' -> 'model'
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Call generateContent with system instruction
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: contextInstruction,
        temperature: 0.7,
      }
    });

    const outputText = response.text || "I was unable to compile a constructive response. Please retrace your question details.";
    return res.json({ response: outputText });

  } catch (error: any) {
    console.error("Gemini API error in Express server:", error);
    return res.status(500).json({ error: error.message || "Internal server error querying AI Mentor" });
  }
});

// ----------------------------------------------------
// VITE SERVICE & STATIC ASSETS
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite as a middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Game Dev OS Server] Running on http://localhost:${PORT}`);
  });
}

start();
