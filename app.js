const fs = require("fs");
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const multer = require("multer"); // Used for handling multipart/form-data, which is primarily used for uploading files. For more detail check: https://www.npmjs.com/package/multer
const bcrypt = require("bcrypt"); // Library to hash password. For more detail check: https://www.npmjs.com/package/bcrypt
var jwt = require("jsonwebtoken"); // Used to create/verify tokens. For more detail check: https://www.npmjs.com/package/jsonwebtoken
const joi = require("joi"); // Used to validate the form of the received data. For more detail check: https://joi.dev/api/?v=17.6.0
const nodemailer = require("nodemailer"); // Used to send mails. For more detail check: https://nodemailer.com/about/
const moment = require("moment"); // for better date and time treatment For more detail check:https://momentjs.com/
const { json } = require("express/lib/response");

// ### initialization of express ###
var app = express();
app.use(express.json({ limit: "1mb" })); // Maximum request body size

// ### Connection with the database ###
var dbConnection = mysql.createConnection({
  host: "localhost",
  user: "sina",
  password: "password",
  database: "sina",
});
dbConnection.connect();

// ### setting up multer ###
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

// setting the disk storage engine
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

// Static files serving Middleware (allow access to these files publicly)
app.use("/public/views", express.static("public/views"));
app.use("/public/uploads/Media", express.static("public/uploads/Media"));
app.use("/public/views", express.static("public/views"));

// Data form validation with joi
const medecinSignUp = joi.object({
  username: joi.string().alphanum().min(6).required(),
  password: joi.string().alphanum().min(8).required(),
  repeat_password: joi.ref("password"),
  email: joi.string().email().required(),
  nom: joi.string().max(20).required(),
  prenom: joi.ref("nom"),
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

// Getting the secret key for jwt (to be changed later)
const mySecretKey =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNzkwMTUwMDY0IiwibmFtZSI6IllvdWNlZiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.BZN25sqbB_Qm7KQq7GyeFjYoWo2J_XvuWZw-2ocFGVWBXHc7v5-UHbYB7xmTvI_NBG8RaFh7wOfs4PNUJ7anlI8nHQQ5QF10kU-CLDO-18dG52uepkTX1vUqbUvNLG4QqLhidj-IcLgpHgfUPjiBq5YHyXyzEkRtyZZKOvDTRQtBBLqqoSxvgKq6FBQJZz47UbacVXOkPFyXC74u28QOZdA5vrQip7Gdex_rt2HNCzs977kTf4lhHJYF5UQcXLrLbo2vQ6V-5wupYLlmF2CCyG9dLxRzxbNY2oBOdqQy2DyRWqONtsnP3Z9s_KrbIgLfhPQLDB4x24UYUu9le7Q_A";

//int nodemailer (to be added later)
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sina.app.pfe@gmail.com", // generated ethereal user
    pass: "sinapassword1", // generated ethereal password
  },
});

// Here goes the API
// Sign up API for doctors
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
        const date = moment().format().slice(0, 19).replace("T", " ");
        // SQL statement we dont use the data here to prevent SQL injections so we replace the fields with a ? and add them when we execute the statement
        const sql = `INSERT INTO medecin(userNameMedecin,passwordMedecin,mailMedecin,nomMedecin,prenomMedecin,sexeMedecin,photoMedecin,dateInscriptientMedecin,NumTlfMedecin,idDaira)
        VALUES(?,?,?,?,?,?,?,?,?,?);`;
        // Add the doctor to our database
        dbConnection.query(
          sql,
          [
            value.username,
            hash,
            value.email,
            value.nom,
            value.prenom,
            value.sex,
            req.file ? req.file.path : null,
            date,
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
                res.send(
                  JSON.status(403).stringify({
                    error: 1062,
                    message: dbErr.sqlMessage,
                  })
                );
              else res.sendStatus(500); // Internal server ERROR
            } else {
              // Everything is good we move on
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
                            fs.unlink(path.normalize(req.file.path), (err) => {
                              if (err) console.log(err);
                            });
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

// Sign in a doctor API
app.get("/medecin/signin", (req, res) => {
  // we validate the form of data we receive

  const { error, value } = medecinSignIn.validate(req.body);
  if (error) {
    // data not valid
    res.status(403).send(error.details);
  } else {
    // valid data .. next
    // select the user information from the database and compare it to the received data
    const statement =
      "SELECT idMedecin,passwordMedecin FROM medecin WHERE usernameMedecin=?";
    dbConnection.query(statement, value.username, (err, result) => {
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
                    { id: result[0].idMedecin, username: result[0].username },
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

app.listen(3000, () => {
  console.log("Server connected on port 3000!");
});
