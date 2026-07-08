# VolunTree 🌳 — AI-Driven Volunteer Matching & Verification Ecosystem

VolunTree is an end-to-end platform designed to streamline non-profit operations and supercharge volunteer engagement. It resolves two of the largest issues in the non-profit sector: **inefficient skill alignment** and **manual, non-verified tracking of service hours**. 

The system leverages a FastAPI backend to run semantic skill-matching algorithms and exposes an interactive, role-based React dashboard for both volunteers and non-profit organizations (NGOs).

---

## 🏗️ Architectural Framework & Data Flow

[ Volunteer Client ]          [ NGO Management Client ]
         │                                │
         ▼                                ▼
┌──────────────────────────────────────────────────────────────┐
│                  React 19 / Vite UI Layer                    │
│             (Context Auth, Axios API Client)                 │
└──────────────────────────────┬───────────────────────────────┘
│ HTTP REST Requests
▼
┌──────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Router                    │
│      (OAuth2 Bearer Tokens, CryptContext Passwords)          │
└──────────────────────────────┬───────────────────────────────┘
│ SQLAlchemy ORM Engine
▼
┌──────────────────────────────────────────────────────────────┐
│                SQLite 3 Database Ledger                      │
│     (Cascading Foreign Keys, Micro-Credential Indexes)       │
└──────────────────────────────────────────────────────────────┘


### End-to-End Feature Execution Loop
1. **Syndication:** An authorized NGO account posts a community initiative with explicit required target skills.
2. **AI Matching:** The backend evaluates the delta between the volunteer’s explicit interest parameters and the posting tags to calculate a match index. Highly matched options display a distinctive badge on the frontend explorer.
3. **Application Lifecycle:** A volunteer submits an application. The application state updates dynamically in the database via cross-entity relational references (`Pending` → `Accepted`).
4. **Hour Verification & Minting:** Upon task completion, the NGO interacts with a verification portal. Submitting service metrics updates hours globally and mints a micro-credential tracking receipt complete with an isolated validation token.

---

## 🛠️ Tech Stack & Key Framework Configurations

### Backend (Python Core)
* **FastAPI:** Clean high-performance asynchronous application router layer.
* **SQLAlchemy ORM:** Relational entity modeling mapping data classes dynamically to storage tables.
* **Passlib [Bcrypt]:** Cryptographic context framework hashing passwords safely before table storage.
* **Python-Jose:** Full JSON Web Token (JWT) compliance to securely authorize active role-based sessions.
* **Pydantic & Pydantic-Settings:** Data integrity schemas handling structural payload validation and system environment management.

### Frontend (Modern Javascript Stack)
* **React 19 Core & Vite Build System:** Hot-Module Replacement (HMR) runtime for fast, performant UI updates.
* **Tailwind CSS Framework:** Clean layout configurations utilizing utility styling architectures.
* **Lucide React:** Scalable vector asset icons integrated across active dashboard navigations.
* **Axios API Core:** Specialized central instance mapping security tokens directly inside out-bound request headers.

---

## 📂 System File Tree Layout (Verified Real-Time Structure)

