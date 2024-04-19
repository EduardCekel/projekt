import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import GetUserData from "../../Auth/GetUserData";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

export default function Basic() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [reason, setReason] = useState(null);
  const [patient, setPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      });
  }, []);

  useEffect(() => {
    if (patient) {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      fetch(`/patient/info/${patient.ID_PACIENTA}`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPatientData(...data);
        });
    }
  }, [patient]);

  const searchPatient = (event) => {
    setTimeout(() => {
      let _filtered;
      if (!event.query.trim().length) {
        _filtered = [...patients];
      } else {
        _filtered = patients.filter((patient) => {
          console.log(patient);
          return (
            patient.ROD_CISLO.toLowerCase().startsWith(
              event.query.toLowerCase()
            ) ||
            patient.MENO.toLowerCase().startsWith(event.query.toLowerCase()) ||
            patient.PRIEZVISKO.toLowerCase().startsWith(
              event.query.toLowerCase()
            )
          );
        });
      }

      setFilteredPatients(_filtered);
    }, 250);
  };

  const handleDownload = () => {
    const queryString = new URLSearchParams({
      name: patientData.MENO,
      surname: patientData.PRIEZVISKO,
      birthId: patientData.ROD_CISLO,
      insurance: patientData.NAZOV_POISTOVNE,
      city: patientData.NAZOV_OBCE,
      age: patientData.VEK,
      PSC: patientData.PSC,
      reason: reason,
    }).toString();

    window.open(`/add/basicPdf?${queryString}`, "_blank");
  };

  const itemTemplate = (rowData) => {
    return (
      <span>
        {rowData.ROD_CISLO} - {rowData.MENO}, {rowData.PRIEZVISKO}
      </span>
    );
  };

  return (
    <div
      style={{ width: "100%", marginTop: "2rem", marginLeft: "10px" }}
      className="p-fluid grid formgrid"
    >
      <div className="field col-12">
        <div className="field col-12">
          <label htmlFor="rod_cislo">Rodné číslo*</label>
          <AutoComplete
            value={patient}
            onChange={(e) => setPatient(e.value)}
            itemTemplate={itemTemplate}
            field="REQUESTNAME"
            suggestions={filteredPatients}
            completeMethod={searchPatient}
            dropdown
          />
        </div>

        <div className="field col-12">
          <label htmlFor="dovod">Dôvod*</label>
          <InputTextarea
            id="dovod"
            autoResize
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>
      <Button label="Stiahnuť" onClick={() => handleDownload()} />
    </div>
  );
}
