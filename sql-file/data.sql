use sina;

-- wilaya
INSERT INTO
    `sina`.`wilaya`(`id`, `name`)
VALUES
    (1, "wilaya 1"),
    (2, "wilaya 2"),
    (3, "wilaya 3"),
    (4, "wilaya 4"),
    (5, "wilaya 5"),
    (6, "wilaya 6"),
    (7, "wilaya 7"),
    (8, "wilaya 8"),
    (9, "wilaya 9"),
    (10, "wilaya 10");

-- daira
INSERT INTO
    `sina`.`daira`(`id`, `name`, `id_wilaya`)
VALUES
    (1, "Daira 1", 1),
    (2, "Daira 2", 1),
    (3, "Daira 3", 1),
    (4, "Daira 4", 2),
    (5, "Daira 5", 2),
    (6, "Daira 6", 2),
    (7, "Daira 7", 3),
    (8, "Daira 8", 3),
    (9, "Daira 9", 3),
    (10, "Daira 10", 4),
    (11, "Daira 11", 4),
    (12, "Daira 12", 4),
    (13, "Daira 13", 5),
    (14, "Daira 14", 5),
    (15, "Daira 15", 5),
    (16, "Daira 16", 6),
    (17, "Daira 17", 6),
    (18, "Daira 18", 6),
    (19, "Daira 19", 7),
    (20, "Daira 20", 7),
    (21, "Daira 21", 7),
    (22, "Daira 22", 8),
    (23, "Daira 23", 8),
    (24, "Daira 24", 8),
    (25, "Daira 25", 9),
    (26, "Daira 26", 9),
    (27, "Daira 27", 9),
    (28, "Daira 28", 10),
    (29, "Daira 29", 10),
    (30, "Daira 30", 10);

-- commune
INSERT INTO
    `sina`.`commune`(`id`, `name`, `id_daira`)
VALUES
    (1, "commune 1", 1),
    (2, "commune 2", 2),
    (3, "commune 3", 3),
    (4, "commune 4", 4),
    (5, "commune 5", 5),
    (6, "commune 6", 6),
    (7, "commune 7", 7),
    (8, "commune 8", 8),
    (9, "commune 9", 9),
    (10, "commune 10", 10),
    (11, "commune 11", 11),
    (12, "commune 12", 12),
    (13, "commune 13", 13),
    (14, "commune 14", 14),
    (15, "commune 15", 15),
    (16, "commune 16", 16),
    (17, "commune 17", 17),
    (18, "commune 18", 18),
    (19, "commune 19", 19),
    (20, "commune 20", 20),
    (21, "commune 21", 21),
    (22, "commune 22", 22),
    (23, "commune 23", 23),
    (24, "commune 24", 24),
    (25, "commune 25", 25),
    (26, "commune 26", 26),
    (27, "commune 27", 27),
    (28, "commune 28", 28),
    (29, "commune 29", 29),
    (30, "commune 30", 30);

-- hopital
INSERT INTO
    `sina`.`hospital`(
        `id`,
        `name`,
        `address`,
        `phone_number`,
        `id_commune`
    )
VALUES
    (1, "hopital 1", "adress", "027649550", 1),
    (2, "hopital 2", "adress", "027783764", 2),
    (3, "hopital 3", "adress", "02743128", 3),
    (4, "hopital 4", "adress", "027672293", 4),
    (5, "hopital 5", "adress", "027714540", 5),
    (6, "hopital 6", "adress", "027770693", 6),
    (7, "hopital 7", "adress", "027430465", 7),
    (8, "hopital 8", "adress", "027360325", 8),
    (9, "hopital 9", "adress", "027789484", 9),
    (10, "hopital 10", "adress", "027583057", 10),
    (11, "hopital 11", "adress", "027989916", 11),
    (12, "hopital 12", "adress", "027699914", 12),
    (13, "hopital 13", "adress", "027524790", 13),
    (14, "hopital 14", "adress", "027559063", 14),
    (15, "hopital 15", "adress", "027491614", 15),
    (16, "hopital 16", "adress", "027812642", 16),
    (17, "hopital 17", "adress", "027773083", 17),
    (18, "hopital 18", "adress", "027974709", 18),
    (19, "hopital 19", "adress", "027787272", 19),
    (20, "hopital 20", "adress", "027816727", 20),
    (21, "hopital 21", "adress", "027955318", 21),
    (22, "hopital 22", "adress", "027386481", 22),
    (23, "hopital 23", "adress", "027774862", 23),
    (24, "hopital 24", "adress", "027391199", 24),
    (25, "hopital 25", "adress", "027336227", 25),
    (26, "hopital 26", "adress", "027430617", 26),
    (27, "hopital 27", "adress", "027450007", 27),
    (28, "hopital 28", "adress", "027675178", 28),
    (29, "hopital 29", "adress", "027200707", 29),
    (30, "hopital 30", "adress", "027360064", 30);

-- Medicament
INSERT INTO
    `sina`.`medication`(`id`, `name`)
VALUES
    (1, "Medicament 1"),
    (2, "Medicament 2"),
    (3, "Medicament 3"),
    (4, "Medicament 4"),
    (5, "Medicament 5"),
    (6, "Medicament 6"),
    (7, "Medicament 7"),
    (8, "Medicament 8"),
    (9, "Medicament 9"),
    (10, "Medicament 10"),
    (11, "Medicament 11"),
    (12, "Medicament 12"),
    (13, "Medicament 13"),
    (14, "Medicament 14"),
    (15, "Medicament 15"),
    (16, "Medicament 16"),
    (17, "Medicament 17"),
    (18, "Medicament 18"),
    (19, "Medicament 19"),
    (20, "Medicament 20"),
    (21, "Medicament 21"),
    (22, "Medicament 22"),
    (23, "Medicament 23"),
    (24, "Medicament 24"),
    (25, "Medicament 25"),
    (26, "Medicament 26"),
    (27, "Medicament 27"),
    (28, "Medicament 28"),
    (29, "Medicament 29"),
    (30, "Medicament 30");

INSERT INTO
    "sina"."illness_type"("type")
VALUES
    ("type 1", "type 2", "type 3");

-- Fichier Ecg
insert into
    fichierecg(lienFichier, dateCreation, idPatient)
values
    ("lient 1", "2021-01-26 12:30", 1),
    ("lient 2", "2021-01-27 12:30", 1),
    ("lient 3", "2021-01-28 12:30", 1);