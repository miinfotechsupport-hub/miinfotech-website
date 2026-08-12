# MIINFOTECH — Onsite IT Infrastructure & Security Solutions in Hassan, Karnataka

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Supported-3ECF8E.svg)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**MIINFOTECH** is a high-performance, SEO-optimized, and GEO-enhanced web application for Onsite IT Infrastructure, Laptop/Computer Repairs, CCTV Camera Installation, Networking, and AMC Services based in **Hassan, Karnataka, India**.

Founded and managed by **Mohammed Ishtiaqh**, MIINFOTECH provides doorstep technical diagnostics, quality replacement components, and high-clarity CCTV installations across Hassan, Belur, Sakleshpur, Holenarasipura, Channarayapatna, and nearby regions.

---

## 🚀 Key Features & Highlights

- ⚡ **Lightning Fast Performance**: Built on React 19 + Vite 6 with server-side rendering support for fast initial load and interactive UI.
- 🎯 **Deep Local & Technical SEO**: Comprehensive Schema.org JSON-LD structured data (`LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`, `Review`), OpenGraph tags, canonical deep links, and dynamic meta management.
- 🤖 **Structured Machine Readability**: Structured semantic markup, entity recognition, and Q&A layouts organized for search engines and generative AI search systems.
- 🛡️ **Comprehensive Security & Robustness**: Global React Error Boundary fallback, sanitized user inputs, secure Express API server proxying, and optional Supabase backend sync.
- 📱 **Mobile & Desktop Adaptive**: 100% fluid, responsive layout built with Tailwind CSS v4 and smooth Motion transitions.
- 🛠️ **Full Administrative Control**: Feature-rich built-in Admin Panel for managing services, gallery projects, blogs, testimonials, SEO meta tags, and site settings.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / Server**: Node.js, Express, tsx, esbuild
- **Database / Sync**: Supabase JS Client (with robust local fallback mode)
- **Deployment**: Compatible with Netlify, Vercel, Cloudflare Pages, and Cloud Run

---

## 📁 Project Structure

```text
├── public/
│   ├── robots.txt         # Search engine crawler instructions
│   └── sitemap.xml        # Dynamic XML sitemap for Google Search Console
├── src/
│   ├── components/        # UI components (Hero, Navbar, ServiceExplorer, AdminPanel, etc.)
│   │   └── ErrorBoundary.tsx # Global React crash boundary
│   ├── lib/               # Utility functions, Supabase client, & configuration
│   ├── App.tsx            # Root application & routing orchestrator
│   ├── index.css          # Tailwind CSS v4 imports & animation utilities
│   ├── main.tsx           # React DOM root entry with ErrorBoundary
│   └── types.ts           # Comprehensive TypeScript interfaces & static datasets
├── server.ts              # Express API server & static production asset server
├── netlify.toml           # Netlify build & rewrite configuration
├── package.json           # Dependencies & build scripts
├── tsconfig.json          # Strict TypeScript compiler options
└── vite.config.ts         # Vite bundler configuration
```

---

## 💻 Getting Started Locally

### Prerequisites

- Node.js `^20.0.0` or higher
- npm / yarn / pnpm / bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/miinfotechsupport-hub/Miinfotech-.git
   cd Miinfotech-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in optional keys:
   ```env
   SITE_URL=https://miinfotech.netlify.app
   VITE_SITE_URL=https://miinfotech.netlify.app
   GEMINI_API_KEY=
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```

This executes:
1. Vite production bundle (`vite build`) outputting static assets to `/dist`.
2. Server compilation using `esbuild` for `server.ts` to `/dist/server.cjs`.

### Netlify Deployment

The project contains a preconfigured `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Simply connect the GitHub repository to Netlify and trigger a deployment.

---

## 📞 Contact & Support

- **Business Name**: MIINFOTECH
- **Founder & Lead IT Specialist**: Mohammed Ishtiaqh
- **Location**: Hassan, Karnataka, India
- **Phone / WhatsApp**: [+91 99647 61624](https://wa.me/919964761624)
- **Website**: [https://miinfotech.netlify.app](https://miinfotech.netlify.app)

---

© 2026 MIINFOTECH. All rights reserved.
