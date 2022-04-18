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
     Constraint FK_IdWil FOREIGN KEY (idWilaya) references Wilaya(idWilaya)
);

Create table Commune (
     idCommune INT NOT NULL AUTO_INCREMENT, 
     nomCommune VARCHAR(50), 
     idDaira INT,
     primary key(idCommune),
     Constraint FK_IdDa FOREIGN KEY (idDaira) references Daira (idDaira)
);

Create table Hopital (
     idHoptial INT NOT NULL AUTO_INCREMENT, 
     nomHoptial VARCHAR(50), 
     adressHopital VARCHAR(255), 
     numTlfHopital VARCHAR(10), 
     idCommune INT,
     primary key(idHoptial),
     Constraint FK_idCommun FOREIGN KEY (idCommune) references Commune (idCommune),
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
     userNameMedecin VARCHAR(50), 
     passwordMedecin VARCHAR(255), 
     mailMedecin VARCHAR(255), 
     nomMedecin VARCHAR(50), 
     prenomMedecin VARCHAR(50), 
     sexeMedecin TINYINT, 
     photoMedecin VARCHAR(255), 
     dateInscriptientMedecin DATETIME, 
     NumTlfMedecin VARCHAR(10), 
     autoAccept TINYINT default 0,
     idDaira INT,
     primary key (idMedecin),
     Constraint Fk_IdDaira FOREIGN KEY (idDaira) references Daira (idDaira),
     Constraint Unq_Med_user UNIQUE (userNameMedecin),
     Constraint Unq_Med_mail UNIQUE (mailMedecin),
     Constraint Unq_Med_Num UNIQUE (NumTlfMedecin)
);

Create table Patient (
     idPatient int NOT NULL AUTO_INCREMENT, 
     userNamePatient VARCHAR(50), 
     passwordPatient VARCHAR(255), 
     mailPatient VARCHAR(255),
     nomPatient VARCHAR(50), 
     prenomPatient VARCHAR(50), 
     sexePatient TINYINT, 
     dateNaisPatient DATETIME,
     adressPatient VARCHAR(255),
     photoPatient VARCHAR(255), 
     degreGravite TINYINT, 
     dateInscriptionPatient DATETIME, 
     statusPatient TINYINT, 
     lienJournalMedicament VARCHAR(255), 
     lienHistoriqueRV VARCHAR(255), 
     NumTlfPatient VARCHAR(10), 
     idTypeMaladie INT,
     idCommune INT,
     idMedecin INT,
     idProche INT,
     Primary key (idPatient),
     Constraint FK_PatTypeMal FOREIGN KEY (idTypeMaladie) references TypeMaladie(idTypeMaladie),
     Constraint FK_idCommune FOREIGN KEY (idCommune) references Commune(idCommune),
     Constraint FK_idMed FOREIGN KEY (idMedecin) references Medecin (idMedecin),
     Constraint FK_idProche FOREIGN KEY (idProche) references Proche (idProche),
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
     Constraint FK_IdPa FOREIGN KEY (idPatient) references Patient (idPatient)
);

Create table Rendezvous (
     idRendezVous INT NOT NULL AUTO_INCREMENT,
     dateRV DATETIME, 
     lieuRV VARCHAR(255), 
     idPatient int,
     primary key(idRendezVous),
     Constraint FK_IdPaa FOREIGN KEY (idPatient) references Patient (idPatient)
);

Create table ListAtt(
     idMedecin INT primary key,
     idPatient INT,
     Constraint FK_IdPatient FOREIGN KEY (idPatient) references Patient (idPatient),
     Constraint FK_IdMede FOREIGN KEY (idMedecin) references Medecin (idMedecin)
);

Create table ListMedicament (
     dateDebut DATETIME, 
     posologie INT,
     idMedecin INT,
     idPatient INT,
     Constraint FK_IdPatie FOREIGN KEY (idPatient) references Patient (idPatient),
     Constraint FK_IdMedi FOREIGN KEY (idMedecin) references Medecin (idMedecin),
     Primary KEY (idPatient,idMedecin)
);

Create table Rapport (
     idRapport INT NOT NULL AUTO_INCREMENT, 
     lienRapport VARCHAR(200), 
     dateRapport DATETIME,
     idPatient int,
     primary key (idRapport),
     Constraint FK_IdPati FOREIGN KEY (idPatient) references Patient (idPatient)
);

Create table NoteMedecin (
     idNote INT NOT NULL AUTO_INCREMENT, 
     DateNote DATETIME, 
     NoteMedecin VARCHAR(1000), 
     idPatient int,
     primary key (idNote),
     Constraint FK_IdP FOREIGN KEY (idPatient) references Patient (idPatient)
);

