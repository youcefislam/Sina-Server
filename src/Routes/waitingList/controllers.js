const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const getWaitingList = (req, res) => {
  let statement =
    "SELECT p.idPatient,p.nomPatient,p.prenomPatient FROM listatt l,patient p WHERE l.idMedecin=? and l.idPatient=p.idPatient;";
  dbPool.query(statement, req.autData.id, (dberr, results) => {
    if (dberr) {
      //database error
      console.log("## db err ##", dberr);
      res.status(500).send({ error: "internal_server_error" });
    } else res.send({ results });
  });
};

const addPatientRequest = (req, res) => {
  let statement = "INSERT INTO listatt (idMedecin,idPatient) values(?,?);";
  dbPool.query(
    statement,
    [req.body.idMedecin, req.autData.id],
    (dberr, results) => {
      if (dberr) {
        //database error
        console.log("## db err ##", dberr);
        res.sendStatus(500);
      } else {
        res.end();
      }
    }
  );
};

module.exports = {
  getWaitingList,
  addPatientRequest,
};
