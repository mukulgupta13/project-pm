require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const cors = require("cors");
const databaseConnection = require("./databaseSetup");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerDocument = require("./docs/swagger.json");
const { errorHandler } = require("./middleware/error_middleware");

const app = express();
databaseConnection();

app.use(cors());
app.use(express.json());

const authRouter = require("./routes/auth_route");
const indexRouter = require("./routes/index_route");
const accountRouter = require("./routes/account_route");
const projectRouter = require("./routes/project_route");
const employeeRouter = require("./routes/employee_route");
const teamRouter = require("./routes/team_route");
const projectAssignmentRouter = require("./routes/projectAssignment_route");
const timesheetRouter = require("./routes/timesheet_route");
const taskRouter = require("./routes/task_route");


app.use("/api/auth", authRouter);
app.use("/api/index", indexRouter);

app.use("/api/project", projectRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/team", teamRouter);
app.use("/api/assignment",projectAssignmentRouter );
app.use("/api/timesheet", timesheetRouter);
app.use("/api/task",taskRouter );
app.use('/api/account',accountRouter);


// const swaggerDocs = swaggerJsDoc(swaggerDocument);
// app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

const PORT = process.env.APP_SERVER_PORT || 8080;
app.listen(PORT, () => console.log(`App server listening on port ${PORT}`));
