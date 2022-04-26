const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const multer = require("multer"); // Used for handling multipart/form-data, which is primarily used for uploading files. For more detail check: https://www.npmjs.com/package/multer
const bcrypt = require("bcrypt"); // Library to hash password. For more detail check: https://www.npmjs.com/package/bcrypt
var jwt = require("jsonwebtoken"); // Used to create/verify tokens. For more detail check: https://www.npmjs.com/package/jsonwebtoken
const joi = require("joi"); // Used to validate the form of the received data. For more detail check: https://joi.dev/Route/?v=17.6.0
const nodemailer = require("nodemailer"); // Used to send mails. For more detail check: https://nodemailer.com/about/
const moment = require("moment"); // for better date and time treatment For more detail check:https://momentjs.com/
const res = require("express/lib/response");

// ### initialization of express ###
var app = express();
app.use(express.json({ limit: "1mb" })); // Maximum request body size

// ### Connection with the database ### -- tested
var dbPool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "sina",
  password: "password",
  database: "sina",
  multipleStatements: true,
});
// dbPool.on("acquire", function (connection) {
//   console.log("Connection %d acquired", connection.threadId);
// });
// dbPool.on("connection", function (connection) {
//   console.log("Connection started");
// });
// dbPool.on("enqueue", function () {
//   console.log("Waiting for available connection slot");
// });
// dbPool.on("release", function (connection) {
//   console.log("Connection %d released", connection.threadId);
// });

// ### setting up multer ###-- tested
// Check File Type
const checkFileType = (file, cb) => {
  //type of valid extension
  const filetype = /jpeg|jpg|png/;
  //check file extension
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  // check the mimetype
  const mimetype = filetype.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error : Image Only");
  }
};

// setting the disk storage engine -- tested
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/uploads/Media");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: photoStorage, // where to store the files
  limits: 1000000, // limit of the uploaded data
  fileFilter: (res, file, cb) => {
    checkFileType(file, cb); // type of valid files
  },
});

// Static files serving Middleware (allow access to these files publicly) -- tested
app.use("/public/views", express.static("public/views"));
app.use("/public/uploads/Media", express.static("public/uploads/Media"));
app.use("/public/views", express.static("public/views"));

// Data form validation with joi
const medecinSignUp = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
  repeat_password: joi.ref("password"),
  email: joi.string().email().required(),
  nom: joi.string().max(50).required(),
  prenom: joi.string().max(50).required(),
  numeroTlf: joi.string().max(10).required(),
  sex: joi.number().max(1).required(),
  address: joi.string().max(400).required(),
  wilaya: joi.number().required(),
  daira: joi.number().required(),
});
const medecinSignIn = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
});
const patientSignUp = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
  repeat_password: joi.ref("password"),
  email: joi.string().email().required(),
});
const patientInfo = joi.object({
  nom: joi.string().max(50).required(),
  prenom: joi.string().max(50).required(),
  sex: joi.number().max(1).required(),
  dateNaiss: joi.date().required(),
  adress: joi.string().max(255).required(),
  idCommune: joi.number().required(),
});
const relativeInfo = joi.object({
  nom: joi.string().max(50).required(),
  prenom: joi.string().max(50).required(),
  numeroTlf: joi.string().max(10).required(),
  email: joi.string().email().required(),
});
const patientSignIn = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
});

// Getting the secret key for jwt (to be changed later)
const mySecretKey =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNzkwMTUwMDY0IiwibmFtZSI6IllvdWNlZiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.BZN25sqbB_Qm7KQq7GyeFjYoWo2J_XvuWZw-2ocFGVWBXHc7v5-UHbYB7xmTvI_NBG8RaFh7wOfs4PNUJ7anlI8nHQQ5QF10kU-CLDO-18dG52uepkTX1vUqbUvNLG4QqLhidj-IcLgpHgfUPjiBq5YHyXyzEkRtyZZKOvDTRQtBBLqqoSxvgKq6FBQJZz47UbacVXOkPFyXC74u28QOZdA5vrQip7Gdex_rt2HNCzs977kTf4lhHJYF5UQcXLrLbo2vQ6V-5wupYLlmF2CCyG9dLxRzxbNY2oBOdqQy2DyRWqONtsnP3Z9s_KrbIgLfhPQLDB4x24UYUu9le7Q_A";
// verify token function with jwt -- tested
const verifiToken = (req, res, next) => {
  // console.log(req.headers);
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    // we split the bearerHeader and take the bearer token
    req.token = bearerHeader.split(" ")[1];
    jwt.verify(req.token, mySecretKey, (err, autData) => {
      // verify the token
      if (err) res.sendStatus(403);
      else {
        req.autData = autData;
        next();
      }
    });
  } else res.sendStatus(403);
};

//int nodemailer (to be added later) -- tested
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sina.app.pfe@gmail.com", // generated ethereal user
    pass: "sinapassword1", // generated ethereal password
  },
});

