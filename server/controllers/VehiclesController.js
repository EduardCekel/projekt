const { resSucc, resErr } = require('../utils/apiResponse');
const HttpStatus = require('../enums/http-status.enum');
const { SuccessMsg, DefaultMsg } = require('../enums/message.enum');
const log = require("../utils/logger");

module.exports = {
  getVehicles: (req, res) => {
    log.info('getVehicles()')
    const vehicles = require('../models/vehicles');

    (async () => {
        const ret_val = await vehicles.getVehicles();
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  getSingleVehicle: (req, res) => {
    log.info('getSingleVehicle()')
    const vehicles = require('../models/vehicles');

    (async () => {
        const ret_val = await vehicles.getSingleVehicle(req.params.vehicle_ecv);
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        console.log(err)
        //log.error(err);
        resErr(res, err);
    });
  },
  
  getVehiclesECV: (req, res) => {
    log.info('getVehiclesECV()')
    const vehicles = require('../models/vehicles');

    (async () => {
        ret_val = await vehicles.getVehiclesECV();
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  getVehiclesECVPlanHist: (req, res) => {
    log.info('getVehiclesECVPlanHist()')
    const vehicles = require('../models/vehicles');
    
    (async () => {
        ret_val = await vehicles.getVehiclesECVPlanHist(req.params.vehicle_ecv);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  getVehiclesECVPlan: (req, res) => {
    log.info('getVehiclesECVPlan()')
    const vehicles = require('../models/vehicles');
    
    (async () => {
        ret_val = await vehicles.getVehiclesECVPlan(req.params.vehicle_ecv);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  getVehicleByHospital: (req, res) => {
    log.info('getVehicleByHospital()')
    const vehicles = require('../models/vehicles');
    
    (async () => {
        ret_val = await vehicles.getVehicleByHospital(req.params.id_hospital);
        res.status(200).json(ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  getFreeVehicles: (req, res) => {
    log.info('getFreeVehicles()')
    const vehicles = require('../models/vehicles');
    
    (async () => {
        const ret_val = await vehicles.getFreeVehicles(req.params.id_hospital);
        resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.error(err);
        resErr(res, err);
    });
  },

  insertVehicle: (req, res) => {
    log.info('insertVehicle()')
    const veh = require("../models/vehicles");

    (async () => {
      ret_val = await veh.insertVehicle(req.body);
      return resSucc(res, HttpStatus.CREATED, SuccessMsg.VEHICLE_CREATED, ret_val);
    })().catch((err) => {
      log.error(err);
      resErr(res, err);
    });
  },

  updateVehicle: (req, res) => {
    log.info('updateVehicle()')
    const veh = require("../models/vehicles");

    (async () => {
      ret_val = await veh.updateVehicle(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.VEHICLE_UPDATED, ret_val);
    })().catch((err) => {
      log.error(err);
      resErr(res, err);
    });
  },

  deleteVehicle: (req, res) => {
    log.info('deleteVehicle()')
    const veh = require("../models/vehicles");

    (async () => {
      ret_val = await veh.deleteVehicle(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.VEHICLE_DELETED);
    })().catch((err) => {
      log.error(err);
      resErr(res, err);
    });
  }
}