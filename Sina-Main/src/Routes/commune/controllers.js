const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const getCommuneList = async (req, res, next) => {
  try {
    res.send(await query.selectAllCommune(req.query));
  } catch (error) {
    next(error);
  }
};

const addCommune = async (req, res, next) => {
  try {
    await query.insertCommune(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateCommune = async (req, res, next) => {
  try {
    const updatedCommune = await query.updateCommune(req.body, req.params);
    if (updatedCommune.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteCommune = async (req, res, next) => {
  try {
    const deletedCommune = await query.deleteCommune(req.params.id);
    if (deletedCommune.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommuneList,
  addCommune,
  updateCommune,
  deleteCommune,
};