// Here goes the Route
// Sign up Route for doctors -- tested
app.post("/medecin/signup", upload.single("photo"), (req, res) => {
  // Check the data form and verify it
  const { error, value } = medecinSignUp.validate(req.body);
  if (error) {
    // if errors occurs we delete the image from the file system if exist
    if (req.file)
      fs.unlink(path.normalize(req.file.path), (err) => {
        if (err) console.log("##fs error##", err);
      });
    res.status(403).send(error.details);
  } else {
    // Hashing the password using the bcrypt module
    const saltRounds = 10;
    bcrypt
      .hash(value.password, saltRounds)
      .then((hash) => {
        // SQL statement we dont use the data here to prevent SQL injections so we replace the fields with a ? and add them when we execute the statement
        let statement = `INSERT INTO medecin(userNameMedecin,passwordMedecin,mailMedecin,nomMedecin,prenomMedecin,sexeMedecin,photoMedecin,dateInscriptientMedecin,NumTlfMedecin,idDaira)
        VALUES(?,?,?,?,?,?,?,curdate(),?,?);`;
        // Add the doctor to our database
        dbPool.query(
          sql,
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
              if (req.file)
                fs.unlink(path.normalize(req.file.path), (err) => {
                  if (err) console.log("##fs error##", err);
                });
              console.log("##db error##", dbErr);
              // if we have double entry error
              if (dbErr.errno == 1062)
                res.status(403).send(
                  JSON.stringify({
                    error: 1062,
                    message: dbErr.sqlMessage,
                  })
                );
              else res.sendStatus(500); // Internal server ERROR
            } else {
              // Everything is good we move on
              // we add the doctor to the not verified accounts table
              statement = "INSERT INTO medecinNonVerifie VALUES(?);";
              dbPool(statement, result.insertId, (dbEerr, result2) => {
                if (dbEerr) {
                  // database error
                  console.log("## db error ## ", dbErr);
                  res.sendStatus(500);
                } else {
                  // Create a token for the user
                  jwt.sign(
                    { id: result.insertId, username: value.username },
                    mySecretKey,
                    (jwtErr, token) => {
                      if (jwtErr) {
                        if (req.file)
                          fs.unlink(path.normalize(req.file.path), (err) => {
                            if (err) console.log(err);
                          });
                        console.log(jwtErr);
                        res.sendStatus(500);
                      } else {
                        const url = `http://localhost:3000/confirmation/${token}`;
                        const emailBody = `
                                <h3>Cher ${value.username}!</h3>
                                <p>TVeuillez cliquer sur le lien de confirmation ci-dessous pour vérifier votre adresse e-mail et créer votre compte:</p>
                                <a href='${url}'>${url}</a>
                                <p>Cordialement,</p>
                                <p>L'équipe de Sina.</p>`;
                        // We send a confirmation mail to the user here
                        transporter.sendMail(
                          {
                            from: '"Sina" sina.app.pfe@gmail.com', // sender address
                            to: value.email, // list of receivers
                            subject: "Vérifiez votre adresse e-mail ✔", // Subject line
                            text: "Sina support team", // plain text body
                            html: emailBody, // html body
                          },
                          (MailerErr, data) => {
                            if (MailerErr) {
                              if (req.file)
                                fs.unlink(
                                  path.normalize(req.file.path),
                                  (err) => {
                                    if (err) console.log(err);
                                  }
                                );
                              console.log(MailerErr);
                              res.sendStatus(500);
                            } else {
                              res.send(JSON.stringify({ token }));
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      })
      .catch((bcrypterr) => {
        if (req.file)
          fs.unlink(path.normalize(req.file.path), (err) => {
            if (err) console.log("##fs error##", err);
          });
        console.log(bcrypterr);
        res.sendStatus(500);
      });
  }
});

// Sign in a doctor Route -- tested
app.get("/medecin/signin", (req, res) => {
  // we validate the form of data we receive

  const { error, value } = medecinSignIn.validate(req.body);
  if (error) {
    // data not valid
    res.status(403).send(error.details);
  } else {
    // valid data .. next
    // select the user information from the database and compare it to the received data
    let statement =
      "SELECT idMedecin,passwordMedecin FROM medecin WHERE usernameMedecin=?";
    dbPool.query(statement, value.username, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (result[0]) {
          // Account exist
          bcrypt.compare(
            value.password,
            result[0].passwordMedecin,
            (err, correct) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                if (correct) {
                  // Correct password
                  // Token generation
                  jwt.sign(
                    { id: result[0].idMedecin, username: value.username },
                    mySecretKey,
                    (err, token) => {
                      if (err) {
                        console.log(err);
                        res.sendStatus(500);
                      } else {
                        // token generated we send it back to the user
                        res.send(JSON.stringify({ token }));
                      }
                    }
                  );
                } else {
                  // Wrong password
                  res.status(403).send(JSON.stringify({ error: "password" }));
                }
              }
            }
          );
        } else {
          // No account exist with that username
          res.status(403).send(JSON.stringify({ error: "username" }));
        }
      }
    });
  }
});

// Account validation Route -- tested
app.post("/confirmation/:token", (req, res) => {
  jwt.verify(req.params.token, mySecretKey, (err, autData) => {
    if (err) res.sendStatus(403); // invalid token
    else res.sendStatus(200); //valid token
  });
});

// Delete doctor's account Route -- tested
app.post("/medecin/delete", verifiToken, (req, res) => {
  let statement = "DELETE FROM medecin WHERE idMedecin=?";
  dbPool.query(statement, req.autData.id, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

// Modify the relative's mail Route -- tested
app.post("/patient/relative/modify/email", verifiToken, (req, res) => {
  const { error, value } = Joi.object({
    email: joi.string().email().required(),
  }).validate(req.body);
  if (error) res.status(403).send(error.details);
  else {
    sql =
      "UPDATE proche SET mailProche = ? WHERE idProche=(SELECT idProche FROM patient WHERE idPatient=?);";
    dbPool.query(sql, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        // if we have double entry error
        if (dbErr.errno == 1062)
          res.status(403).send(
            JSON.stringify({
              error: 1062,
              message: dbErr.sqlMessage,
            })
          );
        else res.sendStatus(500); // Internal server ERROR
      } else {
        // mail modified successfully
        res.end();
      }
    });
  }
});
// Modify doctor's mail Route -- tested
app.post("/medecin/modifyMail", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ email: joi.string().email().required() })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE medecin SET mailMedecin=? WHERE idMedecin=?";
    dbPool.query(statement, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        // if we have double entry error
        if (dbErr.errno == 1062)
          res.status(403).send(
            JSON.stringify({
              error: 1062,
              message: dbErr.sqlMessage,
            })
          );
        else res.sendStatus(500); // Internal server ERROR
      } else res.end();
    });
  }
});

// Modify doctor's username Route -- tested
app.post("/medecin/modifyUsername", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ username: joi.string().min(6).required() })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE medecin SET userNameMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [value.username, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send(
              JSON.stringify({
                error: 1062,
                message: dbErr.sqlMessage,
              })
            );
          else res.sendStatus(500); // Internal server ERROR
        } else
          jwt.sign(
            { id: req.autData.id, username: value.username },
            mySecretKey,
            (err, token) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                // token generated we send it back to the user
                res.send(JSON.stringify({ token }));
              }
            }
          );
      }
    );
  }
});

