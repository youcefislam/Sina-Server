const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
  sendTwilloMessage,
} = require("../../Utilities/utility");
const validateBody = require("../../Utilities/validations");

const sendAlert = async (req, res) => {
  const { error, value } = await validateBody("validAlert", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const statement =
      "SELECT NumTlfMedecin,nomPatient,prenomPatient,NumTlfProche FROM medecin m,patient p,proche pr WHERE p.idPatient=? and p.idMedecin=m.idMedecin and pr.idProche=p.idProche;";
    dbPool.query(statement, req.autData.id, async (dbErr, result) => {
      if (dbErr) res.status(500).send({ error: "internal_server_error" });
      else {
        const messageMedecin = `On a detecter une arythmie de type ${value.heartCondition} pour votre patient ${result[0].nomPatient} ${result[0].prenomPatient}. son emplacement: https://www.google.com/maps/search/?api=1&query=${value.latitude}%2C${value.longitude} -Sina Health Team`;
        const messageProche = `On a detecter une arythmie de type ${value.heartCondition} pour votre proche ${result[0].nomPatient} ${result[0].prenomPatient}. Vous devez contactez son medecin (${result[0].NumTlfMedecin}). son emplacement: https://www.google.com/maps/search/?api=1&query=${value.latitude}%2C${value.longitude} -Sina Health Team`;
        const [errorMed, errorProche] = await Promise.all([
          sendTwilloMessage(result[0].NumTlfMedecin, messageMedecin),
          sendTwilloMessage(result[0].NumTlfProche, messageProche),
        ]);
        if (errorMed || errorProche)
          res.status(500).send({ error: "internal_server_error" });
        else res.end();
      }
    });
  }
};

module.exports = {
  sendAlert,
};
