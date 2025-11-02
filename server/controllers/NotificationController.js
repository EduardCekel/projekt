const AccRoles = require('../enums/access-roles.enum')

module.exports = {
  getNotificationsForUser: (req, res) => {
    const notification = require('../models/notifications');

    (async () => {
      const userId = req.userid;
      if (!userId) return;
      const notifications = await notification.getNotificationsForUser(userId);
      const unread = await notification.getUnreadNotificationsForUser(userId);
      res.json({NOTIFIKACIE: notifications, POCET_NEPRECITANYCH: unread});
    })()
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    });
  },

  insertNotiticationForParamedic: (req, res) => {
    const notification = require('../models/notifications');
    const userModel = require('../models/user');
    const io = req.app.get('io');

    (async () => {
      const newNotif = await notification.inserNewNotification(req.body);
      const userRolse = [AccRoles.PARAMEDIC, AccRoles.PHYSICIAN];
      let recipients = await userModel.getUserEmployeeByRole(userRolse);
      await notification.inserNewUserNotification(recipients, newNotif.ID_NOTIFIKACIE);
      
      recipients = Array.isArray(recipients.rows) ? recipients.rows : recipients;

      for (const rec of recipients) {
        const newNot = await notification.getPramedicNotifForUser(rec.CISLO_ZAM);
        io.to(`user:${rec.CISLO_ZAM}`).emit('notification:new', newNot);
      }

    })()
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    });
  },

  markRead: (req, res) => {
    const notification = require('../models/notifications');

    (async () => {
      const userId = req.userid;
      if (!userId) return res.status(400).json({ error: 'id is required' });
      await notification.markRead(userId);
      res.sendStatus(204);
    })()
    .catch((err) => {
      console.error(e);
      res.status(500).json({ error: 'Failed to mark as read' });
    });
  },

  deleteNotification: (req, res) => {
    const notification = require('../models/notifications');

    (async () => {
      const userId = req.userid;
      const notId = req.params.notId;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      await notification.deleteNotification(userId, notId);
      res.sendStatus(200);
    })()
    .catch((err) => {
      console.error(e);
      res.status(500).json({ error: 'Failed to mark as read' });
    });
  }
}