// Modify doctor's password Route -- tested
app.post("/medecin/modifyPassword", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    const saltRounds = 10;
    bcrypt
      .hash(value.password, saltRounds)
      .then((hash) => {
        let statement =
          "UPDATE medecin SET passwordMedecin=? WHERE idMedecin=?";
        dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
          if (dbErr) {
            console.log("##db error##", dbErr);
            res.sendStatus(500); // Internal server ERROR
          } else res.end();
        });
      })
      .catch((bcrypterr) => {
        console.log(bcrypterr);
        res.sendStatus(500);
      });
  }
});

// Modify doctor's first and last name Route -- tested
app.post("/medecin/modifyName", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      nom: joi.string().max(50).required(),
      prenom: joi.string().max(50).required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement =
      "UPDATE medecin SET nomMedecin=?,prenomMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [value.nom, value.prenom, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
});

// Modify doctor's phone number Route -- tested
app.post("/medecin/modifyNumber", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      numeroTlf: joi.string().max(10).required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE medecin SET NumTlfMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [value.numeroTlf, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send(
              JSON.stringify({
                error: 1062,
                message: dbErr.sqlMessage,
              })
            );
          else res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
});

// Modify doctor's auto accept Route -- tested
app.post("/medecin/modifyAccept", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ auto: joi.number().max(1).required() })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE medecin SET autoAccept=? WHERE idMedecin=?";
    dbPool.query(statement, [value.auto, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        res.sendStatus(500); // Internal server ERROR
      } else res.end();
    });
  }
});

// Modify doctor's daira Route -- tested
app.post("/medecin/modifyDaira", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      daira: joi.number().required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement =
      "UPDATE medecin SET idDaira=(SELECT idDaira FROM daira WHERE idDaira=?) WHERE idMedecin=?;";
    dbPool.query(statement, [value.daira, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        res.sendStatus(500); // Internal server ERROR
      } else res.end();
    });
  }
});

// Modify doctor's photo Route -- tested
app.post(
  "/medecin/modifyPhoto",
  verifiToken,
  upload.single("photo"),
  (req, res) => {
    let statement = "UPDATE medecin SET photoMedecin=? WHERE idMedecin=?";
    dbPool.query(
      statement,
      [req.file ? req.file.path : null, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
);

// get the waiting list of a doctor -- tested
app.get("/medecin/waitinglist", verifiToken, (req, res) => {
  // select all the doctor's patients
  let statement =
    "SELECT p.idPatient,p.nomPatient,p.prenomPatient FROM listatt l,patient p WHERE l.idMedecin=? and l.idPatient=p.idPatient LIMIT 1;";
  dbPool.query(statement, req.autData.id, (dberr, results) => {
    if (dberr) {
      //database error
      console.log("## db err ##", dberr);
      res.sendStatus(500);
    } else {
      // we send the list back
      res.send(JSON.stringify(results));
    }
  });
});

// Accept patient from waiting list Route -- tested
app.post("/medecin/waitinglist/accept", verifiToken, (req, res) => {
  // received data form validation
  const { error, value } = joi
    .object({
      idPatient: joi.number().required(),
      degreGravite: joi.number().max(10).required(),
      idTypeMaladie: joi.number().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // valid data
    // verify if the patient is in the list of this doctor
    let statement = "SELECT idMedecin FROM ListAtt WHERE idPatient=?  LIMIT 1;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("##dberr##", dberr);
        res.sendStatus(500);
      } else {
        if (result[0] && result[0].idMedecin == req.autData.id) {
          // the patient exist in the doctor's waiting list
          // updating the patient's doctor
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
                res.sendStatus(500);
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
                      res.sendStatus(500);
                    } else {
                      // row deleted
                      // notify patient ?
                      res.end();
                    }
                  }
                );
              }
            }
          );
        } else {
          // the patient doesn't appear in the doctor's waiting list
          res.sendStatus(403);
        }
      }
    });
  }
});

// Modify the relative's phone number Route -- tested
app.post("/patient/relative/modify/number", verifiToken, (req, res) => {
  const { error, value } = Joi.object({
    number: joi.string().min(10).required(),
  }).validate(req.body);
  if (error) res.status(403).send(error.details);
  else {
    sql =
      "UPDATE proche SET NumTlfProche = ? WHERE idProche=(SELECT idProche FROM patient WHERE idPatient=?);";
    dbPool.query(sql, [value.number, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        // if we have double entry error
        if (dbErr.errno == 1062)
          res.status(403).send(
            JSON.stringify({
              error: 1062,
              message: dbErr.sqlMessage,
            })
          );
        else res.sendStatus(500); // Internal server ERROR
      } else {
        // number modified successfully
        res.end();
      }
    });
  }
});
// get the type of disease list -- tested
app.get("/maladielist", verifiToken, (req, res) => {
  // select all the type of disease
  let statement = "SELECT idTypeMaladie,TypeMaladie FROM typemaladie";
  dbPool.query(statement, (dberr, result) => {
    if (dberr) {
      // database error
      console.log("## db err ## ", dberr);
      res.sendStatus(500);
    } else {
      // send back the type of disease list
      res.send(JSON.stringify(result));
    }
  });
});

// add a type of disease -- tested
app.post("/maladielist/add", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ TypeMaladie: joi.string().max(50).required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // add the type if disease to the list
    let statement = "INSERT INTO typemaladie(typemaladie) VALUES(?);";
    dbPool.query(statement, value.TypeMaladie, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("## db error ## ", dberr);
        res.sendStatus(500);
      } else {
        // type added
        res.send();
      }
    });
  }
});

// refuse a patient on waiting list -- tested
app.post("/medecin/waitinglist/refuse", verifiToken, (req, res) => {
  // validate the received data form
  const { error, value } = joi
    .object({ idPatient: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // valid form
    // verify if the patient is in the doctor's waiting list
    let statement = "SELECT idMedecin FROM listatt WHERE idPatient=? LIMIT 1;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("## db error", dberr);
        res.sendStatus(500);
      } else {
        if (result[0] && result[0].idMedecin == req.autData.id) {
          // the doctor id is the same as the patient's doctor id
          // delete the request from the waiting list
          statement = "DELETE FROM listatt WHERE  idPatient=?;";
          dbPool.query(statement, value.idPatient, (dberr, result) => {
            if (dberr) {
              // database error
              console.log("## db error ## ", dberr);
              res.sendStatus(500);
            } else {
              // patient deleted from the waiting list
              // notify patient?
              res.end();
            }
          });
        } else {
          // the doctor's id is not the same as the patient's doctor id
          res.sendStatus(403);
        }
      }
    });
  }
});

