const database = require("../database/Database");
const oracledb = database.oracledb;

async function getChoroby() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM choroba`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getNajcastejsieChorobyRokaPocet(pocet, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select poradie,pocet_chorob, nazov from
                (select nazov, rank() over (order by count(id_choroby) desc) as poradie,
                count(id_choroby) as pocet_chorob
                    from zoznam_chorob join choroba using(id_choroby)
                        where to_char(datum_od,'YYYY')= :rok
                        or to_char(datum_od,'YYYY')= :rok
                        group by nazov, id_choroby
                )
<<<<<<< HEAD
            where poradie <= :pocet`,
      {
        rok: { val: rok, dir: oracledb.BIND_IN, type: oracledb.STRING },
        pocet: pocet,
      }
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
=======
            where rank <= :pocet
                order by rank`,
            {
                rok: { val: rok, dir: oracledb.BIND_IN, type: oracledb.STRING },
                pocet: pocet
            }
        );
        console.log(result);
        return result.rows;

    } catch (err) {
        console.log(err);
    }
>>>>>>> origin/Marek_general
}

module.exports = {
  getChoroby,
  getNajcastejsieChorobyRokaPocet,
};
