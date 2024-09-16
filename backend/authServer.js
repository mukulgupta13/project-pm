const express = require("express");
const cors = require("cors");
const databaseConnection = require("./databaseSetup");
const { errorHandler } = require("./middleware/error_middleware");

const app = express();
databaseConnection();

app.use(express.json());
app.use(cors());

const authRouter = require("./routes/auth_route");

app.use("/api/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.AUTH_SERVER_PORT || 9001;
app.listen(PORT, () =>
  console.log(`Authentication server listening on port ${PORT}`)
);