// get the doctor's patient list -- tested
app.get("/medecin/patientlist", verifiToken, (req, res) => {
  // select the patients
  const statement =
    "SELECT idPatient,nomPatient,prenomPatient,statusPatient,photoPatient,TIMESTAMPDIFF(year,dateNaisPatient,CURDATE()) as agePatient FROM patient WHERE idMedecin=?;";
  dbPool.query(statement, req.autData.id, (dberr, result) => {
    if (dberr) {
      // database error
      console.log("## db err ## ", dberr);
      res.sendStatus(500);
    } else {
      // send back the patient list
      res.send(JSON.stringify(result));
    }
  });
});

//Delete patient from the patient list Route -- tested
app.post("/medecin/patientlist/remove", verifiToken, (req, res) => {
  // validation of the data
  const { error, value } = joi
    .object({ idPatient: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // valid data
    // we check if the patient's doctor is the same us the doctor who's making the request
    let statement = "SELECT idMedecin FROM patient WHERE idPatient=?;";
    dbPool.query(statement, value.idPatient, (dberr, result) => {
      if (dberr) {
        // database error
        console.log("## db err ##", dberr);
        res.sendStatus(500);
      } else {
        if (result[0] && result[0].idMedecin == req.autData.id) {
          // the doctor id is the same as the patient's doctor id
          // updating the patient's doctor
          statement = "UPDATE patient SET idMedecin=? WHERE idPatient=?";
          dbPool.query(statement, [null, value.idPatient], (dberr, result) => {
            if (dberr) {
              // database error
              console.log("## db err ##", dberr);
              res.sendStatus(500);
            } else {
              // row updated
              // notify patient ?
              res.end();
            }
          });
        } else {
          // the doctor id is not the same as the patient's doctor id
          res.sendStatus(403);
        }
      }
    });
  }
});

// Patient sign up Route -- tested
app.post("/patient/signUp", (req, res) => {
  // verifying the form of data
  const { error, value } = patientSignUp.validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // valid data
    // hash the password
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        // bcrypt error
        console.log("## bcrypt err ## ", err);
        res.sendStatus(500);
      } else {
        // password hashed successfully
        // insert the patient to our database
        let statement =
          "INSERT INTO patient(userNamePatient,passwordPatient,mailPatient,dateInscriptionPatient) VALUES(?,?,?,CURDATE());";
        dbPool.query(
          statement,
          [value.username, hash, value.email],
          (dbErr, result1) => {
            if (dbErr) {
              // database error
              console.log("##db error##", dbErr);
              // if we have double entry error
              if (dbErr.errno == 1062)
                res.status(403).send(
                  JSON.stringify({
                    error: 1062,
                    message: dbErr.sqlMessage,
                  })
                );
              else res.sendStatus(500); // Internal server ERROR
            } else {
              // no database errors
              // insert the patient to the notVerified table
              statement = "INSERT INTO patientNonVerifie values (?,?);";
              const validationCode = Math.floor(
                Math.random() * 899999 + 100000
              );
              dbPool.query(
                statement,
                [result1.insertId, validationCode],
                (dbErr, result2) => {
                  if (dbErr) {
                    // database error
                    console.log("##db error##", dbErr);
                    res.sendStatus(500);
                  } else {
                    // no database errors
                    // generate a validation code
                    const emailBody = `
                            <h3>Cher ${value.username}!</h3>
                            <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
                            <p style="font-weight: bold;color: #0DBDA5;">${validationCode}</p>
                            <p>Cordialement,</p>
                            <p>L'équipe de Sina.</p>`;
                    // We send a confirmation mail to the patient here
                    transporter.sendMail(
                      {
                        from: '"Sina" sina.app.pfe@gmail.com', // sender address
                        to: value.email, // list of receivers
                        subject: "Vérifiez votre adresse e-mail ✔", // Subject line
                        text: "Sina support team", // plain text body
                        html: emailBody, // html body
                      },
                      (MailerErr, data) => {
                        if (MailerErr) {
                          console.log("## nodemail error ## ", MailerErr);
                          res.sendStatus(500);
                        } else {
                          // Generate a token
                          jwt.sign(
                            { id: result1.insertId, username: value.username },
                            mySecretKey,
                            (jwtErr, token) => {
                              if (jwtErr) {
                                // jwt error
                                console.log("## jwt error ## ", jwtErr);
                                res.sendStatus(500);
                              } else {
                                // Token generated we send it to patient
                                res.send(
                                  JSON.stringify({ validationCode, token })
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  }
});

// Modify the relative's name Route -- tested
app.post("/patient/relative/modify/name", verifiToken, (req, res) => {
  const { error, value } = Joi.object({
    nom: joi.string().max(50).required(),
    prenom: joi.string().max(50).required(),
  }).validate(req.body);
  if (error) res.status(403).send(error.details);
  else {
    sql =
      "UPDATE proche SET nomProche = ?,prenomProche = ? WHERE idProche=(SELECT idProche FROM patient WHERE idPatient=?);";
    dbPool.query(
      sql,
      [value.nom, value.prenom, req.autData.id],
      (err, result) => {
        if (err) {
          // database error
          console.log(err);
          res.sendStatus(500);
        } else {
          // name modified successefully
          res.end();
        }
      }
    );
  }
});
// Resend validation code to patient Route -- tested
app.get("/patient/signup/resendvalidation", verifiToken, (req, res) => {
  let statement = "SELECT idPatient FROM patientNonVerifie WHERE idPatient=?;";
  dbPool.query(statement, req.autData.id, (dbErr, result) => {
    if (dbErr) {
      // database error
      console.log("## db error ## ", dbErr);
      res.sendStatus(500);
    } else {
      if (result[0] && result[0].idPatient == req.autData.id) {
        // the user exist and his account is not verified yet
        // generate and send verifcation code
        // get the user email
        statement = "SELECT mailPatient FROM patient WHERE idPatient=?;";
        dbPool.query(statement, result[0].idPatient, (dbErr, result2) => {
          if (dbErr) {
            // database error
            console.log("## db error ## ", dbErr);
            res.sendStatus(500);
          } else {
            // found the user
            // generate a new validation code and update the one stored in the database
            const validationCode = Math.floor(Math.random() * 899999 + 100000);
            statement =
              "UPDATE patientNonVerifie SET validationCode=? WHERE idPatient=?;";
            dbPool.query(
              statement,
              [validationCode, req.autData.id],
              (dbErr, result3) => {
                if (dbErr) {
                  // database error
                  console.log("## db error ## ", dbErr);
                  res.sendStatus(500);
                } else {
                  const emailBody = `
                      <h3>Cher ${req.autData.username}!</h3>
                      <p>Voici le code de validation ci-dessous pour vérifier votre compte:</p>
                      <p style="font-weight: bold;color: #0DBDA5;">${validationCode}</p>
                      <p>Cordialement,</p>
                      <p>L'équipe de Sina.</p>`;
                  // We send a confirmation mail to the patient here
                  transporter.sendMail(
                    {
                      from: '"Sina" sina.app.pfe@gmail.com', // sender address
                      to: result2[0].mailPatient, // list of receivers
                      subject: "Vérifiez votre adresse e-mail ✔", // Subject line
                      text: "Sina support team", // plain text body
                      html: emailBody, // html body
                    },
                    (MailerErr, data) => {
                      if (MailerErr) {
                        // node mail error
                        console.log("## nodemail error ## ", MailerErr);
                        res.sendStatus(500);
                      } else {
                        // no errors
                        // send the verification code back
                        res.send({ validationCode });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        // no such a user exit (account already verified or dosen't exist)
        res.sendStatus(403);
      }
    }
  });
});

// validate a patient account Route -- tested
app.post("/patient/validateaccount", verifiToken, (req, res) => {
  // verify the data form
  const { error, value } = joi
    .object({ validationCode: joi.number().max(9999999).required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // we delete the patient from
    // verify the code validation is correct
    let statement =
      "SELECT validationCode FROM patientNonVerifie WHERE idPatient=?;";
    dbPool.query(statement, [req.autData.id], (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
      } else {
        if (result[0] && result[0].validationCode == value.validationCode) {
          // validate the user (delete him from the patientNonVerifie table)
          statement = "DELETE FROM patientNonVerifie WHERE idPatient=?;";
          dbPool.query(statement, req.autData.id, (dbErr, result2) => {
            if (dbErr) {
              // database error
              console.log("## db error ## ", dbErr);
            } else {
              // user validated
              res.end();
            }
          });
        } else {
          // validation code doesn't exist or user alredy validated
          res.sendStatus(403);
        }
      }
    });
  }
});

// Add patient's information and adress Route -- tested
app.post("/patient/information/add", verifiToken, (req, res) => {
  const { error, value } = patientInfo.validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // we add the inforamtion to the patient
    let statement =
      "UPDATE patient SET nomPatient=?,prenomPatient=?,sexePatient=?,dateNaisPatient=?,adressPatient=?,idCommune=(SELECT idCommune FROM commune WHERE idCommune=?) WHERE idPatient=?;";
    dbPool.query(
      statement,
      [
        value.nom,
        value.prenom,
        value.sex,
        value.dateNaiss,
        value.adress,
        value.idCommune,
        req.autData.id,
      ],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // user information added successfully
          res.end();
        }
      }
    );
  }
});

// Add patient's relative Route -- tested
app.post("/patient/relative/add", verifiToken, (req, res) => {
  const { error, value } = relativeInfo.validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // We add his relatve's info
    let statement =
      "INSERT INTO proche(nomProche,prenomProche,NumTlfProche,mailProche) VALUES(?,?,?,?);";
    dbPool.query(
      statement,
      [value.nom, value.prenom, value.numeroTlf, value.email],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## database error ## ", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send(
              JSON.stringify({
                error: 1062,
                message: dbErr.sqlMessage,
              })
            );
          else res.sendStatus(500); // Internal server ERROR
        } else {
          // relative info add
          // we affect the relative's id to the patient
          statement = "UPDATE patient SET idProche=? WHERE idPatient=?;";
          dbPool.query(
            statement,
            [result.insertId, req.autData.id],
            (dbErr, result2) => {
              if (dbErr) {
                // database error
                console.log("## db error ## ", dbErr);
                res.sendStatus(500);
              } else {
                // success
                res.end();
              }
            }
          );
        }
      }
    );
  }
});

// Get doctor's list Route -- tested
app.get("/medecin/list", verifiToken, (req, res) => {
  let statement =
    "SELECT idMedecin,nomMedecin,prenomMedecin,nomDaira,photoMedecin,nomWilaya FROM medecin m,wilaya w,daira d WHERE d.idWilaya=w.idWilaya AND d.idDaira=m.idDaira;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) {
      // database error
      console.log("## db error ## ", dbErr);
      res.sendStatus(500);
    } else {
      // send the doctor's list back
      res.send(JSON.stringify(result));
    }
  });
});

// Send a request to doctor Route -- tested
app.post("/medecin/request", verifiToken, (req, res) => {
  // validate the data form
  const { error, value } = joi
    .object({ idMedecin: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // send the request to the doctor
    let statement = "INSERT INTO listAtt VALUES (?,?);";
    dbPool.query(
      statement,
      [value.idMedecin, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // request has been sent to the doctor
          // notify the doctor ?
          res.end();
        }
      }
    );
  }
});

// Get the list of wilaya Route -- tested
app.get("/wilaya", verifiToken, (req, res) => {
  let statement = "SELECT idWilaya,nomWilaya FROM wilaya;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) {
      // database error
      console.log("## db error ## ", dbErr);
      res.sendStatus(500);
    } else {
      // got the list of wilaya we send it back
      res.send(JSON.stringify(result));
    }
  });
});

// Get the list of daira Route -- tested
app.get("/daira", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ idWilaya: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement = "SELECT idDaira,nomDaira FROM daira WHERE idWilaya=?;";
    dbPool.query(statement, value.idWilaya, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // got the list of daira we send it back
        res.send(JSON.stringify(result));
      }
    });
  }
});

// Get the list of commune Route -- tested
app.get("/commune", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ idDaira: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement = "SELECT idCommune,nomCommune FROM commune WHERE idDaira=?;";
    dbPool.query(statement, value.idDaira, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // got the list of commune we send it back
        res.send(JSON.stringify(result));
      }
    });
  }
});

// Delete patient account Route -- tested
app.post("/patient/delete", verifiToken, (req, res) => {
  // delte the patient account from the database
  let statement = "DELETE FROM patient WHERE idPatient=?;";
  dbPool.query(statement, req.autData.id, (dbErr, result) => {
    if (dbErr) {
      // database error
      console.log("## db error ## ", dbErr);
      res.sendStatus(500);
    } else {
      // patient deleted
      res.end();
    }
  });
});

// Send restore patient password link Route -- tested
app.get("/patient/restorelink", (req, res) => {
  const { error, value } = joi
    .object({ email: joi.string().email().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // we verify if the email is linked to a patient account in our database
    let statement =
      "SELECT idPatient,userNamePatient FROM patient WHERE mailPatient = ?;";
    dbPool.query(statement, value.email, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        if (result[0]) {
          // the mail is linked to an account in our database
          // we generate a token for the user
          jwt.sign(
            { id: result[0].idPatient, username: result[0].userNamePatient },
            mySecretKey,
            {
              expiresIn: "2h",
            },
            (jwtErr, token) => {
              if (jwtErr) {
                console.log(jwtErr);
                res.sendStatus(500);
              } else {
                // we send the link to restore the password
                const url = `http://localhost:3000/patient/restorepassword/${token}`;
                const emailBody = `
                                      <h3>Cher ${result[0].userNamePatient}!</h3>
                                      <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                                      <a href='${url}'>${url}</a>
                                      <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                                      <p>Cordialement,</p>
                                      <p>L'équipe de Sina.</p>`;
                transporter.sendMail(
                  {
                    from: '"Sina" sina.app.pfe@gmail.com', // sender address
                    to: value.email, // list of receivers
                    subject: "Restaurer votre mot de passe ✔", // Subject line
                    text: "Sina support team", // plain text body
                    html: emailBody, // html body
                  },
                  (MailerErr, data) => {
                    if (MailerErr) {
                      console.log(MailerErr);
                      res.sendStatus(500);
                    } else {
                      res.end();
                    }
                  }
                );
              }
            }
          );
        } else {
          // the mail is not linked to any account in our database
          res.sendStatus(403);
        }
      }
    });
  }
});

