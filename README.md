# SPS HQ on Netlify

**Ownership**
SPS HQ is © 2026 Ethan Gallagher. All rights reserved. It is licensed to the UniSQ Student Paramedic Society for the society's own use. See `LICENSE.txt`. Keep `LICENSE.txt` and the notice at the top of `index.html` when deploying.

Static site: drop this folder onto Netlify (drag-and-drop in the Netlify dashboard, or connect it as a repo). `netlify.toml` sets the headers; nothing needs building.

Without a backend the site runs in **preview mode** with example data and nothing is shared between devices. The shared database and live SMDT dispatching need a Firebase project (the free Spark plan is plenty):

1. console.firebase.google.com → Add project.
2. Build → **Authentication** → Get started → enable **Anonymous** and **Email/Password**.
3. Authentication → **Users** → Add user: email `admin@unisqsps.com`, password `901314`. This is the one account the app signs into when an executive enters the code **901314**. (The code executives type is `EXEC_CODE` in `index.html`; the account password is `EXEC_PASSWORD` there. Keep both in step with Firebase.)
4. Build → **Firestore Database** → Create database (production mode, an Australian region).
5. Firestore → **Rules** → paste the contents of `firestore.rules` → Publish.
6. Project settings (gear) → Your apps → **Web app** (</>) → register → copy the `firebaseConfig` values into `SPS_FIREBASE` near the bottom of `index.html`.
7. Authentication → Settings → **Authorised domains** → add your Netlify domain.
8. Deploy. On the site, tap the role chip (top right) → enter **901314** → the Dispatch Control Centre appears. The gear next to "Executive" switches the device back to member mode.

Members never sign in or enter anything. Only devices in executive mode see the Dispatch Control Centre, cases and groups; the Firestore rules enforce that server-side, not just in the app.

**What differs from the claude.ai version**
- "Build case with Claude" in Import isn't available here; the PDF importer uses the basic builder (labelled lines) instead.
- Attendee lists show "Member" rather than names.

**SPS Store (merch)**
The Shop tab is open to everyone. Executives manage it from the menu → **Merch store** (orders, products, settings).
1. Firestore → **Rules** → paste the updated `firestore.rules` → Publish. The store adds the `shop`, `shopimg` and `shoporders` collections.
2. Card payments: in Stripe → **Payment Links** → New → product "SPS Store order" with **Customers choose what to pay**. Under After payment, redirect to `https://<your-site>/#shop-paid`. Paste the link into Merch store → Settings. The app adds the order reference (`client_reference_id`) and the buyer's email to the link, so each Stripe payment can be matched to an order.
3. Bank transfer: add the account name, BSB and account number (and/or PayID) in Settings. Buyers quote their order reference.
4. Orders: check the payment, then **Mark paid** (stock comes off), pack it, **Mark ready** with the locker number and code (the buyer sees it under "Your orders"), then **Email collection details**.

**Scenario Suite (Scenario Studio, ECG Studio and the OBS monitor)**
Executives and facilitators open it from the menu → **Scenario Studio** (or the script icon on a case in Scenarios).
- Each scenario is the case's script: Overview (patient, dispatch code, case colour), Case info cards (dispatch, DRABC, history, NILDOCAFIAAT, head-to-toe and the rest), Stages, Debrief and Checks.
- Stages show as a flow map. Each stage has four tabs: Scene (what the crew sees, findings, cues), Obs (drag a label sideways to nudge a value; "Change over time" drifts a vital during the stage), Monitor (a rhythm timeline: each change has a rhythm, rate, start time and ECG changes, or an ECG from ECG Studio) and Choices (where each crew decision leads).
- The OBS monitor plays a stage's timeline exactly. Stages without one still run from their written ECG line. A rhythm the facilitator picks on the iPad always wins.
- Drafts are kept on the device as you work; **Save** writes the case. Sim Night library cases become the case's own copy the first time they're saved.
- No new Firestore collections are needed.

**People and Rx stock**
- Registrations and Documentation are now one tab, **People** (menu → People). It has a People view (everyone, with their events, sign-up times, paperwork and tickets) and a Forms view (blank forms, the external waiver, uploads).
- On the run screen, **Rx** records drugs and procedures. A procedure records its option (e.g. IV access → cannula size) and the kit it used. Menu → **Rx stock** totals what to restock and shows what is used most across nights.

**Coming soon store, no Events or Learn pages**
- The top bar is Home and Shop. Upcoming events on Home open each event's page (with Register). Executives manage events from the menu → Events.
- Shop shows a Coming soon page until Merch store → **Store launched** is switched on. Executives can preview the store from that page.

Install on a phone or tablet: open the site in Safari/Chrome → Share → Add to Home Screen. The terminal then runs full screen.
