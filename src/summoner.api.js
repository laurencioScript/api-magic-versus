const express = require("express");
const serviceSummoner = require("./summoner.service");
const router = express.Router();

router.get("/ranking", async (req, res) => {
  try {
    return res
      .status(200)
      .send(await serviceSummoner.getRanking(req.query.order));
  } catch (e) {
    console.log(">>> e", e);
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

router.get("/", async (req, res) => {
  try {
    return res.status(200).send(await serviceSummoner.getSummoners());
  } catch (e) {
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

router.post("/", async (req, res) => {
  try {
    const summoner = req.body;
    return res.status(200).send(await serviceSummoner.createSummoner(summoner));
  } catch (e) {
    console.log(e);
    if (e.error) {
      return res.status(400).send(e);
    }
    return res.status(400).send("travo parça");
  }
});

module.exports = (app) => app.use("/summoner", router);
