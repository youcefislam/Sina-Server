const sequelize = require("./connection");
const Wilaya = require("../Models/Wilaya");
const Daira = require("../Models/Daira");
const Commune = require("../Models/Commune");
const Hopital = require("../Models/Hopital");
const TypeMaladie = require("../Models/TypeMaladie");
const Medicament = require("../Models/Medicament");
const Proche = require("../Models/Proche");
const Medecin = require("../Models/Medecin");
const Patient = require("../Models/Patient");
const FichierECG = require("../Models/FichierECG");
const Rendezvous = require("../Models/Rendezvous");
const ListAtt = require("../Models/ListAtt");
const ListMedicament = require("../Models/ListMedicament");
const Rapport = require("../Models/Rapport");
const NoteMedecin = require("../Models/NoteMedecin");
const patientNonVerifie = require("../Models/patientNonVerifie");
const medecinNonVerifie = require("../Models/medecinNonVerifie");

sequelize.sync().catch((err) => console.log(err));
