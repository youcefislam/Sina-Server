const query = require("./queries");
const patientQuery = require("../patient/queries");

const updateRelative = async (req, res, next) => {
  try {
    if (req.body.phone_number)
      req.body.phone_number = Number(req.body.phone_number);

    const updatedRelative = await query.updateRelative(req.body, req.params);
    if (updatedRelative.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const addRelative = async (req, res, next) => {
  let relative;
  try {
    relative = await query.insertRelative(req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getRelativeInfo = async (req, res, next) => {
  try {
    const relative = await query.selectRelative(req.params.id);

    res.send({ result: relative });
  } catch (error) {
    next(error);
  }
};

const deleteRelative = async (req, res) => {
  try {
    const deletedRelative = await query.deleteMyRelative(req.params.id);

    if (deletedRelative.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateRelative,
  addRelative,
  getRelativeInfo,
  deleteRelative,
};
