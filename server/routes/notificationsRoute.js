const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/verifyJWT');
const requireRoles = require('../middleware/requiredRoles');
const AccRoles = require('../enums/access-roles.enum');
const controller = require("../controllers/NotificationController");

const ALLOWED = [AccRoles.PHYSICIAN, AccRoles.PARAMEDIC];

router.use(verifyJWT, requireRoles(ALLOWED));

router.get('/', controller.getNotificationsForUser);
router.post('/newNotification/paramedic', controller.insertNotiticationForParamedic);
router.put('/mark-all-read', controller.markRead);
router.delete('/:notId', controller.deleteNotification);

module.exports = router;
