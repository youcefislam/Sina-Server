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
    const updatedCommune = await query.updateCommune(req.body, {
      id: req.params[0],
    });
    if (!updatedCommune.affectedRows)
      return next(new errorHandler("row_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteCommune = async (req, res, next) => {
  try {
    const deletedCommune = await query.deleteCommune(req.params[0]);
    if (!deletedCommune.affectedRows)
      return next(new errorHandler("row_not_found"));
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
