import express, { type Express } from "express";
import cors from "cors";
import { createServer } from "node:http";
import { APP_VERSION, createApiResponse, PORTS } from "@openmesh/shared";
import { createSocketServer } from "./socket/index.js";
import crypto from "crypto";
import { connectDB } from "./services/db.js";

const app: Express = express();
const httpServer = createServer(app);
const startTime = Date.now();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    exposedHeaders:["X-IV", "X-KEY"],
  }),
);
app.use(express.json());

// Initialize MongoDB connection
connectDB();

createSocketServer(httpServer);

app.get("/", (_req, res) => {
  res.json(
    createApiResponse(true, {
      name: "OpenMesh Server",
      version: APP_VERSION,
      docs: "/api/health",
    }),
  );
});

app.get("/api/health", (_req, res) => {
  res.json(
    createApiResponse(true, {
      status: "ok",
      version: APP_VERSION,
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    }),
  );
});

app.get("/api/file/download-encrypt", (req, res)=>{
  const filepath = Buffer.from("Hello from backend");

  const key=crypto.randomBytes(32);
  const iv=crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext=Buffer.concat([cipher.update(filepath), cipher.final()]);
  const tag=cipher.getAuthTag();
  const payload=Buffer.concat([ciphertext,tag]);


  res.setHeader("Content-Type", "application/octent-stream");
  res.setHeader("X-IV", iv.toString("base64"));
  res.setHeader("X-Key", key.toString("base64"));

  res.send(payload);
})

const port = 4000;

httpServer.listen(port, () => {
  console.log(`[openmesh] Server running on http://localhost:${port}`);
  console.log(`[openmesh] WebSocket signaling ready`);
});

export { app, httpServer };
