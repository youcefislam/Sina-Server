const sequelize = require("sequelize");

const medecinNonVerifie = require("../../Models/medecinNonVerifie");
const medecin = require("../../Models/Medecin");
const daira = require("../../Models/Daira");
const wilaya = require("../../Models/Wilaya");
const patient = require("../../Models/Patient");

function queryErrorHandler(type, error) {
  this.type = type;
  this.path = error.path;
}

const insertMedecin = async (
  userNameMedecin,
  passwordMedecin,
  mailMedecin,
  nomMedecin,
  prenomMedecin,
  sexeMedecin,
  photoMedecin,
  NumTlfMedecin,
  idDaira
) => {
  try {
    const values = {
      userNameMedecin,
      passwordMedecin,
      mailMedecin,
      nomMedecin,
      prenomMedecin,
      sexeMedecin,
      photoMedecin,
      dateInscriptientMedecin: sequelize.fn("CURDATE"),
      NumTlfMedecin,
      idDaira,
    };
    return await medecin.create(values);
  } catch (error) {
    if (error instanceof sequelize.UniqueConstraintError)
      throw new queryErrorHandler("duplicated_entry_error", error.errors[0]);
    else throw new Error(error);
  }
};

const insertNotVerifiedMedecin = async ({ idMedecin }) => {
  try {
    return await medecinNonVerifie.create({
      idMedecin,
    });
  } catch (error) {
    medecin.destroy();
    throw new Error(error);
  }
};

const selectMedecinByUsername = async (usernameMedecin) => {
  try {
    return await medecin.findOne({
      where: {
        usernameMedecin,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const selectMedecinById = async (idMedecin) => {
  try {
    return await medecin.findOne({
      where: {
        idMedecin,
      },
      include: {
        model: daira,
        as: "daira",
        include: {
          model: wilaya,
          as: "wilaya",
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const selectMedecinByMail = async (mailMedecin) => {
  try {
    return await medecin.findOne({
      where: {
        mailMedecin,
      },
      include: {
        model: daira,
        as: "daira",
        include: {
          model: wilaya,
          as: "wilaya",
        },
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const selectAllMedecin = async () => {
  try {
    return await medecin.findAll({
      attributes: { exclude: ["passwordMedecin"] },
      nest: false,
      include: {
        model: daira,
        as: "daira",
        include: {
          model: wilaya,
          as: "wilaya",
        },
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMedecinAccount = async (idMedecin) => {
  try {
    await medecin.destroy({
      where: {
        idMedecin,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const updateMedecin = async (newValues, options) => {
  try {
    await medecin.update(newValues, {
      where: options,
    });
  } catch (error) {
    if (error instanceof sequelize.UniqueConstraintError)
      throw new queryErrorHandler("duplicated_entry_error", error.errors[0]);
    else if (error instanceof sequelize.ForeignKeyConstraintError)
      throw new queryErrorHandler("invalid_data", { path: error.fields[0] });
    else throw new Error(error);
  }
};

const selectMedecinsPatientList = async (idMedecin) => {
  try {
    const patientList = await patient.findAll({
      attributes: {
        exclude: ["passwordPatient"],
      },
      where: {
        idMedecin,
      },
    });
    return patientList;
  } catch (error) {
    throw new Error(error);
  }
};

const selectMedecinByPatientId = async (idPatient) => {
  try {
    const { idMedecin } = await patient.findOne({
      attributes: ["idMedecin"],
      where: {
        idPatient,
      },
    });
    return idMedecin;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  insertMedecin,
  insertNotVerifiedMedecin,
  selectMedecinById,
  selectMedecinByUsername,
  selectAllMedecin,
  deleteMedecinAccount,
  updateMedecin,
  selectMedecinsPatientList,
  selectMedecinByPatientId,
  selectMedecinByMail,
};
