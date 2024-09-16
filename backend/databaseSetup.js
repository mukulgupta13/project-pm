require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const mongoose = require("mongoose");

const mongoClientConfig = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  db: process.env.MONGO_DEV_DATABASE_NAME,
};

// let mongoURI = `${mongoClientConfig.host}:${mongoClientConfig.port}/${mongoClientConfig.db}`;
const mongooseConnectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

if (process.env.NODE_ENV === "production") {
  mongooseConnectOptions["authSource"] = mongoClientConfig.db;
  mongooseConnectOptions["user"] = mongoClientConfig.user;
  mongooseConnectOptions["pass"] = mongoClientConfig.password;
  mongoClientConfig.db = process.env.MONGO_DATABASE_NAME
}
let mongoURI = `mongodb+srv://${mongoClientConfig.user}:${mongoClientConfig.password}@clustertest.os1zj.mongodb.net/${mongoClientConfig.db}?retryWrites=true&w=majority`;

// mongoURI = "mongodb://" + mongoURI;
console.log(`Connecting to MongoDB at ${mongoURI}`);

const databaseConenction = async () => {
  const connectWithRetry = () => {
    return mongoose.connect(
      mongoURI,
      mongooseConnectOptions,
      () =>
        console.log(`Connected to Mongo; Database: ${mongoClientConfig.db}`),
      (err) => {
        if (err) {
          console.error(
            "Failed to connect to Mongo on startup - retrying in 5 sec",
            err
          );
          setTimeout(connectWithRetry, 5000);
        }
      }
    );
  };
  connectWithRetry();

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log("Mongoose disconnected on app termination");
      process.exit(0);
    });
  });
};

module.exports = databaseConenction;
