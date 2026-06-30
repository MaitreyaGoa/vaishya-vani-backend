-- migrations/001_core_schema.sql
-- Vaishya Vani Connect — Core Schema (Phase 0)
-- Covers: location hierarchy (State > District > Taluka), Users, Roles, Admin assignments

-- ========================================
-- 1. LOCATION HIERARCHY
-- ========================================

CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  is_priority_state BOOLEAN DEFAULT FALSE, -- TRUE for Goa, Maharashtra, Karnataka, Kerala
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state_id, name)
);

CREATE TABLE talukas (
  id SERIAL PRIMARY KEY,
  district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(district_id, name)
);

-- ========================================
-- 2. ROLES
-- ========================================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE -- 'member', 'taluka_admin', 'master_admin'
);

INSERT INTO roles (name) VALUES ('member'), ('taluka_admin'), ('master_admin');

-- ========================================
-- 3. USERS (base community profile)
-- ========================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(150) UNIQUE,
  password_hash VARCHAR(255), -- nullable if pure OTP-based auth is used instead
  profile_photo_url TEXT,

  -- Location (drill-down). For "Rest of India" users, taluka_id will be NULL.
  state_id INTEGER REFERENCES states(id),
  district_id INTEGER REFERENCES districts(id),
  taluka_id INTEGER REFERENCES talukas(id),

  -- Opt-in flags
  matrimony_opt_in BOOLEAN DEFAULT FALSE,
  business_opt_in BOOLEAN DEFAULT FALSE,

  -- Role & approval workflow
  role_id INTEGER NOT NULL DEFAULT 1 REFERENCES roles(id), -- default = member
  approval_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  approved_by INTEGER REFERENCES users(id), -- which admin approved this user
  approved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_state ON users(state_id);
CREATE INDEX idx_users_district ON users(district_id);
CREATE INDEX idx_users_taluka ON users(taluka_id);
CREATE INDEX idx_users_approval_status ON users(approval_status);

-- ========================================
-- 4. TALUKA ADMIN ASSIGNMENTS
-- ========================================
-- A taluka_admin user is assigned responsibility for ONE taluka (or one district, for Rest-of-India regions)

CREATE TABLE admin_assignments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  taluka_id INTEGER REFERENCES talukas(id),     -- set for priority-state admins
  district_id INTEGER REFERENCES districts(id), -- set for Rest-of-India admins (district-level)
  assigned_by INTEGER REFERENCES users(id),      -- master admin who assigned this
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (taluka_id IS NOT NULL OR district_id IS NOT NULL)
);

-- ========================================
-- 5. OTP VERIFICATION (for mobile-based login/registration)
-- ========================================

CREATE TABLE otp_verifications (
  id SERIAL PRIMARY KEY,
  mobile_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otp_mobile ON otp_verifications(mobile_number);
