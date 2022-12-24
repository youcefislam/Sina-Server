const path = require("path");
const moment = require("moment");
const { deleteFile } = require("../../utilities/uploadUtilities");
const query = require("./queries");
const { errorHandler } = require("../../database/connection");

const addEcgFile = async (req, res, next) => {
  try {
    if (!req.file?.path)
      return next(
        new errorHandler(
          "file_error",
          "File not attached or invalid file extension type"
        )
      );
    req.body.link = req.file?.path;
    req.body.created_at = moment(req.body.created_at).format();
    await query.insertEcgFile({ ...req.body, id_patient: req.params[0] });

    res.sendStatus(201);
  } catch (error) {
    if (req.file?.path) deleteFile(req.file?.path);
    next(error);
  }
};

const downloadECGFile = async (req, res, next) => {
  try {
    const file = await query.selectEcgFileById(req.params[0]);

    res.sendFile(path.resolve(file.link));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getEcgFileList = async (req, res, next) => {
  try {
    res.send(await query.selectPatientEcgFiles(req.params[0], req.query));
  } catch (error) {
    next(error);
  }
};

module.exports = { addEcgFile, downloadECGFile, getEcgFileList };
