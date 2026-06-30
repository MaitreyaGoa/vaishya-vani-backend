-- seeds/003_talukas_kerala.sql
-- Kerala — 78 taluks across 14 districts
-- Source: Kerala Revenue & Land Reforms Department data (cross-referenced via Wikipedia/LGD records)

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Neyyattinkara','Kattakkada','Nedumangad','Thiruvananthapuram','Chirayinkeezhu','Varkala'
]) AS t WHERE d.name = 'Thiruvananthapuram';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kollam','Kunnathoor','Karunagappally','Kottarakkara','Punalur','Pathanapuram'
]) AS t WHERE d.name = 'Kollam';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Adoor','Konni','Kozhencherry','Ranni','Mallappally','Thiruvalla'
]) AS t WHERE d.name = 'Pathanamthitta';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chenganoor','Mavelikkara','Karthikappally','Kuttanad','Ambalappuzha','Cherthala'
]) AS t WHERE d.name = 'Alappuzha';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Changanasserry','Kottayam','Vaikom','Meenachil','Kanjirappally'
]) AS t WHERE d.name = 'Kottayam';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Peermade','Udumbanchola','Idukki','Thodupuzha','Devikulam'
]) AS t WHERE d.name = 'Idukki';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kothamangalam','Muvattupuzha','Kunnathunad','Kanayannur','Kochi','North Paravur','Aluva'
]) AS t WHERE d.name = 'Ernakulam';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Chalakudy','Mukundapuram','Kodungallur','Thrissur','Chavakkad','Kunnamkulam','Thalapilly'
]) AS t WHERE d.name = 'Thrissur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Alathoor','Chittur','Palakkad','Pattambi','Ottappalam','Mannarkkad','Attappady'
]) AS t WHERE d.name = 'Palakkad';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Perinthalmanna','Nilambur','Eranad','Kondotty','Ponnani','Tirur','Tirurangadi'
]) AS t WHERE d.name = 'Malappuram';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Kozhikode','Thamarassery','Koyilandy','Vatakara'
]) AS t WHERE d.name = 'Kozhikode';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Vythiri','Sulthan Bathery','Mananthavady'
]) AS t WHERE d.name = 'Wayanad';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Thalassery','Iritty','Kannur','Taliparamba','Payyanur'
]) AS t WHERE d.name = 'Kannur';

INSERT INTO talukas (district_id, name)
SELECT d.id, t FROM districts d, UNNEST(ARRAY[
  'Hosdurg','Vellarikund','Kasaragod','Manjeshwaram'
]) AS t WHERE d.name = 'Kasaragod';

-- Total: 78 taluks across 14 districts ✅
