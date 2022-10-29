const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const getAllHospitals = async (req, res) => {
  let statement = "SELECT * FROM hopital;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const getHospitalsByCommune = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
  }
  let statement = "SELECT * FROM hopital WHERE idCommune=?;";
  dbPool.query(statement, value.id, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const getHospitalsByDaira = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
  }
  let statement =
    "SELECT * FROM hopital WHERE idCommune IN (select idCommune FROM commune WHERE idDaira=?);";
  dbPool.query(statement, value.id, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const getHospitalsByWilaya = async (req, res) => {
  const { error, value } = await validateBody("validId", req.params);
  if (error) res.status(400).send(error.details);
  else {
  }
  let statement =
    "SELECT * FROM hopital WHERE idCommune IN (select idCommune FROM commune WHERE idDaira IN (SELECT idDaira FROM daira WHERE idWilaya=?));";
  dbPool.query(statement, value.id, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

const addNewHospital = async (req, res) => {
  const { error, value } = await validateBody("validHospital", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "insert into hopital(nomHopital,adressHopital,numTlfHopital,idCommune) values(?,?,?,?);";
    dbPool.query(
      statement,
      [value.nomHopital, value.adress, value.numeroTlf, value.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const modifyHospital = async (req, res) => {
  const { error, value } = await validateBody("validHospital", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement =
      "UPDATE hopital SET nomHopital=?,adressHopital=?,numTlfHopital=? WHERE idHopital=?;";
    dbPool.query(
      statement,
      [value.nomHopital, value.adress, value.numeroTlf, value.id],
      (dbErr, result) => {
        if (dbErr) res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    );
  }
};

const deleteHospital = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "DELTE FROM hopital WHERE idHopital=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.end();
    });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalsByCommune,
  getHospitalsByDaira,
  getHospitalsByWilaya,
  addNewHospital,
  modifyHospital,
  deleteHospital,
};