// reset password patient Route -- tested
app.post("/patient/resetpassword", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      password: joi.string().min(8).required(),
      repeatPassword: joi.ref("password"),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // hash the password
    const saltRounds = 10;
    bcrypt
      .hash(value.password, saltRounds)
      .then((hash) => {
        // Change the password
        let statement =
          "UPDATE patient SET passwordPatient = ? WHERE idPatient = ?;";
        dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
          if (dbErr) {
            // database error
            console.log("## db error ## ", dbErr);
            res.sendStatus(500);
          } else {
            // password changed
            res.end();
          }
        });
      })
      .catch((err) => {
        // bcrypt error
        console.log("## bcrypt error ## ", err);
        res.sendStatus(500);
      });
  }
});

// Send restore doctor password link Route -- tested
app.get("/medecin/restorelink", (req, res) => {
  const { error, value } = joi
    .object({ email: joi.string().email().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // we verify if the email is linked to a patient account in our database
    let statement =
      "SELECT idMedecin,userNameMedecin FROM medecin WHERE mailMedecin = ?;";
    dbPool.query(statement, value.email, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        if (result[0]) {
          // the mail is linked to an account in our database
          // we generate a token for the user
          jwt.sign(
            { id: result[0].idMedecin, username: result[0].userNameMedecin },
            mySecretKey,
            {
              expiresIn: "2h",
            },
            (jwtErr, token) => {
              if (jwtErr) {
                console.log(jwtErr);
                res.sendStatus(500);
              } else {
                // we send the link to restore the password
                const url = `http://localhost:3000/medecin/restorepassword/${token}`;
                const emailBody = `
                                      <h3>Cher ${result[0].userNameMedecin}!</h3>
                                      <p>nous sommes désolés que vous rencontriez des problèmes pour utiliser votre compte, entrez ce lien pour réinitialiser votre mot de passe:</p>
                                      <a href='${url}'>${url}</a>
                                      <p> ce lien ne fonctionne que pendant les 2 prochaines heures </p>
                                      <p>Cordialement,</p>
                                      <p>L'équipe de Sina.</p>`;
                transporter.sendMail(
                  {
                    from: '"Sina" sina.app.pfe@gmail.com', // sender address
                    to: value.email, // list of receivers
                    subject: "Restaurer votre mot de passe ✔", // Subject line
                    text: "Sina support team", // plain text body
                    html: emailBody, // html body
                  },
                  (MailerErr, data) => {
                    if (MailerErr) {
                      console.log(MailerErr);
                      res.sendStatus(500);
                    } else {
                      res.end();
                    }
                  }
                );
              }
            }
          );
        } else {
          // the mail is not linked to any account in our database
          res.sendStatus(403);
        }
      }
    });
  }
});

