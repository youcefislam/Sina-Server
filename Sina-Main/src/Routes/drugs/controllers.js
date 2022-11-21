const moment = require("moment");
const validateBody = require("../../Utilities/validations");
const query = require("./queries");

const getPatientDrugsList = async (req, res) => {
  try {
    const options = await validateBody("page", req.query);
    const params = await validateBody("validIdPatient", req.params);

    res.send({
      results: await query.selectPatientDrugList(
        params.id_patient,
        options?.page
      ),
    });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addToDrugsList = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const body = await validateBody("validIdDrug", req.body);

    await query.insertIntoDrugList({ ...params, ...body });
    res.sendStatus(201);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "invalid_data" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteFromDugList = async (req, res) => {
  try {
    const params = await validateBody("validDrugListItem", req.params);

    const deletedItem = await query.deleteFromDrugList(params);

    if (deletedItem.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getAllDrugs = async (req, res) => {
  try {
    const options = await validateBody("page", req.query);
    res.send({ results: await query.selectAllDrugs(options?.page) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addNewDrug = async (req, res) => {
  try {
    const body = await validateBody("drug", req.body);
    await query.insertDrug(body);
    res.sendStatus(201);
  } catch (error) {
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sentStatus(500);
  }
};

const getDrugInfo = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    res.send({ result: await query.selectDrugById(params.id) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateDrug = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("drugUpdate", req.body);

    const updatedDrug = await query.updatedDrug(body, params);
    console.log(updatedDrug);
    if (updatedDrug.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

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

const deleteDrug = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deletedDrug = await query.deleteDrug(params.id);

    console.log(deletedDrug);
    if (deletedDrug.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getDrugsJournal = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const options = await validateBody("page", req.query);

    res.send({
      results: await query.selectDrugsJournal(params.id_patient, options?.page),
    });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400), send(error);
    res.sendStatus(500);
  }
};

const getOneDrugJournal = async (req, res) => {
  try {
    const params = await validateBody("validDrugListItem", req.params);

    res.send({
      results: await query.selectDrugsJournalItem(params),
    });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400), send(error);
    res.sendStatus(500);
  }
};

const addToDrugsJournal = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const body = await validateBody("validIdDrug", req.body);

    const insertedItem = await query.insertIntoDrugJournal({
      ...params,
      ...body,
      date: moment().format(),
    });
    res.status(201).send({ id_drug: insertedItem.insertId });
  } catch (error) {
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteDrugFromJournal = async (req, res) => {
  try {
    const params = await validateBody("drugJournalDeletion", req.params);

    const deletedItem = await query.deleteFromJournal(params);

    if (deletedItem.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getPatientDrugsList,
  addToDrugsList,
  getAllDrugs,
  addNewDrug,
  updateDrug,
  deleteDrug,
  addToDrugsJournal,
  deleteDrugFromJournal,
  getOneDrugJournal,
  getDrugInfo,
  getDrugsJournal,
  deleteFromDugList,
};
