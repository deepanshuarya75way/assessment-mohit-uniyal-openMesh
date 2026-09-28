import crypto from "node:crypto";
const IV_LENGTH= 16;
/**
 * 
 * @param data - The plaindata
 * @param key 
 * @param iv 
 * @returns 
 */

export async function encryptFile(data:ArrayBuffer, key:ArrayBuffer, iv:ArrayBuffer):Promise<ArrayBuffer>{
  const cipher= crypto.createCipheriv("aes-256-gcm", key ,iv);

  const ciphertext=Buffer.concat([cipher.update(Buffer.from(data)), cipher.final()])

  const tag=cipher.getAuthTag();

  const combine = Buffer.concat([ciphertext,tag]);

  return combine.buffer.slice([encrypt, tag]);
}


/**
 * 
 * @param encrypt - Buffer contain ciphertext and auth tag
 * @param key -32-byte key
 * @param iv -16-byte intialization vector
 * @returns -Decrypted Buffer
 */

export async function decryptFile(encrypt:ArrayBuffer,key:ArrayBuffer,iv:ArrayBuffer):Promise<ArrayBuffer>{
  if(encrypt.byteLength < IV_LENGTH){
    throw new Error("Decryption falied");
  }
  const tag=encrypt.slice(encrypt.byteLength-IV_LENGTH);
  const ciphertext = encrypt.slice(0,encrypt.byteLength -IV_LENGTH);

  const decipher = crypto.createDecipher("aes-256-gcm", key ,iv);
  decipher.setAuthTag(tag);

  try {
    const decrypt = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypt;
  } catch (error) {
    throw new Error("Decryption falied");
  }
}
