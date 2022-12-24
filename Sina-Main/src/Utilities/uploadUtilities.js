const path = require("path"),
  fs = require("fs"),
  multer = require("multer");

const checkReportType = (file, cb) => {
  //type of valid extension
  const filetype = /pdf/;
  //check file extension
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  // check the mimetype
  const mimetype = filetype.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(null, false);
};
const checkEcgType = (file, cb, res) => {
  //type of valid extension
  const filetype = /csv/;
  //check file extension
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  // check the mimetype
  const mimetype = filetype.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(null, false);
};

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/reportFiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "rapport-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const ecgFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/ecgfiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ecg-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadReport = multer({
  storage: reportStorage, // where to store the files
  limits: 30000000, // limit of the uploaded data
  fileFilter: (req, file, cb) => {
    checkReportType(file, cb); // type of valid files
  },
});

const uploadEcg = multer({
  storage: ecgFileStorage, // where to store the files
  limits: 30000000, // limit of the uploaded data
  fileFilter: (req, file, cb) => {
    checkEcgType(file, cb); // type of valid files
  },
});

const deleteFile = (path) => {
  fs.unlink(path, (error) => {
    if (error) return console.log(error);
  });
};

module.exports = {
  uploadReport,
  uploadEcg,
  deleteFile,
};
