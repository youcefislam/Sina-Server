const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const getCommuneList = async (req, res) => {
  const { error, value } = await validateBody("validId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "SELECT idCommune,nomCommune FROM commune WHERE idDaira=?;";
    dbPool.query(statement, value.id, (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else res.send({ results: result });
    });
  }
};

module.exports = {
  getCommuneList,
};
