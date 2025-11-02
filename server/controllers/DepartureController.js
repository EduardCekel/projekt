const { resSucc, resErr } = require('../utils/apiResponse');
const HttpStatus = require('../enums/http-status.enum');
const { SuccessMsg, DefaultMsg } = require('../enums/message.enum');
const log = require("../utils/logger");
const dep_plan = require("../models/departures");

module.exports = {
  getDepartureTypes: (req, res) => {
    log.info('getDepartureTypes()');
    const types = require('../models/departures');

    (async () => {
        const ret_val = await types.getDepartureTypes();
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.error(err);
        return resErr(res, err);
    });
  },

  getDeparturePlans: (req, res) => {
    log.info("getDeparturePlans()");

    (async () => {
        const ret_val = await dep_plan.getDeparturePlans();
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.err(err);
        return resErr(res, err);
    });
  },

  getDepartures: (req, res) => {
    log.info("getDepartures()");

    (async () => {
        const ret_val = await dep_plan.getDepartures();
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.err(err);
        return resErr(res, err);
    });
  },

  getDeparturesHistory: (req, res) => {
    log.info("getDeparturesHistory()");

    (async () => {
        const ret_val = await dep_plan.getDeparturesHistory();
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.err(err);
        return resErr(res, err);
    });
  },

  getMatchingDepartures: (req, res) => {
    log.info("getMatchingDepartures()");

    (async () => {
        const hosp_from = req.query.from;
        const hosp_to = req.query.to;
        const date = req.query.date;
        const ret_val = await dep_plan.getMatchingDepartures(hosp_from, hosp_to, date);
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.err(err);
        return resErr(res, err);
    });
  },

  getMatchingDeparturesCount: (req, res) => {
    log.info("getMatchingDeparturesCount()");

    (async () => {
        const hosp_from = req.query.from;
        const hosp_to = req.query.to;
        const date = req.query.date;

        const ret_val = await dep_plan.getMatchingDeparturesCount(hosp_from, hosp_to, date);
        return resSucc(res, HttpStatus.OK, DefaultMsg.DEFAULT_MSG, ret_val);
      })()
      .catch((err) => {
        log.err(err);
        return resErr(res, err);
    });
  },

  insertDeparturePlan: (req, res) => {
    log.info('insertDeparturePlan()');

    (async () => {
      ret_val = await dep_plan.insertDeparturePlan(req.body);
      return resSucc(res, HttpStatus.CREATED, SuccessMsg.DEPARTURE_CREATED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  insertVehicleToDeparture: (req, res) => {
    log.info('insertVehicleToDeparture()');

    (async () => {
      const ret_val = await dep_plan.insertVehicleToDeparture(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_VEHICLE_ASSIGNED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  updateDeparturePlan: (req, res) => {
    //log.info('updateDeparturePlan()')

    (async () => {
      ret_val = await dep_plan.updateDeparturePlan(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_UPDATED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  updateDeparturePlanDuration: (req, res) => {
    //log.info('updateDeparturePlan()')

    (async () => {
      ret_val = await dep_plan.updateDeparturePlanDuration(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_DURATION_CHANGED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  
  updateVehicleInDeparture: (req, res) => {
    log.info('updateVehicleInDeparture()');

    (async () => {
      const ret_val = await dep_plan.updateVehicleInDeparture(req.body);
      return resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_VEHICLE_CHANGED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  deletePlannedDeparture: (req, res) => {
    //log.info('deletePlannedDeparture()')

    (async () => {
      ret_val = await dep_plan.deletePlannedDeparture(req.params.dep_id);
      resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_DELETED);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  },

  deleteDeparture: (req, res) => {
    //log.info('deleteDeparture()')

    (async () => {
      const ret_val = await dep_plan.deleteDeparture(req.params.dep_id);
      resSucc(res, HttpStatus.OK, SuccessMsg.DEPARTURE_DELETED, ret_val);
    })().catch((err) => {
      log.err(err);
      return resErr(res, err);
    });
  }
}