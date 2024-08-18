const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { specs, swaggerUi } = require("./swagger");
const route = require("./route");

const app = express();

const PORT = 3000;
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(route);
app.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
