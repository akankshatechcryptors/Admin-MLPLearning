import CryptoJS from "crypto-js";

// same values you had before
const SECRET_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; 
const IV = "1234567890123456";

export function encryptFilename(text) {
  const encrypted = CryptoJS.AES.encrypt(
    text,
    CryptoJS.enc.Hex.parse(SECRET_KEY),   // parse hex key
    {
      iv: CryptoJS.enc.Utf8.parse(IV),    // parse IV
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
// console.log(encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""))
  // make URL-safe
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
