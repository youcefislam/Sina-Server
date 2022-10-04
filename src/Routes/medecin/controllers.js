const mysql = require("mysql");
const {
  medecinSignUpJoi,
  medecinSignInJoi,
} = require("../../Utilities/validations");
const {
  hashPassword,
  generateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

// ### Connection with the database ### -- tested
var dbPool = mysql.createPool({
  connectionLimit: 30,
  host: "localhost",
  user: "sina",
  password: "password",
  database: "sina",
  multipleStatements: true,
});

const medecinSignUp = async (req, res) => {
  // Check the data form and verify it

  const { error, value } = await medecinSignUpJoi(req.body);

  if (error) {
    res.status(403).send(error.details);
  } else {
    // Hashing the password using the bcrypt module
    const { hash, error } = await hashPassword(value.password);

    if (error) res.status(500).send({ error: "internal_server_error" });
    else {
      // SQL statement we dont use the data here to prevent SQL injections so we replace the fields with a ? and add them when we execute the statement
      let statement = `INSERT INTO medecin(userNameMedecin,passwordMedecin,mailMedecin,nomMedecin,prenomMedecin,sexeMedecin,photoMedecin,dateInscriptientMedecin,NumTlfMedecin,idDaira)
          VALUES(?,?,?,?,?,?,?,curdate(),?,?);`;
      value.numeroTlf =
        value.numeroTlf[0] == "0" ? value.numeroTlf.slice(1) : value.numeroTlf;
      // Add the doctor to our database
      dbPool.query(
        statement,
        [
          value.username,
          hash,
          value.email,
          value.nom,
          value.prenom,
          value.sex,
          req.file ? req.file.path : null,
          value.numeroTlf,
          value.daira,
        ],
        (dbErr, result) => {
          // If any database error occure
          if (dbErr) {
            console.log("##db error##", dbErr);
            // if we have double entry error
            if (dbErr.errno == 1062)
              res.status(403).send({
                error: 1062,
                message: dbErr.sqlMessage,
              });
            else res.status(500).send({ error: "internal_server_error" }); // Internal server ERROR
          } else {
            // Everything is good we move on
            // we add the doctor to the not verified accounts table
            statement = "INSERT INTO medecinNonVerifie VALUES(?);";
            dbPool.query(
              statement,
              result.insertId,
              async (dbEerr, result2) => {
                if (dbEerr) {
                  // database error
                  console.log("## db error ## ", dbErr);
                  res.status(500).send({ error: "internal_server_error" });
                } else {
                  // Create a token for the user
                  const { token, error } = await generateToken({
                    id: result.insertId,
                    username: value.username,
                  });
                  if (error)
                    res.status(500).send({ error: "internal_server_error" });
                  else {
                    const url = `http://localhost:3000/confirmation/${token}`;
                    const emailBody = `
                                <h3>Cher ${value.username}!</h3>
                                <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                                <a href='${url}'>${url}</a>
                                <p>Cordialement,</p>
                                <p>L'équipe de Sina.</p>`;
                    // We send a confirmation mail to the user here
                    const mail = {
                      to: value.email, // Change to your recipient
                      from: "sina.app.pfe@outlook.fr", // Change to your verified sender
                      subject: "Vérifiez votre adresse e-mail ✔",
                      text: "Sina support team",
                      html: emailBody,
                    };
                    const { error } = await sendMail(mail);
                    if (error)
                      res.status(500).send({ error: "internal_server_error" });
                    else res.send({ token });
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

const medecinSignIn = async (req, res) => {
  // we validate the form of data we receive
  const { error, value } = await medecinSignInJoi(req.body);
  if (error) {
    // data not valid
    console.log(error);
    res.status(403).send(error.details);
  } else {
    // valid data .. next
    // select the user information from the database and compare it to the received data
    let statement =
      "SELECT idMedecin,passwordMedecin FROM medecin WHERE usernameMedecin=?";
    dbPool.query(statement, value.username, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "internal_server_error" });
      } else {
        if (result[0]) {
          // Account exist
          const { error, correct } = await comparePassword(
            value.password,
            result[0].passwordMedecin
          );
          if (error) res.status(500).send({ error: "internal_server_error" });
          else {
            if (correct) {
              const { token, error } = await generateToken({
                id: result[0].idMedecin,
                username: value.username,
              });
              if (error)
                res.status(500).send({ error: "internal_server_error" });
              else res.send({ token });
            } else {
              res.status(403).send({ error: "password" });
            }
          }
        } else res.status(403).send({ error: "username" });
      }
    });
  }
};

module.exports = {
  medecinSignUp,
  medecinSignIn,
};
