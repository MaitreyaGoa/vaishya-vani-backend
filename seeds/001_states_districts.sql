-- seeds/001_states_districts.sql
-- Seed: 4 priority states + their districts, plus a "Rest of India" placeholder state

-- ========================================
-- STATES
-- ========================================
INSERT INTO states (name, is_priority_state) VALUES
('Goa', TRUE),
('Maharashtra', TRUE),
('Karnataka', TRUE),
('Kerala', TRUE),
('Rest of India', FALSE);

-- ========================================
-- GOA DISTRICTS (2)
-- ========================================
INSERT INTO districts (state_id, name)
SELECT id, d FROM states, UNNEST(ARRAY[
  'North Goa', 'South Goa'
]) AS d WHERE states.name = 'Goa';

-- ========================================
-- MAHARASHTRA DISTRICTS (36)
-- ========================================
INSERT INTO districts (state_id, name)
SELECT id, d FROM states, UNNEST(ARRAY[
  'Ahmednagar','Akola','Amravati','Aurangabad (Chh. Sambhajinagar)','Beed','Bhandara',
  'Buldhana','Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna',
  'Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar',
  'Nashik','Osmanabad (Dharashiv)','Palghar','Parbhani','Pune','Raigad','Ratnagiri',
  'Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'
]) AS d WHERE states.name = 'Maharashtra';

-- ========================================
-- KARNATAKA DISTRICTS (31)
-- ========================================
INSERT INTO districts (state_id, name)
SELECT id, d FROM states, UNNEST(ARRAY[
  'Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban','Bidar','Chamarajanagar',
  'Chikkaballapur','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad',
  'Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru',
  'Raichur','Ramanagara','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayapura',
  'Vijayanagara','Yadgir'
]) AS d WHERE states.name = 'Karnataka';

-- ========================================
-- KERALA DISTRICTS (14)
-- ========================================
INSERT INTO districts (state_id, name)
SELECT id, d FROM states, UNNEST(ARRAY[
  'Alappuzha','Ernakulam','Idukki','Kannur','Kasaragod','Kollam','Kottayam','Kozhikode',
  'Malappuram','Palakkad','Pathanamthitta','Thiruvananthapuram','Thrissur','Wayanad'
]) AS d WHERE states.name = 'Kerala';

-- ========================================
-- "Rest of India" — one placeholder district per state name will be added
-- dynamically at registration time (no taluka drill-down needed here),
-- OR we add a generic district called 'General' for now:
-- ========================================
INSERT INTO districts (state_id, name)
SELECT id, 'General' FROM states WHERE name = 'Rest of India';
