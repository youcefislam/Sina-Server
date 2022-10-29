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

const addMaladie = async (req, res) => {
  const { error, value } = await validateBody("validDiseaseType", req.body);
  if (error) res.status(400).send(error.details);
  else {
    // add the type if disease to the list
    let statement = "INSERT INTO typemaladie(typemaladie) VALUES(?);";
    dbPool.query(statement, value.TypeMaladie, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("## db error ## ", dberr);
        res.status(500).send({ error: "internal_server_error" });
      } else res.send();
    });
  }
};

module.exports = {
  getMaladiesList,
  addMaladie,
};
