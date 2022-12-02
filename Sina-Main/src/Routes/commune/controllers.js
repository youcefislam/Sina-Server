const query = require("./queries");

const getCommuneList = async (req, res) => {
  try {
    res.send(await query.selectAllCommune(req.query));
  } catch (error) {
    res.sendStatus(500);
  }
};

const addCommune = async (req, res) => {
  try {
    await query.insertCommune(req.body);
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateCommune = async (req, res) => {
  try {
    const updatedCommune = await query.updateCommune(req.body, req.params);
    if (updatedCommune.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteCommune = async (req, res) => {
  try {
    const deletedCommune = await query.deleteCommune(req.params.id);
    if (deletedCommune.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getCommuneList,
  addCommune,
  updateCommune,
  deleteCommune,
};
