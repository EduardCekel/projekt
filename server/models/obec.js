const database = require("../database/Database");

async function getObce() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT psc, nazov FROM mesto ORDER BY nazov`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getObce,
};
