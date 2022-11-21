const moment = require("moment");
const validateBody = require("../../Utilities/validations");
const query = require("./queries");

const getNotesList = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);

    res.send({ results: await query.selectNoteList(params.id_patient) });
  } catch (error) {
    console.log(error);
    if (error.type == 0) return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addNote = async (req, res) => {
  try {
    const body = await validateBody("createNote", req.body);

    body.created_at = moment().format();

    await query.insertNote(body);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateNote = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("validNote", req.body);

    const queryResult = await query.updateNote(body, params);

    if (queryResult?.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteNote = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const queryResult = await query.deleteNote(params.id);

    if (queryResult.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getNote = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    res.send({ result: await query.selectNoteById(params.id) });
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  getNotesList,
  addNote,
  updateNote,
  deleteNote,
  getNote,
};
