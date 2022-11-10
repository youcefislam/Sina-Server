const dbPool = require("../../Database/Connection");
const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const patientQuery = require("../patient/queries");

const modifyMail = async (req, res) => {
  try {
    const body = await validateBody("validMail", req.body);

    const updatedRelative = await query.updateRelative(body, req.params);
    if (updatedRelative.affectedRows == 0)
      return res.status(400).send({ type: "raw_not_found" });
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

const modifyNumber = async (req, res) => {
  try {
    const body = await validateBody("validNumber", req.body);

    const updatedRelative = await query.updateRelative(body, req.params);
    if (updatedRelative.affectedRows == 0)
      return res.status(400).send({ type: "relative_not_found" });
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

const modifyName = async (req, res) => {
  try {
    const body = await validateBody("validName", req.body);

    const updatedRelative = await query.updateRelative(body, req.params);
    if (updatedRelative.affectedRows == 0)
      return res.status(400).send({ type: "relative_not_found" });
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

const addRelative = async (req, res) => {
  let relative;
  try {
    const body = await validateBody("relativeInfo", req.body);

    relative = await query.insertRelative(req.body);
    await patientQuery.updatePatient(
      { id_relative: relative.insertId },
      req.params
    );
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (relative) await query.deleteRelative(relative.insertId);
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error" ||
      error.type == "invalid_data"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getRelativeInfo = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const relative = await query.selectRelative(params.id);

    res.send({ result: relative });
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteRelative = async (req, res) => {
  try {
    const deletedRelative = await query.deleteMyRelative(req.params.id);

    if (deletedRelative.affectedRows == 0)
      return res.status(400).send({ type: "relative_not_found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  modifyName,
  modifyNumber,
  modifyMail,
  addRelative,
  getRelativeInfo,
  deleteRelative,
};
