const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));
app.listen(8080);

// cors
const cors = require("cors");
const rootRoute = require("./routes/rootRoutes");
app.use(cors());

// use rootRoute
app.use("/", rootRoute);
