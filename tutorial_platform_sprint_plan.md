# 7-Day Tutorial Platform Sprint — Implementation Plan

> **Stack:** Next.js 15+ · TypeScript · Tailwind CSS · Google Stitch · GitHub · Vercel · Google Antigravity (MCP)
> **Review this plan before any code is written. Approve each phase gate before proceeding.**

---

## CONCEPTUAL FOUNDATION (Pre-Work)

### 1. System Instructions vs. Runtime Guardrails

| Dimension | System Instructions | Runtime Guardrails |
|---|---|---|
| **What it is** | The agent's *identity contract* — defines role, capabilities, output format, and behavioral rules baked in at session start. | Dynamic enforcement rules applied *during* execution — they intercept, evaluate, and optionally halt agent actions in real time. |
| **When it runs** | Once, at the beginning of every session (the system prompt). | Continuously, on every agent action or tool call. |
| **Written by** | You, the architect — as structured prompts in a config file (e.g., `agents/builder.system.md`). | You + tooling — as rule sets in CI hooks, middleware, or MCP policy layers. |
| **Example** | *"You are [Agent 1: The Builder]. You MUST use Next.js App Router. You MUST NOT use `getServerSideProps` or any Pages Router API."* | A hook that scans every code diff and blocks the PR if it detects `getServerSideProps`, `useEffect` for data fetching without Suspense, or `any` TypeScript types. |
| **Analogy** | The employee's job description and company handbook. | The compliance officer watching every email and flagging policy violations. |
| **Failure mode if missing** | Agent drifts in role, uses wrong APIs, produces inconsistent output. | No enforcement — agent may *know* the rules but still violate them under pressure/context drift. |

**Key Principle:** System Instructions define *intent*. Runtime Guardrails enforce *compliance*. You need both.

---

### 2. Git Branching Strategy — Commands to Run on Day 1

#### Branch Architecture
```
main          ← Production only. Protected. No direct pushes.
  └── release-candidate  ← Staging. Created from develop on Day 6.
        └── develop       ← Integration branch. All feature PRs target here.
              ├── feature/scaffolding   (Day 1)
              ├── feature/ui-system     (Day 2)
              ├── feature/mdx-pipeline  (Day 3)
              ├── feature/search-pipeline (Day 5)
              └── ...
```

#### Step-by-Step Commands

```bash
# STEP 1 — Initialize the repo locally
cd c:\Tutorials
git init
git add .
git commit -m "chore: initial commit"

# STEP 2 — Create remote on GitHub (via gh CLI or GitHub UI first)
git remote add origin https://github.com/YOUR_ORG/tutorial-platform.git

# STEP 3 — Push main and lock it
git push -u origin main

# STEP 4 — Create develop branch from main
git checkout -b develop
git push -u origin develop

# STEP 5 — Create the first feature branch
git checkout -b feature/scaffolding
git push -u origin feature/scaffolding
```

#### Branch Protection Rules (Set in GitHub UI: Settings → Branches)

**For `main`:**
- ✅ Require pull request before merging
- ✅ Require 1 approving review (you = the architect)
- ✅ Require status checks to pass (Vercel preview build)
- ✅ Restrict direct pushes — only `release-candidate` can merge in
- ✅ Do not allow bypassing the above settings

**For `develop`:**
- ✅ Require pull request before merging
- ✅ Require status checks to pass (TypeScript compile, ESLint)
- ✅ No force pushes

---

## PHASE 1 — PRINCIPAL ARCHITECTURE & REPO SCAFFOLDING (Day 1 · Friday)

### Objectives
- Initialize Next.js 15 with App Router, TypeScript, Tailwind CSS
- Establish folder architecture (`/app`, `/tutorials`, `/dashboard`)
- Write the formal System Instructions for [Agent 1: The Builder]
- Establish the GitHub repo with protected branches

### Agent in Play
**[Agent 1: The Builder]** — Scaffolding mode

### System Instructions for Agent 1 (save as `agents/builder.system.md`)

