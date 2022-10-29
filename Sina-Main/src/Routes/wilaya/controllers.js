const dbPool = require("../../Database/Connection");
const {
  hashPassword,
  generateToken,
  validateToken,
  sendMail,
  comparePassword,
} = require("../../Utilities/utility");

const getWilayaList = (req, res) => {
  let statement = "SELECT idWilaya,nomWilaya FROM wilaya;";
  dbPool.query(statement, (dbErr, result) => {
    if (dbErr) res.status(500).send({ error: "internal_server_error" });
    else res.send({ results: result });
  });
};

module.exports = {
  getWilayaList,
};
