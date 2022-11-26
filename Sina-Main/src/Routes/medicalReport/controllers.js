const moment = require("moment");
const fs = require("mz/fs");
const path = require("path");
const query = require("./queries");

const addMedicalReport = async (req, res) => {
  try {
    if (req.file?.path == null)
      return res.status(400).send({
        code: "file_error",
        message: "File not attached or invalid file extension type",
      });
    req.params.link = req.file?.path;
    req.params.created_at = moment().format();
    await query.insertReport(req.params);
    res.sendStatus(201);
  } catch (error) {
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const getMedicalReport = async (req, res) => {
  try {
    const report = await query.selectReportById(req.params.id);
    if (report == null) return res.status(400).send({ code: "file_not_found" });

    const fileName = "file.pdf";
    const fileURL = "./" + path.normalize(report.link);
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/pdf",
    });
    stream.pipe(res);
  } catch (error) {
    res.sendStatus(500);
  }
};
const getMedicalReportList = async (req, res) => {
  try {
    res.send({
      results: await query.selectReportList(
        req.params.id_patient,
        req.query,
        req.query.page
      ),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};
const deleteReport = async (req, res) => {
  try {
    const deleteQuery = await query.deleteReport(req.params.id);
    if (deleteQuery.affectedRows == 0)
      return res.status(400).send({ code: "row_not_found" });
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
};
module.exports = {
  addMedicalReport,
  getMedicalReport,
  deleteReport,
  getMedicalReportList,
};
