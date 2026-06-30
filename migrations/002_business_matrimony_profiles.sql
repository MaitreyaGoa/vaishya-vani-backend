-- migrations/002_business_matrimony_profiles.sql
-- Phase 2: Registration Engine — Business & Matrimony profile tables
-- A user can have NEITHER, ONE, or BOTH of these, controlled by the opt-in flags
-- already on the users table (business_opt_in, matrimony_opt_in).

-- ========================================
-- BUSINESS PROFILES
-- ========================================
CREATE TABLE business_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  business_name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  contact_number VARCHAR(15),
  address TEXT,
  city VARCHAR(100),

  -- Inherited from user's location by default, but editable independently
  state_id INTEGER REFERENCES states(id),
  district_id INTEGER REFERENCES districts(id),
  taluka_id INTEGER REFERENCES talukas(id),

  website_url TEXT,
  social_links TEXT, -- comma-separated or JSON string of social links

  logo_image_url TEXT,        -- Cloudinary URL
  logo_image_public_id TEXT,  -- Cloudinary public_id, needed for deletion/replacement

  approval_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_user ON business_profiles(user_id);
CREATE INDEX idx_business_approval_status ON business_profiles(approval_status);
CREATE INDEX idx_business_state ON business_profiles(state_id);
CREATE INDEX idx_business_category ON business_profiles(category);

-- ========================================
-- MATRIMONY PROFILES
-- ========================================
CREATE TABLE matrimony_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  age INTEGER,
  gender VARCHAR(20),
  education VARCHAR(150),
  profession VARCHAR(150),
  height VARCHAR(20),

  native_place VARCHAR(150),
  current_location VARCHAR(150),

  family_background TEXT,
  family_contact VARCHAR(15),
  family_introduction TEXT,

  gotra VARCHAR(100),
  language_preference VARCHAR(100),

  profile_photo_url TEXT,        -- Cloudinary URL
  profile_photo_public_id TEXT,
  horoscope_url TEXT,            -- optional document/image upload
  horoscope_public_id TEXT,

  show_to_registered_only BOOLEAN DEFAULT TRUE, -- privacy toggle from your matrimony doc
  phone_visible BOOLEAN DEFAULT FALSE,          -- hidden until approved request

  approval_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_matrimony_user ON matrimony_profiles(user_id);
CREATE INDEX idx_matrimony_approval_status ON matrimony_profiles(approval_status);
CREATE INDEX idx_matrimony_native_place ON matrimony_profiles(native_place);
CREATE INDEX idx_matrimony_gotra ON matrimony_profiles(gotra);
