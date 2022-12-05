const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getWilayaList = async (req, res, next) => {
  try {
    res.send(await query.selectAllWilaya(req.query));
  } catch (error) {
    next(error);
  }
};

const addWilaya = async (req, res, next) => {
  try {
    await query.insertWilaya(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateWilaya = async (req, res, next) => {
  try {
    const updatedWilaya = await query.updateWilaya(req.body, req.params);
    if (updatedWilaya.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteWilaya = async (req, res, next) => {
  try {
    const deletedWilaya = await query.deleteWilaya(req.params.id);
    if (deletedWilaya.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWilayaList,
  addWilaya,
  updateWilaya,
  deleteWilaya,
};
