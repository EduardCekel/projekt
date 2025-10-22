const express = require('express');
const router = express.Router();
const controller = require("../controllers/DepartureController");
const verify = require('../middleware/verifyUser');
const AccRoles = require('../enums/access-roles.enum');

router.get(
  "/types", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getDepartureTypes
);
router.get(
  "/plans", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getDeparturePlans
);
router.get(
  "/departures", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getDepartures
);
router.get(
  "/departuresHistory", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getDeparturesHistory
);
router.get(
  "/departures/noVehicles", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getDepartureNoVehicle
);
router.post(
  "/newPlan", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.insertDeparturePlan
);
router.post(
  "/vehicleToDeparture", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.insertVehicleToDeparture
);
router.put(
  "/updateDeparturePlan", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.updateDeparturePlan
);
router.delete(
  "/deletePlannedDep/:dep_id", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.deletePlannedDeparture
);

module.exports = router;