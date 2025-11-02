function mapMidpoints(json) {
  if (!json) return undefined;
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return undefined;

    return arr.map(mp => ({
      NEMOCNICA_KAM: mp?.ID_NEMOCNICE ?? undefined,
      MESTO_KAM: mp?.MESTO ?? undefined,
      ADRESA_KAM: mp?.ADRESA ?? undefined,
    }));
  } catch {
    return undefined;
  }
}

function mapDepartureRow(r) {
  return {
    ID_PLAN_VYJAZDU: r.ID_PLAN_VYJAZDU,
    PLANOVANY_DATUM: r.PLANOVANY_DATUM,
    CAS_ODCHODU: r.CAS_ODCHODU,
    CAS_PRICHODU: r.CAS_PRICHODU,
    TYP_VYJAZDU_NAZOV: r.TYP_VYJAZDU_NAZOV,
    TYP_VYJAZDU_CIEL_ID: r.TYP_VYJAZDU_CIEL_ID,
    TYP_VYJAZDU_START_NAZOV: r.TYP_VYJAZDU_START_NAZOV,
    TYP_VYJAZDU_START_ID: r.TYP_VYJAZDU_START_ID,
    MESTO_ODKIAL: r.MESTO_ODKIAL,
    MESTO_KAM: r.MESTO_KAM,
    MESTO_ODKIAL_NAZOV: r.MESTO_ODKIAL_NAZOV,
    MESTO_KAM_NAZOV: r.MESTO_KAM_NAZOV,
    ADRESA_ODKIAL: r.ADRESA_ODKIAL,
    ADRESA_KAM: r.ADRESA_KAM,
    NEMOCNICA_ODKIAL: r.NEMOCNICA_ODKIAL,
    NEMOCNICA_KAM: r.NEMOCNICA_KAM,
    TRVANIE: r.TRVANIE,
    ECV: r.ECV,

    // normalize JSON strings from DB:
    BODY_NA_TRASE_CIEL: mapMidpoints(r.BODY_NA_TRASE_CIEL),
    BODY_NA_TRASE_START: mapMidpoints(r.BODY_NA_TRASE_START),
  };
}

function mapDepartureRows(rows) {
  return rows.map(mapDepartureRow);
}

module.exports = { mapDepartureRow, mapDepartureRows };
