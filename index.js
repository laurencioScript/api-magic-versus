const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

require("./src/match.api")(app);
require("./src/summoner.api")(app);
require("./src/champion.api")(app);

app.listen(process.env.PORT || 3000, function () {
  console.log("App listening on port 3000!");
});
