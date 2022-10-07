const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const patientSignUp = async (req, res) => {
  const { error, value } = await validateBody("patientSignUp", req.body);
  if (error) res.status(400).send(error.details);
  else {
    const { hash, error } = await hashPassword(req.body.password);
    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      let statement =
        "INSERT INTO patient(userNamePatient,passwordPatient,mailPatient,dateInscriptionPatient) VALUES(?,?,?,CURDATE());";
      dbPool.query(
        statement,
        [value.username, hash, value.email],
        (dbErr, result1) => {
          if (dbErr) {
            console.log("##db error##", dbErr);
            if (dbErr.errno == 1062)
              res.status(400).send({
                error: 1062,
                message: dbErr.sqlMessage,
              });
            else res.status(500).send({ error: "internal_server_error" });
          } else {
            statement = "INSERT INTO patientNonVerifie values (?,?);";
            const validationCode = Math.floor(Math.random() * 899999 + 100000);
            dbPool.query(
              statement,
              [result1.insertId, validationCode],
              async (dbErr, result2) => {
                if (dbErr) {
                  console.log("##db error##", dbErr);
                  res.status(500).send({ error: "internal_server_error" });
                } else {
                  const emailBody = `
                          <h3>Cher ${value.username}!</h3>
                          <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
                          <p style="font-weight: bold;color: #0DBDA5;">${validationCode}</p>
                          <p>Cordialement,</p>
                          <p>L'équipe de Sina.</p>`;
                  const validationMail = {
                    to: value.email,
                    from: "sina.app.pfe@outlook.fr",
                    subject: "Vérifiez votre adresse e-mail ✔",
                    text: "Sina support team",
                    html: emailBody,
                  };
                  const { error } = await sendMail(validationMail);
                  if (error)
                    res.status(500).send({ error: "internal_server_error" });
                  else {
                    const { token, error } = await generateToken({
                      id: result1.insertId,
                      username: value.username,
                      patient: 1,
                    });
                    if (error)
                      res.status(500).send({ error: "internal_server_error" });
                    else res.send({ validationCode, token });
                  }
                }
              }
            );
          }
        }
      );
    }
  }
};

module.exports = {
  patientSignUp,
};
