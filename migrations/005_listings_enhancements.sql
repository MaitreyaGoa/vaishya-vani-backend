-- migrations/005_listings_enhancements.sql
-- Phase 5: Add event_date, location, and external_link to community_listings
-- This enables a proper events calendar (sort by date, upcoming/past filter)
-- and richer detail pages for all listing types.

ALTER TABLE community_listings
  ADD COLUMN IF NOT EXISTS event_date DATE,
  ADD COLUMN IF NOT EXISTS location VARCHAR(200),
  ADD COLUMN IF NOT EXISTS external_link TEXT,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_listings_event_date ON community_listings(event_date);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON community_listings(featured);

-- Update existing sample events with dates so the calendar has something to show
UPDATE community_listings SET event_date = '2026-08-12', location = 'Ponda, Goa'
  WHERE title LIKE '%Sammelan%';
UPDATE community_listings SET event_date = '2026-09-03', location = 'Mangaluru, Karnataka'
  WHERE title LIKE '%Youth Networking%';
UPDATE community_listings SET event_date = '2026-11-10', location = 'Kochi, Kerala'
  WHERE title LIKE '%Diwali%';
