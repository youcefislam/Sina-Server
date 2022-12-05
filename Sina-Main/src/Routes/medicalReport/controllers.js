const moment = require("moment");
const fs = require("mz/fs");
const path = require("path");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const addMedicalReport = async (req, res, next) => {
  try {
    if (req.file?.path == null)
      return next(
        new errorHandler(
          "file_error",
          "File not attached or invalid file extension type"
        )
      );

    req.params.link = req.file?.path;
    req.params.created_at = moment().format();
    await query.insertReport(req.params);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const getMedicalReport = async (req, res, next) => {
  try {
    const report = await query.selectReportById(req.params.id);
    if (report == null) return next(new errorHandler("raw_not_found"));

    const fileName = "file.pdf";
    const fileURL = "./" + path.normalize(report.link);
    const stream = fs.createReadStream(fileURL);
    res.set({
      "Content-Disposition": `attachment; filename='${fileName}'`,
      "Content-Type": "application/pdf",
    });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

const getMedicalReportList = async (req, res, next) => {
  try {
    res.send(await query.selectReportList(req.params.id_patient, req.query));
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const deleteQuery = await query.deleteReport(req.params.id);
    if (deleteQuery.affectedRows == 0)
      return next(new errorHandler("raw_not_found"));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMedicalReport,
  getMedicalReport,
  getMedicalReportList,
  deleteReport,
};
