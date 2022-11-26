const dbPool = require("../../Database/Connection");
const query = require("./queries");

const getWilayaList = async (req, res) => {
  try {
    res.send({ results: await query.selectAllWilaya(req.query?.page) });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addWilaya = async (req, res) => {
  try {
    await query.insertWilaya(req.body);
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error" || error.code == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const updateWilaya = async (req, res) => {
  try {
    const updatedWilaya = await query.updateWilaya(req.body, req.params);
    if (updatedWilaya.affectedRows == 0)
      return res.status(400).send({ code: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const deleteWilaya = async (req, res) => {
  try {
    const deletedWilaya = await query.deleteWilaya(req.params.id);
    if (deletedWilaya.affectedRows == 0)
      return res.status(400).send({ code: "raw_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};
module.exports = {
  getWilayaList,
  addWilaya,
  updateWilaya,
  deleteWilaya,
};
