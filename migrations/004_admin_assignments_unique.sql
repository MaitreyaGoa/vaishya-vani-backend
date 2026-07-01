-- migrations/004_admin_assignments_unique.sql
-- Adds a unique constraint on admin_assignments.user_id so that
-- the ON CONFLICT (user_id) DO UPDATE pattern works in the assign route.
-- Safe to run even if no admin assignments exist yet.

ALTER TABLE admin_assignments
  ADD CONSTRAINT admin_assignments_user_id_unique UNIQUE (user_id);
