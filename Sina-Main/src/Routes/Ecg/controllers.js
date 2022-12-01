const path = require("path");
const moment = require("moment");
const { deleteFile } = require("../../Utilities/uploadUtilities");
const query = require("./queries");

const addEcgFile = async (req, res) => {
  try {
    if (req.file?.path == null)
      return res.status(400).send({
        code: "file_error",
        message: "File not attached or invalid file extension type",
      });
    req.body.link = req.file?.path;
    req.params.created_at = moment(req.params.created_at).format();
    await query.insertEcgFile({ ...req.body, ...req.params });

    res.sendStatus(201);
  } catch (error) {
    if (req.file?.path) deleteFile(req.file?.path);
    if (error.code == "invalid_data") return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const downloadECGFile = async (req, res) => {
  try {
    const file = await query.selectEcgFileById(req.params.id);

    res.download("./" + path.normalize(file.link));
  } catch (error) {
    res.sendStatus(500);
  }
};

const getEcgFileList = async (req, res) => {
  try {
    res.send({
      results: await query.selectPatientEcgFiles(
        req.params.id_patient,
        req.query,
        req.query?.page
      ),
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { addEcgFile, downloadECGFile, getEcgFileList };
