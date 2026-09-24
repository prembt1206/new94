# MindGuard AI — Dynamic Mental Health Monitoring & Distress Prediction System

**MindGuard AI** is an enterprise-grade, highly secure, full-stack web application tailored for victims of social atrocities, human rights abuses, and severe psychological trauma. MindGuard AI shifts clinical trauma support from **reactive** to **proactive** by continuously monitoring physiological & emotional indicators, forecasting acute distress episodes using Google Gemini predictive intelligence, protecting sensitive survivor data with Row-Level Security (RLS), and triggering automated counselor escalations before a crisis unfolds.

---

## 🌟 Key Architecture & Capabilities

1. **Trauma-Informed Survivor Experience**
   - **Full Pseudonymity:** Survivors can register and log in with anonymous aliases (`Phoenix_92`, etc.) — zero legal name requirement.
   - **Quick Exit Safety:** Prominent, instant one-click redirect to Google Weather or window closure for users in hostile or monitored environments.
   - **Dynamic Daily Check-In:** Likert scales (1-5) for Mood, Anxiety, Nocturnal Triggers/Sleep, and Somatic Guarding/Tension, alongside open-ended unstructured reflections and trauma prompt chips.

2. **AI-Powered Predictive Distress Engine (@google/genai SDK)**
   - Utilizes Google Gemini (`gemini-3.6-flash` / `gemini-2.5-flash`) configured with **low temperature (0.2)** for analytical consistency.
   - Outputs strict, validated JSON with:
     - `distressScore` (0.00 – 100.00 index)
     - `riskLevel` (`green`, `yellow`, `orange`, `red`)
     - `analysisSummary` (Empathetic yet clinical assessment)
     - `recommendedActions` (Targeted grounding and de-escalation steps)
   - Resilient clinical heuristic fallback ensures **zero downtime** during network disruptions or API rate limits.

3. **Automated Escalation & Emergency Dispatch**
   - Distress scores categorized as **Orange (56–80)** or **Red (81–100)** automatically dispatch prioritized records into the Counselor Alert Queue.
   - Immediate crisis popup connects survivors to 24/7 helplines (988, Crisis Text Line 741741, RAINN 1-800-656-4673, Trevor Project, and international lifelines).
   - Interactive Somatic Grounding: 4-4-4-4 Box Breathing visualizer and 5-4-3-2-1 Sensory Re-anchoring checklist.

4. **Clinical Intervention Portal for Mental Health Professionals**
   - Real-time patient triage queue with status tracking (`pending`, `acknowledged`, `resolved`).
   - Detailed patient timelines and longitudinal trend charts (powered by Recharts).
   - Immutable audit logging for every access to survivor psychological timelines.

5. **PostgreSQL & Row-Level Security (RLS)**
   - Production SQL migration in [`supabase/migrations/20260924_initial_schema.sql`](file:///g:/sih2/new/supabase/migrations/20260924_initial_schema.sql).
   - Enforces strict data isolation between survivors while granting licensed counselors authorized access to assigned patient profiles.

---

## 📁 Repository Structure

```
g:/sih2/new/
├── client/                     # React (Vite) Frontend
│   ├── src/
│   │   ├── components/         # Trauma-safe UI Components
│   │   │   ├── Navbar.tsx      # Header with Quick Exit & Emergency triggers
│   │   │   ├── CheckInForm.tsx # Likert sliders & Gemini AI feedback
│   │   │   ├── RiskBadge.tsx   # Dynamic color-coded risk tier badges
│   │   │   ├── TrendChart.tsx  # Recharts graphical fluctuation timeline
│   │   │   ├── CounselorQueue.tsx # Medical staff triage table
│   │   │   ├── EmergencyModal.tsx # High-priority crisis hotline modal
│   │   │   └── GroundingTool.tsx  # 4-4-4-4 Box breathing & 5-4-3-2-1 sensory reset
│   │   ├── pages/              # Application Pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── SurvivorDashboard.tsx
│   │   │   ├── CheckInPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── ResourcesPage.tsx
│   │   │   ├── CounselorDashboard.tsx
│   │   │   ├── PatientDetailsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts          # Axios API service
│   │   │   ├── authContext.tsx # Context with 1-click test accounts
│   │   │   └── supabase.ts     # Supabase client bindings
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css           # Glassmorphism & soothing theme
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/        # CheckIn, Prediction, Alert, Counselor & Auth
│   │   ├── middleware/         # JWT Auth, RBAC, Rate Limiting, Error Handling
│   │   ├── routes/             # REST API routers
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Gemini SDK service & Supabase/Local store
│   │   ├── types/              # TypeScript interfaces
│   │   └── server.ts           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 20260924_initial_schema.sql # Production PostgreSQL schema & RLS
├── package.json                # Root orchestration scripts
└── .env                        # Configured environment variables
```

---

## 🚀 Getting Started

### 1. Environment Variables Configuration
The `.env` file is pre-configured with the Gemini API key and Supabase endpoint:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://wrkpxbwmezhuwoqqyqjb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=mindguard-trauma-safe-secure-jwt-secret-key-2026
```

### 2. Running Locally

Both client and server can be launched concurrently or independently:

```bash
# Start Backend Server (runs on http://localhost:5000)
npm --prefix server run dev

# Start Frontend Client (runs on http://localhost:5173)
npm --prefix client run dev
```

### 3. Demo Accounts (1-Click Test Logins on Login Page)

| Role | Email | Password | Display Alias | Purpose |
|---|---|---|---|---|
| **Survivor** | `survivor@mindguard.org` | `demo1234` | `Phoenix_92` | Daily check-ins, distress score timeline, grounding exercises |
| **Counselor** | `counselor@mindguard.org` | `demo1234` | `Dr_Lin_TraumaLead` | Triage alert queues, patient detailed timelines, escalation management |

---

## 🔒 Security & Privacy Standard
- **Zero Raw PII Storage:** No compulsory real name, address, or phone number required to record check-in logs.
- **Rate-Limited Endpoints:** Strict Express rate limiters protect authentication and AI endpoints from DDoS or brute-force enumeration.
- **Client & Server Zod Validation:** Dual-boundary validation enforces strict sanitization before data is persisted.
- **Audit Logging:** Every view of a survivor's psychological history by a counselor produces an immutable audit record.
