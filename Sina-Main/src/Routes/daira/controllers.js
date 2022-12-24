const query = require("./queries");
const { errorHandler } = require("../../database/connection");

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
    const updatedDaira = await query.updateDaira(req.body, {
      id: req.params[0],
    });
    if (!updatedDaira.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteDaira = async (req, res, next) => {
  try {
    const deletedDaira = await query.deleteDaira(req.params[0]);
    if (!deletedDaira.affectedRows)
      return next(new errorHandler("row_not_found"));
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
