const dbPool = require("../../Database/Connection");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const getDairaList = async (req, res) => {
  try {
    res.send({ results: await query.selectAllDaira() });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getDaira = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    res.send({ result: await query.selectDaria(params.id) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addDaira = async (req, res) => {
  try {
    const body = await validateBody("newDaira", req.body);

    await query.insertDaira(body);
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

const updateDaira = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("name", req.body);

    const updatedDaira = await query.updateDaira(body, params);
    if (updatedDaira.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "duplicated_entry_error" ||
      error.type == "validation_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const deleteDaira = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deletedDaira = await query.deleteDaira(params.id);
    if (deletedDaira.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getDairaList,
  getDaira,
  addDaira,
  updateDaira,
  deleteDaira,
};
