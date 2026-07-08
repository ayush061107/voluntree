# VolunTree 🌳 — AI-Driven Volunteer Matching & Verification Ecosystem

VolunTree is an end-to-end platform designed to streamline non-profit operations and supercharge volunteer engagement. It resolves two of the largest issues in the non-profit sector: **inefficient skill alignment** and **manual, non-verified tracking of service hours**.

The system leverages a FastAPI backend to run semantic skill-matching algorithms and exposes an interactive, role-based React dashboard for both volunteers and non-profit organizations (NGOs).

---

## 🏗️ Architectural Framework & Data Flow

* **Frontend:** React 19 UI managing individual session authorization providers.
* **Backend:** FastAPI handling security configurations, token engines, and relationship logic routes.
* **Storage Layer:** Relational SQLite 3 file ledger running automated cascading delete keys.

---

## 📂 System File Tree Layout (Verified Real-Time Structure)

* **backend/app/api/** — Core application routers (`applications.py`, `auth.py`, `certificates.py`, `deps.py`, `matching.py`, `opportunities.py`, `volunteer.py`)
* **backend/app/core/** — Core settings configuration layers (`config.py`, `database.py`, `security.py`)
* **backend/app/models/** — Relational tracking structure classes (`application.py`, `models.py`)
* **backend/app/schemas/** — Pydantic endpoints schema parameters data validators
* **frontend/src/components/** — Custom layout dashboards views (`AuthScreen.jsx`, `NgoManager.jsx`, `VolunteerCertificates.jsx`, `VolunteerExplorer.jsx`)
* **frontend/src/context/** — Central user profile global auth tracking state (`AuthContext.jsx`)

---

## ⚡ Step-By-Step Installation & Run Manual

### Backend Spin-up
1. Navigate to backend space: `cd backend`
2. Boot virtual container environments: `python3 -m venv venv && source venv/bin/activate`
3. Synchronize package manifestations items: `pip install -r requirements.txt`
4. Seed active testing database ledger models: `python3 seed_demo.py`
5. Fire up dev process server daemon link: `uvicorn app.main:app --reload --port 8000`

### Frontend Spin-up
1. Navigate to client folder workspace: `cd frontend`
2. Download specified node core assets packages: `npm install`
3. Run local Hot Module dev compilation stream: `npm run dev`

---

## 🧪 Interactive Testing Profiles (Demo Accounts)

* **NGO Lead Account:** `demo_admin@habitat.org` | Passkey: `hackathon2026`
* **Volunteer Active A:** `alex@test.com` | Passkey: `hackathon2026`
* **Volunteer Target B:** `sam@test.com` | Passkey: `hackathon2026`

---

## 🛠️ Common Troubleshooting Run-book

* **Problem: App crashes on password login.** -> *Resolution:* Ensure passlib and bcrypt features are initialized. Run `pip install passlib bcrypt`.
* **Problem: Frontend throws network connectivity runtime failures.** -> *Resolution:* Confirm FastAPI process engine handles are actively routing traffic live on port 8000.
* **Problem: Icons fail to compile across elements frame canvas.** -> *Resolution:* Run `npm install lucide-react` manually inside your frontend workspace node path module.
