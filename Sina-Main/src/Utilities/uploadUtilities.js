const path = require("path");
const multer = require("multer");

const checkReportType = (file, cb) => {
  //type of valid extension
  const filetype = /pdf/;
  //check file extension
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  // check the mimetype
  const mimetype = filetype.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Pdf Only");
  }
};
const checkEcgtType = (file, cb) => {
  //type of valid extension
  const filetype = /csv/;
  //check file extension
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  // check the mimetype
  const mimetype = filetype.test(file.mimetype);
  console.log(extname);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("csv Only");
  }
};

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/uploads/reportFiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "rapport-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const ecgFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/uploads/ECGfiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ecg-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadReport = multer({
  storage: reportStorage, // where to store the files
  limits: 30000000, // limit of the uploaded data
  fileFilter: (res, file, cb) => {
    checkReportType(file, cb); // type of valid files
  },
});

const uploadEcg = multer({
  storage: ecgFileStorage, // where to store the files
  limits: 30000000, // limit of the uploaded data
  fileFilter: (res, file, cb) => {
    checkEcgtType(file, cb); // type of valid files
  },
});

module.exports = {
  uploadReport,
  uploadEcg,
};