```markdown
# Agent 1: The Builder — System Instructions v1.0

## Identity
You are The Builder, a senior Next.js engineer on the Tutorial Platform team.
Your decisions must be architecturally sound, performant, and production-ready.

## Technology Contract (NON-NEGOTIABLE)
- Framework: Next.js 15+ with App Router ONLY
- Language: TypeScript — strict mode enabled, zero `any` types allowed
- Styling: Tailwind CSS v3+ with custom design tokens from Google Stitch
- Rendering: Server Components by default; Client Components only when interaction requires it
- State: React Server Components + URL state (nuqs) for server; Zustand only for complex client state

## Prohibited Patterns (INSTANT STOP)
- NEVER use `getServerSideProps`, `getStaticProps`, or any Pages Router API
- NEVER use `useEffect` for data fetching — use Server Components or React Query
- NEVER commit to `main` or `develop` directly
- NEVER use TypeScript `any` — use `unknown` with type guards instead
- NEVER use inline styles — all styling via Tailwind utility classes or CSS Modules

## Output Format
- All code changes → granular commits with Conventional Commits format
- Commit format: `type(scope): description` (e.g., `feat(layout): add root layout shell`)
- One logical change per commit
- PR description must include: What changed, Why, Screenshots (if UI), How to test

## Behavioral Rules
- Ask for clarification before deleting files
- Always run `tsc --noEmit` mentally before claiming TypeScript is valid
- Prefer composition over inheritance
- Prefer React Server Components over Client Components (ratio target: 80/20)
```

### Code Deliverables

#### Folder Structure
```
c:\Tutorials\
├── app/
│   ├── layout.tsx          ← Root layout (fonts, theme provider)
│   ├── page.tsx            ← Home / tutorial grid landing
│   ├── tutorials/
│   │   ├── layout.tsx      ← Tutorial section layout
│   │   ├── page.tsx        ← Tutorial listing page
│   │   └── [slug]/
│   │       └── page.tsx    ← Individual tutorial page (dynamic)
│   └── dashboard/
│       ├── layout.tsx      ← Dashboard layout (auth-gated future)
│       └── page.tsx        ← Dashboard overview
├── components/
│   ├── ui/                 ← Atomic design tokens components
│   ├── layout/             ← Header, Footer, Nav, Sidebar
│   └── tutorials/          ← TutorialCard, TutorialGrid, etc.
├── lib/
│   ├── mdx.ts              ← MDX processing utilities
│   └── utils.ts            ← Shared helpers
├── content/
│   └── tutorials/          ← MDX source files
├── public/
├── agents/
│   ├── builder.system.md
│   ├── reviewer.system.md  ← Created Day 4
│   └── release-manager.system.md ← Created Day 6
├── .github/
│   └── workflows/          ← CI/CD pipeline YAMLs
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

#### Next.js Init Command
```bash
npx -y create-next-app@latest ./ \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-eslint
```

Then add ESLint + Prettier manually with strict config.

### Runtime Guardrail — Day 1 ESLint Config
```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/strict"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-restricted-imports": ["error", {
      "patterns": ["pages/*", "../pages/*"]
    }]
  }
}
```

### CI Pipeline — `.github/workflows/ci.yml`
```yaml
name: CI
on: [pull_request]
jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
```

### Phase 1 Exit Criteria
- [ ] `npx create-next-app` runs cleanly
- [ ] `npm run dev` serves on localhost:3000
- [ ] `tsc --noEmit` exits with 0 errors
- [ ] `feature/scaffolding` branch pushed to GitHub
- [ ] PR opened targeting `develop` (not `main`)
- [ ] Branch protection rules active on `main`

---

## PHASE 2 — AUTONOMOUS UI & STITCH TOKEN INTEGRATION (Day 2 · Saturday)

### Objectives
- Integrate Google Stitch design tokens into Tailwind config
- Build responsive layouts for web and mobile viewports
- Implement dark/light theme switching
- All work on `feature/ui-system` branch — autonomous agent execution

### Agent in Play
**[Agent 1: The Builder]** — Autonomous "vibe coding" mode

### AI Architecture Concept: "Vibe Coding" vs Micromanagement

**Micromanagement prompt (BAD):**
> "Create a CSS variable called `--color-primary` with hex value `#1A73E8`..."

**Vibe coding prompt (GOOD):**
> "Using Google Stitch Material You tokens, establish a brand-aware color system for the Tutorial Platform. The platform should feel modern, educational, and trustworthy — think Google Developer documentation aesthetics. Implement the full token set in Tailwind with semantic naming (e.g., `surface`, `on-surface`, `primary`, `on-primary`). Auto-generate dark mode variants using CSS custom properties."

