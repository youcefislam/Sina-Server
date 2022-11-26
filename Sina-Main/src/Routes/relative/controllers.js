const dbPool = require("../../Database/Connection");
const query = require("./queries");
const patientQuery = require("../patient/queries");

const updateRelative = async (req, res) => {
  try {
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);

    const updatedRelative = await query.updateRelative(req.body, req.params);
    if (updatedRelative.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addRelative = async (req, res) => {
  let relative;
  try {
    relative = await query.insertRelative(req.body);
    await patientQuery.updatePatient(
      { id_relative: relative.insertId },
      req.params
    );
    res.sendStatus(204);
  } catch (error) {
    if (relative) await query.deleteRelative(relative.insertId);
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getRelativeInfo = async (req, res) => {
  try {
    const relative = await query.selectRelative(req.params.id);

    res.send({ result: relative });
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteRelative = async (req, res) => {
  try {
    const deletedRelative = await query.deleteMyRelative(req.params.id);

    if (deletedRelative.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getRelativeInfo,
  addRelative,
  updateRelative,
  deleteRelative,
};
