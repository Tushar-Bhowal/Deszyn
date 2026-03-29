# Deszyn — AI Design Platform for Developers

> **From idea to shipped product — generate startup names, logos, and production-ready React design systems using AI. No design skills needed.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://deszyn.vercel.app)
[![Status](https://img.shields.io/badge/Status-Phase%201%20In%20Progress-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## The Problem

Every developer has been here:

> *Client calls. They want a website. You can build the entire backend in 2 days.  
> But then you spend 3 days searching Dribbble, copying Tailwind templates, manually writing  
> CSS variables, arguing with Figma, and still deliver a mediocre design.*

**The code takes 2 days. The design takes 3. Deszyn removes that bottleneck entirely.**

Deszyn is built for three kinds of developers — all of whom hit the same wall:

**The Freelancer**
Client wants a landing page. You can wire up the entire backend, auth, and database
in a weekend. But the moment someone says *"make it look good"* — you are on Dribbble
for 4 hours, copying a Tailwind template that does not quite fit, manually tweaking
CSS variables until 2am. Deszyn generates the design system from their existing site
or brand — you just approve sections and export.

**The Portfolio Builder**
You are preparing for interviews. You have a great full-stack project but the UI looks
like a university assignment. Recruiters and CTOs make a judgment in 8 seconds —
and a polished UI is the difference between "tell me more" and moving to the next
candidate. Deszyn gives your project a production-grade design without needing
a designer co-founder.

**The Startup Founder (Who Codes)**
You have the idea, the technical skills, and the Firebase project already set up.
But you are spending two weeks on brand identity — what should the name be?
what does the logo look like? what colors? Deszyn handles name generation with
live trademark and domain verification, logo generation, and a complete design
system — in one session, before you write a single line of product code.

---

All three face the same problem: **design is the bottleneck, not the code.**
Deszyn exists to remove that bottleneck entirely.

---

## The Journey

This project was not planned in a day. It was designed through a series of deliberate  
architectural decisions — each one made by asking "why this and not the obvious alternative?"  
This README documents that journey, phase by phase.

---

## Product Vision

### Two Core Modes

**Mode 1 — Brand Identity (Start from Zero)**
```
You: "I'm building an AI note-taking tool for developers"
         ↓
Deszyn generates → 5 verified startup names (trademark + domain checked live)
         ↓
You pick a name → Logo generated from your brand personality
         ↓
Brand tokens extracted from logo (colors, fonts, spacing)
         ↓
Full website designed using your brand identity
```

**Mode 2 — Web Designer (You have an existing site)**
```
You: paste https://yourclient.com/pricing
         ↓
Deszyn scrapes → extracts full design system (colors, fonts, spacing, radius)
         ↓
Section-by-section redesign — you approve each section before next generates
         ↓
Protected pages? → Deszyn asks for credentials, uses them in-memory, never stores
         ↓
Multi-step forms/modals? → Agent clicks through all states and captures each
         ↓
Export: React components + global.css + design tokens as ZIP
```

### The UX Philosophy: Chat-First, Zero Forms

No dropdowns. No "select page type" wizards. One chat box.

```
User types: "build me a landing page for my dev tool startup"
     → Intent detected: GENERATE_NEW_PAGE, pageType: landing

User types: "stripe.com/pricing, redesign it"
     → Intent detected: REDESIGN_FROM_URL, url: stripe.com/pricing

User types: "make the hero headline bigger and bolder"
     → Intent detected: EDIT_SECTION, target: hero, change: typography
```

Voice input supported — Web Speech API (native browser, no library, no cost).

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│            Next.js 16 Frontend (Vercel)             │
│         TypeScript + Tailwind v4 + Shadcn/ui        │
│         Plus Jakarta Sans + Geist + Geist Mono      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS REST + WebSocket
┌──────────────────────▼──────────────────────────────┐
│         Node.js + Express — API Gateway             │
│                  (AWS EC2, Docker)                  │
│                                                     │
│  • Auth verification (NextAuth JWT)                 │
│  • Rate limiting (subscription tier enforcement)    │
│  • Request routing to Python AI service             │
│  • WebSocket server (real-time generation updates)  │
│  • Stripe webhook handling (future)                 │
└──────────────────────┬──────────────────────────────┘
                       │ Internal HTTP (Docker network)
┌──────────────────────▼──────────────────────────────┐
│         Python FastAPI — AI Service                 │
│                  (AWS EC2, Docker)                  │
│                                                     │
│  • LangGraph stateful agent orchestration           │
│  • LangChain RAG pipeline                           │
│  • Gemini API calls (LLM + image generation)        │
│  • Playwright scraping (public + protected pages)   │
│  • Vector DB operations (Pinecone)                  │
│  • Name verification pipeline                       │
│  • Logo color extraction (Pillow)                   │
└────────┬──────────────────┬────────────────┬────────┘
         │                  │                │
   MongoDB Atlas       Upstash Redis     Pinecone
  (user data,         (session state,   (design pattern
   designs,            rate limits,      knowledge base
   history)            LangGraph         for RAG)
                        checkpoints)
```

### Why Split Node.js + Python?

This is the most important architectural decision in the project.

**Node.js handles I/O-bound work** — auth middleware, WebSocket connections,
routing, Stripe webhooks. Its non-blocking event loop handles thousands of
concurrent connections efficiently. This is what Node.js was designed for.

**Python handles AI-bound work** — LangChain, LangGraph, Pinecone, Pillow,
Playwright. Every serious AI library was written in Python first. The JavaScript
LangChain SDK lags behind the Python SDK in features — LangMem (long-term
agent memory), Semantic Text Splitter, and LangGraph Studio all require Python.
Forcing AI work into Node.js means HTTP wrappers adding latency on every call.

Splitting by responsibility also means each service scales independently.
If AI generation becomes the bottleneck, we scale only the Python service.

---

## Complete Technology Stack

### Why Each Tool Was Chosen

#### Frontend

| Technology | Version | Why This, Not The Alternative |
|---|---|---|
| **Next.js** | 16.2.1 | App Router SSR for landing page SEO. Vercel deploy is zero-config. 16.2 ships "Agent-ready" features specifically for AI tools. Vite 8 is faster to build but no SSR = poor Lighthouse score on public pages |
| **TypeScript** | 5.x | Shared types between frontend and Node.js API Gateway. Catches data shape mismatches between API response and UI before runtime |
| **Tailwind CSS** | v4 (CSS-first) | v4 eliminates tailwind.config.ts — all configuration in globals.css. No build step for config changes |
| **Shadcn/ui** | Latest | Components live in your codebase, not in node_modules. No version lock-in. Fully accessible. Dark theme native |
| **Plus Jakarta Sans** | Google Fonts | Display font for headlines — matches premium dev tool aesthetic (Linear, Vercel, Raycast all use similar). Pairs with Geist for body text |
| **Geist Sans + Mono** | Vercel | Vercel's own font. Geist Mono for displaying generated React/CSS code output |
| **Zustand** | Latest | Design session state shared across editor components. Redux is overkill. Context API re-renders every consumer. Zustand gives surgical re-renders, no boilerplate |
| **Vercel AI SDK** | Latest | `useChat` hook handles streaming, message history, and loading states. Works with any backend — just points to our Node.js endpoint |

#### Backend — API Gateway

| Technology | Version | Why This, Not The Alternative |
|---|---|---|
| **Node.js + Express** | 20 LTS | Massive middleware ecosystem. `passport.js`, `express-rate-limit`, `multer` all battle-tested. Fastify is faster in benchmarks but ecosystem gap matters at MVP stage |
| **NextAuth.js** | v5 | Native Next.js auth. Google OAuth in 20 lines. JWT session tokens. No external auth service cost |
| **ws** (WebSocket) | Native | Real-time generation progress pushed to frontend. Native Node.js `ws` library — no Socket.io overhead for a simple unidirectional stream |

#### Backend — AI Service

| Technology | Version | Why This, Not The Alternative |
|---|---|---|
| **Python** | 3.12 | LangChain, LangGraph, Pillow, Playwright — all Python-native. The JavaScript LangChain SDK lacks LangMem, Semantic Splitter, and LangGraph Studio. Python is non-negotiable for the AI layer |
| **FastAPI** | Latest | Built on Pydantic + ASGI (Starlette). Native async/await — a blocking LLM call does not freeze the server (Flask's fatal flaw). Auto-generates OpenAPI docs at /docs. Request/response validation built-in |
| **LangChain** | v1.0 | The backbone of every AI pipeline step. `WebBaseLoader` scrapes URLs in one line. `createRetrievalChain` builds RAG in 5 lines. `ChatGoogleGenerativeAI` wraps Gemini with automatic retry and streaming. Swapping models is one line |
| **LangGraph** | v1.0 | For multi-step AI workflows with decisions, loops, and human pauses. The section generation flow is NOT linear — it has conditional edges (valid JSX?), retry loops (user rejected), and `interrupt()` calls waiting for human approval. LangChain handles single steps; LangGraph handles the flow between steps |
| **Playwright** | Latest | Headless browser for scraping JS-rendered sites. `getComputedStyle()` extracts actual applied CSS, not just inline styles. Handles protected page login via credential injection. Auto-detects and clicks interactive elements (modals, multi-step forms) |
| **Pillow** | Python | Extracts dominant hex colors from generated/uploaded logos. Used to automatically create the brand color palette from visual input |
| **Gemini 2.5 Flash** | Free tier | Primary LLM — 500 req/day free, 1M token context window. Multimodal: reads screenshots AND HTML simultaneously. 1M context fits an entire scraped website in one prompt |
| **Gemini 2.5 Pro** | Free tier | Complex generation — full page design, design system compilation. 100 req/day free. Used sparingly for high-complexity tasks |
| **Gemini Imagen** | Free tier | Logo generation from text description. Same API key, same SDK — zero additional integration cost |

#### Data + Infrastructure

| Technology | Use Case | Why Free Tier Is Sufficient | Cost |
|---|---|---|---|
| **MongoDB Atlas** | User data, saved designs, brand profiles, generation history | 512MB free tier. A design project averages 50KB. That is 10,000 complete projects before needing to upgrade | Free forever |
| **Upstash Redis** | LangGraph session checkpoints, token cache, rate limit counters | 10K req/day free. Redis writes at ~0.1ms vs MongoDB's ~5-10ms — critical for LangGraph's per-node state saves. Same URL scraped twice returns cached tokens: zero LLM calls | Free forever |
| **Pinecone** | Vector DB for RAG design patterns | 100K vectors, 1 index, forever free. Stores component pattern embeddings so generation is grounded in real design patterns, not LLM hallucination | Free forever |
| **AWS EC2 t3.micro** | Both Node.js + Python run on ONE instance via Docker Compose | 750 hours/month free for 12 months. Two instances = 1440 hours = you pay. One instance with Docker Compose = 720 hours = free. Nginx routes traffic to correct service | Free (12 months) |
| **Vercel** | Next.js frontend | Purpose-built for Next.js (same company). Global CDN, auto SSL, preview deploys on every PR. Free forever for personal projects | Free forever |
| **GitHub Actions** | CI/CD pipeline | On every push to main: lint → build → Docker push → SSH deploy to EC2. Free for public repos. Eliminates 15 minutes of manual SSH deployment per change | Free |
| **Docker Compose** | Local dev + production | Same docker-compose.yml runs locally and on EC2. Eliminates "works on my machine" entirely. Node.js, Python, Nginx all containerized | Free |

#### Free APIs (Zero Cost, No Credit Card)

| Feature | API | Why This Specifically |
|---|---|---|
| **US Trademark check** | Markbase API | No API key required. 30 req/min. Indexes 14M+ US trademarks updated daily. Returns active/dead status |
| **EU Trademark check** | EUIPO Open Data API | Official EU trademark office API. Free, no key. Covers all 27 EU member states |
| **Domain availability** | RDAP Protocol | Public internet standard (replaces WHOIS). 404 = domain not registered = available. Completely free forever, no rate limits. Used by all major registrars internally |
| **Web presence check** | Google Custom Search API | 100 queries/day free. Checks if a name has existing web presence before suggesting it to users |
| **Voice input** | Web Speech API | Native browser API. No library, no backend call, no cost. Transcript fills chat box for user review before sending |

---

## Key Engineering Decisions

### 1. Three-Layer Memory Architecture

LangGraph requires three different types of memory for different purposes:

```
Layer 1 — Short-term (Redis)
  What: Active session state, current design tokens, generated sections
  Why Redis: ~0.1ms write latency. LangGraph writes state after every node.
  At 15 nodes per session × 5ms MongoDB latency = 75ms wasted per generation
  Key pattern: langgraph:session:{userId} | TTL: 24 hours

Layer 2 — Long-term (MongoDB)
  What: User style preferences, past approved designs, brand profiles
  Why MongoDB: Durable, queryable, flexible schema for varied design data
  Key pattern: users/{userId}/preferences

Layer 3 — Knowledge Base (Pinecone)
  What: Component pattern embeddings for RAG
  Why Pinecone: Purpose-built for vector similarity search.
  Faster than pgvector for ANN search at this scale
```

### 2. Parallel Async Verification (Why It Matters)

Name verification runs 4 checks against 40 candidates = 160 API calls.

```python
# Sequential: 40 names × 4 checks × 0.2s each = 32 seconds ← unusable UX
# Parallel: all 160 calls simultaneously = ~2 seconds ← feels instant

results = await asyncio.gather(*[
    verify_name(name) for name in generated_names
])

async def verify_name(name):
    trademark, domain_com, domain_io, web = await asyncio.gather(
        check_trademark_us(name),
        check_domain(name + ".com"),
        check_domain(name + ".io"),
        check_web_presence(name)
    )
    return { "name": name, "clean": not trademark and domain_com and not web }
```

This is not a micro-optimisation. It is the difference between a 32-second wait
and a 2-second wait — the difference between a user staying and leaving.

### 3. Credential Security for Protected Pages

When users provide login credentials to scrape protected pages:

```python
async def scrape_protected(url: str, creds: CredentialInput):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        await page.fill("#username", creds.username)  # in-memory only
        await page.fill("#password", creds.password)  # in-memory only
        await page.click("[type=submit]")
        await page.wait_for_load_state("networkidle")
        content = await page.content()
        screenshot = await page.screenshot(full_page=True)
        await browser.close()

    del creds  # immediately destroyed — never written to DB or logs
    return content, screenshot
```

Credentials exist only in process memory for the duration of the Playwright
session. They are never written to a database, log file, or environment variable.
This is clearly disclosed in the Terms of Service.

### 4. The Adapter Pattern for Schema Export (Future-Proof)

Every export target is a plugin. Adding a new one never touches existing code:

```typescript
interface ExportAdapter {
  name: string
  export(schema: SchemaDefinition): string
}

// Registry — adding Prisma later = one line here, zero other changes
export const EXPORT_ADAPTERS: ExportAdapter[] = [
  MongoDBAdapter,
  PostgreSQLAdapter,
  SupabaseAdapter,
  // PrismaAdapter  ← future: just add here
]
```

### 5. Section-Isolated Editing

The inline chat editor passes ONLY the current section to the LLM:

```python
# Full generation: entire page context
state = { "mode": "generate", "allSections": [], "tokens": brand_tokens }

# Section edit: only the selected section
state = {
  "mode": "edit",
  "currentSection": hero_component_code,  # only this section
  "command": "make headline bigger",
  "tokens": brand_tokens
  # full page NOT in context — saves tokens, prevents unwanted changes
}
```

Gemini 2.5 Flash at 500 req/day free means every unnecessary token call
matters during development. Section isolation reduces average token usage
per edit by ~85%.

---

## Project Phases

### Phase 1 — Frontend Foundation (Current)

**Goal:** Complete, polished, demo-ready UI with mock data.  
A recruiter clicking the live link should see a real product, not a skeleton.

**What is being built:**
- Next.js 16 project setup with Tailwind v4 + Shadcn/ui dark theme
- Custom font system: Plus Jakarta Sans (display) + Geist Sans (body) + Geist Mono (code)
- Landing page: 12 sections combining Halo template (stats, reviews, footer)  
  and Taif template (hero, how it works, pricing, FAQ) as visual references
- Dashboard layout: sidebar + brand/design section separation
- Brand Identity page: name generator UI + logo picker (mock data)
- Web Designer page: chat-first interface, section preview, approve/reject bar
- Three responsive view toggle: Desktop / Tablet / Mobile
- Inline section chat editor panel
- Export modal with ZIP download progress
- All features functional with mock API responses

**Frontend decisions locked in Phase 1:**
```
Framework:    Next.js 16.2.1 (not Vite 8 — landing page needs SSR for SEO)
Styling:      Tailwind v4 CSS-first (no tailwind.config.ts)
Components:   Shadcn/ui (owned in codebase, not a dependency)
Theme:        Forced dark (forcedTheme="dark" — no system/light toggle)
Fonts:        Plus Jakarta Sans + Geist Sans + Geist Mono
State:        Zustand for design session
Chat UX:      Vercel AI SDK useChat hook (streaming, history, loading states)
Voice:        Web Speech API (native browser, zero cost)
Deploy:       Vercel (auto-deploy on push to main)
```

---

### 🔜 Phase 2 — Python AI Service (Next)

**Goal:** Build the real AI backend. Replace all mock responses with live generation.

**What will be built:**
- FastAPI project setup with async routes
- LangChain WebBaseLoader + Playwright scraper
- Gemini 2.5 Flash integration via LangChain
- Design token extractor (HTML + CSS → JSON tokens)
- Name generation + 4-layer parallel verification pipeline
- Logo generation via Gemini Imagen
- Pillow color extraction from logos
- Redis caching layer for scraped tokens
- Basic section generator (Hero + Navbar to start)

**Why Python and not Node.js for this layer:**
Python is the native language of every AI library used. LangGraph's JavaScript
SDK has open GitHub issues about production readiness. Pillow has no Node.js
equivalent for image color extraction. FastAPI's native async prevents LLM
calls from blocking the server — Flask's synchronous model would freeze on
every Gemini API call.

---

### 🔜 Phase 3 — LangGraph Agents + RAG

**Goal:** Replace simple LangChain chains with stateful LangGraph agents.  
Add human-in-the-loop approval flow. Build the RAG knowledge base.

**What will be built:**
- Full LangGraph StateGraph with all nodes and conditional edges
- `interrupt()` for section-by-section human approval
- RedisSaver checkpointer for session persistence
- MongoDB long-term memory store for user preferences
- Pinecone vector store seeded with component patterns
- RAG retrieval chain integrated into generation
- Multi-step form detection and traversal via Playwright
- Protected page credential injection

---

### 🔜 Phase 4 — Node.js API Gateway + Integration

**Goal:** Connect frontend to Python AI service via Node.js gateway.  
Full end-to-end generation working.

**What will be built:**
- Express API gateway with JWT verification middleware
- Rate limiting per subscription tier via Redis counters
- WebSocket server for real-time generation progress
- Request proxying to Python FastAPI service
- NextAuth.js Google OAuth setup
- MongoDB user schema and project storage
- Full frontend-to-backend integration
- End-to-end testing of complete generation flow

---

### 🔜 Phase 5 — DevOps: Docker + AWS EC2 + CI/CD

**Goal:** Production deployment. Zero manual work per deploy.

**What will be built:**
- Dockerfiles for Node.js and Python services
- `docker-compose.yml` running both services + Nginx on single EC2 instance
- Nginx reverse proxy config (public → Nginx → Node.js or Python)
- AWS EC2 t3.micro setup (Ubuntu 22.04, security groups, elastic IP)
- GitHub Actions workflow: lint → build → push to Docker Hub → SSH deploy to EC2
- Environment variable management via AWS Parameter Store
- Health checks and automatic container restart policies

**Why single EC2 instance for both services:**
AWS free tier gives 750 hours/month across ALL instances. Two instances running
24/7 = 1,440 hours = you pay for 690 hours. One instance with Docker Compose
= 720 hours = completely free. Both Node.js and Python idle at ~400-600MB RAM
combined — within the 1GB t3.micro limit for demo/portfolio traffic.



## What I Learned Building This

**Architecture decisions are 100x cheaper before writing code.**
Every decision in this README was made before a single feature was built —
which framework, which database, why split the backend, why Python for AI.
Changing an architectural decision at week 3 costs days. Changing it in a
README costs minutes.

**LangGraph's `interrupt()` is the correct pattern for AI tools with human review.**
Most tutorials show linear LangChain chains. Real products need the agent to
pause, show output, wait for human feedback, and resume with that feedback
in state. This is what separates a demo from a product.

**Parallel async is not an optimisation — it is a UX requirement.**
Sequential verification of 40 names takes 32 seconds. Parallel takes 2.
A user will not wait 32 seconds. They will close the tab. `asyncio.gather()`
is a product decision disguised as a technical one.

**Redis, MongoDB, and Pinecone solve three completely different problems.**
Using MongoDB for everything (including session state) would have been the
naive choice. Understanding that each data store has a specific performance
characteristic — and matching the right store to the right data — is the
difference between a system that works and one that scales.

**Forced dark theme is a product decision, not a preference.**
Both reference designs (Halo and Taif) that Deszyn's landing page is modelled
after use deep dark backgrounds. `forcedTheme="dark"` ensures every user sees
the intended design regardless of their OS settings. Consistency is a feature.

---

*Built by [Tushar Bhowal] — [https://www.linkedin.com/in/tushar-bhowal-32bb74205/]() who got tired of design being the bottleneck.*