The agent translates *design intent* to implementation. You validate the visual output, not the specific hex values.

### Google Stitch Token Integration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--md-sys-color-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--md-sys-color-on-primary) / <alpha-value>)',
        surface: 'rgb(var(--md-sys-color-surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--md-sys-color-on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--md-sys-color-surface-variant) / <alpha-value>)',
        secondary: 'rgb(var(--md-sys-color-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--md-sys-color-tertiary) / <alpha-value>)',
        error: 'rgb(var(--md-sys-color-error) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        'md-xs': '4px', 'md-sm': '8px', 'md-md': '12px',
        'md-lg': '16px', 'md-xl': '28px',
      }
    }
  }
}
export default config
```

### Autonomous Agent Commit Pattern (Day 2)
```
feat(tokens): add Material You CSS custom properties for light theme
feat(tokens): add dark mode token overrides via .dark class
feat(layout): implement responsive root layout with header/footer
feat(nav): add mobile drawer navigation with hamburger toggle
feat(typography): apply Inter font with Stitch type scale
feat(theme): wire ThemeToggle component to next-themes provider
```

### Phase 2 Exit Criteria
- [ ] Stitch tokens visible in Tailwind IntelliSense
- [ ] Dark/light toggle works without FOUC
- [ ] Mobile drawer opens/closes smoothly (< 300ms animation)
- [ ] No hydration errors in browser console
- [ ] `feature/ui-system` pushed and ready for PR

---

## PHASE 3 — AUTONOMOUS MDX CONTENT PIPELINE & MCP (Day 3 · Sunday)

### Objectives
- Build an MDX-based content delivery engine for tutorials
- Configure MCP to connect Agent 1 to local content folders securely
- Mobile-optimized reading experience with responsive code blocks
- Create the weekend summary PR from feature branches into `develop`

### Agent in Play
**[Agent 1: The Builder]** — MDX pipeline + MCP configuration mode

### AI Architecture Concept: MCP (Model Context Protocol)

MCP is an open protocol that allows agents to securely read from and write to external data sources without embedding that data directly into the context window.

```
[Agent 1: The Builder]
       │
       ▼ MCP Tool Call: read_file(path)
[MCP Server: Local Filesystem]
       │
       ▼ Returns file contents
[Agent 1 processes MDX, generates components]
```

**MCP Config File** (`mcp.config.json`):
```json
{
  "servers": {
    "content-filesystem": {
      "type": "filesystem",
      "allowed_paths": ["c:/Tutorials/content/tutorials"],
      "permissions": ["read"],
      "description": "Tutorial MDX content source — read-only"
    }
  },
  "policies": {
    "max_file_size_kb": 500,
    "allowed_extensions": [".mdx", ".md"],
    "block_patterns": ["*.env*", "*.key", "*.secret"]
  }
}
```

**Security Principle:** MCP enforces *least privilege*. The agent can only read `.mdx` files — it cannot access `.env` files, API keys, or write to the filesystem.

### MDX Pipeline Architecture

```typescript
// lib/mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc'
import { readFile, readdir } from 'fs/promises'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/tutorials')

export interface TutorialFrontmatter {
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  publishedAt: string
  estimatedMinutes: number
}

export async function getTutorial(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  const source = await readFile(filePath, 'utf8')
  const { content, frontmatter } = await compileMDX<TutorialFrontmatter>({
    source,
    options: { parseFrontmatter: true }
  })
  return { content, frontmatter, slug }
}

export async function getAllTutorials() {
  const files = await readdir(CONTENT_DIR)
  const slugs = files.filter(f => f.endsWith('.mdx')).map(f => f.replace('.mdx', ''))
  return Promise.all(slugs.map(getTutorial))
}
```

### Phase 3 Exit Criteria
- [ ] `content/tutorials/getting-started.mdx` renders at `/tutorials/getting-started`
- [ ] Code blocks have syntax highlighting + horizontal scroll on mobile
- [ ] MCP config blocks access to files outside `content/tutorials/`
- [ ] Weekend PR created targeting `develop`

---

## PHASE 4 — THE REVIEWER AGENT & GUARDRAIL ENFORCEMENT (Day 4 · Monday)

### Objectives
- Spin up [Agent 2: The Code Reviewer]
- Audit weekend PRs for hydration errors, responsive flaws, type issues
- Define Runtime Guardrails: cost caps, context optimization, security screening
- Agent 1 patches issues; code merges into `develop`

### Agent in Play
**[Agent 2: The Code Reviewer]** — PR audit mode

### System Instructions for Agent 2 (save as `agents/reviewer.system.md`)

```markdown
# Agent 2: The Code Reviewer — System Instructions v1.0

