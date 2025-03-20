import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import connectDB from "./config/connect";

const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  console.log("Server started on port http://localhost:" + process.env.PORT);
  await connectDB();
});
