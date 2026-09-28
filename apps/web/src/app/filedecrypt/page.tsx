"use client";

import { useState } from "react";
import { fetchAndDecryptFile } from "../../lib/crypto";


export default function FileViewer(){
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async()=>{
    setError(null);
    try {
      const bolb= await fetchAndDecryptFile();
      const url = URL.createObjectURL(bolb);

      setFileUrl(url);
    } catch (error) {
      setError(error.message || "Decrypt fail")
    }
  };

  return (
    <div className="p-4 space-y-3">
      <button 
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white"
      >decrypt file</button>
      {error && <p className="text-red-500 text-sm">{error}</p>
      }
      {fileUrl  && (
        <a
        href={fileUrl}
        download="decryptfile.txt"
        className="inline-block px-3 py-1 bg-green-600 text-white"
        >open file</a>
      )}
    </div>
  )
}