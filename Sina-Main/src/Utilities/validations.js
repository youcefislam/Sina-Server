const joi = require("joi");

// Data form validation with joi
// modify this garbage at the end of the refactoring
const schema = {
  updatePatientInfo: joi
    .object({
      username: joi.string().min(6),
      first_name: joi.string().max(50),
      last_name: joi.string().max(50),
      mail: joi.string().email(),
      sex: joi.number().max(1),
      birth_date: joi.date(),
      address: joi.string().max(255),
      id_commune: joi.number(),
      phone_number: joi
        .string()
        .length(10)
        .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
    })
    .and("id_commune", "address")
    .and("first_name", "last_name"),
  addRelative: joi.object({
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
    phone_number: joi
      .string()
      .length(10)
      .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
    mail: joi.string().email().required(),
    id_patient: joi.number().min(1).required(),
  }),
  updateRelative: joi
    .object({
      first_name: joi.string().max(50),
      last_name: joi.string().max(50),
      phone_number: joi
        .string()
        .length(10)
        .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
      mail: joi.string().email(),
    })
    .and("first_name", "last_name"),
  validNewPassword: joi
    .object({
      old_password: joi.string().alphanum().min(8).required(),
      password: joi.string().alphanum().min(8).required(),
      repeat_password: joi.ref("password"),
    })
    .with("password", "repeat_password"),
  type: joi.object({
    type: joi.string().max(50).required(),
  }),
  validId: joi.object({ id: joi.number().min(1).required() }),
  addAppointment: joi.object({
    id_patient: joi.number().min(1).required(),
    date: joi.date().required(),
  }),
  updateAppointment: joi.object({
    date: joi.date().required(),
  }),
  addNewDrug: joi.object({
    name: joi.string().max(50).required(),
    company: joi.string().max(100).required(),
    description: joi.string().max(1000),
    adult_dosage: joi.string().max(300),
    children_dosage: joi.string().max(300),
    warnings: joi.string().max(1000),
  }),
  validIdDrug: joi.object({
    id_drug: joi.number().min(1).required(),
  }),
  drugListItem: joi.object({
    id_drug: joi.number().min(1).required(),
    id_patient: joi.number().min(1).required(),
  }),
  deleteFromDrugJournal: joi.object({
    id: joi.number().min(1).required(),
    id_drug: joi.number().min(1).required(),
    id_patient: joi.number().min(1).required(),
  }),
  updateDrug: joi.object({
    name: joi.string().max(50),
    company: joi.string().max(100),
    description: joi.string().max(1000),
    adult_dosage: joi.string().max(300),
    children_dosage: joi.string().max(300),
    warnings: joi.string().max(1000),
  }),
  name: joi.object({
    name: joi.string().max(50).min(1).required(),
  }),
  addDairaBody: joi.object({
    id_wilaya: joi.number().min(1).required(),
    name: joi.string().max(1000).required(),
  }),
  addCommuneBody: joi.object({
    id_daira: joi.number().min(1).required(),
    name: joi.string().max(1000).required(),
  }),
  addNote: joi.object({
    id_patient: joi.number().min(1).required(),
    description: joi.string().max(1000).required(),
  }),
  updateNote: joi.object({
    description: joi.string().max(1000).required(),
  }),
  addHospitalBody: joi.object({
    name: joi.string().max(50).required(),
    address: joi.string().max(255).required(),
    phone_number: joi
      .string()
      .length(10)
      .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
    id_commune: joi.number().min(1).required(),
  }),
  updateHospital: joi
    .object({
      name: joi.string().max(50),
      address: joi.string().max(255),
      phone_number: joi
        .string()
        .length(10)
        .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
      id_commune: joi.number().min(1),
    })
    .with("address", "id_commune"),
  validDate: joi.object({ date: joi.date().required() }),
  sendAlert: joi.object({
    heart_condition: joi.string().required(),
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
  }),
  searchDoctorQuery: joi
    .object({
      username: joi.string().alphanum(),
      mail: joi.string().email(),
      page: joi.number().min(1),
    })
    .or("username", "mail"),
  validPassword: joi.object({
    password: joi.string().alphanum().min(8).required(),
  }),
  deleteFromPatientList: joi.object({
    id: joi.number().min(1).required(),
    id_patient: joi.number().min(1).required(),
  }),
  validIdDoctor: joi.object({
    id_doctor: joi.number().min(1).required(),
  }),
  validPatientRequest: joi.object({
    id_doctor: joi.number().min(1).required(),
    id_patient: joi.number().min(1).required(),
  }),
  validIdPatient: joi.object({
    id_patient: joi.number().min(1).required(),
  }),
  validAcceptTicket: joi.object({
    id_patient: joi.number().min(1).required(),
    severity: joi.number().max(5).required(),
    id_illness_type: joi.number().min(1).required(),
  }),
  page: joi.object({
    page: joi.number().min(1),
  }),
  id_wilaya: joi.object({
    id_wilaya: joi.number().min(1).required(),
  }),
  searchHospitalQuery: joi.object({
    name: joi.string().max(50),
    phone_number: joi
      .string()
      .length(10)
      .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
    id_commune: joi.number().min(1),
    id_wilaya: joi.number().min(1),
    id_daira: joi.number().min(1),
    page: joi.number().min(1),
  }),
  addEcgFile: joi.object({
    created_at: joi.date().required(),
  }),
  getEcgListOptions: joi.object({
    year: joi.number().min(1998).max(2100),
    month: joi.number().min(1).max(12),
    day: joi.number().min(1).max(31),
    page: joi.number().min(1),
  }),
  updateDoctor: joi
    .object({
      username: joi.string().min(6),
      mail: joi.string().email(),
      first_name: joi.string().max(50),
      last_name: joi.string().max(50),
      phone_number: joi
        .string()
        .length(10)
        .pattern(/^0{1}(7|6|5){1}([0-9]){8}$/),
      auto_accept: joi.bool(),
      id_daira: joi.number().min(1),
    })
    .and("first_name", "last_name"),
  getReportOptions: joi.object({
    created_at: joi.date(),
    page: joi.number().min(1),
  }),
  patientRequest: joi
    .object({
      id_patient: joi.number().min(1).required(),
      severity: joi.number().max(10),
      id_illness_type: joi.number().min(1),
    })
    .and("severity", "id_illness_type"),
  addPatientRequest: joi.object({
    id: joi.number().min(1).required(),
    message: joi.string().max(250),
  }),
};
module.exports = {
  schema,
};
