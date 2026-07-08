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


🔐 Security Framework & Implementation Protocol
VolunTree applies rigorous state-of-the-art security patterns throughout its decoupled communication layers:

-->One-Way Password Hashing: User passwords are never saved plaintext. The server leverages a CryptContext implementation leveraging the Bcrypt algorithm with an adaptive computational work-factor salt to generate mathematically irreversible hashes.

-->OAuth2 Specification & Stateful Session Isolation: Secure routes are protected by an OAuth2PasswordBearer dependency scheme. Successful logins return a cryptographically signed JSON Web Token (JWT) using the highly secure HS256 signature profile.

-->Role-Based Access Control (RBAC): Authenticated payloads pass through role verification checks in app/api/deps.py. Only accounts with an explicitly verified role == "ngo" can mutate application states, list matching entities, or mint digital hour credentials.

🧠 Core Match Pipeline and Algorithmic Logic

VolunTree features a native matching engine within app/api/matching.py that automatically maps prospective opportunities to volunteer user spaces using tag intersections.

The Scoring Formula:
The matching calculation evaluates the direct mathematical intersection of tag groupings:

Match Index = (Number of Matching Tags) / (Total Number of Opportunity Skill Tags)

Threshold Metrics:
--> When an intersection yields a match index score of 0.50 or higher (50% or greater tag intersection), the backend tags the record payload with an active true match status.
--> The frontend React map immediately reads this true status to dynamically attach a glowing golden gradient border across the UI explorer cards.
--> This visual indicator instantly highlights high-relevance opportunities tailored perfectly to the volunteer's specialized profile preferences.

📡 Essential REST API Endpoints Route Directory

All payloads accept and output strict application JSON content shapes enforced by structural Pydantic validation layers.

🔑 Authorization Endpoints (/api/auth)
--> POST /api/auth/register -- Creates a brand new user profile document record. Accepts structural variables mapping name, unique email, role configuration, and skill list array blocks.
--> POST /api/auth/token -- Main authorization exchange router. Validates plain password strings against Bcrypt records to return a timed JWT token bearer payload string.

🌳 Opportunity Endpoints (/api/opportunities)
--> GET /api/opportunities/ -- Reads all active system wide opportunities. Automatically incorporates profile context lookups to append localized match score flags.
--> POST /api/opportunities/ -- Allows verified NGO configurations to append a brand-new service posting (Protected Root Access Required).

📝 Tracking and Applications Endpoints (/api/applications)
--> POST /api/applications/apply/{opportunity_id} -- Submits a volunteer record intent index row entry initialized to a default Pending tracking state.
--> PATCH /api/applications/{application_id}/status} -- Mutates the programmatic state workflow from Pending to Accepted (NGO Access Restricted).

🎓 Hour Credentials Endpoints (/api/certificates)
--> GET /api/certificates/my-certificates -- Returns the current volunteer user's verified historical credentials ledger.
--> POST /api/certificates/issue -- Closes the targeted applicant cycle pipeline row, modifies total completed user hours, and dynamically appends an individual credential asset line block (NGO Access Restricted).

⚡ Step-By-Step Installation and Run Manual

Follow these sequential steps exactly to configure and boot up your local instance of VolunTree without environment friction.

### 🛠️ Backend Setup

Always navigate directly to the `backend` workspace folder before installing dependencies or starting the server.

