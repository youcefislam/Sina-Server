drop database sina;
create schema if not exists sina;
use sina;
Create table Wilaya (
    idWilaya INT NOT NULL AUTO_INCREMENT, 
    nomWilaya VARCHAR(50),
    primary key(idWilaya)
);

Create table Daira (
     idDaira INT NOT NULL AUTO_INCREMENT, 
     nomDaira VARCHAR(50),
     idWilaya INT,
     primary key (idDaira),
     Constraint FK_daira_IdWil FOREIGN KEY (idWilaya) references Wilaya(idWilaya)
     ON DELETE CASCADE
);

Create table Commune (
     idCommune INT NOT NULL AUTO_INCREMENT, 
     nomCommune VARCHAR(50), 
     idDaira INT,
     primary key(idCommune),
     Constraint FK_com_IdDa FOREIGN KEY (idDaira) references Daira (idDaira)
     ON DELETE CASCADE
);

Create table Hopital (
     idHopital INT NOT NULL AUTO_INCREMENT, 
     nomHopital VARCHAR(50), 
     adressHopital VARCHAR(255), 
     numTlfHopital VARCHAR(10), 
     idCommune INT,
     primary key(idHoptial),
     Constraint FK_hopital_idCommun FOREIGN KEY (idCommune) references Commune (idCommune) ON DELETE CASCADE,
     Constraint Unq_hopital_num UNIQUE(numTlfHopital)
);

Create table TypeMaladie (
     idTypeMaladie INT NOT NULL AUTO_INCREMENT, 
     TypeMaladie VARCHAR(50),
     primary key(idTypeMaladie)
);

Create table Medicament (
     idMedicament INT NOT NULL AUTO_INCREMENT,
     nomMedicament VARCHAR(50),
     primary key(idMedicament)
);

Create table Proche (
     idProche INT NOT NULL AUTO_INCREMENT,
     nomProche VARCHAR(50),
     prenomProche VARCHAR(50), 
     NumTlfProche VARCHAR(10), 
     mailProche VARCHAR(255), 
     primary key(idProche),
     Constraint Unq_Proche_Num UNIQUE (NumTlfProche),
     Constraint Unq_Proche_Mail UNIQUE (mailProche)
);

Create table Medecin(
     idMedecin INT NOT NULL AUTO_INCREMENT, 
     userNameMedecin VARCHAR(50) NOT NULL, 
     passwordMedecin VARCHAR(255) NOT NULL, 
     mailMedecin VARCHAR(255) NOT NULL, 
     nomMedecin VARCHAR(50), 
     prenomMedecin VARCHAR(50), 
     sexeMedecin TINYINT, 
     photoMedecin VARCHAR(255), 
     dateInscriptientMedecin DATETIME, 
     NumTlfMedecin VARCHAR(10) NOT NULL, 
     autoAccept TINYINT default 0,
     idDaira INT,
     primary key (idMedecin),
     Constraint Fk_Med_IdDaira FOREIGN KEY (idDaira) references Daira(idDaira) ON DELETE SET NULL,
     Constraint Unq_Med_user UNIQUE (userNameMedecin),
     Constraint Unq_Med_mail UNIQUE (mailMedecin),
     Constraint Unq_Med_Num UNIQUE (NumTlfMedecin)
);

Create table Patient (
     idPatient int NOT NULL AUTO_INCREMENT, 
     userNamePatient VARCHAR(50) NOT NULL, 
     passwordPatient VARCHAR(255) NOT NULL, 
     mailPatient VARCHAR(255) NOT NULL,
     nomPatient VARCHAR(50), 
     prenomPatient VARCHAR(50), 
     sexePatient TINYINT, 
     dateNaisPatient DATE,
     adressPatient VARCHAR(255),
     photoPatient VARCHAR(255), 
     degreGravite TINYINT, 
     dateInscriptionPatient DATETIME, 
     statusPatient TINYINT default 0, 
     lienJournalMedicament VARCHAR(255), 
     lienHistoriqueRV VARCHAR(255), 
     NumTlfPatient VARCHAR(10), 
     idTypeMaladie INT,
     idCommune INT,
     idMedecin INT,
     idProche INT,
     Primary key (idPatient),
     Constraint FK_pat_PatTypeMal FOREIGN KEY (idTypeMaladie) references TypeMaladie(idTypeMaladie) ON DELETE SET NULL,
     Constraint FK_pat_idCommune FOREIGN KEY (idCommune) references Commune(idCommune) ON DELETE SET NULL,
     Constraint FK_pat_idMed FOREIGN KEY (idMedecin) references Medecin (idMedecin) ON DELETE SET NULL,
     Constraint FK_pat_idProche FOREIGN KEY (idProche) references Proche (idProche) ON DELETE SET NULL,
     Constraint Unq_Pat_user UNIQUE (userNamePatient),
     Constraint Unq_Pat_mail UNIQUE (mailPatient),
     Constraint Unq_Pat_Num UNIQUE (NumTlfPatient)
);

Create table FichierECG (
     idFichierECG INT NOT NULL AUTO_INCREMENT, 
     lienFichier VARCHAR(255), 
     dateCreation DATETIME,
     idPatient INT,
     primary key(idFichierECG),
     Constraint FK_FichEcg_IdPa FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE
);

Create table Rendezvous (
     idRendezVous INT NOT NULL AUTO_INCREMENT,
     dateRV DATETIME, 
     idPatient int NOT NULL,
     primary key(idRendezVous),
     Constraint FK_RDV_IdPaa FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE
);

Create table ListAtt(
     idMedecin INT primary key,
     idPatient INT NOT NULL,
     Constraint FK_listAtt_IdPatient FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE,
     Constraint FK_listAtt_IdMede FOREIGN KEY (idMedecin) references Medecin (idMedecin) ON DELETE CASCADE
);

Create table ListMedicament (
     dateDebut DATETIME, 
     posologie INT,
     idPatient INT NOT NULL,
     idMedicament int NOT NULL,
     Constraint FK_listMed_IdPatie FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE,
     Constraint FK_listMed_IdMedicament FOREIGN KEY (idMedicament) references medicament (idMedicament) ON DELETE CASCADE,
     Primary KEY (idPatient,idMedicament)
);

Create table Rapport (
     idRapport INT NOT NULL AUTO_INCREMENT, 
     lienRapport VARCHAR(200), 
     dateRapport DATETIME,
     idPatient int NOT NULL,
     primary key (idRapport),
     Constraint FK_Rap_IdPati FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE
);

Create table NoteMedecin (
     idNote INT NOT NULL AUTO_INCREMENT, 
     DateNote DATETIME, 
     NoteMedecin VARCHAR(1000), 
     idPatient int NOT NULL,
     primary key (idNote),
     Constraint FK_Note_IdP FOREIGN KEY (idPatient) references Patient (idPatient) ON DELETE CASCADE
);

CREATE TABLE patientNonVerifie(
     idPatient INT NOT NULL,
     validationCode INT NOT NULL,
     PRIMARY KEY (idPatient),
     CONSTRAINT FK_patNonVerif_IdP FOREIGN KEY (idPatient) REFERENCES patient (idPatient) ON DELETE CASCADE
);

CREATE TABLE medecinNonVerifie(
     idMedecin INT NOT NULL,
     PRIMARY KEY (idMedecin),
     CONSTRAINT FK_medNonVerif_IdP FOREIGN KEY (idMedecin) REFERENCES medecin (idMedecin) ON DELETE CASCADE
);
