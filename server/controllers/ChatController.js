module.exports = {
  getSpravy: (req, res) => {
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.getSpravy(req.params.id);
      res.status(200).json(ret_val);
    })().catch((err) => {
      console.error(err);
      res.status(403).send(err);
    });
  },

  insertSprava: (req, res) => {
    console.log("first");
    const chat = require("../models/chat");
    (async () => {
      ret_val = await chat.insertSprava(req.body);
      res.status(200).json("success");
    })().catch((err) => {
      // error handling logic 1
      console.error(err); // logging error
      res.status(500).send(err);
    });
  },
};