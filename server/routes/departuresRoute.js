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
  "/matchingDepartures", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getMatchingDepartures
);
router.get(
  "/matchingDeparturesCount", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getMatchingDeparturesCount
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
router.put(
  "/updateDeparturePlanDuration", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.updateDeparturePlanDuration
);
router.put(
  "/changeVehicleInDeparture", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.updateVehicleInDeparture
);
router.delete(
  "/deletePlannedDep/:dep_id", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.deletePlannedDeparture
);
router.delete(
  "/deleteDeparture/:dep_id", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.deleteDeparture
);

module.exports = router;