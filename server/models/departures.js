const database = require("../database/Database");

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
            tuv.nazov as typ_vyjazdu_nazov, 
            tuv.id_typu_vyjazdu as typ_vyjazdu_id,
            m.psc as mesto_odkial, 
            me.psc as mesto_kam, 
            adresa_odkial,
            adresa_kam,
            id_nemocnice_odkial as nemocnica_odkial,
            id_nemocnice_kam as nemocnica_kam,
            trvanie,
            m.nazov as mesto_odkial_nazov,
            me.nazov as mesto_kam_nazov
        FROM 
            plan_vyjazdov pv
        LEFT JOIN 
            mesto m ON (pv.odkial_mesto  = m.psc)
        LEFT JOIN 
            mesto me ON (pv.kam_mesto  = me.psc)
        JOIN 
            typ_ucelu_vyjazdu tuv ON (pv.id_typu_vyjazdu = tuv.id_typu_vyjazdu)
        WHERE 
            id_plan_vyjazdu NOT IN (
                SELECT id_plan_vyjazdu FROM vyjazdy
            )
        ORDER BY 
            PLANOVANY_DATUM, CAS_ODCHODU ASC`
      );
  
      return result.rows;
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getDepartures() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          to_char(pl_vyj.datum_od, 'DD.MM.YYYY') as PLANOVANY_DATUM, 
          to_char(pl_vyj.datum_od, 'HH24:MI') as CAS_ODCHODU,
          tuv.id_typu_vyjazdu as TYP_VYJAZDU_ID,
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
          plan_vyjazdov pl_vyj
      JOIN 
          vyjazdy vyj ON (vyj.id_plan_vyjazdu = pl_vyj.id_plan_vyjazdu)
      JOIN 
          typ_ucelu_vyjazdu tuv ON (pl_vyj.id_typu_vyjazdu = tuv.id_typu_vyjazdu)
      JOIN 
            mesto m_odkial ON (pl_vyj.odkial_mesto  = m_odkial.psc)
      JOIN 
            mesto m_kam ON (pl_vyj.kam_mesto  = m_kam.psc)
      WHERE 
          pl_vyj.datom_do >= sysdate
      ORDER BY 
          vyj.datum_od ASC`
    );

    return result.rows;
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
          tuv.id_typu_vyjazdu as TYP_VYJAZDU_ID,
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
          typ_ucelu_vyjazdu tuv ON (pl_vyj.id_typu_vyjazdu = tuv.id_typu_vyjazdu)
      JOIN 
          mesto m_odkial ON (pl_vyj.odkial_mesto  = m_odkial.psc)
      JOIN 
          mesto m_kam ON (pl_vyj.kam_mesto  = m_kam.psc)
      WHERE 
          pl_vyj.datom_do < sysdate
      ORDER BY 
          vyj.datum_od DESC`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function getDepartureNoVehicle() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
          id_plan_vyjazdu, 
          to_char(datum_od, 'DD.MM.YYYY') as PLANOVANY_DATUM, 
          to_char(datum_od, 'HH24:MI') as CAS_ODCHODU, 
          tuv.nazov as TYP, 
          trvanie, 
          m_od.nazov as MESTO_ODKIAL, 
          m_kam.nazov as MESTO_KAM, 
          adresa_odkial, 
          adresa_kam, 
          n_od.nazov as NEMOCNICA_ODKIAL, 
          n_kam.nazov as NEMOCNICA_KAM
      FROM 
          plan_vyjazdov pv
      JOIN 
          typ_ucelu_vyjazdu tuv on (tuv.id_typu_vyjazdu = pv.id_typu_vyjazdu)
      LEFT JOIN 
          nemocnica n_od on (n_od.id_nemocnice = pv.id_nemocnice_odkial)
      LEFT JOIN 
          nemocnica n_kam on (n_kam.id_nemocnice = pv.id_nemocnice_kam)
      LEFT JOIN 
          mesto m_od on (m_od.psc = pv.odkial_mesto)
      LEFT JOIN 
          mesto m_kam on (m_kam.psc = pv.kam_mesto)
      WHERE 
          id_plan_vyjazdu NOT IN (
              SELECT id_plan_vyjazdu FROM vyjazdy
          ) 
      ORDER BY 
          datum_od ASC`
    );

    return result.rows;
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
              :departure_type, 
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
      start: body.PLANOVANY_DATUM_CAS,
      departure_type: body.TYP_VYJAZDU,
      city_from: body.MESTO_ODKIAL,
      city_to: body.MESTO_KAM,
      address_from: body.ADRESA_ODKIAL,
      address_to: body.ADRESA_KAM,
      id_hospital_from: body.NEMOCNICA_ODKIAL,
      id_hospital_to: body.NEMOCNICA_KAM,
      duration: body.TRVANIE
    });

  } catch (err) {
    throw new Error('insertDeparturePlan ' + err);
  }
}

async function insertVehicleToDeparture(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vyjazd_insert(:ecv, :id_departure_plan);
      END;`;

    let result = await conn.execute(sqlStatement, {
      id_departure_plan: body.id_departure_plan,
      ecv: body.ecv
    });

  } catch (err) {
    throw new Error('insertVehicleToDeparture' + err);
  }
}

async function updateDeparturePlan(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `
      BEGIN
          update_plan_vyjazdov(
              :departure_id,
              :date_start, 
              :departure_type, 
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
      departure_type: body.TYP_VYJAZDU,
      city_from: body.MESTO_ODKIAL,
      city_to: body.MESTO_KAM,
      address_from: body.ADRESA_ODKIAL,
      address_to: body.ADRESA_KAM,
      id_hospital_from: body.NEMOCNICA_ODKIAL,
      id_hospital_to: body.NEMOCNICA_KAM,
      duration: body.TRVANIE
    });

  } catch (err) {
    throw new Error('insertDeparturePlan ' + err);
  }
}

async function deletePlannedDeparture(dep_id) {
  try {
    let conn = await database.getConnection();
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


module.exports = {
  getDepartureTypes,
  getDeparturePlans,
  getDepartures,
  getDeparturesHistory,
  getDepartureNoVehicle,
  insertDeparturePlan,
  insertVehicleToDeparture,
  updateDeparturePlan,
  deletePlannedDeparture
}