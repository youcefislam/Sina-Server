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

const acceptPatientRequest = async (req, res) => {
  // received data form validation
  const { error, value } = await validateBody("validPatientApproval", req.body);
  if (error) res.send(400).send(error.details);
  else {
    let statement = "SELECT idMedecin FROM ListAtt WHERE idPatient=?  LIMIT 1;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("##dberr##", dberr);
        res.status(500).send({ error: "internal_server_error" });
      } else {
        if (result[0]?.idMedecin == req.autData.id) {
          statement =
            "UPDATE patient SET idMedecin=?,idTypeMaladie=?,degreGravite=? WHERE idPatient=?;";
          dbPool.query(
            statement,
            [
              result[0].idMedecin,
              value.idTypeMaladie,
              value.degreGravite,
              value.idPatient,
            ],
            (dberr, result) => {
              if (dberr) {
                // database doctor
                console.log("## db err ##", dberr);
                res.status(500).send({ error: "internal_server_error" });
              } else {
                // we delete the patient from the doctor's waiting list
                statement =
                  "DELETE FROM ListAtt WHERE idPatient=? && idMedecin=?";
                dbPool.query(
                  statement,
                  [value.idPatient, req.autData.id],
                  (dberr, result) => {
                    if (dberr) {
                      // database error
                      console.log("## db err ##", dberr);
                      res.status(500).send({ error: "internal_server_error" });
                    } else res.end();
                  }
                );
              }
            }
          );
        } else res.status(400).send({ error: "request_not_found" });
      }
    });
  }
};

const refusePatientRequest = async (req, res) => {
  const { error, value } = await validateBody("validPatientId", req.body);
  if (error) res.status(400).send(error.details);
  else {
    let statement = "SELECT idMedecin FROM listatt WHERE idPatient=? LIMIT 1;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        console.log("## db error", dberr);
        res.status(500).send({ error: "internal_server_error" });
      } else {
        if (result[0]?.idMedecin == req.autData.id) {
          statement = "DELETE FROM listatt WHERE  idPatient=?;";
          dbPool.query(statement, value.idPatient, (dberr, result) => {
            if (dberr) {
              console.log("## db error ## ", dberr);
              res.status(500).send({ error: "internal_server_error" });
            } else res.end();
          });
        } else res.status(400).send({ error: "request_not_found" });
      }
    });
  }
};

module.exports = {
  getWaitingList,
  addPatientRequest,
  acceptPatientRequest,
  refusePatientRequest,
};
