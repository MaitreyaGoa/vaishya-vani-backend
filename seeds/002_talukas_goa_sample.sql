-- seeds/002_talukas_goa_sample.sql
-- Taluka-level data is large (300+ talukas across Maharashtra/Karnataka/Kerala/Goa).
-- We're seeding Goa fully here as the working example since it's small (only 2 districts, 12 talukas).
-- Maharashtra/Karnataka/Kerala talukas will be added in the next session in the same pattern,
-- ideally cross-checked against your Taluka Admins' actual local knowledge for accuracy.

-- North Goa talukas
INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Bardez','Bicholim','Pernem','Ponda','Sattari','Tiswadi'
]) AS t
WHERE d.name = 'North Goa';

-- South Goa talukas
INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Canacona','Mormugao','Quepem','Salcette','Sanguem','Dharbandora'
]) AS t
WHERE d.name = 'South Goa';
