import express from "express";
import router from "./api/routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

require("dotenv").config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
