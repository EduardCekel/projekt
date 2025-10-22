const { resSucc, resErr } = require('../utils/apiResponse');
const HttpStatus = require('../enums/http-status.enum');
const { DefaultMsg } = require('../enums/message.enum');
const log = require("../utils/logger");

module.exports = {
  getMapaNemocnice: (req, res) => {
    const nemocnica = require('../models/nemocnica');
    (async () => {
      ret_val = await nemocnica.getMapaNemocnice(req.params.id_nemocnice);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getOddeleniaByNemocnica: (req, res) => {
    const nemocnica = require('../models/nemocnica');
    (async () => {
      ret_val = await nemocnica.getOddeleniaByNemocnica(
        req.params.id_nemocnice
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllDoctorsForHospital: (req, res) => {
    const employee = require('../models/zamestnanec');
    (async () => {
      ret_val = await employee.getAllDoctorsForHospital(req.params.hospitalId);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllNursesForHospital: (req, res) => {
    const employee = require('../models/zamestnanec');
    (async () => {
      ret_val = await employee.getAllNursesForHospital(req.params.hospitalId);
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllCurrentlyHospitalizedPatientsForHospital: (req, res) => {
    const hospital = require('../models/nemocnica');
    (async () => {
      ret_val = await hospital.getAllCurrentlyHospitalizedPatientsForHospital(
        req.params.hospitalId
      );
      res.status(200).json(ret_val);
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
  getAllHospitals: (req, res) => {
    log.info("getAllHospitals()");
    const hospital = require('../models/nemocnica');
    
    (async () => {
      const ret_val = await hospital.getAllHospitals();
      return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    });
  },
};
