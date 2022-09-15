require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const morgan = require("morgan");

const connectDB = require("./db/connect");

const authRouter = require("./routes/authRoutes");

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hiiya");
});

app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
