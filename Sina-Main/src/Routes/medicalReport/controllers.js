const moment = require("moment");
const path = require("path");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const addMedicalReport = async (req, res, next) => {
  try {
    if (!req.file?.path)
      return next(
        new errorHandler(
          "file_error",
          "File not attached or invalid file extension type"
        )
      );

    await query.insertReport({
      id_patient: req.params[0],
      link: req.file?.path,
      created_at: moment().format(),
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const getMedicalReport = async (req, res, next) => {
  try {
    const report = await query.selectReportById(req.params[0]);
    if (!report) return next(new errorHandler("raw_not_found"));

    res.sendFile(path.resolve(report.link));
  } catch (error) {
    next(error);
  }
};

const getMedicalReportList = async (req, res, next) => {
  try {
    res.send(await query.selectReportList(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const deleteQuery = await query.deleteReport(req.params[0]);
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
