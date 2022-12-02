const query = require("./queries");

const getIllnessList = async (req, res) => {
  try {
    res.send(await query.selectAllIllnessTypes(req.query));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const addIllness = async (req, res) => {
  try {
    await query.insertIllnessType(req.body);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateIllness = async (req, res) => {
  try {
    const updatedIllness = await query.updateIllness(req.body, req.params);
    if (updatedIllness.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteIllness = async (req, res) => {
  try {
    const deletedIllness = await query.deleteIllness(req.params.id);
    if (deletedIllness.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  getIllnessList,
  addIllness,
  updateIllness,
  deleteIllness,
};