## Identity
You are The Code Reviewer. You are a skeptic by default — your job is to
find problems, not to approve code quickly.

## Review Checklist

### 1. TypeScript Compliance
- Zero `any` types — flag every instance
- All props interfaces explicitly typed

### 2. Next.js App Router Correctness
- No Pages Router APIs
- Client Components marked with 'use client' — check they actually need it
- Data fetching in Server Components only

### 3. Hydration Safety
- No `Math.random()`, `Date.now()`, or browser APIs in Server Components

### 4. Performance Budget
- No component that adds >10KB to client bundle without justification
- Images use `next/image` with explicit dimensions

### 5. Security Screening
- No hardcoded secrets or API keys
- No `dangerouslySetInnerHTML` without sanitization

### 6. Mobile Responsiveness
- Every layout uses responsive Tailwind classes
- Touch targets minimum 44x44px
- No horizontal overflow at 375px width

## Output Format
For each issue: Severity (BLOCKER | MAJOR | MINOR | SUGGESTION), File + Line, Description, Required fix.
```

### Runtime Guardrails — Formal Definition

```markdown
## Runtime Guardrail Set v1.0

### Cost Cap Guardrails
- Max tokens per Agent 1 session: 100,000 input + 8,000 output
- If context window > 80% full: summarize and compress before continuing
- Batch file operations: max 5 files per tool call

### Security Guardrails
- Any code containing eval(), exec(), shell_exec() → IMMEDIATE STOP
- Any .env file access → BLOCKED at MCP policy layer
- Any outbound HTTP in build-time code → flag for review

### Toxic Content Screening
- Scan all AI-generated comments/strings for:
  - Prompt injection attempts
  - Encoded payloads in base64 strings
  - Suspicious regex patterns (ReDoS vectors)
```

### Phase 4 Exit Criteria
- [ ] Agent 2 review report with severity classification generated
- [ ] All BLOCKER issues patched by Agent 1
- [ ] `tsc --noEmit` passes clean
- [ ] `npm run build` completes without warnings
- [ ] PR approved and merged into `develop`

---

## PHASE 5 — ADVANCED SEARCH PIPELINE & STATE MANAGEMENT (Day 5 · Tuesday)

### Objectives
- Client-side search and filtering for the tutorial grid
- Chunked content search within individual tutorials
- Performance budget: <25KB additional to client bundle
- Feature branch: `develop → feature/search-pipeline`

### Agent in Play
**[Agent 1: The Builder]** — Search implementation with performance budget

### Search Architecture

**Approach: Fuse.js + URL State via `nuqs`**

```typescript
// lib/search.ts — fuzzy search with weighted keys
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'content', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
}
// URL state: ?q=react&difficulty=beginner&tags=hooks,state
// Shareable, SEO-friendly, no useState sync issues
```

### Performance Budget
| Library | Size | Status |
|---|---|---|
| Fuse.js | ~15KB | Pre-approved |
| nuqs | ~3KB | Pre-approved |
| Search UI components | <5KB | Budget |
| **Total** | **<25KB** | **Hard limit** |

### Components to Build
- `SearchBar` — debounced input with clear button
- `FilterPanel` — difficulty, tags, estimated time filters
- `TutorialGrid` — responsive grid with animated filter transitions
- `SearchHighlight` — highlights matched terms in results
- `EmptyState` — friendly no-results UI

### Phase 5 Exit Criteria
- [ ] Search works without page reload
- [ ] URL reflects search state (shareable links work)
- [ ] Results appear in <100ms for datasets up to 500 tutorials
- [ ] Bundle increase verified <25KB
- [ ] Mobile filter panel uses bottom sheet pattern

---

## PHASE 6 — CI/CD, THE RELEASE MANAGER, & PRE-FLIGHT (Day 6 · Wednesday)

### Objectives
- Achieve clean `next build` with zero warnings
- Create `release-candidate` branch from `develop`
- Spin up [Agent 3: The Release Manager]
- Validate Vercel preview deployment

### Agent in Play
**[Agent 3: The Release Manager]** — Release coordination mode

### System Instructions for Agent 3 (save as `agents/release-manager.system.md`)

```markdown
# Agent 3: The Release Manager — System Instructions v1.0

