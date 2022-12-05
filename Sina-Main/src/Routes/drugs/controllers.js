const moment = require("moment");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getPatientDrugsList = async (req, res, next) => {
  try {
    res.send(
      await query.selectPatientDrugList(req.params.id_patient, req.query)
    );
  } catch (error) {
    next(error);
  }
};

const addToDrugsList = async (req, res, next) => {
  try {
    await query.insertIntoDrugList({ ...req.params, ...req.body });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const deleteFromDugList = async (req, res, next) => {
  try {
    const deletedItem = await query.deleteFromDrugList(req.params);

    if (deletedItem.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getAllDrugs = async (req, res, next) => {
  try {
    res.send(await query.selectAllDrugs(req.query));
  } catch (error) {
    next(error);
  }
};

const addNewDrug = async (req, res, next) => {
  try {
    await query.insertDrug(req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const getDrugInfo = async (req, res, next) => {
  try {
    res.send({ result: await query.selectDrugById(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const updateDrug = async (req, res, next) => {
  try {
    const updatedDrug = await query.updatedDrug(req.body, req.params);
    if (updatedDrug.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteDrug = async (req, res, next) => {
  try {
    const deletedDrug = await query.deleteDrug(req.params.id);

    if (deletedDrug.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getDrugsJournal = async (req, res, next) => {
  try {
    res.send(await query.selectDrugsJournal(req.params.id_patient, req.query));
  } catch (error) {
    next(error);
  }
};

const getOneDrugJournal = async (req, res, next) => {
  try {
    res.send({
      results: await query.selectDrugsJournalItem(req.params),
    });
  } catch (error) {
    next(error);
  }
};

const addToDrugsJournal = async (req, res, next) => {
  try {
    const insertedItem = await query.insertIntoDrugJournal({
      ...req.params,
      ...req.body,
      date: moment().format(),
    });
    res.status(201).send({ id_drug: insertedItem.insertId });
  } catch (error) {
    next(error);
  }
};

const deleteDrugFromJournal = async (req, res, next) => {
  try {
    const deletedItem = await query.deleteFromJournal(req.params);

    if (deletedItem.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
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
