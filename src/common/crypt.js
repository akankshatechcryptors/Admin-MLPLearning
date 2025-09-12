// utils/encryption.js
import CryptoJS from "crypto-js";

const SECRET_KEY_HEX = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const SECRET_KEY = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);

// 16-byte IV as UTF-8 WordArray
const IV = CryptoJS.enc.Utf8.parse("1234567890123456");

export function encryptPassword(password) {
  const passwordStr = String(password);

  const encrypted = CryptoJS.AES.encrypt(passwordStr, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // Base64 output
}

// Example
//console.log(encryptPassword(123456));

export function decryptPassword(cipherText) {
  const decrypted = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}