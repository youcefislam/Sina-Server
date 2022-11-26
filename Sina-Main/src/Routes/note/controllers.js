const moment = require("moment");
const query = require("./queries");

const getNotesList = async (req, res) => {
  try {
    res.send({
      results: await query.selectNoteList(
        req.params.id_patient,
        req.query?.page
      ),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addNote = async (req, res) => {
  try {
    req.body.created_at = moment().format();

    await query.insertNote(req.body);
    res.sendStatus(201);
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateNote = async (req, res) => {
  try {
    const queryResult = await query.updateNote(req.body, req.params);

    if (queryResult?.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteNote = async (req, res) => {
  try {
    const queryResult = await query.deleteNote(req.params.id);

    if (queryResult.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};
const getNote = async (req, res) => {
  try {
    res.send({ result: await query.selectNoteById(req.params.id) });
  } catch (error) {
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
