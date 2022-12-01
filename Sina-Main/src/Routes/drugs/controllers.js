const moment = require("moment");
const query = require("./queries");

const getPatientDrugsList = async (req, res) => {
  try {
    res.send({
      results: await query.selectPatientDrugList(
        req.params.id_patient,
        req.query?.page
      ),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addToDrugsList = async (req, res) => {
  try {
    await query.insertIntoDrugList({ ...req.params, ...req.body });
    res.sendStatus(201);
  } catch (error) {
    if (error.code == "invalid_data" || error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteFromDugList = async (req, res) => {
  try {
    const deletedItem = await query.deleteFromDrugList(req.params);

    if (deletedItem.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getAllDrugs = async (req, res) => {
  try {
    res.send({ results: await query.selectAllDrugs(req.query?.page) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addNewDrug = async (req, res) => {
  try {
    await query.insertDrug(req.body);
    res.sendStatus(201);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sentStatus(500);
  }
};

const getDrugInfo = async (req, res) => {
  try {
    res.send({ result: await query.selectDrugById(req.params.id) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const updateDrug = async (req, res) => {
  try {
    const updatedDrug = await query.updatedDrug(req.body, req.params);
    if (updatedDrug.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteDrug = async (req, res) => {
  try {
    const deletedDrug = await query.deleteDrug(req.params.id);

    if (deletedDrug.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getDrugsJournal = async (req, res) => {
  try {
    res.send({
      results: await query.selectDrugsJournal(
        req.params.id_patient,
        req.query?.page
      ),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const getOneDrugJournal = async (req, res) => {
  try {
    res.send({
      results: await query.selectDrugsJournalItem(req.params),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addToDrugsJournal = async (req, res) => {
  try {
    const insertedItem = await query.insertIntoDrugJournal({
      ...req.params,
      ...req.body,
      date: moment().format(),
    });
    res.status(201).send({ id_drug: insertedItem.insertId });
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteDrugFromJournal = async (req, res) => {
  try {
    const deletedItem = await query.deleteFromJournal(req.params);

    if (deletedItem.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getPatientDrugsList,
  addToDrugsList,
  deleteFromDugList,
  getAllDrugs,
  addNewDrug,
  getDrugInfo,
  updateDrug,
  deleteDrug,
  getDrugsJournal,
  getOneDrugJournal,
  addToDrugsJournal,
  deleteDrugFromJournal,
};
