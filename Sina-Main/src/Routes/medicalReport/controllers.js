const moment = require("moment");
const fs = require("mz/fs");
const path = require("path");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const addMedicalReport = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);

    if (req.file?.path == null)
      return res.status(400).send({ type: "no_file_attached" });
    params.link = req.file?.path;
    params.created_at = moment().format();
    await query.insertReport(params);
    res.sendStatus(201);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getMedicalReport = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const report = await query.selectReportById(params.id);
    if (report == null) return res.status(400).send({ type: "file_not_found" });

    const fileName = "file.pdf";
    const fileURL = "./" + path.normalize(report.link);
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/pdf",
    });
    stream.pipe(res);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getMedicalReportList = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const options = await validateBody("GetReportOptions", req.query);

    res.send({
      results: await query.selectReportList(
        params.id_patient,
        options,
        options.page
      ),
    });
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const deleteReport = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const deleteQuery = await query.deleteReport(params.id);
    if (deleteQuery.affectedRows == 0)
      return res.status(400).send({ type: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = {
  addMedicalReport,
  getMedicalReport,
  deleteReport,
  getMedicalReportList,
};
