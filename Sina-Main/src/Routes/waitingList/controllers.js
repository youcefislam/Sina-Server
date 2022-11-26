const query = require("./queries");
const patientQuery = require("../patient/queries.js");

const getWaitingList = async (req, res) => {
  try {
    res.send({
      results: await query.selectWaitingList(req.autData.id, req.query?.page),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addRequest = async (req, res) => {
  try {
    await query.insertRequest({
      id_doctor: req.body.id,
      id_patient: req.autData.id,
      message: req.body.message,
    });
    res.sendStatus(204);
  } catch (error) {
    if (error.code == "invalid_data" || error.code == "duplicated_entry_error")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const deleteRequest = async (req, res) => {
  try {
    const patientRequest = await query.selectRequest({
      id_doctor: req.autData.id,
      id_patient: req.query.id_patient,
    });
    if (patientRequest == null)
      return res.status(400).send({ code: "row_not_found" });

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
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getWaitingList,
  addRequest,
  deleteRequest,
};
