const database = require("../database/Database");

async function getNotificationsForUser(userId) {
  const conn = await database.getConnection();

  try {
    const result = await conn.execute(
      `SELECT 
          id_zam_not,
          nazov,
          popis,
          precitane
      FROM
          zamestnanec_notifikacie 
      JOIN
          notifikacie USING (id_notifikacie)
      JOIN
          notifikacie_typy USING (id_typu_notifikacie)
      WHERE 
          cislo_zam = :userId
      ORDER BY
          precitane ASC, 
          vytvorene DESC`,
      { userId }
    );

    return result.rows;
  } finally {
    await conn.close();
  }
}

async function getUnreadNotificationsForUser(userId) {
  const conn = await database.getConnection();

  try {
    const result = await conn.execute(
      `SELECT 
          COUNT(*) as pocet
      FROM
          zamestnanec_notifikacie
      WHERE 
          precitane = 0 AND 
          cislo_zam = :userId`,
      { userId }
    );

    return result.rows[0];
  } finally {
    await conn.close();
  }
}

async function getPramedicNotifForUser(userId) {
  const conn = await database.getConnection();

  try {
    const result = await conn.execute(
      `SELECT 
          id_zam_not,
          nazov,
          popis,
          precitane
      FROM
          zamestnanec_notifikacie 
      JOIN
          notifikacie USING (id_notifikacie)
      JOIN
          notifikacie_typy USING (id_typu_notifikacie)
      WHERE
          cislo_zam = :userId
      ORDER BY
          precitane ASC, 
          vytvorene DESC,
          vytvorene DESC
      FETCH FIRST 1 ROW ONLY`,
      { userId }
    );

    return result.rows[0];
  } finally {
    await conn.close();
  }
}


async function inserNewNotification(notif) {
  const conn = await database.getConnection();

  try {
    await conn.execute(
      `INSERT INTO notifikacie
         (id_typu_notifikacie, popis)
       VALUES
         (:id_typ, :popis)`,
      { 
        id_typ: notif.ID_TYPU_NOTIFIKACIE,
        popis: notif.POPIS
      },
      { autoCommit: true }
    );

    return await getNewNotification(notif);
  } finally {
    await conn.close();
  }
}

async function inserNewUserNotification(users, notifId) {
  const conn = await database.getConnection();

  try {
    const arr = Array.isArray(users.rows) ? users.rows : users;
    const binds = arr.map(u => ({
      cislo_zam: Number(u.CISLO_ZAM),
      id_typ: Number(u.ID_TYP),
      notifId: Number(notifId),
    }));
    
    await conn.executeMany(
      `INSERT INTO zamestnanec_notifikacie
        (cislo_zam, id_typ, id_notifikacie, precitane)
      VALUES
        (:cislo_zam, :id_typ, :notifId, 0)
      `,
      binds,
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

async function markRead(userId) {
  const conn = await database.getConnection();
  try {
    await conn.execute(
      `UPDATE 
          zamestnanec_notifikacie
      SET 
          precitane = 1
      WHERE 
          cislo_zam = :userId`,
      { userId },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

async function deleteNotification(userId, notId) {
  const conn = await database.getConnection();
  try {
    await conn.execute(
      `DELETE FROM
          zamestnanec_notifikacie
      WHERE 
          cislo_zam = :userId AND
          id_zam_not = :notId`,
      { userId, notId },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

async function getNewNotification(notif) {
  const conn = await database.getConnection();
  try {
    const result = await conn.execute(

      `SELECT 
          *
      FROM notifikacie
      WHERE 
          id_typu_notifikacie = :id_typ AND 
          popis = :popis
      ORDER BY 
          vytvorene DESC
      FETCH FIRST 1 ROW ONLY`,
      { 
        id_typ: notif.ID_TYPU_NOTIFIKACIE,
        popis: notif.POPIS
       },
      { autoCommit: true }
    );

    return result.rows[0];
  } finally {
    await conn.close();
  }
}

module.exports = {
  getNotificationsForUser,
  getUnreadNotificationsForUser,
  getPramedicNotifForUser,
  inserNewNotification,
  inserNewUserNotification,
  markRead,
  deleteNotification
};
