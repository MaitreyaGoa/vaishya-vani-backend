-- seeds/004_talukas_maharashtra.sql
-- Maharashtra — talukas by district (36 districts)
-- Source: Maharashtra government district records (maharashtra.gov.in) cross-referenced via Wikipedia
-- NOTE: This is the best available consolidated list. Master Admin can add/edit/rename/remove
-- any taluka via the admin panel (see /api/admin/talukas routes) if local corrections are needed.

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kankavli','Vaibhavwadi','Devgad','Malwan','Sawantwadi','Kudal','Vengurla','Dodamarg'
]) AS t WHERE d.name = 'Sindhudurg';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Ratnagiri','Sangameshwar','Lanja','Rajapur','Chiplun','Guhagar','Dapoli','Mandangad','Khed'
]) AS t WHERE d.name = 'Ratnagiri';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Pen','Alibag','Murud','Panvel','Uran','Karjat','Khalapur','Mangaon','Tala','Roha',
  'Sudhagad-Pali','Mahad','Poladpur','Shrivardhan','Mhasala'
]) AS t WHERE d.name = 'Raigad';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Mumbai City'
]) AS t WHERE d.name = 'Mumbai City';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kurla','Andheri','Borivali'
]) AS t WHERE d.name = 'Mumbai Suburban';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Thane','Kalyan','Murbad','Bhiwandi','Shahapur','Ulhasnagar','Ambarnath'
]) AS t WHERE d.name = 'Thane';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Palghar','Vasai','Dahanu','Talasari','Jawhar','Mokhada','Vada','Vikramgad'
]) AS t WHERE d.name = 'Palghar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nashik','Igatpuri','Dindori','Peth','Trimbakeshwar','Kalwan','Deola','Surgana','Baglan',
  'Malegaon','Nandgaon','Chandwad','Niphad','Sinnar','Yeola'
]) AS t WHERE d.name = 'Nashik';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nandurbar','Navapur','Shahada','Talode','Akkalkuwa','Dhadgaon'
]) AS t WHERE d.name = 'Nandurbar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Dhule','Sakri','Sindkheda','Shirpur'
]) AS t WHERE d.name = 'Dhule';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Jalgaon','Jamner','Erandol','Dharangaon','Bhusawal','Raver','Muktainagar','Bodwad','Yawal',
  'Amalner','Parola','Chopda','Pachora','Bhadgaon','Chalisgaon'
]) AS t WHERE d.name = 'Jalgaon';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Buldhana','Chikhli','Deulgaon Raja','Jalgaon Jamod','Sangrampur','Malkapur','Motala',
  'Nandura','Khamgaon','Shegaon','Mehkar','Sindkhed Raja','Lonar'
]) AS t WHERE d.name = 'Buldhana';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Akola','Akot','Telhara','Balapur','Patur','Murtajapur','Barshitakli'
]) AS t WHERE d.name = 'Akola';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Washim','Malegaon','Risod','Mangrulpir','Karanja','Manora'
]) AS t WHERE d.name = 'Washim';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Amravati','Bhatkuli','Nandgaon Khandeshwar','Dharni','Chikhaldara','Achalpur','Chandurbazar',
  'Morshi','Warud','Daryapur','Anjangaon-Surji','Chandur','Dhamangaon','Tiosa'
]) AS t WHERE d.name = 'Amravati';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Wardha','Deoli','Seloo','Arvi','Ashti','Karanja','Hinganghat','Samudrapur'
]) AS t WHERE d.name = 'Wardha';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nagpur Urban','Nagpur Rural','Kamptee','Hingna','Katol','Narkhed','Savner','Kalameshwar',
  'Ramtek','Mouda','Parseoni','Umred','Kuhi','Bhiwapur'
]) AS t WHERE d.name = 'Nagpur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Bhandara','Tumsar','Pauni','Mohadi','Sakoli','Lakhani','Lakhandur'
]) AS t WHERE d.name = 'Bhandara';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Gondia','Goregaon','Salekasa','Tiroda','Amgaon','Deori','Arjuni-Morgaon','Sadak-Arjuni'
]) AS t WHERE d.name = 'Gondia';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Gadchiroli','Dhanora','Chamorshi','Mulchera','Desaiganj','Armori','Kurkheda','Korchi',
  'Aheri','Etapalli','Bhamragad','Sironcha'
]) AS t WHERE d.name = 'Gadchiroli';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chandrapur','Saoli','Mul','Ballarpur','Pombhurna','Gondpimpri','Warora','Chimur',
  'Bhadravati','Bramhapuri','Nagbhid','Sindewahi','Rajura','Korpana','Jiwati'
]) AS t WHERE d.name = 'Chandrapur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Yavatmal','Arni','Babhulgaon','Kalamb','Darwha','Digras','Ner','Pusad','Umarkhed',
  'Mahagaon','Kelapur','Ralegaon','Ghatanji','Wani','Maregaon','Zari Jamani'
]) AS t WHERE d.name = 'Yavatmal';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nanded','Ardhapur','Mudkhed','Bhokar','Umri','Loha','Kandhar','Kinwat','Himayatnagar',
  'Hadgaon','Mahur','Deglur','Mukhed','Dharmabad','Biloli','Naigaon'
]) AS t WHERE d.name = 'Nanded';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Hingoli','Sengaon','Kalamnuri','Basmath','Aundha Nagnath'
]) AS t WHERE d.name = 'Hingoli';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Parbhani','Sonpeth','Gangakhed','Palam','Purna','Sailu','Jintur','Manwath','Pathri'
]) AS t WHERE d.name = 'Parbhani';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Jalna','Bhokardan','Jafrabad','Badnapur','Ambad','Ghansawangi','Partur','Mantha'
]) AS t WHERE d.name = 'Jalna';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Aurangabad','Kannad','Soegaon','Sillod','Phulambri','Khuldabad','Vaijapur','Gangapur','Paithan'
]) AS t WHERE d.name = 'Aurangabad (Chh. Sambhajinagar)';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Beed','Georai','Patoda','Shirur-Kasar','Ashti','Majalgaon','Wadwani','Kaij','Dharur',
  'Parli','Ambajogai'
]) AS t WHERE d.name = 'Beed';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Latur','Renapur','Ausa','Ahmedpur','Jalkot','Chakur','Shirur Anantpal','Nilanga','Deoni','Udgir'
]) AS t WHERE d.name = 'Latur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Osmanabad','Tuljapur','Bhum','Paranda','Washi','Kalamb','Lohara','Umarga'
]) AS t WHERE d.name = 'Osmanabad (Dharashiv)';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Solapur North','Barshi','Solapur South','Akkalkot','Madha','Karmala','Pandharpur','Mohol',
  'Malshiras','Sangole','Mangalvedhe'
]) AS t WHERE d.name = 'Solapur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nagar','Shevgaon','Pathardi','Parner','Sangamner','Kopargaon','Akole','Shrirampur','Nevasa',
  'Rahata','Rahuri','Shrigonda','Karjat','Jamkhed'
]) AS t WHERE d.name = 'Ahmednagar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Pune City','Haveli','Khed','Junnar','Ambegaon','Maval','Mulshi','Shirur',
  'Purandhar (Saswad)','Velhe','Bhor','Baramati','Indapur','Daund'
]) AS t WHERE d.name = 'Pune';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Satara','Jaoli','Koregaon','Wai','Mahabaleshwar','Khandala','Phaltan','Maan','Khatav',
  'Patan','Karad'
]) AS t WHERE d.name = 'Satara';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Miraj','Kavathemahankal','Tasgaon','Jat','Walwa','Shirala','Khanapur (Vita)','Atpadi',
  'Palus','Kadegaon'
]) AS t WHERE d.name = 'Sangli';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Karvir','Panhala','Shahuwadi','Kagal','Hatkanangale','Shirol','Radhanagari','Gaganbawada',
  'Bhudargad','Gadhinglaj','Chandgad','Ajra'
]) AS t WHERE d.name = 'Kolhapur';

-- Total: 36 districts covered ✅
