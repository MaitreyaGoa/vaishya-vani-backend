-- migrations/003_sample_content.sql
-- Adds a generic 'community_listings' table that covers Events, News, Jobs,
-- Education, Temples & Trusts, and Community Directory (one shared structure,
-- distinguished by 'type'). Business Hub and Matrimony already have their own
-- dedicated tables from migration 002 — this seeds sample rows into those too.
--
-- All sample rows are clearly tagged so Master Admin can find and delete them
-- later (look for "[SAMPLE]" in the title, or admin_name = 'Demo Seed Data').

-- ========================================
-- GENERIC LISTINGS TABLE
-- ========================================
CREATE TABLE community_listings (
  id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL, -- 'event' | 'news' | 'job' | 'education' | 'temple' | 'directory'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  meta_line VARCHAR(200), -- short line e.g. location/date, shown under the title
  approval_status VARCHAR(20) NOT NULL DEFAULT 'approved',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_type ON community_listings(type);
CREATE INDEX idx_listings_status ON community_listings(approval_status);

-- ========================================
-- SAMPLE USERS (so business/matrimony sample rows have a valid owner)
-- ========================================
INSERT INTO users (full_name, mobile_number, email, password_hash, approval_status)
VALUES
('[SAMPLE] Demo Seed Account 1', '9000000001', 'sample1@demo.test', 'x', 'approved'),
('[SAMPLE] Demo Seed Account 2', '9000000002', 'sample2@demo.test', 'x', 'approved');

-- ========================================
-- SAMPLE EVENTS
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('event', '[SAMPLE] Annual Vaishya Vani Sammelan', 'A gathering of families across Goa and Maharashtra for cultural programs and felicitation.', 'https://placehold.co/600x400/7a1f2b/f1d99b?text=Community+Event', '📍 Ponda, Goa · 12 Aug 2026'),
('event', '[SAMPLE] Youth Networking Meet', 'An evening for young professionals and entrepreneurs to connect over dinner.', 'https://placehold.co/600x400/7a1f2b/f1d99b?text=Youth+Meet', '📍 Mangaluru · 03 Sep 2026'),
('event', '[SAMPLE] Diwali Community Gathering', 'Lighting ceremony, cultural performances, and a community feast.', 'https://placehold.co/600x400/7a1f2b/f1d99b?text=Diwali+Gathering', '📍 Kochi · 10 Nov 2026');

-- ========================================
-- SAMPLE NEWS
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('news', '[SAMPLE] Platform Launch Update', 'VaishyaVaniParivar.com registration opens to all community members.', 'https://placehold.co/600x400/4a1118/f1d99b?text=News', '🗓️ Jun 2026'),
('news', '[SAMPLE] Success Story: A Match Made Here', 'Two families share how they connected through the community network.', 'https://placehold.co/600x400/4a1118/f1d99b?text=Success+Story', '🗓️ May 2026');

-- ========================================
-- SAMPLE JOBS
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('job', '[SAMPLE] Accounts Executive', 'Hinde Hardware & Tools is hiring a full-time accounts executive.', 'https://placehold.co/600x400/c9952f/4a1118?text=Job+Opening', '💼 Full-time · Bicholim, Goa'),
('job', '[SAMPLE] Marketing Intern', 'Vani Catering Services is looking for a marketing intern.', 'https://placehold.co/600x400/c9952f/4a1118?text=Internship', '💼 Internship · Mysuru, KA');

-- ========================================
-- SAMPLE EDUCATION
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('education', '[SAMPLE] Community Merit Scholarship', 'Annual scholarship for students pursuing higher education.', 'https://placehold.co/600x400/7a1f2b/f1d99b?text=Scholarship', '🎓 Applications open'),
('education', '[SAMPLE] Career Mentorship Circle', 'Connect students with community professionals for guidance.', 'https://placehold.co/600x400/7a1f2b/f1d99b?text=Mentorship', '🎓 Ongoing program');

-- ========================================
-- SAMPLE TEMPLES & TRUSTS
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('temple', '[SAMPLE] Shri Vaishya Vani Temple Trust', 'Managing the community temple and annual festival programs.', 'https://placehold.co/600x400/4a1118/f1d99b?text=Temple+Trust', '🛕 Goa Chapter'),
('temple', '[SAMPLE] Samaj Charitable Trust', 'Supporting community welfare, education, and emergency relief.', 'https://placehold.co/600x400/4a1118/f1d99b?text=Charitable+Trust', '🛕 Karnataka Chapter');

-- ========================================
-- SAMPLE COMMUNITY DIRECTORY
-- ========================================
INSERT INTO community_listings (type, title, description, image_url, meta_line) VALUES
('directory', '[SAMPLE] Hinde Family', 'Registered community family with 4 members.', 'https://placehold.co/600x400/c9952f/4a1118?text=Family+Profile', '📍 Bicholim, Goa'),
('directory', '[SAMPLE] Vaishya Vani Mahila Mandal', 'Community organization, Kerala chapter.', 'https://placehold.co/600x400/c9952f/4a1118?text=Organization', '📍 Kerala');

-- ========================================
-- SAMPLE BUSINESS PROFILES (uses existing business_profiles table)
-- ========================================
INSERT INTO business_profiles (user_id, business_name, category, description, contact_number, city, logo_image_url, approval_status)
SELECT id, '[SAMPLE] Hinde Hardware & Tools', 'Hardware', 'Wholesale and retail hardware supplies, serving North Goa since 1998.', '9876500001', 'Bicholim, Goa', 'https://placehold.co/400x400/7a1f2b/f1d99b?text=Hardware+Co', 'approved'
FROM users WHERE full_name = '[SAMPLE] Demo Seed Account 1';

INSERT INTO business_profiles (user_id, business_name, category, description, contact_number, city, logo_image_url, approval_status)
SELECT id, '[SAMPLE] Konkan Spice Traders', 'Trading', 'Export-quality spices and dry goods sourced directly from local farms.', '9876500002', 'Ratnagiri, Maharashtra', 'https://placehold.co/400x400/4a1118/f1d99b?text=Spice+Traders', 'approved'
FROM users WHERE full_name = '[SAMPLE] Demo Seed Account 2';

INSERT INTO business_profiles (user_id, business_name, category, description, contact_number, city, logo_image_url, approval_status)
SELECT id, '[SAMPLE] Vani Catering Services', 'Catering', 'Traditional and contemporary catering for weddings and community events.', '9876500003', 'Mysuru, Karnataka', 'https://placehold.co/400x400/c9952f/4a1118?text=Catering', 'approved'
FROM users WHERE full_name = '[SAMPLE] Demo Seed Account 1';

-- ========================================
-- SAMPLE MATRIMONY PROFILES (uses existing matrimony_profiles table)
-- ========================================
INSERT INTO matrimony_profiles (user_id, age, gender, education, profession, native_place, current_location, profile_photo_url, approval_status)
SELECT id, 28, 'Female', 'B.Com, MBA', 'Family Business', 'Goa', 'Pune', 'https://placehold.co/400x500/7a1f2b/f1d99b?text=Profile+Photo', 'approved'
FROM users WHERE full_name = '[SAMPLE] Demo Seed Account 1';

INSERT INTO matrimony_profiles (user_id, age, gender, education, profession, native_place, current_location, profile_photo_url, approval_status)
SELECT id, 30, 'Male', 'B.E. Computer Science', 'Software Engineer', 'Karnataka', 'Bengaluru', 'https://placehold.co/400x500/4a1118/f1d99b?text=Profile+Photo', 'approved'
FROM users WHERE full_name = '[SAMPLE] Demo Seed Account 2';
