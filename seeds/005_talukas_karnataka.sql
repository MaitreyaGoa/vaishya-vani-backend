-- seeds/005_talukas_karnataka.sql
-- Karnataka — talukas by district (31 districts)
-- Source: Karnataka government district records (karnataka.gov.in) cross-referenced via Wikipedia
-- NOTE: Karnataka has been actively creating new taluks in recent years, so this is the
-- best consolidated list available. Master Admin can add/edit/rename/remove via admin panel.

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Bagalkot','Jamkhandi','Mudhol','Badami','Bilagi','Hunagunda','Ilkal','Rabkavi Banhatti','Guledgudda'
]) AS t WHERE d.name = 'Bagalkot';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Ballari','Kurugodu','Kampli','Sanduru','Siraguppa'
]) AS t WHERE d.name = 'Ballari';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Belagavi','Athani','Bailhongal','Chikkodi','Gokak','Khanapura','Mudalgi','Nippani',
  'Rayabaga','Savadatti','Ramadurga','Kagawada','Hukkeri','Kitturu','Yargatti'
]) AS t WHERE d.name = 'Belagavi';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Bengaluru','Kengeri','Krishnarajapura','Anekal','Yelahanka'
]) AS t WHERE d.name = 'Bengaluru Urban';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Nelamangala','Doddaballapura','Devanahalli','Hosakote'
]) AS t WHERE d.name = 'Bengaluru Rural';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Aurad','Basavakalyana','Bhalki','Bidar','Chitgoppa','Hulsuru','Humnabad','Kamalanagara'
]) AS t WHERE d.name = 'Bidar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chamarajanagara','Gundlupete','Kollegala','Yelanduru','Hanuru'
]) AS t WHERE d.name = 'Chamarajanagar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chikkaballapura','Bagepalli','Chintamani','Gauribidanuru','Gudibanda','Sidlaghatta',
  'Cheluru','Manchenahalli'
]) AS t WHERE d.name = 'Chikkaballapur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chikkamagaluru','Kaduru','Koppa','Mudigere','Narasimharajapura','Sringeri','Tarikere',
  'Ajjampura','Kalasa'
]) AS t WHERE d.name = 'Chikkamagaluru';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chitradurga','Challakere','Hiriyur','Holalkere','Hosadurga','Molakalmuru'
]) AS t WHERE d.name = 'Chitradurga';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Mangaluru','Ullal','Mulki','Moodbidri','Bantwala','Belathangadi','Putturu','Sulya','Kadaba'
]) AS t WHERE d.name = 'Dakshina Kannada';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Davanagere','Harihara','Channagiri','Honnali','Nyamathi','Jagaluru'
]) AS t WHERE d.name = 'Davanagere';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kalghatgi','Dharwad','Hubballi (Rural)','Hubballi (Urban)','Kundagolu','Navalgunda',
  'Alnavara','Annigeri'
]) AS t WHERE d.name = 'Dharwad';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Gadag','Naragunda','Mundaragi','Rona','Gajendragada','Lakshmeshwara','Shirahatti'
]) AS t WHERE d.name = 'Gadag';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Hassan','Arasikere','Channarayapattana','Holenarsipura','Sakleshpura','Aluru',
  'Arakalagudu','Beluru'
]) AS t WHERE d.name = 'Hassan';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Ranibennur','Byadgi','Hangala','Haveri','Savanuru','Hirekeruru','Shiggavi','Rattihalli'
]) AS t WHERE d.name = 'Haveri';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kalaburagi','Afzalpura','Alanda','Chincholi','Chitapura','Jevargi','Sedam','Kamalapura',
  'Shahabad','Kalgi','Yedrami'
]) AS t WHERE d.name = 'Kalaburagi';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Madikeri','Somawarapete','Virajapete','Ponnammapete','Kushalnagara'
]) AS t WHERE d.name = 'Kodagu';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kolar','Bangarapete','Maluru','Mulabagilu','Srinivasapura','Kolar Gold Fields (Robertsonpete)'
]) AS t WHERE d.name = 'Kolar';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Koppal','Gangavathi','Kushtagi','Yelaburga','Kanakagiri','Karatagi','Kukanuru'
]) AS t WHERE d.name = 'Koppal';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Mandya','Madduru','Malavalli','Srirangapattana','Krishnarajapete','Nagamangala','Pandavapura'
]) AS t WHERE d.name = 'Mandya';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Mysuru','Hunasuru','Krishnarajanagara','Nanjanagodu','Heggadadevanakote','Piriyapattana',
  'Tirumakudalu Narasipura','Saraguru','Saligrama'
]) AS t WHERE d.name = 'Mysuru';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Raichur','Sindhanuru','Manvi','Devadurga','Lingasaguru','Mudgal','Maski','Sirawara'
]) AS t WHERE d.name = 'Raichur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Ramanagara','Magadi','Kanakapura','Channapattana','Harohalli'
]) AS t WHERE d.name = 'Ramanagara';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Shivamogga','Sagara','Bhadravathi','Hosanagara','Shikaripura','Soraba','Tirthahalli'
]) AS t WHERE d.name = 'Shivamogga';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Tumakuru','Chikkanayakanahalli','Kunigal','Madhugiri','Sira','Tipturu','Gubbi',
  'Koratagere','Pavagada','Turuvekere'
]) AS t WHERE d.name = 'Tumakuru';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Udupi','Kapu','Bynduru','Karkala','Kundapura','Hebri','Brahmavara'
]) AS t WHERE d.name = 'Udupi';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Karwara','Sirsi','Joida','Dandeli','Bhatkal','Kumta','Ankola','Haliyal','Honnavara',
  'Mundagodu','Siddapura','Yellapura'
]) AS t WHERE d.name = 'Uttara Kannada';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Vijayapura','Indi','Basavana Bagewadi','Sindgi','Muddebihala','Talikote','Devara Hipparagi',
  'Chadchana','Tikote','Babaleshwara','Kolhara','Nidagundi','Alamela'
]) AS t WHERE d.name = 'Vijayapura';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Yadgir','Shahapura','Surapura','Gurmitkala','Vadagera','Hunsagi'
]) AS t WHERE d.name = 'Yadgir';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Hosapete','Hagaribommanahalli','Harapanahalli','Hoovina Hadagali','Kudligi','Kotturu'
]) AS t WHERE d.name = 'Vijayanagara';

-- Total: 31 districts covered ✅
