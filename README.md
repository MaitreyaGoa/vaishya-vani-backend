# Vaishya Vani Connect — Backend (Phase 0)

## What's in this delivery
- Node.js + Express server skeleton
- PostgreSQL schema: `states`, `districts`, `talukas`, `users`, `roles`, `admin_assignments`, `otp_verifications`
- Seed data: full State → District → Taluka hierarchy for Goa, Maharashtra, Karnataka, Kerala + "Rest of India"
  - **Goa**: 2 districts, 12 talukas ✅
  - **Kerala**: 14 districts, 78 taluks — verified against Kerala Revenue Dept records ✅
  - **Maharashtra**: 36 districts, ~350 talukas — sourced from Maharashtra govt district records ✅
  - **Karnataka**: 31 districts, ~220 talukas — sourced from Karnataka govt district records ✅
- **Admin location-management API** (`/api/admin/states`, `/api/admin/districts`, `/api/admin/talukas`) — lets Master Admin add, rename, or remove any state/district/taluka entry. This is the safety net for the Maharashtra/Karnataka data: if any taluka name is outdated, missing, or wrong, it can be fixed directly through the admin panel — no code redeploy needed.
- Basic public API routes to fetch states/districts/talukas (powers the registration form's location drill-down)

## A note on data accuracy
Maharashtra and Karnataka government sources don't fully agree on exact taluka counts (active reorganization is ongoing — new taluks get added every few years). What's seeded here is the most complete and recent consolidated list available. Treat it as a strong starting point, not gospel — use the new admin panel routes to correct anything your Taluka Admins flag as wrong when they register.

## Setup steps
1. Install PostgreSQL locally (or use a free-tier hosted DB like Render/Railway/Supabase).
2. Create the database:
   ```
   createdb vaishya_vani_connect
   ```
3. Copy `.env.example` to `.env` and fill in your real DB credentials.
4. Install dependencies:
   ```
   npm install
   ```
5. Run migrations (creates tables):
   ```
   npm run migrate
   ```
6. Run seeds (populates states/districts/talukas):
   ```
   npm run seed
   ```
7. Start the server:
   ```
   npm run dev
   ```
8. Test it's working:
   - `GET http://localhost:5000/api/health`
   - `GET http://localhost:5000/api/states`
   - `GET http://localhost:5000/api/districts/1` (replace 1 with a real state id)
   - `GET http://localhost:5000/api/talukas/1` (replace 1 with a real district id)
   - `GET http://localhost:5000/api/admin/hierarchy/1` (full district+taluka tree for a state — useful to spot-check accuracy)

## Admin correction examples
```
POST /api/admin/talukas        { "district_id": 5, "name": "New Taluka Name" }
PUT  /api/admin/talukas/42     { "name": "Corrected Spelling" }
DELETE /api/admin/talukas/42
```
(These will be locked behind Master Admin auth once the Authentication session is built — for now they're open for local testing.)

## What's next (Session 2 of Phase 0)
- Design system setup on frontend (React) — color theme, header/footer, homepage skeleton with placeholder live-registration-counter widget

