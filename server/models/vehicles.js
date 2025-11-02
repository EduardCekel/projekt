const database = require("../database/Database");
const oracledb = require('oracledb');

async function getVehicles() {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT
          n.nazov,
          v.ecv,
          v.typ_vozidla,
          TO_CHAR(v.priradenie, 'dd.mm.yyyy') AS dat_priradenia,
          TO_CHAR(v.stk,        'dd.mm.yyyy') AS dat_stk,
          CASE
              WHEN EXISTS (
                  SELECT 
                      1
                  FROM 
                      vyjazdy y
                  JOIN 
                      plan_vyjazdov p ON (p.id_plan_vyjazdu = y.id_plan_vyjazdu)
                  WHERE
                      y.ecv = v.ecv
                      AND p.datum_od <= SYSDATE
                      AND p.datom_do >= SYSDATE
              )
              THEN 0
              ELSE 1
          END AS volne,
          v.obrazok
      FROM 
          vozidla v
      JOIN 
          nemocnica n ON n.id_nemocnice = v.id_nemocnice`
    );
    
    return result.rows;
  } catch (err) {
    throw new Error("getVehicles error: " + err);
  }
}

async function getSingleVehicle(vehicle_ecv) {
  try {
    const result = await getVehicleByEcv(vehicle_ecv);
    return result;
  } catch (err) {
    throw new Error("getSingleVehicle error: " + err);
  }
}

async function getVehiclesECV() {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT ecv FROM vozidla Order by ecv ASC`
    );

    return result.rows;
  } catch (err) {
    throw new Error("getVehiclesECV error: " + err);
  }
}

async function getVehiclesECVPlanHist(vehicle_ecv) {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          nazov, 
          to_char(vyjazdy.datum_od, 'DD:MM:YYYY HH:MI:SS') as datum_cas, 
          odkial_mesto as odkial, 
          kam_mesto as kam
      FROM 
          vyjazdy 
      JOIN 
          plan_vyjazdov USING (id_plan_vyjazdu)
      JOIN 
          typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE 
          ecv = :vehicle_ecv AND datom_do IS NOT NULL AND datom_do < sysdate`, 
      {vehicle_ecv}
    );

    return result.rows;
  } catch (err) {
    throw new Error("getVehiclesECVPlanHist error: " + err);
  }
}

async function getVehiclesECVPlan(vehicle_ecv) {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          nazov, 
          to_char(vyjazdy.datum_od, 'DD:MM:YYYY HH:MI:SS') as datum_cas, 
          odkial, 
          kam
      FROM 
          vyjazdy 
      JOIN 
          plan_vyjazdov USING (id_plan_vyjazdu)
      JOIN 
          typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE 
          ecv = :vehicle_ecv 
          AND 
          (datom_do IS NULL OR datom_do > sysdate)`, 
      {vehicle_ecv}
    );

    return result.rows;
  } catch (err) {
    throw new Error("getVehiclesECVPlan error: " + err);
  }
}

async function getVehicleByHospital(id_hospital) {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          ecv, 
          typ_vozidla, 
          COUNT(id_plan_vyjazdu) AS pocet
      FROM 
          vozidla
      LEFT JOIN 
          vyjazdy USING (ECV)
      WHERE  
          id_nemocnice = :id_hospital
          AND 
          ecv NOT IN (
            SELECT 
                ecv 
            FROM 
                vyjazdy
            JOIN 
                plan_vyjazdov using (id_plan_vyjazdu)
            WHERE 
                datom_do > sysdate
          )
      GROUP BY 
          ecv, 
          typ_vozidla
      ORDER BY 
          pocet ASC`, 
      {id_hospital}
    );

    return result.rows;
  } catch (err) {
    throw new Error("getVehicleByHospital error: " + err);
  }  
}

async function getFreeVehicles(id_hospital) {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          ecv, 
          typ_vozidla,
          nazov
      FROM 
          vozidla
      LEFT JOIN
          nemocnica USING (id_nemocnice)
      WHERE 
          ecv NOT IN (
            SELECT 
                ecv 
            FROM 
                vyjazdy
            JOIN 
                plan_vyjazdov using (id_plan_vyjazdu)
            WHERE 
                datom_do > sysdate
          )
          AND
          stk >= ADD_MONTHS(TRUNC(SYSDATE), -24) 
       ORDER BY 
          CASE 
              WHEN id_nemocnice = :id_hospital THEN 1 
              ELSE 2 
          END, 
          ecv`,
      [id_hospital]
    );

    return result.rows;
  } catch (err) {
    throw new Error("getFreeVehicles error: " + err);
  }
}

async function insertVehicle(body) {
  try {
    const conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vozidlo_insert(:ecv, :id_nemocnice, :typ_vozidla, :stk, :obrazok);
      END;`;

    await conn.execute(
      sqlStatement, 
      {
        ecv: body.ECV,
        id_nemocnice: body.ID_NEMOCNICE,
        typ_vozidla: body.TYP_VOZIDLA,
        stk: body.STK,
        obrazok: body.OBRAZOK
      }
    );
    
    const newVehicle = await getVehicleByEcv(body.ECV);
    return newVehicle;
  } catch (err) {
    throw new Error("insertVehicle error: " + err);;
  }
}

async function updateVehicle(body) {
  try {
    const conn = await database.getConnection();
    const sqlStatement = `BEGIN 
        vozidlo_update(:ecv, :id_nemocnice, :typ_vozidla, :stk, :obrazok); 
      END;`;

    await conn.execute(
      sqlStatement, 
      {
        ecv: body.ECV,
        id_nemocnice: body.ID_NEMOCNICE,
        typ_vozidla: body.TYP_VOZIDLA,
        stk: body.STK,
        obrazok: body.OBRAZOK
      }
    );
    
    const updatedVehicle = await getVehicleByEcv(body.ECV);
    return updatedVehicle;
  } catch (err) {
    throw new Error("updateVehicle error: " + err);;
  }    
}

async function deleteVehicle(body) {
  try {
    const conn = await database.getConnection();
    const sqlStatement = `BEGIN delete_vozidlo(:p_ecv); END;`;

    let ecvs = Array.isArray(body) ? body : [body];
    
    for (const singleEcv of ecvs) {
      await conn.execute(sqlStatement, {
        p_ecv: singleEcv,
      });
    }
  } catch (err) {
    throw new Error("deleteVehicle error: " + err);
  }    
}

async function getVehicleByEcv(vehicle_ecv) {
  try {
    const conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          nazov, 
          ecv, 
          typ_vozidla, 
          to_char(priradenie, 'dd.mm.yyyy') as dat_priradenia, 
          to_char(stk, 'dd.mm.yyyy') as dat_stk,
          obrazok
      FROM 
          nemocnica
      JOIN 
          vozidla using (id_nemocnice)
      WHERE 
          TRIM(UPPER(ecv)) = TRIM(UPPER(:vehicle_ecv))`,
      { vehicle_ecv }
    ); 

    return result.rows[0];
  } catch (err) {
    throw new Error("getVehicleByEcv error: " + err);;
  }   
}

module.exports = {
  getVehicles,
  getSingleVehicle,
  getVehiclesECV,
  getVehiclesECVPlanHist,
  getVehiclesECVPlan,
  getVehicleByHospital,
  getFreeVehicles,
  insertVehicle,
  updateVehicle,
  deleteVehicle
}