// reset password medecin Route -- tested
app.post("/medecin/resetpassword", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      password: joi.string().min(8).required(),
      repeatPassword: joi.ref("password"),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // hash the password
    const saltRounds = 10;
    bcrypt
      .hash(value.password, saltRounds)
      .then((hash) => {
        // Change the password
        let statement =
          "UPDATE medecin SET passwordMedecin = ? WHERE idMedecin = ?;";
        dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
          if (dbErr) {
            // database error
            console.log("## db error ## ", dbErr);
            res.sendStatus(500);
          } else {
            // password changed
            res.end();
          }
        });
      })
      .catch((err) => {
        // bcrypt error
        console.log("## bcrypt error ## ", err);
        res.sendStatus(500);
      });
  }
});

// sign in patient Route
app.get("/patient/signin", (req, res) => {
  // we validate the form of data we receive
  const { error, value } = patientSignIn.validate(req.body);
  if (error) {
    // data not valid
    res.status(403).send(error.details);
  } else {
    // valid data .. next
    // select the user information from the database and compare it to the received data
    let statement =
      "SELECT idPatient,passwordPatient FROM patient WHERE usernamePatient=?";
    dbPool.query(statement, value.username, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (result[0]) {
          // Account exist
          bcrypt.compare(
            value.password,
            result[0].passwordPatient,
            (err, correct) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                if (correct) {
                  // Correct password
                  // Token generation
                  jwt.sign(
                    { id: result[0].idPatient, username: value.username },
                    mySecretKey,
                    (err, token) => {
                      if (err) {
                        console.log(err);
                        res.sendStatus(500);
                      } else {
                        // token generated we send it back to the user
                        res.send(JSON.stringify({ token }));
                      }
                    }
                  );
                } else {
                  // Wrong password
                  res.status(403).send(JSON.stringify({ error: "password" }));
                }
              }
            }
          );
        } else {
          // No account exist with that username
          res.status(403).send(JSON.stringify({ error: "username" }));
        }
      }
    });
  }
});

