import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
export default function Combobox() {
  const [select, setSelect] = useState(null);
  const [valuesInTable, setValuesInTable] = useState(null);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [columns, setColumns] = useState([]);
  const selects = [
    { name: "Pacienti", path: "PA" },
    { name: "Lekári", path: "LE" },
    { name: "Operácie", path: "OPE" },
    { name: "Vyšetrena", path: "VY" },
    { name: "Hospitalizácie", path: "HO" },
  ];
  let json = {
    Dribbble: "a",
    Behance: "",
    Blog: "http://blog.invisionapp.com/reimagine-web-design-process/",
    Youtube: "",
    Vimeo: "",
  };
  const onSelectChange = (e) => {
    setSelect(e.value);
  };

  const handleSubmit = () => {
    /* fetch(`http://localhost:5000/${select.path}`)
      .then((res) => res.json())
      .then((result) => {
        setValuesInTable(result);
      });*/
    loadColumnsHeaders();
  };

  const loadColumnsHeaders = () => {
    // get the results (useful data) somewhere
    // get the first result set, or you can loop trhrough all, assuming that each reuslt set is the same.
    if (Object.keys(json).length > 0) {
      loadColumns(Object.keys(json));
    }
  };

  const loadColumns = (keys) => {
    let array = "";
    keys.forEach((element) => {
      array = [
        ...array,
        <Column field={element} header={element} key={element}></Column>,
      ];
    });
    setColumns(array);
  };

  return (
    <div className="card">
      <Dropdown
        value={select}
        options={selects}
        onChange={onSelectChange}
        optionLabel="name"
        placeholder="Vyber select"
      />
      <Button icon="pi pi-check" label="Zadaj" onClick={handleSubmit}></Button>
      <div className="card">
        <DataTable value={valuesInTable} responsiveLayout="scroll">
          {/* <Column field="code" header="Code"></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column> */}
          {columns}
        </DataTable>
      </div>
    </div>
  );
}
