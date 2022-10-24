const dbPool = require("../../Database/connection");

function queryErrorHandler(type, error) {
  this.type = type;
  this.path = error.path;
}

const updatePatient = async (newValues, options) =>
  new Promise((resolve, reject) => {
    let statement = `UPDATE patient SET ? WHERE ?;`;
    dbPool.query(statement, [newValues, options], (dbErr, result) => {
      if (dbErr) {
        if (dbErr.errno == 1062)
          reject(
            new queryErrorHandler(
              "duplicated_entry_error",
              dbErr.sqlMessage.replace("doctor.", "")
            )
          );
        else if (dbErr.errno == 1452)
          reject(
            new queryErrorHandler(
              "invalid_data",
              `no data found with the entered data`
            )
          );
        else reject(dbErr);
      } else resolve(result);
    });
  });

module.exports = {
  updatePatient,
};
