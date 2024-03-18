import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate, useLocation } from "react-router";

export default function MedicamentCard(props) {
  const [detail, setDetail] = useState("");
  const [ucinneLatky, setUcinneLatky] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState(null); // Added state for selected substance
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetchMedicamentDetail(headers);
    fetchUcinnaLatka(headers);
  }, []);

  const fetchMedicamentDetail = (headers) => {
    fetch(
      `pharmacyManagers/detailLieku/${
        typeof props.medicamentId !== "undefined" && props.medicamentId !== null
          ? props.medicamentId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetail(...data);
        console.log(data);
      });
  };

  const fetchUcinnaLatka = (headers) => {
    fetch(
      `pharmacyManagers/getUcinnaLatka/${
        typeof props.substanceId !== "undefined" && props.substanceId !== null
          ? props.substanceId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setUcinneLatky(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching ucinne latky:", error);
      });
  };

  const redirect = () => {
    navigate("/medicaments");
  };

  const renderCardFooter = () => {
    return (
      <div>
        <Button
          label="Späť"
          icon="pi pi-replay"
          style={{ marginTop: 50 }}
          onClick={() => redirect()}
        />
        <Button
          label="Upraviť účinnú látku"
          icon="pi pi-file-edit"
          className="p-button-rounded p-button-warning"
          style={{ marginTop: 50, marginLeft: "50px" }}
          onClick={() => setDisplayDialog(true)} // Open dialog when Edit button is clicked
        />
      </div>
    );
  };

  const renderDetail = (label, value) => (
    <div className="flex w-100">
      <div className="col-6 m-0">
        <h3 className="ml-10">{label}</h3>
      </div>
      <div className="col-6 m-0">
        <h4 style={{ color: "gray" }}>{value}</h4>
      </div>
    </div>
  );

  const handleSubstanceSelect = (event) => {
    setSelectedSubstance(event.data); // Update selected substance state
    setDisplayDialog(false); // Close dialog
    // Perform any additional action, such as updating detail with selected substance
  };

  return (
    <div>
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "45rem", height: "45rem" }}
          title=<h3>{detail.NAZOV_LIEKU}</h3>
        >
          {renderDetail("Typ lieku: ", detail.TYP)}
          {renderDetail("Dávkovanie lieku: ", detail.DAVKOVANIE)}
          {renderDetail("Množstvo: ", detail.MNOZSTVO)}
          {renderDetail("Účinná látka: ", detail.NAZOV_UCINNEJ_LATKY)}
          {renderDetail("Účinná látka (latinsky): ", detail.LATINSKY_NAZOV)}
          {renderCardFooter()}
        </Card>
      </div>
      <div className="col-12 flex"></div>
      {/* Dialog for displaying active substances */}
      <Dialog
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)} // Close dialog when user clicks outside
        header="Účinné látky"
      >
        <DataTable
          value={ucinneLatky}
          selectionMode="single"
          selection={selectedSubstance}
          onSelectionChange={handleSubstanceSelect}
        >
          <Column field="NAZOV" header="Názov účinnej látky"></Column>
        </DataTable>
      </Dialog>
    </div>
  );
}
