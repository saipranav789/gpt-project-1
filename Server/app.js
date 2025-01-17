import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import configRoutes from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Routes will be running on http://localhost:3000");
});
configRoutes(app);

export default app;
