const query = require("./queries");

const getAllHospitals = async (req, res) => {
  try {
    res.send(await query.selectHospitals(req.query));
  } catch (error) {
    res.sendStatus(500);
  }
};

const addNewHospital = async (req, res) => {
  try {
    await query.insertHospital(req.body);
    res.sendStatus(201);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyHospital = async (req, res) => {
  try {
    const updateQuery = await query.updateHospital(req.body, req.params);
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteHospital = async (req, res) => {
  try {
    const deleteQuery = await query.deleteHospital(req.params.id);
    if (deleteHospital.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getAllHospitals,
  addNewHospital,
  modifyHospital,
  deleteHospital,
};
