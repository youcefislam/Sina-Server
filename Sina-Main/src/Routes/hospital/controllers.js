const query = require("./queries");
const { errorHandler } = require("../../database/connection");

const getAllHospitals = async (req, res, next) => {
  try {
    res.send(await query.selectHospitals(req.query));
  } catch (error) {
    next(error);
  }
};

const addNewHospital = async (req, res, next) => {
  try {
    await query.insertHospital(req.body);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const modifyHospital = async (req, res, next) => {
  try {
    const updateQuery = await query.updateHospital(req.body, {
      id: req.params[0],
    });
    if (!updateQuery.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteHospital = async (req, res, next) => {
  try {
    const deleteQuery = await query.deleteHospital(req.params[0]);
    if (!deleteHospital.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHospitals,
  addNewHospital,
  modifyHospital,
  deleteHospital,
};
