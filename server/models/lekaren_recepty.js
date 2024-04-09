const database = require("../database/Database");
const client = require("twilio")(accountSid, authToken);

async function getZoznamAktualnychReceptov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
    typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
    from recept
    join pacient on (pacient.id_pacienta = recept.id_pacienta)
    join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
    join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
    join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
    join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
    join liek on (liek.id_liek = recept.id_liek)
    where recept.datum_prevzatia is NULL
    order by ID_RECEPTU`);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZoznamVydanychReceptov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
    typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
    from recept
    join pacient on (pacient.id_pacienta = recept.id_pacienta)
    join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
    join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
    join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
    join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
    join liek on (liek.id_liek = recept.id_liek)
    where recept.datum_prevzatia is NOT NULL
    order by ID_RECEPTU`);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailReceptu(id) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA",
      trvanlivost_lieku.id_liek as "ID_LIEKU", to_char(trvanlivost_lieku.datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_TRVANLIVOSTI", 
      liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
      typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA",
      trvanlivost_lieku.pocet as "DOSTUPNY_POCET_NA_SKLADE", trvanlivost_lieku.id_sklad, lekaren.id_lekarne, lekaren.nazov as "NAZOV_LEKARNE",
      oupac.email as "EMAIL", oupac.telefon as "TELEFON"
      from recept
       left join pacient on (pacient.id_pacienta = recept.id_pacienta)
       left join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
       left join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
       left join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
       left join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
       left join liek on (liek.id_liek = recept.id_liek)
       left join trvanlivost_lieku on (trvanlivost_lieku.id_liek = liek.id_liek)
       left join sklad on (sklad.id_sklad = trvanlivost_lieku.id_sklad)
       left join lekaren on (lekaren.id_lekarne = sklad.id_lekarne)
      where recept.id_receptu = :id`,
      [id]
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

async function updateDatumZapisu(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE recept SET datum_prevzatia = to_date(:datum_prevzatia, 'DD.MM.YY')
    where id_receptu = :id_receptu`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        datum_prevzatia: body.datum_prevzatia,
        id_receptu: body.id_receptu,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function updatePocetLiekuVydajReceptu(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE trvanlivost_lieku
    SET pocet = pocet - :vydanyPocet
    WHERE datum_trvanlivosti = TO_DATE(:datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS')
    AND id_liek = :id_liek
    AND id_sklad IN (SELECT id_sklad FROM sklad WHERE id_lekarne = :id_lekarne)
    AND pocet >= :vydanyPocet`;
    let result = await conn.execute(
      sqlStatement,
      {
        datum_trvanlivosti: body.datum_trvanlivosti,
        id_liek: body.id_liek,
        id_lekarne: body.id_lekarne,
        vydanyPocet: body.vydanyPocet,
      },
      { autoCommit: true }
    );

    console.log("Rows updated " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function sendSMS(body) {
  console.log(body);
  try {
    client.messages
      .create({
        body:
          "Vážený pán/Vážená pani: " +
          body.meno_pacienta +
          " " +
          body.priezvisko_pacienta +
          ", liek na recept " +
          body.nazov_lieku +
          " bol vybratý v lekárni " +
          body.nazov_lekarne +
          " dňa " +
          body.datum_prevzatia,
        to: body.telefon,
        from: "+13344234063", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

module.exports = {
  getZoznamAktualnychReceptov,
  getZoznamVydanychReceptov,
  getDetailReceptu,
  updateDatumZapisu,
  updatePocetLiekuVydajReceptu,
  sendSMS,
};
