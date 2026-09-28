import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {encryptFile , decryptFile} from "../src/encrypt.ts";
import crypto from "crypto";

describe("Encrypted Sharing", ()=>{
  const sampledata = Buffer.from("hello world");
  const key =crypto.randomByte(32);
  const iv = crypto.randomByte(16);

  it("encrypt and decrypt",()=>{
    const encrypt = encryptFile(sampledata, key,iv);
    const decrypt = decryptFile(encrypt,key,iv);
    assert.strictEqual(decrypt.toString()).toBe(sampledata.toString());
  })

  it("reject alter data",()=>{
    const encrypt = encryptFile(sampledata, key , iv);
    encrypt[0]=encrypt[0]^0xff;
    assert.strictEqual(()=>decryptFile(encrypt, key, iv)).toThrow();
  });

  it("faliure message", ()=>{
    const encrypt = encryptFile(sampledata, key, iv);
    const wrongKey = crypto.randomByte(32);

    try {
      decryptFile(encrypt,wrongKey,iv);
    } catch (error) {
      console.log("wrong key")
    }
  });

  it("reject plain text", ()=>{
    const encrypt = encryptFile(sampledata, key , iv);

    assert.strictEqual(encrypt.includes("hello world")).toBe(false);
  })
})