## Identity
You are The Release Manager. You own the promotion of code from develop
to release-candidate to main. You do NOT write code. You read logs,
validate checklists, and make go/no-go decisions.

## Pre-Release Checklist (ALL must be GREEN)

### Build Validation
- [ ] `npm run build` exits with code 0
- [ ] Zero TypeScript errors
- [ ] Lighthouse Performance >90, Accessibility >95 (mobile + desktop)

### Vercel Preview Validation
- [ ] Preview URL accessible, loads in <2s
- [ ] No 404s on known routes
- [ ] Dark/light theme, search, MDX tutorials all functional

### Security Checklist
- [ ] No secrets in git history
- [ ] All env vars use Vercel secrets
- [ ] CSP headers configured in next.config.ts

## Decision
All GREEN → "GO — Authorized to merge release-candidate to main."
Any RED → "NO-GO — [reason]" + create blocking issue.
```

### Vercel Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Phase 6 Exit Criteria
- [ ] `release-candidate` branch exists and clean
- [ ] Vercel preview build successful
- [ ] Agent 3 checklist 100% GREEN
- [ ] Agent 3 formal "GO" authorization issued

---

## PHASE 7 — PRODUCTION DEPLOYMENT & PLATFORM HANDOFF (Day 7 · Thursday)

### Objectives
- Merge `release-candidate` into `main` → Vercel production deploy
- Browser validation on Desktop and Mobile via Antigravity
- Generate the multi-agent operations manual in `README.md`

### Production Merge Commands
```bash
git checkout main
git merge --no-ff release-candidate -m "release: v1.0.0 Tutorial Platform"
git tag -a v1.0.0 -m "Tutorial Platform v1.0.0 — 7-day sprint complete"
git push origin main --tags
```

### Browser Validation Matrix
| Route | Desktop | Mobile (375px) |
|---|---|---|
| `/` Home | ✅ | ✅ |
| `/tutorials` Grid | ✅ | ✅ |
| `/tutorials/[slug]` | ✅ | ✅ |
| `/dashboard` | ✅ | ✅ |
| Search + filters | ✅ | ✅ |
| Dark/light toggle | ✅ | ✅ |
| 404 page | ✅ | ✅ |

### README Operations Manual Outline
```markdown
# Tutorial Platform — Multi-Agent Operations Manual
## Architecture Overview
## Agent Roster (Builder, Reviewer, Release Manager)
## GitOps Workflow Diagram
## System Instructions Reference
## Runtime Guardrails Reference
## MCP Configuration Guide
## CI/CD Pipeline Reference
## Runbook: Adding a New Tutorial
## Runbook: Hotfix Process
## Performance Budgets & Security Policies
```

### Phase 7 Exit Criteria
- [ ] Production URL live and accessible
- [ ] All 14 browser validation tests pass (7 routes × 2 viewports)
- [ ] `v1.0.0` git tag pushed
- [ ] `README.md` operations manual complete
- [ ] All feature branches cleaned up

---

## SPRINT SUMMARY

| Day | Phase | Agent | Branch | Gate |
|---|---|---|---|---|
| Fri | 1 · Scaffolding | Builder | `feature/scaffolding` | PR → develop |
| Sat | 2 · UI System | Builder (auto) | `feature/ui-system` | Atomic commits |
| Sun | 3 · MDX + MCP | Builder (auto) | `feature/mdx-pipeline` | Weekend PR |
| Mon | 4 · Review | Reviewer | — | Patch & merge develop |
| Tue | 5 · Search | Builder | `feature/search-pipeline` | PR → develop |
| Wed | 6 · Release Prep | Release Mgr | `release-candidate` | GO auth |
| Thu | 7 · Production | All three | `main` | Live URL ✅ |

---

> **Next Step:** Reply **"Proceed with Phase 1"** when ready to begin actual implementation.
