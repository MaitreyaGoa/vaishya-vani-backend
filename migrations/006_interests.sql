-- migrations/006_interests.sql
-- Phase 4 Session 2 — Interest/Match system
-- A member can send an interest to another matrimony profile.
-- When both sides have sent interest to each other = a match.

CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_profile_id INTEGER REFERENCES matrimony_profiles(id) ON DELETE CASCADE,
  receiver_profile_id INTEGER REFERENCES matrimony_profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | accepted | declined
  message TEXT, -- optional short note from sender
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id) -- one interest per pair
);

CREATE INDEX idx_interests_sender ON interests(sender_id);
CREATE INDEX idx_interests_receiver ON interests(receiver_id);
CREATE INDEX idx_interests_status ON interests(status);