```text
voluntree/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── applications.py # Handles individual program application tracking lifecycle
│   │   │   ├── auth.py         # Sign-up, login token exchange, and validation routines
│   │   │   ├── certificates.py # Hours verification engines and validation credentials
│   │   │   ├── deps.py         # Shared dependency injections and authorization tokens
│   │   │   ├── matching.py     # Core algorithmic tag matching engine calculations
│   │   │   ├── opportunities.py# Opportunity publishing logic handles and structures
│   │   │   └── volunteer.py    # Dedicated volunteer profiles and tracking dashboards
│   │   ├── core/
│   │   │   ├── config.py       # Security key constants and environment variables
│   │   │   ├── database.py     # SQLite engine engine connection sessions and initialization
│   │   │   └── security.py     # Password cryptography modules (Bcrypt hashes generator)
│   │   ├── models/
│   │   │   ├── application.py  # Application data class mapping configurations
│   │   │   └── models.py       # Shared database base entity schemas mapping models
│   │   ├── schemas/            # Pydantic schema engines validation blocks
│   │   │   ├── application.py  
│   │   │   ├── auth.py
│   │   │   ├── certificate.py
│   │   │   ├── opportunity.py
│   │   │   └── volunteer.py
│   │   └── main.py             # App boot management setup mapping global CORS rules
│   ├── requirements.txt        # Frozen Python backend requirement dependencies
│   ├── seed_demo.py            # Automated testing database simulation seeder script
│   └── voluntree.db            # Master operational engine relational ledger
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js       # Core Axios client instance pre-injecting security tokens
    │   ├── assets/             # Bundled system UI visual graphics
    │   ├── components/
    │   │   ├── AuthScreen.jsx  # Toggle dashboard log-in panel controls
    │   │   ├── NgoManager.jsx  # Active application lifecycle status pipelines console
    │   │   ├── VolunteerCertificates.jsx # Micro-credential card modal badge layout
    │   │   └── VolunteerExplorer.jsx     # AI listing discovery feed panel view
    │   ├── context/
    │   │   └── AuthContext.jsx # Global profile user session provider setup
    │   ├── App.css             # Main stylesheet customization classes
    │   ├── App.jsx             # Top-level routing layout core supervisor component
    │   ├── index.css           # Global app layout template overrides
    │   └── main.jsx            # Core react element mounting node mapping setup
    └── package.json            # Dev tools (Vite, Tailwind V4) deployment parameters
⚡ Step-By-Step Installation & Run Manual
Follow these sequential steps exactly to configure and boot up your local instance of VolunTree without environment friction.

📡 1. Configure and Run the Backend Environment
Open your system shell, enter the backend working space, establish an isolated virtual context, and install the verified application library bundle:

Bash
cd backend

# Initialize your local python environment wrapper
python3 -m venv venv
source venv/bin/activate

# Execute batch setup against our frozen environment manifests
pip install -r requirements.txt
Run the Testing Data Seeder
Before launching the live development server, initialize and seed your active SQLite runtime tables with pre-built dummy credentials, testing relationships, and demo records:

Bash
python3 seed_demo.py
Activate the Live FastAPI Daemon
Fire up the local Uvicorn process engine bound securely to terminal port 8000:

Bash
uvicorn app.main:app --reload --port 8000
The interactive backend API reference panel will build automatically and run live at http://127.0.0.1:8000/docs.

💻 2. Configure and Boot the Frontend User Client
Open an independent sibling shell instance or a new terminal window to spin up your client-side React UI layout stack:

Bash
cd frontend

# Download the specified node asset layers
npm install

# Activate the local Vite Hot Module Replacement builder engine
npm run dev
Your application framework window will spin up instantly. Open your browser and point it straight to http://localhost:5173 to test the environment live.

🧪 Interactive Testing & Evaluation Walkthrough
Use these pre-loaded seed accounts to safely verify every stage of VolunTree's logic loop during your live demo evaluation tracking:

Target Role	Registered Address	Pass Key	Primary Evaluation Target
NGO Administrator	demo_admin@habitat.org	hackathon2026	Create new tasks, manage applications, and log hour milestones.
Active Volunteer A	alex@test.com	hackathon2026	Review pre-loaded 10-hour verification certificates and modal cards.
New Volunteer B	sam@test.com	hackathon2026	Test general opportunity browsing, tag matching, and real-time application requests.
🔄 Step-by-Step Demo Script to Follow
Log in as Volunteer B (sam@test.com): Head to the opportunities section. Notice the custom amber-gradient banner highlighting high-relevance matches tailored to your profile tags. Click Apply on an initiative.

Switch over to the NGO Leader account (demo_admin@habitat.org): Open your Applications Pipeline workspace tab. Identify the freshly logged applicant row under Pending, then click the green checkmark icon to transition them to Accepted.

Log the Service Metrics: On that same accepted line item, click the blue Log Hours action item button. Enter a target value (e.g., 12), and submit the modal structure. The tracking lifecycle shifts immediately to Completed.

Inspect the Minted Micro-Credential Badge: Log back in as Volunteer B. Go to the newly available My Certificates console panel. Click the action button on your new row card. A beautiful modal certificate canvas renders live, displaying the verified 12 hours metric along with a secure, system-generated cryptographic hash receipt.

🛠️ Common Troubleshooting Run-book
Problem: App crashes on password login.

Resolution: Ensure passlib has bcrypt dependencies explicitly initialized. Run pip install passlib bcrypt and make sure your server environment is reloaded.

Problem: Frontend throws CORS or Network Connection failure issues.

Resolution: Check that your backend application loop is active on port 8000. Double-check app/main.py to confirm CORSMiddleware allows requests from your frontend's 5173 client origin address.

Problem: Icons fail to render properly or crash the compilation process.

Resolution: Run npm install lucide-react directly in the frontend subdirectory to ensure the complete SVG sprite registry index maps cleanly.

