import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

export default function TabResevations() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [zoznamRezervacii, setZoznamRezervacii] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(
      `/pharmacyManagers/getZoznamRezervacii/${userDataHelper.UserInfo.userid}`,
      {
        headers,
      }
    )
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: "error",
            summary: "Session timeout redirecting to login page",
            life: 999999999,
          });
          setTimeout(() => {
            navigate("/logout");
          }, 3000);
        }
      })
      .then((data) => {
        setZoznamRezervacii(data);
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const onSubmit = () => {
    setShowDialog(false);
    navigate("/medicament_detail", { state: selectedRow.ID_LIEK });
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="Zatvoriť"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => onHide()}
        />
        <Button
          label="Vydať"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať"
            />
          </span>
          <div className="ml-4">
            <h2
              style={{
                color: "#00796b",
                borderBottom: "2px solid #004d40",
                paddingBottom: "5px",
                marginBottom: "10px",
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Rezervácie liekov vo vašej lekárni
            </h2>
          </div>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ID_REZERVACIE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      DATUM_REZERVACIE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <div className="card">
        {loading ? (
          <div
            className="p-d-flex p-jc-center p-ai-center"
            style={{ height: "300px" }}
          >
            <ProgressSpinner
              className="p-d-flex p-jc-center p-ai-center"
              style={{
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.8)",
              }}
              strokeWidth="4"
            />
          </div>
        ) : (
          <DataTable
            value={zoznamRezervacii}
            responsiveLayout="scroll"
            selectionMode="single"
            paginator
            rows={15}
            selection={selectedRow}
            onSelectionChange={(e) => handleClick(e.value)}
            header={header}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "ID_REZERVACIE",
              "DATUM_REZERVACIE",
              "ROD_CISLO",
              "MENO",
              "PRIEZVISKO",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column
              field="ID_REZERVACIE"
              header={"ID rezervácie"}
              filter
            ></Column>
            <Column
              field="DATUM_REZERVACIE"
              header={"Dátum rezervácie"}
              filter
            ></Column>
            <Column field="ROD_CISLO" header={"Rodné číslo"} filter></Column>
            <Column field="MENO" header={"Meno"} filter></Column>
            <Column field="PRIEZVISKO" header={"Priezvisko"} filter></Column>
          </DataTable>
        )}
      </div>
      <Dialog
        header="Detail rezervácie"
        visible={showDialog}
        style={{ textAlign: "center" }}
        modal
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <div className="confirmation-content" style={{ display: "grid" }}>
          <i
            className="pi pi-info-circle"
            style={{
              fontSize: "2rem",
              color: "var(--blue-500)",
              marginBottom: "1rem",
            }}
          ></i>
          <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
            <b>Názov rezervovaného lieku:</b> {selectedRow?.NAZOV_LIEKU}
          </span>
          <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
            <b>Rezervované množstvo lieku:</b> {selectedRow?.REZERVOVANY_POCET}
          </span>
          <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
            <b>Dostupné množstvo lieku na sklade:</b>{" "}
            {selectedRow?.DOSTUPNY_POCET}
          </span>
        </div>
      </Dialog>
    </div>
  );
}
