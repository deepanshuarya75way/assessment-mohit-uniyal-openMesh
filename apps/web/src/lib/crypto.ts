export async function fetchAndDecryptFile(): Promise<Blob>{
  const server = "http://localhost:4000";
  const res = await fetch(`${server}/api/file/download-encrypt`);
  if(!res.ok){
    throw new Error("Faild to fetch encryptd file");
  }

  const encryptPlayload= await res.arrayBuffer();

  const ivr=res.headers.get("X-IV");
  const key= res.headers.get("X-Key");

  if(!ivr || !key){
    throw new Error("Messing encryption prarameter");
  }

  const iv = Uint8Array.from(atob(ivr) , (c)=> c.charCodeAt(0));
  const rawkey= Uint8Array.from(atob(key), (c)=>c.charCodeAt(0));

  const cryptoKey= await window.crypto.subtle.importKey(
    "raw",
    rawkey,
    {name:"AES-GCM"},
    false,
    ["decrypt"]
  )
  
  try{
    const decryptBuffer = await window.crypto.subtle.decrypt({
      name:"AES-GCM",
      iv:iv,
      tagLength:128
    },
    cryptoKey,
    encryptPlayload
  )
  return new Blob([decryptBuffer]);
  } catch(err){
    throw new Error("Decrypt falied");
  }
}