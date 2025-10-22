const express = require('express');
const router = express.Router();
const controller = require("../controllers/VehiclesController");
const verify = require('../middleware/verifyUser');
const AccRoles = require('../enums/access-roles.enum');

router.get(
  "/all", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getVehicles
);
router.get(
  "/vehicle/:vehicle_ecv", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getSingleVehicle
);
router.get(
  "/ecvs", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getVehiclesECV
);
router.get(
  "/vozidloPlanHist/:vehicle_ecv", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getVehiclesECVPlanHist
);
router.get(
  "/vozidloPlan/:vehicle_ecv", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getVehiclesECVPlan
);
router.get(
  "/volneVozidlo/:id_hospital", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getFreeVehicles
);
/*router.get(
  "/volneVozidlo/:id_hospital", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.getVehicleByHospital
);*/
router.post(
  "/noveVozidlo", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.insertVehicle
);
router.put(
  "/editVozidlo", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.updateVehicle
);
router.delete(
  "/deleteVozidlo", 
  verify.verifyRoles(AccRoles.PHYSICIAN, AccRoles.PARAMEDIC), 
  controller.deleteVehicle
);

module.exports = router;