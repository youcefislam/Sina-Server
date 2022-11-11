const dbPool = require("../../Database/Connection");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const getCommuneList = async (req, res) => {
  try {
    res.send({ results: await query.selectAllCommune() });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getCommune = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    res.send({ result: await query.selectCommune(params.id) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addCommune = async (req, res) => {
  try {
    const body = await validateBody("newCommune", req.body);

    await query.insertCommune(body);
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

const updateCommune = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("name", req.body);

    const updatedCommune = await query.updateCommune(body, params);
    if (updatedCommune.affectedRows == 0)
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
const deleteCommune = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deletedCommune = await query.deleteCommune(params.id);
    if (deletedCommune.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getCommuneList,
  getCommune,
  addCommune,
  updateCommune,
  deleteCommune,
};
