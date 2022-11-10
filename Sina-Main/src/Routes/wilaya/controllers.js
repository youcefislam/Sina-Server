const dbPool = require("../../Database/Connection");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const getWilayaList = async (req, res) => {
  try {
    res.send({ results: await query.selectAllWilaya() });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addWilaya = async (req, res) => {
  try {
    const body = await validateBody("name", req.body);

    await query.insertWilaya(body);
    res.sendStatus(204);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateWilaya = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("name", req.body);

    const updatedWilaya = await query.updateWilaya(body, params);
    if (updatedWilaya.affectedRows == 0)
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
const deleteWilaya = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deletedWilaya = await query.deleteWilaya(params.id);
    if (deletedWilaya.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getWilayaList,
  addWilaya,
  updateWilaya,
  deleteWilaya,
};
