// utils/encryption.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "learn-with-mlp"; // ⚠️ Keep same across frontend & backend

const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // fixed 16-byte IV

export function encryptPassword(password) {
  const encrypted = CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return encrypted.toString();
}

export function decryptPassword(cipherText) {
  const decrypted = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}