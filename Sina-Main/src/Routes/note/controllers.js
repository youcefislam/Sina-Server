const moment = require("moment");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getNotesList = async (req, res, next) => {
  try {
    res.send(await query.selectNoteList(req.params.id_patient, req.query));
  } catch (error) {
    next(error);
  }
};

const addNote = async (req, res, next) => {
  try {
    req.body.created_at = moment().format();

    await query.insertNote(req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const queryResult = await query.updateNote(req.body, req.params);

    if (queryResult?.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const queryResult = await query.deleteNote(req.params.id);

    if (queryResult.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    res.send({ result: await query.selectNoteById(req.params.id) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotesList,
  addNote,
  updateNote,
  deleteNote,
  getNote,
};
