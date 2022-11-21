const validateBody = require("../../Utilities/validations");
const query = require("./queries");

const getIllnessList = async (req, res) => {
  try {
    const options = await validateBody("page", req.query);

    res.send({ results: await query.selectAllIllnessTypes(options?.page) });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const addIllness = async (req, res) => {
  try {
    const body = await validateBody("type", req.body);

    await query.insertIllnessType(body);
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getIllness = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    res.send({ result: await query.selectIllnessType(params.id) });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const updateIllness = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("type", req.body);

    const updatedIllness = await query.updateIllness(body, params);
    if (updatedIllness.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (
      error.type == "validation_error" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteIllness = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deletedIllness = await query.deleteIllness(params.id);
    if (deletedIllness.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getIllnessList,
  addIllness,
  getIllness,
  updateIllness,
  deleteIllness,
};
