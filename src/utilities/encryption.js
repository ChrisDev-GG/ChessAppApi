const CryptoJS = require('crypto-js');
require('dotenv').config();

// Función para encriptar
function encryptData(data) {
    const encryptedData = CryptoJS.AES.encrypt(data, process.env.CRYPTO_SECRET).toString();
    return encryptedData;
}
// Función para desencriptar
function decryptData(encryptedData){
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

module.exports = { encryptData, decryptData };