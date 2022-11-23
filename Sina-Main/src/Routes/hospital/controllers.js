const dbPool = require("../../Database/Connection");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const getAllHospitals = async (req, res) => {
  try {
    const options = await validateBody("searchHospital", req.query);
    res.send({ results: await query.selectHospitals(options, options.page) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addNewHospital = async (req, res) => {
  try {
    const body = await validateBody("validHospital", req.body);

    await query.insertHospital(body);
    res.sendStatus(201);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error" ||
      error.type == "invalid_data"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const modifyHospital = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("updateHospital", req.body);

    const updateQuery = await query.updateHospital(body, params);
    if (updateQuery.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error" ||
      error.type == "invalid_data"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteHospital = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deleteQuery = await query.deleteHospital(params.id);
    if (deleteHospital.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getAllHospitals,
  addNewHospital,
  modifyHospital,
  deleteHospital,
};
