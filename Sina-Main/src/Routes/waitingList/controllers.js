const query = require("./queries");
const patientQuery = require("../patient/queries.js");
const { errorHandler } = require("../../Database/Connection");

const getWaitingList = async (req, res, next) => {
  try {
    res.send(await query.selectWaitingList(req.autData.id, req.query));
  } catch (error) {
    next(error);
  }
};

const addRequest = async (req, res, next) => {
  try {
    await query.insertRequest({
      id_doctor: req.body.id,
      id_patient: req.autData.id,
      message: req.body.message,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    const patientRequest = await query.selectRequest({
      id_doctor: req.autData.id,
      id_patient: req.query.id_patient,
    });
    if (!patientRequest) return next(new errorHandler("raw_not_found"));

    if (req.query.severity)
      await patientQuery.updatePatient(
        {
          id_doctor: req.autData.id,
          severity: req.query.severity,
          id_illness_type: req.query.id_illness_type,
        },
        { id: req.query.id_patient }
      );

    await query.deleteRequest(patientRequest);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWaitingList,
  addRequest,
  deleteRequest,
};
