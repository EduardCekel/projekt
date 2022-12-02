const database = require("../database/Database");

async function getOsobneUdaje() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM os_udaje`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getMenovciPacientLekar() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select p.meno, p.priezvisko as priezvisko_pacient, l.priezvisko as priezvisko_lekar 
                    from lekar_pacient join pacient using(id_pacienta)
                    join os_udaje p on(p.rod_cislo = pacient.rod_cislo)
                    join lekar using(id_lekara)
                    join zamestnanec using(id_zamestnanca)
                    join os_udaje l on(l.rod_cislo = zamestnanec.rod_cislo)
                where p.meno = l.meno`
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPomerMuziZeny(id_oddelenia) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select trunc(zeny, 2) as zeny, trunc(100-zeny, 2) as muzi from
          (select count(case when (substr(os.rod_cislo, 3, 1)) in ('5','6') then 1 else null end)/count(*)*100 as zeny
              from os_udaje os join pacient p on(p.rod_cislo = os.rod_cislo)
              join lekar_pacient lp on (lp.id_pacienta = p.id_pacienta)
              join lekar l on (l.id_lekara = lp.id_lekara)
              join zamestnanec z on (z.id_zamestnanca = l.id_zamestnanca)
              where z.id_oddelenia = :id_oddelenia)`,
      [id_oddelenia]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getOsobneUdaje,
  getMenovciPacientLekar,
  getPomerMuziZeny,
};
