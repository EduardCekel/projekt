//@TODO add ordering on critical stock in warehouse for all medications that are in hospital
//@TODO also add ordering when medicine will expire in X days

//Imports
import React, { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import GetUserData from "../Auth/GetUserData";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Calendar} from "primereact/calendar";
import {json} from "react-router-dom";

export default function Orders() {

    let emptyOrders = {
        ID_OBJEDNAVKY: null,
        ID_SKLAD: null,
        DATUM_OBJEDNAVKY: null,
        ZOZNAM_LIEKOV: null,
        DATUM_DODANIA: null
    };

    let dialog = {
        dialog: true
    };

    let formattedString = null;

    //Defined constants
    const [products, setProducts] = useState(null);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [order, setOrder] = useState(emptyOrders);
    const [drugs, setDrugs] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [addOrderDialog, setAddOrderDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [confirmOrder, setConfirmOrder] = useState(false);
    const [changeProductDialog, setChangeProductDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [xmlContent, setXmlContent] = useState("");
    const toast = useRef(null);
    const [selectedMedications, setSelectedMedications] = useState([]);

    /*
    ----------------------------------------------------------------------------------------
    Functions section
    ----------------------------------------------------------------------------------------
    */

    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        const userDataHelper = GetUserData(token);
        fetch(`objednavky/all/${userDataHelper.UserInfo.userid}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            });
        //initFilter();
    }, []);

    //Async function for inserting new data into DB
    async function insertData() {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                zoznam_liekov: formattedString,
                usr_id: userDataHelper.UserInfo.userid
            }),
        };

        const response = await fetch("/objednavky/add", requestOptions).catch((err) =>
            console.log(err)
        );

    }

    async function confirmOrderDB(medication) {
        const token = localStorage.getItem("hospit-user");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id: medication.id,
                poc: medication.amount,
                id_obj: order.ID_OBJEDNAVKY,
                sel_date: order.DATUM_DODANIA
            }),
        };

        fetch("/objednavky/confirmOrder", requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if(res.message !== undefined) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: res.message,
                        life: 3000,
                    });
                    return false;
                }
            });
        return true;
    }

    //Async function for removing order
    async function deleteOrder(_order) {
        const token = localStorage.getItem("hospit-user");
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id_obj: _order.ID_OBJEDNAVKY
            }),
        };
        const response = await fetch("/objednavky/deleteOrder", requestOptions);
    }

    //Function that will be called after clicking on one of the rows
    const handleClick = (value) => {
        setShowDialog(true);
        setLoading(true);
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        setSelectedRow(value);

        fetch(`/objednavky/list/${value.ID_OBJEDNAVKY}`, { headers })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                return res.text();
            })
            .then((data) => {
                try {

                    const jsonData = JSON.parse(data);

                    if(jsonData[0].DATUM_DODANIA === null) {
                        setConfirmOrder(true);
                        order.ID_OBJEDNAVKY = value.ID_OBJEDNAVKY;
                    }

                    // If ZOZNAM_LIEKOV is a string, parse it as JSON
                    if (jsonData && jsonData[0] && jsonData[0].ZOZNAM_LIEKOV) {
                        const zoznamLiekovArray = JSON.parse(jsonData[0].ZOZNAM_LIEKOV);

                        setLoading(false);
                        setXmlContent(zoznamLiekovArray);
                    } else {console.error('Invalid ZOZNAM_LIEKOV structure:', jsonData);
                    }
                } catch (error) {
                    console.error('Error parsing data:', error);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    };

    //Function for adding new order
    const openNew = () => {
        const token = localStorage.getItem("hospit-user");
        const headers = { authorization: "Bearer " + token };
        fetch(`lieky/all`, { headers })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setDrugs(data);
            });

        setOrder(emptyOrders);
        setAddOrderDialog(true);
    };

    //Add new order function
    const addOrder = () => {
        let _orders = [...products];
        let _order = { ... order};

        //Checking if there are any values below 0
        let checkPocet = true;
        if(selectedMedications.some((medication) => medication.quantity <= 0)) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Počet liekov musí byť kladný",
                life: 3000,
            });
            checkPocet = false;
        }

        //Checking if all medicines are unique
        let unique = true;

        if(addOrderDialog) {
            const selectedDrugs = selectedMedications.map((medication) => medication.selectedDrug.NAZOV);
            const uniqueDrugs = new Set(selectedDrugs);

            if (selectedDrugs.length !== uniqueDrugs.size) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Lieky v zozname musia byť unikátne",
                    life: 3000,
                });
                unique = false;
            }
        }

        //Add whole list and create new order
        if(unique && checkPocet && selectedMedications.length > 0) {
            const transformedData = selectedMedications.map((item) => ({
                id: item.selectedDrug.ID_LIEK,
                name: item.selectedDrug.NAZOV,
                amount: item.quantity
            }));
            formattedString = JSON.stringify(transformedData);

            insertData();

            const token = localStorage.getItem("hospit-user");
            const headers = { authorization: "Bearer " + token };
            const userDataHelper = GetUserData(token);

            //@TODO it seems that this is sometimes faster then insert into table and therefor I am having duplicated
            //@TODO ids in table and it crashes due to component then, could be fixxed by simple wait (1-2 second)
            //@TODO tbh I dont know why is it doing this when other inserts have select after it
            fetch(`/objednavky/getLastOrder/${userDataHelper.UserInfo.userid}`, { headers })
                .then((response) => response.json())
                .then((data) => {
                    _order.ID_OBJEDNAVKY = data[0].ID_OBJEDNAVKY;
                    _order.ID_SKLAD = data[0].ID_SKLAD;
                    _order.ZOZNAM_LIEKOV = formattedString;

                    let currentDate = new Date();
                    let day = currentDate.getDate();
                    let month = currentDate.getMonth() + 1;
                    let year = currentDate.getFullYear();

                    _order.DATUM_OBJEDNAVKY = day + "." + month + "." + year;
                    _orders.push(_order);

                    console.log(_order);
                    console.log(_orders);

                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Objednávka vola vytvorená",
                        life: 3000,
                    });

                    setSelectedDrug(null);
                    setSelectedMedications([]);
                    setAddOrderDialog(false);
                    setProducts(_orders);
                    setOrder(emptyOrders);
                });
        }

        hideDialog();
    }

    //Function for confirming orders
    const confirmOrderDelivery = () => {
        //@TODO get selected row and update date in it and then update it in table on site

        const selectedDate = new Date(order.DATUM_DODANIA);
        const currentDate = new Date();
        let finish = true;

        if(selectedDate > currentDate) {
            finish = false;
        } else {
            for (let index = 0; index < xmlContent.length; index++) {
                const medication = xmlContent[index];

                if(!confirmOrderDB(medication)) {
                    //There was an error while performing confirmation
                    finish = false;
                    break;
                }

            }

        }

        if(finish) {
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Objednávka bola potvrdená a lieky boli pridané do skladu",
                life: 3000,
            });

            console.log(order);

            const _products = products.filter(product => product.ID_OBJEDNAVKY !== order.ID_OBJEDNAVKY);
            const index = products.findIndex(product => product.ID_OBJEDNAVKY === order.ID_OBJEDNAVKY);

            const date = new Date(order.DATUM_DODANIA);
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

            console.log(formattedDate);

            order.DATUM_OBJEDNAVKY = products[index].DATUM_OBJEDNAVKY;
            order.DATUM_DODANIA = formattedDate;

            _products.push(order);

            setProducts(_products);

        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Zadaný dátum je väčší ako aktuálny dátum",
                life: 3000,
            });
        }

        setOrder(emptyOrders);
        onHide();

    }

    const deleteProduct = () => {
        let _orders = products.filter((val) => val.ID_OBJEDNAVKY !== order.ID_OBJEDNAVKY);
        deleteOrder(order);
        setProducts(_orders);
        setDeleteProductDialog(false);
        setOrder(emptyOrders);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Objednávka bola odstránená",
            life: 3000,
        });
    };

    const confirmDeleteProduct = (product) => {
        setOrder(product);
        setDeleteProductDialog(true);
    };

    // Function to add selected medication to the list
    const addMedication = () => {
        setSelectedMedications([...selectedMedications, { NAZOV: "", ID_LIEK: 0, quantity: 0}]);
    };

    // Function to remove medication from the list
    const removeMedication = (index) => {
        const updatedMedications = [...selectedMedications];
        updatedMedications.splice(index, 1);
        setSelectedMedications(updatedMedications);
    };

    /*
    ******************************************************************************************************************
                                                    Hide functions
    ******************************************************************************************************************
    */

    //Selected Order hide
    const onHide = () => {
        setXmlContent(null);
        setSelectedRow(null);
        setShowDialog(false);
        setConfirmOrder(false);
    };

    //New order hide
    const hideDialog = () => {
        setSelectedDrug(null);
        setAddOrderDialog(false);
        setChangeProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };


    //New/Delete toolbar function
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button
                label="New"
                icon="pi pi-plus"
                className="p-button-success mr-2"
                onClick={openNew}
            />
        </React.Fragment>
    );
};

    const productDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={addOrder}
            />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </React.Fragment>
        );
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDeleteProductDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteProduct}
            />
        </React.Fragment>
    );

    /*
    ----------------------------------------------------------------------------------------
    Page content
    ----------------------------------------------------------------------------------------
    */
//Default page looks when it is loaded
return (
    //Header DIV for adding new orders and for table
    <div>
        <Toast ref={toast} />

        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
            value={products}
            selection={selectedRow}
            selectionMode="single"
            onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
            dataKey="ID_OBJEDNAVKY"
            globalFilter={NaN} //globalFilter
            globalFilterFields={["ID_OBJEDNAVKY","ID_SKLAD", "DATUM_OBJEDNAVKY", "DATUM_DODANIA"]}
            filters={NaN} //filter
            header={NaN} //header
            responsiveLayout="scroll"
        >

            <Column
                field="ID_OBJEDNAVKY"
                header="Id objednavky"
                style={{ minWidth: "10rem" }}
            ></Column>
            <Column
                field="ID_SKLAD"
                header="Id skladu"
                style={{ minWidth: "8rem" }}
            ></Column>
            <Column
                field="DATUM_OBJEDNAVKY"
                header="Dátum objednania"
                style={{ minWidth: "12rem" }}
            ></Column>
            <Column
                field="DATUM_DODANIA"
                header="Dátum dodania"
                style={{ minWidth: "10rem" }}
            ></Column>
            <Column
                body={actionBodyTemplate}
                style={{ minWidth: "8rem" }}
            ></Column>
        </DataTable>

        <Dialog
            visible={showDialog && dialog}
            style={{ maxWidth: "50vw" }}
            footer={NaN} //productDialogFooter
            onHide={() => onHide()}
        >
            {loading ? (
                <div style={{ width: "500px", display: "flex" }}>
                    <ProgressSpinner />
                </div>
            ) : selectedRow !== null ? (
                <div style={{ maxWidth: "500px", overflowWrap: "break-word" }}>
                    <h3>Zoznam objednaných liekov</h3>
                    {xmlContent.map((item, index) => (
                        <div key={index}>
                            <p>ID Lieku: {item.id}</p>
                            <p>Názov: {item.name}</p>
                            <p>Počet: {item.amount}</p>
                        </div>
                    ))}
                </div>
            ) : (
                ""
            )}
            {confirmOrder  ? (
                <div>
                    <h2>Potvrdenie príchodu objednávky</h2>
                    <div className="formgird grid">
                        <div className="field col">
                            <label htmlFor="DATUM_DODANIA">Dátum dodania objednávky</label>
                            <div>

                                <Calendar
                                    value={order.DATUM_DODANIA}
                                    dateFormat="dd.mm.yy"
                                    onChange={(e) =>
                                        setOrder({ ...order, DATUM_DODANIA: e.value })
                                    }
                                ></Calendar>
                            </div>
                        </div>
                    </div>
                    <div className={"submit-button"}>
                        <Button style={{width: "50%"}} label="Potvrdiť doručenie" onClick={confirmOrderDelivery} />
                    </div>
                </div>
            ) : (
                ""
            )}
        </Dialog>


        <Dialog
            visible={addOrderDialog}
            style={{ width: "500px", height: "700px"}}
            header="Pridať objednávku"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
        >
            <label>Zoznam liekov</label>
            {selectedMedications.map((selectedMedication, index) => (
                <div key={index} style={{paddingTop: "20px"}}>
                    <div className="field col">
                        <Dropdown
                            style={{width: "auto"}}
                            value={selectedMedication.selectedDrug}
                            options={drugs}
                            onChange={(e) => {
                                const updatedMedications = [...selectedMedications];
                                updatedMedications[index].selectedDrug = e.value;
                                setSelectedMedications(updatedMedications);
                            }}
                            optionLabel="NAZOV"
                            placeholder="Vyberte liek"
                        />
                    </div>
                    <label style={{paddingLeft: "15px"}} htmlFor="quantity">Počet</label>
                    <div className="field col">
                        <InputNumber
                            style={{width: "100px"}}
                            value={selectedMedication.quantity}
                            onChange={(e) => {
                                const updatedMedications = [...selectedMedications];
                                updatedMedications[index].quantity = e.value;
                                setSelectedMedications(updatedMedications);
                            }}
                            integeronly
                        />
                        <Button
                            style={{marginLeft: "10px"}}
                            icon="pi pi-times"
                            onClick={() => removeMedication(index)}
                        />
                    </div>
                </div>
            ))}
            <div className={"submit-button"}>
                <Button style={{width: "50%"}} label="Pridať do zoznamu" onClick={addMedication} />
            </div>
        </Dialog>

        <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
        >
            <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {order && (
                    <span>
              Naozaj chcete odstrániť objednávku s ID: <b>{order.ID_OBJEDNAVKY}</b> ?
            </span>
                )}
            </div>
        </Dialog>

    </div>


);
}