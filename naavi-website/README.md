# ⚓ Naavi Information Website

> **Official River & Lake Boat Discovery, Booking & Operations Public Portal**
> Flagship Deployment: **Varanasi (River Ganges) – 15 Continuous Zones**

---

## 📖 Overview

The **Naavi Information Website** is the official public-facing portal for the Naavi boat booking and inland waterways operations platform. Designed as an official extension of the Naavi ecosystem, it shares the exact branding, color tokens, and design language used across the **Customer App**, **Driver/Boatman App**, and **Admin Command Center**.

The website provides comprehensive details on:
- **15 Continuous Ganges River Zones** from Assi Ghat (Zone 1) to Sant Ravidas Smarak (Zone 15).
- **Verified River Fleet** (Motor Boats, Traditional Hand-Row Boats, Royal Heritage Bajras, Solar EV Eco Catamarans, and VIP Speed Patrol Craft).
- **Standardized Tariffs & Fair Fares** eliminating predatory bargaining at the ghat steps.
- **Institutional Safety Standards** (100% Life Jacket Compliance, Water Police Direct SOS Telemetry at `+91 542 2221234`, and statutory night boating curfew at 09:30 PM).
- **24/7 Physical Ghat Operations Desks** stationed at Dashashwamedh Main Ghat (Platform #2), Assi Ghat South Terminal, and Rajghat Heritage Pier.
- **Support & Inquiries** connected to backend endpoint `POST /api/support/tickets`.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript (Strict typing, no `any`)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 + Naavi Design System Custom CSS Tokens
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Typography:** *Plus Jakarta Sans* & *JetBrains Mono* (Google Fonts)

---

## 🎨 Design Tokens & Branding

The website strictly adheres to the established Naavi brand identity:

| Token | Value | Description |
|---|---|---|
| **Primary** | `#EB4D37` | Naavi Sunrise Coral |
| **Primary Hover** | `#D63D27` | Deep Terracotta Coral |
| **Primary Light** | `#FFF1EE` | Warm Dawn Tint |
| **Primary Border** | `#FFD5CE` | Warm Accent Border |
| **Accent** | `#FF7A00` | Sunset Amber |
| **Dark Base** | `#121418` | Command Center Dark Slate |
| **Background** | `#FAFAFA` | Light Clean Neutral |
| **Text Primary** | `#0F172A` | Deep River Navy |
| **Radius** | `16px – 24px` | Pill buttons & rounded cards |

All official image assets (`varanasi_sunrise_bg.jpg`, `boat_motor.jpg`, `boat_premium.jpg`, `boat_solar.jpg`, `live_boat_cruise.jpg`, `naavi_logo.png`, `boat_circle_logo.png`) are located in `public/images/`.

---

## 📁 Project Structure

```
naavi-website/
├── public/
│   ├── assets/            # Static brand assets from admin-panel
│   ├── images/            # Authentic boat, river & Varanasi photography
│   ├── favicon.svg        # Official vector favicon
│   ├── robots.txt         # Search engine crawler instructions
│   └── sitemap.xml        # Route indexing configuration
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmergencyBanner.tsx  # Top emergency hotlines strip
│   │   │   └── SEO.tsx              # Dynamic document meta & title
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Sticky nav with mobile drawer
│   │   │   ├── Footer.tsx           # Multi-column footer & contacts
│   │   │   └── Layout.tsx           # App shell with download modal
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── FeaturedServicesSection.tsx
│   │   │   ├── FleetHighlightsSection.tsx
│   │   │   ├── ZonesPreviewSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── SafetyTrustSection.tsx
│   │   │   ├── GhatDesksSection.tsx
│   │   │   └── AppDownloadSection.tsx
│   │   └── ui/
│   │       ├── Button.tsx           # Reusable styled button component
│   │       ├── Card.tsx             # Standard card component
│   │       ├── Badge.tsx            # Category & status pill badges
│   │       ├── Accordion.tsx        # Accessible FAQ accordion
│   │       └── Modal.tsx            # App download & QR dialog
│   ├── config/
│   │   └── siteConfig.ts            # Brand, contact, store links & API config
│   ├── data/
│   │   ├── servicesData.ts          # Curated boat services catalog
│   │   ├── fleetData.ts             # Vessel fleet master data
│   │   ├── zonesData.ts             # 15 Varanasi zones & GPS piers
│   │   ├── safetyData.ts            # Protocols & passenger guidelines
│   │   ├── faqData.ts               # Categorized FAQ questions & answers
│   │   └── legalData.ts             # Terms of Service & Privacy Policy
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── ZonesPage.tsx
│   │   ├── FleetPage.tsx
│   │   ├── SafetyPage.tsx
│   │   ├── FaqPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── TermsPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/
│   │   └── index.ts                 # Strict TypeScript interface contracts
│   ├── utils/
│   │   └── api.ts                   # Backend support API client with fallback
│   ├── App.tsx                      # Route declarations
│   ├── index.css                    # Tailwind v4 setup & typography
│   └── main.tsx                     # React entrypoint
├── index.html                       # Semantic HTML with SEO & OpenGraph tags
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Running the Project

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Install Dependencies
```powershell
cd naavi-website
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```
The development server will launch at:
👉 **`http://localhost:5173`** (or the next available port).

### 4. Verify TypeScript Types
```powershell
npx tsc --noEmit
```

### 5. Build for Production
```powershell
npm run build
```

### 6. Preview Production Build
```powershell
npm run preview
```

---

## 🔗 Backend Integration Points

The website integrates seamlessly with the existing Naavi Node.js backend (`backend/`):

- **Support Ticket Submission:** `POST /api/support/tickets`
  - Submits inquiry details from the Contact Page.
  - Automatically receives a verified ticket code (e.g. `TKT-VAR-xxxxx`).
  - Includes client-side timeout and offline fallback when the local backend server is not running.
- **Helpline Information:** `GET /api/support/helpline-info`
- **Master Data:** `GET /api/master/zones` & `GET /api/master/boarding-points`

To configure a custom backend URL, create a `.env` file inside `naavi-website/`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Store Links & Pilot Notice

As noted in the platform configuration (`src/config/siteConfig.ts`):
- **Android:** Currently in Pilot Testing with registered Varanasi boatmen and passengers. Public Google Play listing link can be activated in `siteConfig.ts`.
- **iOS:** TestFlight in progress; scheduled for public App Store release in next milestone.
