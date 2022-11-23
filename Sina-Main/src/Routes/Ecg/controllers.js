const path = require("path");
const { deleteFile } = require("../../Utilities/uploadUtilities");
const query = require("./queries");
const validateBody = require("../../Utilities/validations");

const addEcgFile = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const body = await validateBody("addEcgFile", req.body);

    if (req?.file?.path == null)
      return res.status(400).send({ type: "no_file_attached" });
    body.link = req?.file?.path;
    await query.insertEcgFile({ ...body, ...params });

    res.sendStatus(201);
  } catch (error) {
    if (req?.file?.path) deleteFile(req?.file?.path);
    if (error.type == "validation_error" || error.type == "invalid_data")
      return res.status(400).send(error);
    res.sendStatus(500);
  }
};

const downloadECGFile = async (req, res) => {
  try {
    const params = await validateBody("validId", req.params);

    const file = await query.selectEcgFileById(params.id);

    res.download("./" + path.normalize(file.link));
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
const getEcgFileList = async (req, res) => {
  try {
    const params = await validateBody("validIdPatient", req.params);
    const options = await validateBody("page", req.query);

    res.send({
      results: await query.selectPatientEcgFiles(
        params.id_patient,
        options,
        options.page
      ),
    });
  } catch (error) {
    console.log(error);
    if (error.type == "validation_error") return res.status(400).send(error);
    res.sendStatus(500);
  }
};
module.exports = { addEcgFile, downloadECGFile, getEcgFileList };