// =====================
// Modify patient's mail Route -- tested
app.post("/patient/modifyMail", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ email: joi.string().email().required() })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE patient SET mailPatient=? WHERE idPatient=?";
    dbPool.query(statement, [value.email, req.autData.id], (dbErr, result) => {
      if (dbErr) {
        console.log("##db error##", dbErr);
        // if we have double entry error
        if (dbErr.errno == 1062)
          res.status(403).send(
            JSON.stringify({
              error: 1062,
              message: dbErr.sqlMessage,
            })
          );
        else res.sendStatus(500); // Internal server ERROR
      } else res.end();
    });
  }
});

// Modify patient's username Route -- tested
app.post("/patient/modifyUsername", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({ username: joi.string().min(6).required() })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE patient SET userNamePatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.username, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send(
              JSON.stringify({
                error: 1062,
                message: dbErr.sqlMessage,
              })
            );
          else res.sendStatus(500); // Internal server ERROR
        } else
          jwt.sign(
            { id: req.autData.id, username: value.username },
            mySecretKey,
            (err, token) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                // token generated we send it back to the user
                res.send(JSON.stringify({ token }));
              }
            }
          );
      }
    );
  }
});

// Modify patient's password Route -- tested
app.post("/patient/modifyPassword", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    const saltRounds = 10;
    bcrypt
      .hash(value.password, saltRounds)
      .then((hash) => {
        let statement =
          "UPDATE patient SET passwordPatient=? WHERE idPatient=?";
        dbPool.query(statement, [hash, req.autData.id], (dbErr, result) => {
          if (dbErr) {
            console.log("##db error##", dbErr);
            res.sendStatus(500); // Internal server ERROR
          } else res.end();
        });
      })
      .catch((bcrypterr) => {
        console.log(bcrypterr);
        res.sendStatus(500);
      });
  }
});

// Modify patient's first and last name Route -- tested
app.post("/patient/modifyName", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      nom: joi.string().max(50).required(),
      prenom: joi.string().max(50).required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement =
      "UPDATE patient SET nomPatient=?,prenomPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.nom, value.prenom, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
});

// Modify patient's phone number Route -- tested
app.post("/patient/modifyNumber", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      numeroTlf: joi.string().max(10).required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    let statement = "UPDATE patient SET NumTlfPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [value.numeroTlf, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          // if we have double entry error
          if (dbErr.errno == 1062)
            res.status(403).send(
              JSON.stringify({
                error: 1062,
                message: dbErr.sqlMessage,
              })
            );
          else res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
});

// Modify patient's adress Route -- tested
app.post("/patient/modifyadress", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      commune: joi.number().required(),
      adress: joi.string().max(255).required(),
    })
    .validate(req.body);
  if (error) res.send(error.details);
  else {
    console.log(req.autData.id);
    let statement =
      "UPDATE patient SET idCommune=(SELECT idCommune FROM commune WHERE idCommune=?),adressPatient=? WHERE idPatient=?;";
    dbPool.query(
      statement,
      [value.commune, value.adress, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
});

// Modify patient's photo Route -- tested
app.post(
  "/patient/modifyPhoto",
  verifiToken,
  upload.single("photo"),
  (req, res) => {
    let statement = "UPDATE patient SET photoPatient=? WHERE idPatient=?";
    dbPool.query(
      statement,
      [req.file ? req.file.path : null, req.autData.id],
      (dbErr, result) => {
        if (dbErr) {
          console.log("##db error##", dbErr);
          res.sendStatus(500); // Internal server ERROR
        } else res.end();
      }
    );
  }
);

// Delete patient's account Route -- tested
app.post("/patient/delete", verifiToken, (req, res) => {
  let statement = "DELETE FROM patient WHERE idPatient=?";
  dbPool.query(statement, req.autData.id, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

// Get patient profile Route -- tested
app.get("/patient", verifiToken, (req, res) => {
  // validate the for of the received data
  const { error, value } = joi
    .object({ idPatient: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement =
      "SELECT idPatient,nomPatient,prenomPatient,sexePatient,dateNaisPatient,adressPatient,photoPatient,degreGravite,statusPatient,TypeMaladie,nomProche,prenomProche,NumTlfProche,mailProche,nomCommune,nomDaira,nomWilaya FROM patient p,typemaladie t,proche r,commune c,daira d, wilaya w WHERE p.idPatient=? and p.idProche=r.idProche and p.idTypeMaladie=t.idTypeMaladie and c.idDaira=d.idDaira and d.idWilaya=w.idWilaya;SELECT idFichierECG,lienFichier,dateCreation FROM fichierecg WHERE idPatient=?;SELECT idRapport,lienRapport,dateRapport FROM rapport WHERE idPatient=?; SELECT idRendezVous,dateRV,lieuRV FROM  rendezvous WHERE idPatient=?;";
    dbPool.query(
      statement,
      [value.idPatient, value.idPatient, value.idPatient, value.idPatient],
      (dbErr, results, fields) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          res.send(JSON.stringify({ results, fields }));
        }
      }
    );
  }
});

// Add an appointement -- tested
app.post("/rdv/add", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idPatient: joi.number().required(),
      date: joi.date().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement = "INSERT INTO rendezvous(idPatient,dateRV) VALUES(?,?,?);";
    dbPool.query(statement, [value.idPatient, value.date], (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // appointement added
        // notify the patient ??
        res.end();
      }
    });
  }
});

