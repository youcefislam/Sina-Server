const path = require("path");
const moment = require("moment");
const { deleteFile } = require("../../Utilities/uploadUtilities");
const query = require("./queries");
const { errorHandler } = require("../../Database/Connection");

const addEcgFile = async (req, res, next) => {
  try {
    if (req.file?.path == null)
      return next(
        new errorHandler(
          "file_error",
          "File not attached or invalid file extension type"
        )
      );
    req.body.link = req.file?.path;
    req.params.created_at = moment(req.params.created_at).format();
    await query.insertEcgFile({ ...req.body, ...req.params });

    res.sendStatus(201);
  } catch (error) {
    if (req.file?.path) deleteFile(req.file?.path);
    next(error);
  }
};

const downloadECGFile = async (req, res, next) => {
  try {
    const file = await query.selectEcgFileById(req.params.id);

    res.download("./" + path.normalize(file.link));
  } catch (error) {
    next(error);
  }
};

const getEcgFileList = async (req, res, next) => {
  try {
    res.send(
      await query.selectPatientEcgFiles(req.params.id_patient, req.query)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { addEcgFile, downloadECGFile, getEcgFileList };