```bash
# 1. Navigate to the backend folder
cd /workspaces/voluntree/backend

# 2. Install the clean Python requirements manifest
pip install -r requirements.txt

# 3. Initialize and seed the local database state cleanly
rm -f voluntree.db
PYTHONPATH=. python3 seed_demo.py

# 4. Launch the application API server framework
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

💻 2. Configure and Boot the Frontend User Client
Open an independent sibling shell instance or a new terminal window to spin up your client-side React UI layout stack:

# 1. Navigate to the frontend folder
cd /workspaces/voluntree/frontend

# 2. Download Vite and all project UI modules
npm install

# 3. Spin up the local development interface server
npm run dev -- --host 0.0.0.0 --port 5173

🧪 Interactive Testing and Evaluation Walkthrough

Use these pre-loaded seed accounts to safely verify every stage of VolunTree's logic loop during your live demo evaluation tracking:

--> NGO Administrator Profile
Address: demo_admin@habitat.org
Pass Key: hackathon2026
Target: Create new tasks, manage applications, and log hour milestones.

--> Active Volunteer A Profile
Address: alex@test.com
Pass Key: hackathon2026
Target: Review pre-loaded 10-hour verification certificates and modal cards.

--> New Volunteer B Profile
Address: sam@test.com
Pass Key: hackathon2026
Target: Test general opportunity browsing, tag matching, and real-time application requests.

🔄 Step-by-Step Demo Script to Follow:
--> 1. Log in as Volunteer B (sam@test.com): Head to the opportunities section. Notice the custom amber-gradient banner highlighting high-relevance matches tailored to your profile tags. Click Apply on an initiative.
--> 2. Switch over to the NGO Leader account (demo_admin@habitat.org): Open your Applications Pipeline workspace tab. Identify the freshly logged applicant row under Pending, then click the green checkmark icon to transition them to Accepted.
--> 3. Log the Service Metrics: On that same accepted line item, click the blue Log Hours action item button. Enter a target value (like 12), and submit the modal structure. The tracking lifecycle shifts immediately to Completed.
--> 4. Inspect the Minted Micro-Credential Badge: Log back in as Volunteer B. Go to the newly available My Certificates console panel. Click the action button on your new row card. A beautiful modal certificate canvas renders live, displaying the verified 12 hours metric along with a secure, system-generated cryptographic hash receipt.

🛠️ Common Troubleshooting Run-book

--> Problem: App crashes on password login.
Resolution: Ensure passlib has bcrypt dependencies explicitly initialized. Run pip install passlib bcrypt and make sure your server environment is reloaded.

--> Problem: Frontend throws CORS or Network Connection failure issues.
Resolution: Check that your backend application loop is active on port 8000. Double-check app/main.py to confirm CORSMiddleware allows requests from your frontend's 5173 client origin address.

--> Problem: Icons fail to render properly or crash the compilation process.
Resolution: Run npm install lucide-react directly in the frontend subdirectory to ensure the complete SVG sprite registry index maps cleanly.

🔮 Future Development Roadmap

VolunTree is engineered to scale from a localized hackathon prototype into a robust, global volunteer networking and impact validation ecosystem. The planned expansion track covers five strategic pillars:

🤖 1. Advanced AI Alignment Core
--> Direct Chat Assistant Integration: Contextual conversational bots allowing volunteers to discover opportunities via conversational natural language.
--> Algorithmic Skill Gap Analysis: Automated profile inspection that identifies missing qualifications for high-tier NGO missions and suggests intermediate tracking pathways.
--> Predictive Talent Match Routing: Machine learning models that forecast seasonal volunteer shortages for critical non-profit operations.

🛡️ 2. Enterprise Security and Identity Layer
--> Verified Government ID Mapping: Secure, zero-knowledge passport and official identification matching protocols for sensitive care environments.
--> Distributed Anti-Fraud Inspection: Advanced consensus patterns preventing artificial inflation of service hour ledger logs.
--> Decentralized Identity (DID) Framework: Transitioning tracking credentials into standard web-native digital wallet configurations.

👥 3. Community and Social Engagement Engine
--> Peer Discussion Forums: Interactive local message boards segmenting conversations by community target sectors (e.g., climate, education).
--> Impact Story Feeds: Multimedia publishing hubs enabling users to display active, verified team milestones.
--> Mentorship Connections Hub: Dedicated tracking paths pairing high-hour veteran volunteers with newly onboarded community entrants.

📊 4. Impact Analytics and Global Metrics Ledger
--> SDG Mapping Integration: Live analytics charting project contributions directly against the United Nations Sustainable Development Goals (SDGs).
--> Regional Footprint Heatmaps: Public geospatial visualization charts revealing localized volunteer density maps and underserved areas.
--> Automated PDF Impact Generation: One-click compliance report creators helping NGOs instantly generate visual summaries for corporate grant panels.

🌐 5. Ecosystem Connectivity and Accessibility
--> One-Click Social Sharing API: Native plugins allowing volunteers to instantaneously syndicate minted credential badges directly to LinkedIn profile feeds.
--> Cross-Platform Mobile Applications: Dedicated iOS and Android client shells featuring native push notification alerts for high-priority emergency deployments.
--> Multilingual and Voice Interface: Screen-reader optimizations and local speech processing interfaces removing physical accessibility boundaries.