// update an appointement -- tested
app.post("/rdv/update", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idRendezVous: joi.number().required(),
      date: joi.date().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement = "UPDATE rendezvous SET dateRV=? WHERE idRendezVous=?;";
    dbPool.query(
      statement,
      [value.date, value.idRendezVous],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // appointement updated
          // notify patient ?
          res.end();
        }
      }
    );
  }
});

// Cancel an appointement -- tested
app.post("/rdv/cancel", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({ idRendezVous: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement = "DELETE FROM  rendezvous WHERE idRendezVous=?;";
    dbPool.query(statement, value.idRendezVous, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // appointement deleted
        // notify patient ?
        res.end();
      }
    });
  }
});

// Archive an appointement -- tested
app.post("/rdv/archive", verifiToken, (req, res) => {
  const { error, value } = joi
    .object({
      idRendezVous: joi.number().required(),
      date: joi.date().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // check wether the patient have already an appointement archive file or not
    let statement =
      "SELECT lienHistoriqueRV,idPatient,dateInscriptionPatient FROM patient WHERE idPatient = (SELECT idPatient FROM rendezvous WHERE idRendezVous=?);";
    dbPool.query(statement, value.idRendezVous, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // write on the file
        fs.appendFile(
          result[0].lienHistoriqueRV
            ? result[0].lienHistoriqueRV
            : "./Public/uploads/ECGFiles/" +
                result[0].idPatient +
                "-" +
                result[0].dateInscriptionPatient.getTime() / 1000 +
                ".txt",
          `${value.date}\n`,
          (err) => {
            if (err) {
              // fs module error
              console.log("## fs module error ## ", err);
              res.sendStatus(500);
            } else {
              // we delete the appointement from the database
              statement = "DELETE FROM rendezvous WHERE idRendezVous=?;";
              dbPool.query(statement, value.idRendezVous, (dbErr, result2) => {
                if (dbErr) {
                  // database error
                  console.log("## db error ## ", dbErr);
                  res.sendStatus(500);
                } else {
                  // appointement deleted
                  res.end();
                }
              });
            }
          }
        );
      }
    });
  }
});

// Get the medication list of a patient Route -- tested
app.get("/patient/medication", verifiToken, (req, res) => {
  // verify the form of the data
  const { error, value } = joi
    .object({ idPatient: joi.number().required() })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    let statement =
      "SELECT m.idMedicament,m.nomMedicament,l.posologie,l.dateDebut FROM medicament m,listMedicament l WHERE m.idMedicament=l.idMedicament AND l.idPatient=?;";
    dbPool.query(statement, value.idPatient, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // send the list back
        res.send(JSON.stringify(result));
      }
    });
  }
});

// Add a medication to the list of medication for a patient -- tested
app.post("/patient/medication/add", verifiToken, (req, res) => {
  // verify the form of the data
  const { error, value } = joi
    .object({
      idPatient: joi.number().required(),
      idMedicament: joi.number().required(),
      dosage: joi.string().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // insert the medication in the medication list
    let statement =
      "insert into listmedicament(idMedicament,idPatient,posologie,dateDebut) VALUES (?,?,?,curdate());";
    dbPool.query(
      statement,
      [value.idMedicament, value.idPatient, value.dosage],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // medication inserted
          res.end();
        }
      }
    );
  }
});

// Modify the dosage of a medication in the list of medication for a patient Route -- tested
app.post("/patient/medication/modify", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idPatient: joi.number().required(),
      idMedicament: joi.number().required(),
      dosage: joi.string().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // update the dosage
    let statement =
      "UPDATE listmedicament SET posologie=? WHERE idPatient=? AND idMedicament=?;";
    dbPool.query(
      statement,
      [value.dosage, value.idPatient, value.idMedicament],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // list updated
          res.end();
        }
      }
    );
  }
});

// Delete a medication from the list of a patient Route -- tested
app.post("/patient/medication/delete", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idPatient: joi.number().required(),
      idMedicament: joi.number().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // delete the medicin from the list
    let statement =
      "DELETE FROM listMedicament WHERE idPatient=? AND idMedicament=?;";
    dbPool.query(
      statement,
      [value.idPatient, value.idMedicament],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // medicin deleted
          res.end();
        }
      }
    );
  }
});

// Get all medications list Route -- tested
app.get("/medication", verifiToken, (req, res) => {
  let statement = "SELECT * FROM medicament;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) {
      // database error
      console.log("## db error ## ", dbErr);
      res.sendStatus(500);
    } else {
      // we send the list of medication back
      res.send(JSON.stringify(result));
    }
  });
});

// Add a new medication Route -- tested
app.post("/medication/add", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      nomMedicament: joi.string().max(50).required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // add the medication to the list
    let statement = "INSERT INTO medicament(nomMedicament) values(?);";
    dbPool.query(statement, value.nomMedicament, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // medication added to the database
        res.end();
      }
    });
  }
});

// Modify the name of a medication Route -- tested
app.post("/medication/modify", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idMedicament: joi.number().required(),
      nomMedicament: joi.string().max(50).required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // add the medication to the list
    let statement =
      "UPDATE medicament SET nomMedicament=? WHERE idMedicament=?;";
    dbPool.query(
      statement,
      [value.nomMedicament, value.idMedicament],
      (dbErr, result) => {
        if (dbErr) {
          // database error
          console.log("## db error ## ", dbErr);
          res.sendStatus(500);
        } else {
          // medication modified at the database
          res.end();
        }
      }
    );
  }
});

// Delete a medication Route -- tested
app.post("/medication/delete", verifiToken, (req, res) => {
  // validate the form of the data
  const { error, value } = joi
    .object({
      idMedicament: joi.number().required(),
    })
    .validate(req.body);
  if (error) res.send(JSON.stringify(error.details));
  else {
    // add the medication to the list
    let statement = "DELETE FROM medicament WHERE idMedicament=?;";
    dbPool.query(statement, value.idMedicament, (dbErr, result) => {
      if (dbErr) {
        // database error
        console.log("## db error ## ", dbErr);
        res.sendStatus(500);
      } else {
        // medication modified at the database
        res.end();
      }
    });
  }
});

app.listen(3000, () => {
  console.log("Server connected on port 3000!");
});
