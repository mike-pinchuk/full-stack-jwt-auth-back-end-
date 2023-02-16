const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequilizeConnection = require("./config/database.js");
const db = require("./models/index.js");
const router = require("./router/index.js");
const errorMiddleWare = require("./middlewares/error.middleware.js");
const PORT = process.env.PORT || 3000;

const corsConfig = {
  credentials: true,
  origin: process.env.CLIENT_URL
}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.use("/api/", router);
app.use(errorMiddleWare);

const start = () => {
  try {
    sequilizeConnection;
    db.sequelize
      .sync()
      .then(() => {
        console.log("Database establiched successful.");
      })
      .catch((err) => {
        console.log("Failed to sync db: " + err.message);
      });
    app.listen(PORT, () => console.log(`Server established at ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
