const moment = require("moment");
const query = require("./queries");
const utility = require("../../Utilities/utility");

const updatePatient = async (req, res) => {
  try {
    if (req.body.birth_date)
      req.body.birth_date = moment
        .parseZone(req.body.birth_date)
        .format()
        .split("T")[0];
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);
    const updatedPatient = await query.updatePatient(req.body, req.params);

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null) return res.status(400).send({ code: "row_not_found" });

    const validPassword = await utility.comparePassword(
      req.body.password,
      patient.password
    );

    if (!validPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "password" });

    await query.deletePatientAccount(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const modifyPassword = async (req, res) => {
  try {
    const patient = await query.selectPatient_sensitive(req.params);

    if (patient == null) return res.status(400).send({ code: "row_not_found" });

    const correctOldPassword = await utility.comparePassword(
      req.body.old_password,
      patient.password
    );

    if (!correctOldPassword)
      return res
        .status(400)
        .send({ code: "incorrect_information", path: "old_password" });

    const newPassword = await utility.hashPassword(req.body.password);

    const updatedPatient = await query.updatePatient(
      { password: newPassword },
      req.params
    );

    if (updatedPatient.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getPatientInfo = async (req, res) => {
  try {
    res.send({ result: await query.searchPatient(req.params) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getAllPatient = async (req, res) => {
  try {
    res.send(await query.selectAllPatient(req.query));
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  updatePatient,
  deleteAccount,
  modifyPassword,
  getPatientInfo,
  getAllPatient,
};
