import http from "http";
import app from "./app/app";
import { PORT } from "./config/env.config";

const server = http.createServer(app);

const startServer = async () => {
  server.listen(PORT, () => {
    const startTime = new Date();
    console.log(`✅ HTTP server running, Timestamp: ${startTime} ✅`);
  });
};

startServer();
