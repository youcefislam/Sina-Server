const moment = require("moment");
const query = require("./queries");
const { errorHandler } = require("../../database/connection");

const getPatientDrugsList = async (req, res, next) => {
  try {
    res.send(await query.selectPatientDrugList(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

const addToDrugsList = async (req, res, next) => {
  try {
    await query.insertIntoDrugList({ id_patient: req.params[0], ...req.body });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const deleteFromDugList = async (req, res, next) => {
  try {
    const deletedItem = await query.deleteFromDrugList({
      id_patient: req.params[0],
      id_drug: req.params[1],
    });

    if (!deletedItem.affectedRows)
      return next(new errorHandler("row_not_found"));

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
    res.send({ result: await query.selectDrugById(req.params[0]) });
  } catch (error) {
    next(error);
  }
};

const updateDrug = async (req, res, next) => {
  try {
    const updatedDrug = await query.updatedDrug(req.body, {
      id: req.params[0],
    });
    if (!updatedDrug.affectedRows)
      return next(new errorHandler("row_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteDrug = async (req, res, next) => {
  try {
    const deletedDrug = await query.deleteDrug(req.params[0]);

    if (!deletedDrug.affectedRows)
      return next(new errorHandler("row_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getDrugsJournal = async (req, res, next) => {
  try {
    res.send(await query.selectDrugsJournal(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

const getOneDrugJournal = async (req, res, next) => {
  try {
    res.send(
      await query.selectDrugsJournalItem(
        { id_patient: req.params[0], id_drug: req.params[1] },
        req.query
      )
    );
  } catch (error) {
    next(error);
  }
};

const addToDrugsJournal = async (req, res, next) => {
  try {
    const insertedItem = await query.insertIntoDrugJournal({
      id_patient: req.params[0],
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
    const deletedItem = await query.deleteFromJournal({
      id_patient: req.params[0],
      id_drug: req.params[1],
      id: req.params[2],
    });

    if (!deletedItem.affectedRows)
      return next(new errorHandler("row_not_found"));

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
