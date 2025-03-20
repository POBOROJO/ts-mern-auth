import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import connectDB from "./config/connect";
import userRoutes from "./routes/User";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());

const server = http.createServer(app);

app.use("/api/v1/user", userRoutes);

server.listen(process.env.PORT, async () => {
  console.log("Server started on port http://localhost:" + process.env.PORT);
  await connectDB();
});
