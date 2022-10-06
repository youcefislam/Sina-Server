const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const getMaladiesList = (req, res) => {
  // select all the type of disease
  let statement = "SELECT idTypeMaladie,TypeMaladie FROM typemaladie";
  dbPool.query(statement, (dberr, result) => {
    if (dberr) {
      // database error
      console.log("## db err ## ", dberr);
      res.status(500).send({ error: "internal_server_error" });
    } else res.send({ results: result });
  });
};

module.exports = {
  getMaladiesList,
};
