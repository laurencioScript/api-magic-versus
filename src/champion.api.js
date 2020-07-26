const express = require("express");
const serviceApi = require("./api.service");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).send(await serviceApi.getChampions());
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

module.exports = (app) => app.use("/champion", router);
