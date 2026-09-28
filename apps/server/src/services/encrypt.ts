import express from "express";
import crypto from "crypto";

const app = express();
const tag_lenght=16;


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