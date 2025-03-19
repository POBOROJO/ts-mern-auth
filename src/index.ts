import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

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


server.listen(8080,()=>{
    console.log("Server started on port http://localhost:8080");
})