import express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export default app;
