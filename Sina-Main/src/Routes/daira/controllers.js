const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getDairaList = async (req, res, next) => {
  try {
    res.send(await query.selectAllDaira(req.query));
  } catch (error) {
    next(error);
  }
};

const addDaira = async (req, res, next) => {
  try {
    await query.insertDaira(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateDaira = async (req, res, next) => {
  try {
    const updatedDaira = await query.updateDaira(req.body, req.params);
    if (updatedDaira.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteDaira = async (req, res, next) => {
  try {
    const deletedDaira = await query.deleteDaira(req.params.id);
    if (deletedDaira.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDairaList,
  addDaira,
  updateDaira,
  deleteDaira,
};
