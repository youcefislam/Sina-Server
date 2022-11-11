create schema IF NOT EXISTS sina;

use sina;

CREATE TABLE IF NOT EXISTS wilaya (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(50) NOT NULL,
     primary key(id),
     UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS daira (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(50) NOT NULL,
     id_wilaya INT NOT NULL,
     primary key (id),
     FOREIGN KEY (id_wilaya) references wilaya(id) ON DELETE CASCADE,
     UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS commune (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(50) NOT NULL,
     id_daira INT NOT NULL,
     primary key(id),
     FOREIGN KEY (id_daira) references daira (id) ON DELETE CASCADE,
     UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS hospital (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(50) NOT NULL,
     address VARCHAR(255) NOT NULL,
     phone_number VARCHAR(10) NOT NULL,
     id_commune INT NOT NULL,
     primary key(id),
     FOREIGN KEY (id_commune) references commune (id) ON DELETE CASCADE,
     UNIQUE(phone_number)
);

CREATE TABLE IF NOT EXISTS illness_type (
     id INT NOT NULL AUTO_INCREMENT,
     type VARCHAR(50) NOT NULL,
     primary key(id),
     UNIQUE(type)
);

CREATE TABLE IF NOT EXISTS medication (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(50) NOT NULL,
     primary key(id),
     UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS relative (
     id INT NOT NULL AUTO_INCREMENT,
     first_name VARCHAR(50),
     last_name VARCHAR(50),
     phone_number VARCHAR(10),
     mail VARCHAR(255),
     primary key(id),
     UNIQUE (phone_number),
     UNIQUE (mail)
);

CREATE TABLE IF NOT EXISTS doctor(
     id INT NOT NULL AUTO_INCREMENT,
     username VARCHAR(50) NOT NULL,
     password VARCHAR(255) NOT NULL,
     mail VARCHAR(255) NOT NULL,
     first_name VARCHAR(50),
     last_name VARCHAR(50),
     sex TINYINT,
     photo VARCHAR(255),
     created_at DATETIME,
     phone_number VARCHAR(10) NOT NULL,
     auto_accept TINYINT default 0,
     id_daira INT,
     address VARCHAR(255),
     primary key (id),
     UNIQUE (username),
     UNIQUE (mail),
     UNIQUE (phone_number),
     FOREIGN KEY (id_daira) references daira(id) ON DELETE
     SET
          NULL
);

CREATE TABLE IF NOT EXISTS patient (
     id int NOT NULL AUTO_INCREMENT,
     username VARCHAR(50) NOT NULL,
     password VARCHAR(255) NOT NULL,
     mail VARCHAR(255) NOT NULL,
     first_name VARCHAR(50),
     last_name VARCHAR(50),
     sex TINYINT,
     birth_date DATE,
     address VARCHAR(255),
     photo VARCHAR(255),
     severity TINYINT,
     created_at DATETIME,
     phone_number VARCHAR(10),
     id_illness_type INT,
     id_commune INT,
     id_doctor INT,
     id_relative INT,
     Primary key (id),
     FOREIGN KEY (id_illness_type) references illness_type(id) ON DELETE
     SET
          NULL,
          FOREIGN KEY (id_commune) references Commune(id) ON DELETE
     SET
          NULL,
          FOREIGN KEY (id_doctor) references doctor (id) ON DELETE
     SET
          NULL,
          FOREIGN KEY (id_relative) references relative (id) ON DELETE
     SET
          NULL,
          UNIQUE (username),
          UNIQUE (mail),
          UNIQUE (phone_number)
);

CREATE TABLE IF NOT EXISTS patient_login_info(
     id INT NOT NULL AUTO_INCREMENT,
     token VARCHAR(60) NOT NULL,
     platform varchar(50),
     ip varchar(15),
     id_patient INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (id_patient) REFERENCES patient(id) ON DELETE CASCADE,
     INDEX (id_patient)
);

CREATE TABLE IF NOT EXISTS doctor_login_info(
     id INT NOT NULL AUTO_INCREMENT,
     token VARCHAR(60) NOT NULL,
     platform varchar(50),
     ip varchar(15),
     id_doctor INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (id_doctor) REFERENCES doctor(id) ON DELETE CASCADE,
     INDEX (id_doctor)
);

CREATE TABLE IF NOT EXISTS medication_journal(
     id int NOT NULL AUTO_INCREMENT,
     date DATETIME,
     id_patient INT NOT NULL,
     Primary key (id),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointement_journal(
     id int NOT NULL AUTO_INCREMENT,
     date DATETIME,
     id_patient INT,
     Primary key (id),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ecg_file (
     id INT NOT NULL AUTO_INCREMENT,
     lik VARCHAR(255),
     created_at DATETIME,
     id_patient INT,
     primary key(id),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointement (
     id INT NOT NULL AUTO_INCREMENT,
     date DATETIME,
     id_patient int NOT NULL,
     primary key(id),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS patient_request(
     id_doctor INT NOT NULL,
     id_patient INT NOT NULL,
     primary key(id_doctor, id_patient),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE,
     FOREIGN KEY (id_doctor) references doctor (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medication_list (
     start_date DATETIME,
     dosage VARCHAR(50),
     id_patient INT NOT NULL,
     id_medication int NOT NULL,
     Primary KEY (id_patient, id_medication),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE,
     FOREIGN KEY (id_medication) references medication (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medical_report (
     id INT NOT NULL AUTO_INCREMENT,
     link VARCHAR(200),
     created_at DATETIME,
     id_patient int NOT NULL,
     primary key (id),
     FOREIGN KEY (id) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medical_note (
     id INT NOT NULL AUTO_INCREMENT,
     created_at DATETIME,
     description VARCHAR(2000),
     id_patient int NOT NULL,
     primary key (id),
     FOREIGN KEY (id_patient) references patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS patient_account_validation(
     id_patient INT NOT NULL,
     validation_code INT NOT NULL,
     PRIMARY KEY (id_patient),
     FOREIGN KEY (id_patient) REFERENCES Patient (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_account_validation(
     id INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (id) REFERENCES doctor (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE
OR REPLACE VIEW doctorView AS
SELECT
     doctor.id,
     username,
     first_name,
     last_name,
     sex,
     auto_accept,
     created_at,
     phone_number,
     mail,
     daira.id as id_daira,
     daira.name as daira_name,
     wilaya.id as id_wilaya,
     wilaya.name as wilaya_name
FROM
     doctor,
     daira,
     wilaya
WHERE
     daira.id_wilaya = wilaya.id
     AND daira.id = doctor.id_daira;

CREATE
OR REPLACE VIEW patientView AS
SELECT
     patient.id,
     username,
     password,
     patient.mail,
     patient.first_name,
     patient.last_name,
     sex,
     birth_date,
     address,
     photo,
     severity,
     created_at,
     patient.phone_number,
     id_illness_type,
     illness_type.type as "illness_type",
     id_commune,
     commune.name as "commune_name",
     daira.id as "id_daira",
     daira.name as "daira_name",
     wilaya.id as "id_wilaya",
     wilaya.name as "wliaya_name",
     id_doctor,
     id_relative,
     relative.first_name as "relative_first_name",
     relative.last_name as "relative_last_name",
     relative.phone_number "relative_phone_number",
     relative.mail as "relative_mail"
FROM
     patient,
     commune,
     daira,
     wilaya,
     relative,
     illness_type
WHERE
     patient.id_illness_type = illness_type.id
     AND patient.id_commune = commune.id
     AND patient.id_relative = relative.id
     AND commune.id_daira = daira.id
     AND daira.id_wilaya = wilaya.id;

CREATE
OR REPLACE VIEW patientView AS
SELECT
     p.id,
     username,
     p.mail,
     p.first_name,
     p.last_name,
     sex,
     birth_date,
     address,
     photo,
     severity,
     created_at,
     p.phone_number,
     id_illness_type,
     i.type as "illness_type",
     id_commune,
     c.name as "commune_name",
     d.id as "id_daira",
     d.name as "daira_name",
     w.id as "id_wilaya",
     w.name as "wliaya_name",
     id_doctor,
     id_relative,
     r.first_name as "relative_first_name",
     r.last_name as "relative_last_name",
     r.phone_number "relative_phone_number",
     r.mail as "relative_mail"
FROM
     patient as p
     left join commune as c on p.id_commune = c.id
     left join daira as d on c.id_daira = d.id
     left join wilaya as w on d.id_wilaya = w.id
     left join relative as r on p.id_relative = r.id
     left join illness_type as i on p.id_illness_type = i.id;

CREATE
OR REPLACE VIEW patientView AS
SELECT
     p.id,
     p.username,
     p.mail,
     p.first_name,
     p.last_name,
     p.sex,
     p.birth_date,
     p.address,
     p.photo,
     severity,
     p.created_at,
     p.phone_number,
     id_illness_type,
     i.type as "illness_type",
     id_commune,
     c.name as "commune_name",
     d.id as "id_daira",
     d.name as "daira_name",
     w.id as "id_wilaya",
     w.name as "wliaya_name",
     id_relative,
     r.first_name as "relative_first_name",
     r.last_name as "relative_last_name",
     r.phone_number "relative_phone_number",
     r.mail as "relative_mail",
     id_doctor,
     doc.first_name as "doctor_first_name",
     doc.last_name as "doctor_last_name",
     doc.phone_number "doctor_phone_number",
     doc.mail as "doctor_mail",
     doc.address as "doctor_address"
FROM
     patient as p
     left join commune as c on p.id_commune = c.id
     left join daira as d on c.id_daira = d.id
     left join wilaya as w on d.id_wilaya = w.id
     left join relative as r on p.id_relative = r.id
     left join doctor as doc on p.id_doctor = doc.id
     left join illness_type as i on p.id_illness_type = i.id;