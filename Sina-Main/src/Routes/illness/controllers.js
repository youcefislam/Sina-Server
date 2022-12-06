const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getIllnessList = async (req, res, next) => {
  try {
    res.send(await query.selectAllIllnessTypes(req.query));
  } catch (error) {
    next(error);
  }
};

const addIllness = async (req, res, next) => {
  try {
    await query.insertIllnessType(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateIllness = async (req, res, next) => {
  try {
    const updatedIllness = await query.updateIllness(req.body, {
      id: req.params[0],
    });
    if (!updatedIllness.affectedRows)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteIllness = async (req, res, next) => {
  try {
    const deletedIllness = await query.deleteIllness(req.params[0]);
    if (!deletedIllness.affectedRows)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIllnessList,
  addIllness,
  updateIllness,
  deleteIllness,
};
