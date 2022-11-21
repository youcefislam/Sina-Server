const validateBody = require("../../Utilities/validations");
const query = require("./queries");
const patientQuery = require("../patient/queries.js");

const getWaitingList = async (req, res) => {
  try {
    const options = await validateBody("page", req.query);
    res.send({
      results: await query.selectWaitingList(req.params.id, options?.page),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const addRequest = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    await query.insertRequest({
      id_doctor: params.id,
      id_patient: req.autData.id,
    });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (
      error.type == "validation_error" ||
      error.type == "invalid_data" ||
      error.type == "duplicated_entry_error"
    )
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const acceptRequest = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("validAcceptTicket", req.body);

    const updatedRecord = await patientQuery.updatePatient(
      {
        id_doctor: params.id,
        severity: body.severity,
        id_illness_type: body.id_illness_type,
      },
      { id: body.id_patient }
    );

    const deletedRecord = await query.deleteRequest({
      id_doctor: params.id,
      id_patient: body.id_patient,
    });
    if (deletedRecord.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const rejectRequest = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);
    const body = await validateBody("validIdPatient", req.body);

    const deletedRecord = await query.deleteRequest({
      id_doctor: params.id,
      ...body,
    });
    if (deletedRecord.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getWaitingList,
  addRequest,
  acceptRequest,
  rejectRequest,
};
