import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "AgentFlow backend is running",
  });
});

app.use("/api", apiRoutes);


export default app;