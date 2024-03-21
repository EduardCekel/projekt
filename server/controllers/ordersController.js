const order = require("../models/orders");
module.exports = {
    getAllOrders: (req, res) => {
        (async () => {
            ret_val = await order.getAllOrders(req.params.id);
            res.status(200).json(ret_val);
        })();
    },
    getListOrders: (req, res) => {
        (async () => {
            ret_val = await order.getListOrders(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    getLastOrder: (req, res) => {
        (async () => {
            ret_val = await order.getLastOrder(req.params.id);
            res.status(200).json(ret_val);
        })();
    },

    confirmOrder: (req, res) => {
        const date = new Date(req.body.dat);
        const currDate = new Date();

        if(date > currDate) {
            return res.status(500).json({message: `Zadaný dátum je väčší ako aktuálny dátum`});
        }

        (async () => {
            ret_val = await order.confirmOrder(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    insertOrder: (req, res) => {
        (async () => {
            ret_val = await order.insertOrder(req.body);
            res.status(200);
        })().catch((err) => {
            console.log("Error Kontroler");
            console.error(err);
            res.status(500).send(err);
        });
    },

    deleteOrder: (req, res) => {
        (async () => {
            ret_val = await order.deleteObjednavka(req.body);
            res.status(200);
        })().catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
};