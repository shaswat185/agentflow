import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`AgentFlow backend running on port ${PORT}`);
  });
};

startServer();