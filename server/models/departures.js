const database = require("../database/Database");
const oracledb = require('oracledb');
const { mapDepartureRows } = require('../utils/departure-mapper');

async function getDepartureTypes() {
  try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `SELECT * FROM typ_ucelu_vyjazdu WHERE nazov != 'RZP'`
      );
  
      return result.rows;
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getDeparturePlans() {
  try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `SELECT 
            id_plan_vyjazdu, 
            to_char(datum_od, 'DD.MM.YYYY') as PLANOVANY_DATUM, 
            to_char(datum_od, 'HH24:MI') as CAS_ODCHODU,
            tuvd.nazov as typ_vyjazdu_nazov, 
            tuvd.id_typu_vyjazdu as typ_vyjazdu_ciel_id,
            tuvs.nazov as typ_vyjazdu_start_nazov, 
            tuvs.id_typu_vyjazdu as typ_vyjazdu_start_id,
            m.psc as mesto_odkial, 
            me.psc as mesto_kam, 
            adresa_odkial,
            adresa_kam,
            id_nemocnice_odkial as nemocnica_odkial,
            id_nemocnice_kam as nemocnica_kam,
            trvanie,
            m.nazov as mesto_odkial_nazov,
            me.nazov as mesto_kam_nazov,
            (
                SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'ID_NEMOCNICE' VALUE t.id_nemocnice,
                              'MESTO' VALUE t.mesto,
                              'ADRESA' VALUE t.adresa
                          )
                      )
                FROM plan_vyjazdov_trasa t
                WHERE t.id_plan_vyjazdu = pv.id_plan_vyjazdu
                  AND t.smer_ciel = 1
            ) AS BODY_NA_TRASE_CIEL,
            (
                SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'ID_NEMOCNICE' VALUE t.id_nemocnice,
                              'MESTO' VALUE t.mesto,
                              'ADRESA' VALUE t.adresa
                          )
                      )
                FROM plan_vyjazdov_trasa t
                WHERE t.id_plan_vyjazdu = pv.id_plan_vyjazdu
                  AND t.smer_ciel = 0
            ) AS BODY_NA_TRASE_START
        FROM 
            plan_vyjazdov pv
        LEFT JOIN 
            mesto m ON (pv.odkial_mesto  = m.psc)
        LEFT JOIN 
            mesto me ON (pv.kam_mesto  = me.psc)
        JOIN 
            typ_ucelu_vyjazdu tuvd ON (pv.id_typu_vyjazdu_ciel = tuvd.id_typu_vyjazdu)
        LEFT JOIN 
            typ_ucelu_vyjazdu tuvs ON (pv.id_typu_vyjazdu_start = tuvs.id_typu_vyjazdu)
        WHERE 
            id_plan_vyjazdu NOT IN (
                SELECT id_plan_vyjazdu FROM vyjazdy
            )
        ORDER BY 
            PLANOVANY_DATUM, CAS_ODCHODU ASC`
      );
  
      return mapDepartureRows(result.rows);
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getDepartures() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          pl_vyj.id_plan_vyjazdu,
          TO_CHAR(pl_vyj.datum_od, 'DD.MM.YYYY') AS PLANOVANY_DATUM, 
          TO_CHAR(pl_vyj.datum_od, 'HH24:MI') AS CAS_ODCHODU,
          tuvd.id_typu_vyjazdu AS TYP_VYJAZDU_CIEL_ID,
          tuvs.id_typu_vyjazdu as typ_vyjazdu_start_id,
          pl_vyj.odkial_mesto AS MESTO_ODKIAL, 
          pl_vyj.kam_mesto AS MESTO_KAM, 
          pl_vyj.adresa_odkial,
          pl_vyj.adresa_kam,
          pl_vyj.id_nemocnice_odkial AS NEMOCNICA_ODKIAL,
          pl_vyj.id_nemocnice_kam AS NEMOCNICA_KAM,
          pl_vyj.trvanie,
          vyj.ecv,
          m_odkial.nazov AS mesto_odkial_nazov,
          m_kam.nazov AS mesto_kam_nazov,
          (
              SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID_NEMOCNICE' VALUE t.id_nemocnice,
                            'MESTO' VALUE t.mesto,
                            'ADRESA' VALUE t.adresa
                        )
                    )
              FROM plan_vyjazdov_trasa t
              WHERE t.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
                AND t.smer_ciel = 1
          ) AS BODY_NA_TRASE_CIEL,
          (
              SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID_NEMOCNICE' VALUE t.id_nemocnice,
                            'MESTO' VALUE t.mesto,
                            'ADRESA' VALUE t.adresa
                        )
                    )
              FROM plan_vyjazdov_trasa t
              WHERE t.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
                AND t.smer_ciel = 0
          ) AS BODY_NA_TRASE_START
      FROM 
          plan_vyjazdov pl_vyj
      JOIN 
          vyjazdy vyj ON vyj.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
      JOIN 
          typ_ucelu_vyjazdu tuvd ON pl_vyj.id_typu_vyjazdu_ciel = tuvd.id_typu_vyjazdu
      LEFT JOIN 
          typ_ucelu_vyjazdu tuvs ON pl_vyj.id_typu_vyjazdu_start = tuvs.id_typu_vyjazdu
      JOIN 
          mesto m_odkial ON pl_vyj.odkial_mesto = m_odkial.psc
      JOIN 
          mesto m_kam ON pl_vyj.kam_mesto = m_kam.psc
      WHERE 
          pl_vyj.datom_do >= SYSDATE
      ORDER BY 
          vyj.datum_od ASC`
    );

    return mapDepartureRows(result.rows);
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function getDeparturesHistory() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          to_char(pl_vyj.datum_od, 'DD.MM.YYYY') as PLANOVANY_DATUM, 
          to_char(pl_vyj.datum_od, 'HH24:MI') as CAS_ODCHODU,
          tuvd.id_typu_vyjazdu as TYP_VYJAZDU_CIEL_ID,
          tuvs.id_typu_vyjazdu as TYP_VYJAZDU_CIEL_ID,
          pl_vyj.odkial_mesto as MESTO_ODKIAL, 
          pl_vyj.kam_mesto as MESTO_KAM, 
          pl_vyj.adresa_odkial,
          pl_vyj.adresa_kam,
          pl_vyj.id_nemocnice_odkial as NEMOCNICA_ODKIAL,
          pl_vyj.id_nemocnice_kam as NEMOCNICA_KAM,
          pl_vyj.trvanie,
          vyj.ecv,
          m_odkial.nazov as mesto_odkial_nazov,
          m_kam.nazov as mesto_kam_nazov
      FROM 
          vyjazdy vyj
      JOIN 
          plan_vyjazdov pl_vyj ON (vyj.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu)
      JOIN 
          typ_ucelu_vyjazdu tuvd ON (pl_vyj.id_typu_vyjazdu_ciel = tuvd.id_typu_vyjazdu)
      LEFT JOIN 
          typ_ucelu_vyjazdu tuvs ON (pl_vyj.id_typu_vyjazdu_start = tuvs.id_typu_vyjazdu)
      JOIN 
          mesto m_odkial ON (pl_vyj.odkial_mesto  = m_odkial.psc)
      JOIN 
          mesto m_kam ON (pl_vyj.kam_mesto  = m_kam.psc)
      WHERE 
          pl_vyj.datom_do < sysdate
      ORDER BY 
          vyj.datum_od DESC`
    );

    return mapDepartureRows(result.rows);
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function getMatchingDepartures(hosp_from, hosp_to, date) {
  try {
    const result = await _getAllMatchingDep(hosp_from, hosp_to, date);
    return mapDepartureRows(result.rows);
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function getMatchingDeparturesCount(hosp_from, hosp_to, date) {
  try {
    const result = await _getAllMatchingDep(hosp_from, hosp_to, date);
    return { POCET: result.rows.length };
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function insertDeparturePlan(body) {
  try {
    let conn = await database.getConnection();

    const sqlStatement = `
      BEGIN
          plan_vyjazdov_insert(
              :start, 
              :departure_type_dest, 
              :departure_type_start, 
              :city_from, 
              :city_to, 
              :address_from, 
              :address_to, 
              :id_hospital_from, 
              :id_hospital_to, 
              :duration,
              :p_id_out
          );  
      END;`;
    
    let result = await conn.execute(sqlStatement, {
      start: body.PLANOVANY_DATUM_CAS,
      departure_type_dest: body.TYP_VYJAZDU_CIEL,
      departure_type_start: body.TYP_VYJAZDU_START,
      city_from: body.MESTO_ODKIAL,
      city_to: body.MESTO_KAM,
      address_from: body.ADRESA_ODKIAL,
      address_to: body.ADRESA_KAM,
      id_hospital_from: body.NEMOCNICA_ODKIAL,
      id_hospital_to: body.NEMOCNICA_KAM,
      duration: body.TRVANIE,
      p_id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    });

    const newId = result.outBinds.p_id_out;
    
    _insertRoutesFromPlanDep(newId, body);

  } catch (err) {
    throw new Error('insertDeparturePlan ' + err);
  }
}

async function insertVehicleToDeparture(body) {
  try {
    let conn = await database.getConnection();

    const checkDep =  await conn.execute(
      `SELECT 
          COUNT(*) as pocet
      FROM
          vyjazdy
      WHERE
          id_plan_vyjazdu = :id_departure_plan`, 
      {
        id_departure_plan: body.id_departure_plan,
      }
    );

    if (checkDep.rows[0].POCET > 0) {
      throw new Error(`Danému výjazdu už bolo priradené vozidlo`);
    }

    let planDep = await conn.execute(
      `SELECT 
          to_char(datum_od, 'DD.MM.YYYY HH24:MI:SS') as datum_od, 
          to_char(datom_do, 'DD.MM.YYYY HH24:MI:SS') as datom_do, 
      FROM
          plan_vyjazdov
      WHERE
          id_plan_vyjazdu = :id_departure_plan`, 
      {
        id_departure_plan: body.id_departure_plan,
      }
    )

    planDep = planDep.rows[0];

    const checkVehAvailability =  await conn.execute(
      `SELECT
          COUNT(*) as pocet
      FROM
          vyjazdy vyj
      JOIN
          vozidla voz ON (vyj.ecv = voz.ecv)
      WHERE 
          vyj.ecv NOT IN (
            SELECT 
                vyj2.ecv 
            FROM 
                vyjazdy vyj2
            JOIN 
                plan_vyjazdov p ON (vyj2.id_plan_vyjazdu = p.id_plan_vyjazdu)
            WHERE 
                p.datom_do > sysdate AND NOT (
                    (
                        p.datum_od >= to_date(:date_from, 'DD.MM.YYYY HH24:MI:SS') AND
                        p.datom_do <= NVL(to_date(:date_to, 'DD.MM.YYYY HH24:MI:SS'), p.datum_od + NUMTODSINTERVAL(trvanie, 'MINUTE'))
                    ) OR
                    (
                        p.datum_od <= to_date(:date_from, 'DD.MM.YYYY HH24:MI:SS') AND
                        p.datom_do >= NVL(to_date(:date_to, 'DD.MM.YYYY HH24:MI:SS'), p.datum_od + NUMTODSINTERVAL(trvanie, 'MINUTE'))
                    ) OR
                    (
                        p.datum_od <= to_date(:date_from, 'DD.MM.YYYY HH24:MI:SS') AND
                        p.datom_do >= to_date(:date_from, 'DD.MM.YYYY HH24:MI:SS')
                    ) OR
                    (
                        p.datum_od <= NVL(to_date(:date_to, 'DD.MM.YYYY HH24:MI:SS'), p.datum_od + NUMTODSINTERVAL(trvanie, 'MINUTE')) AND
                        p.datom_do >= NVL(to_date(:date_to, 'DD.MM.YYYY HH24:MI:SS'), p.datum_od + NUMTODSINTERVAL(trvanie, 'MINUTE'))
                    )
                )
          ) AND
          voz.stk >= ADD_MONTHS(TRUNC(SYSDATE), -24) AND
          vyj.ecv = :ecv`, 
      {
        ecv: body.ecv,
        date_from: planDep.DATUM_OD,
        date_to: planDep.DATOM_DO
      }
    );

    console.log(checkVehAvailability.rows)

    if (checkVehAvailability.rows[0].POCET > 0) {
      throw new Error(`Vozidlo je v danom čase (${planDep.DATUM_OD}) na inom výjazde`);
    }

    const result = await conn.execute(
      `BEGIN
          vyjazd_insert(:ecv, :id_departure_plan);
      END;`, 
      {
        id_departure_plan: body.id_departure_plan,
        ecv: body.ecv
      }
    );

  } catch (err) {
    throw new Error(err);
  }
}

async function updateDeparturePlan(body) {
  try {
    let conn = await database.getConnection();

    const sqlStatement = `
      BEGIN 
          update_plan_vyjazdov
          (
              :departure_id, 
              :date_start, 
              :departure_type_dest, 
              :departure_type_start,
              :city_from, 
              :city_to, 
              :address_from, 
              :address_to, 
              :id_hospital_from,  
              :id_hospital_to, 
              :duration
            ); 
      END;`;

      let result = await conn.execute(sqlStatement, {
      departure_id: body.ID_PLAN_VYJAZDU,
      date_start: body.PLANOVANY_DATUM_CAS,
      departure_type_dest: body.TYP_VYJAZDU_CIEL,
      departure_type_start: body.TYP_VYJAZDU_START,
      city_from: body.MESTO_ODKIAL,
      city_to: body.MESTO_KAM,
      address_from: body.ADRESA_ODKIAL,
      address_to: body.ADRESA_KAM,
      id_hospital_from: body.NEMOCNICA_ODKIAL,
      id_hospital_to: body.NEMOCNICA_KAM,
      duration: body.TRVANIE
    });
    
    deleteDepRoutes(body.ID_PLAN_VYJAZDU);
    _insertRoutesFromPlanDep(body.ID_PLAN_VYJAZDU, body);

  } catch (err) {
    throw new Error('updateDeparturePlan ' + err);
  }
}

async function updateDeparturePlanDuration(body) {
  try {
    let conn = await database.getConnection();

    let result = await conn.execute(
      `UPDATE
          plan_vyjazdov
      SET
          trvanie = :trvanie,
          datom_do = datum_od  + :trvanie/1440
      WHERE 
          id_plan_vyjazdu = :id_plan_vyjazdu`, 
      {
        id_plan_vyjazdu: body.dep_id,
        trvanie: body.duration
      },
      { autoCommit: true }
    );

  } catch (err) {
    throw new Error('updateDeparturePlanDuration ' + err);
  }
}

async function updateVehicleInDeparture(body) {
  try {
    let conn = await database.getConnection();

    let result = await conn.execute(
      `UPDATE 
          vyjazdy
      SET 
          ecv = :ecv
      WHERE
          id_plan_vyjazdu = :id_departure_plan`, 
      {
        id_departure_plan: body.id_departure_plan,
        ecv: body.ecv
      },
      { autoCommit: true }
    );

  } catch (err) {
    throw new Error('updateVehicleInDeparture' + err);
  }
}

async function deletePlannedDeparture(dep_id) {
  try {
    let conn = await database.getConnection();

    deleteDepRoutes(dep_id);

    const sqlStatement = `BEGIN
        delete_vyjazd(:dep_id);
      END;`;

    await conn.execute(sqlStatement, {
      dep_id: dep_id,
    });

  } catch (err) {
    throw new Error('deletePlannedDeparture' + err);
  }
}

async function deleteDeparture(dep_id) {
  try {
    let conn = await database.getConnection();

    const typeNumber = await conn.execute(
      `SELECT 
          COUNT(id_typu_vyjazdu_start) + COUNT(id_typu_vyjazdu_ciel) as pocet_typov
      FROM 
          plan_vyjazdov
      WHERE
          id_plan_vyjazdu = :dep_id`, 
      {
        dep_id: dep_id,
      },
    );

    await conn.execute(
      `DELETE FROM
          vyjazdy
      WHERE
          id_plan_vyjazdu = :dep_id`, 
      {
        dep_id: dep_id,
      },
      { autoCommit: true }
    );

    return typeNumber.rows[0];
  } catch (err) {
    throw new Error('deletePlannedDeparture' + err);
  }
}

async function _getAllMatchingDep(hosp_from, hosp_to, date) {
  try {
    let conn = await database.getConnection();
    const d = _parseClientDateTime(date);
    d.setHours(0, 0, 0, 0);

    const result = await conn.execute(
      `SELECT 
          pl_vyj.id_plan_vyjazdu,
          TO_CHAR(pl_vyj.datum_od, 'DD.MM.YYYY') AS PLANOVANY_DATUM, 
          TO_CHAR(pl_vyj.datum_od, 'HH24:MI') AS CAS_ODCHODU,
          TO_CHAR(pl_vyj.datom_do - NUMTODSINTERVAL(pl_vyj.trvanie/2, 'MINUTE'), 'HH24:MI') AS CAS_PRICHODU,
          tuvd.id_typu_vyjazdu AS TYP_VYJAZDU_CIEL_ID,
          tuvd.nazov AS TYP_VYJAZDU_NAZOV,
          tuvs.id_typu_vyjazdu as typ_vyjazdu_start_id,
          pl_vyj.odkial_mesto AS MESTO_ODKIAL, 
          pl_vyj.kam_mesto AS MESTO_KAM, 
          pl_vyj.adresa_odkial,
          pl_vyj.adresa_kam,
          pl_vyj.id_nemocnice_odkial AS NEMOCNICA_ODKIAL,
          pl_vyj.id_nemocnice_kam AS NEMOCNICA_KAM,
          pl_vyj.trvanie,
          vyj.ecv,
          m_odkial.nazov AS mesto_odkial_nazov,
          m_kam.nazov AS mesto_kam_nazov,
          (
              SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID_NEMOCNICE' VALUE t.id_nemocnice,
                            'MESTO' VALUE t.mesto,
                            'ADRESA' VALUE t.adresa
                        )
                    )
              FROM plan_vyjazdov_trasa t
              WHERE t.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
                AND t.smer_ciel = 1
          ) AS BODY_NA_TRASE_CIEL,
          (
              SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ID_NEMOCNICE' VALUE t.id_nemocnice,
                            'MESTO' VALUE t.mesto,
                            'ADRESA' VALUE t.adresa
                        )
                    )
              FROM plan_vyjazdov_trasa t
              WHERE t.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
                AND t.smer_ciel = 0
          ) AS BODY_NA_TRASE_START
      FROM 
          plan_vyjazdov pl_vyj
      JOIN 
          vyjazdy vyj ON vyj.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu
      JOIN 
          typ_ucelu_vyjazdu tuvd ON pl_vyj.id_typu_vyjazdu_ciel = tuvd.id_typu_vyjazdu
      LEFT JOIN 
          typ_ucelu_vyjazdu tuvs ON pl_vyj.id_typu_vyjazdu_start = tuvs.id_typu_vyjazdu
      JOIN 
          mesto m_odkial ON pl_vyj.odkial_mesto = m_odkial.psc
      JOIN 
          mesto m_kam ON pl_vyj.kam_mesto = m_kam.psc
      WHERE 
          pl_vyj.datum_od > SYSDATE AND
          pl_vyj.id_nemocnice_odkial = :hosp_to AND
          pl_vyj.id_nemocnice_kam = :hosp_from AND
          (
              pl_vyj.datum_od BETWEEN  
                  to_date(:date_from) - 2 AND 
                  to_date(:date_from) + 2
          ) AND
          tuvs.id_typu_vyjazdu IS NULL
      ORDER BY 
          vyj.datum_od ASC`,
      {
        hosp_from: Number(hosp_from),
        hosp_to: Number(hosp_to),
        date_from: { val: d, type: oracledb.DB_TYPE_DATE }
      }
    )

    return result;
  } catch (err) {
    throw new Error('_getAllMatchingDep' + err);
  }
}

async function _insertRoutesFromPlanDep(depId, body) {
  try {
    let conn = await database.getConnection();

    const rowsAll = [
      ...(body.BODY_NA_TRASE_CIEL ?? []).map(m => ({
        id_plan_vyjazdu: depId,
        id_nemocnice: m.NEMOCNICA_KAM ?? null,
        mesto: m.MESTO_KAM ?? null,
        adresa: m.ADRESA_KAM ?? null,
        smer_ciel: 1
      })),
      ...(body.BODY_NA_TRASE_START ?? []).map(m => ({
        id_plan_vyjazdu: depId,
        id_nemocnice: m.NEMOCNICA_KAM ?? null,
        mesto: m.MESTO_KAM ?? null,
        adresa: m.ADRESA_KAM ?? null,
        smer_ciel: 0
      }))
    ];

    if (rowsAll.length) {
      await conn.executeMany(
        `INSERT INTO 
            plan_vyjazdov_trasa 
            (
                id_plan_vyjazdu, 
                id_nemocnice, 
                mesto, adresa, 
                smer_ciel
            )
        VALUES 
        (
            :id_plan_vyjazdu, 
            :id_nemocnice, 
            :mesto, 
            :adresa, 
            :smer_ciel
        )`,
        rowsAll,
        { autoCommit: true }
      );
    }
  } catch (err) {
    throw new Error('deletePlannedDeparture' + err);
  }
}

async function deleteDepRoutes(depId) {
  try {
    let conn = await database.getConnection();

    await conn.execute(
      `DELETE FROM
          plan_vyjazdov_trasa
      WHERE
          id_plan_vyjazdu = :depId`,
      { depId: depId },
      { autoCommit: true }
    );
  } catch (err) {
    throw new Error('deletePlannedDeparture' + err);
  }
}

function _parseClientDateTime(ddmmyyyyHHmm) {
  // "30/10/2025 08:20" or "30/10/2025 08:20:00"
  const [datePart, timePart = '00:00:00'] = ddmmyyyyHHmm.trim().split(/\s+/);
  const [dd, mm, yyyy] = datePart.split(/[\/\-\.]/).map(Number);
  const [HH, MI = 0, SS = 0] = timePart.split(':').map(Number);

  if (!yyyy || !mm || !dd) throw new Error(`Bad date: ${ddmmyyyyHHmm}`);
  return new Date(yyyy, mm - 1, dd, HH || 0, MI || 0, SS || 0, 0); // local time
}


module.exports = {
  getDepartureTypes,
  getDeparturePlans,
  getDepartures,
  getDeparturesHistory,
  getMatchingDepartures,
  getMatchingDeparturesCount,
  insertDeparturePlan,
  insertVehicleToDeparture,
  updateDeparturePlan,
  updateDeparturePlanDuration,
  updateVehicleInDeparture,
  deletePlannedDeparture,
  deleteDeparture
}