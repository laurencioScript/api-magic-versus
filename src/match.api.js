const express = require("express");
const serviceMatch = require("./match.service");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).send(await serviceMatch.getMatch());
  } catch (e) {
    console.log(">>> e", e);
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

router.post("/", async (req, res) => {
  try {
    const match = req.body;
    return res.status(200).send(await serviceMatch.createMatch(match));
  } catch (e) {
    console.log(e);
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

module.exports = (app) => app.use("/match", router);
