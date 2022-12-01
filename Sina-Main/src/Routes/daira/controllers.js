const query = require("./queries");

const getDairaList = async (req, res) => {
  try {
    res.send({ results: await query.selectAllDaira(req.query?.page) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addDaira = async (req, res) => {
  try {
    await query.insertDaira(req.body);
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateDaira = async (req, res) => {
  try {
    const updatedDaira = await query.updateDaira(req.body, req.params);
    if (updatedDaira.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteDaira = async (req, res) => {
  try {
    const deletedDaira = await query.deleteDaira(req.params.id);
    if (deletedDaira.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getDairaList,
  addDaira,
  updateDaira,
  deleteDaira,
};
