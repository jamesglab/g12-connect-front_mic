import * as CryptoJS from 'crypto-js';


export class EncryptTools {

    encrypt(element: any): string {
        const STRING_ELEMENT = JSON.stringify(element);
        const ELEMENT_ENCRYPTED = btoa(STRING_ELEMENT);
        return ELEMENT_ENCRYPTED;
    }

    desencrypt(element: string): any {
        if (element === '' || element.trim() === '') { return false; }
        try {
            const ELEMENT_DESENCRYPTED = JSON.parse(atob(element));
            return ELEMENT_DESENCRYPTED;
        } catch (err) {
            return false;
        }
    }

}

export const encrypt = (keys, value) => {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

    return encrypted.toString();
}

export const decrypt = (keys, value) => {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
// export const encryptDataConection = async (
//     data: { [key: string]: boolean | string | number | [] | {} },
//     secret_encrypt: string
// ): Promise<string> => {
//     //SE OBTIENE UN RANGO DE BYTES PARA ENCRIPTAR
//     const random_byte = await randomBytes(16);
//     //SE CREA EL CIFRADO DEL STRING
//     const cipher = createCipheriv(
//         "aes-256-gcm",
//         scryptSync(secret_encrypt, "salt", 32),
//         random_byte
//     );
//     //SE ENCRIPTA LA DATA Y SE OPTIENE EL BUFFER
//     let encrypted = cipher.update(JSON.stringify(data));
//     //SE MODIFICA EL BUFFER ANTERIOR PARA CONCATENAR UN CIFRADO
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     //SE RETORNA LA CADENA ENCRIPTADA
//     return random_byte.toString("hex") + ":" + encrypted.toString("hex");
// };
// export const decrypt = (data: string, secret_encrypt: string) => {
//     //SE PARTE EL STRING ENCRIPTADO ENTRE EL RANDOM_BYTE Y EL TEXTO ENCRIPTADO
//     const data_part = data.split(":");
//     //SE OBTIENE EL BUFFER DEL RANDOMB_BYTE
//     const random_byte = Buffer.from(data_part.shift(), "hex");
//     //SE OBTIENE EL BUFFER DE LA DATA ENVIADA
//     const decrypted_data = Buffer.from(data_part.join(":"), "hex");
//     //SE GENERA EL DECIFRADO
//     const decipher = createCipheriv(
//         "aes-256-gcm",
//         scryptSync(secret_encrypt, "salt", 32),
//         random_byte
//     );
//     //SE DESENCRIPTAN LOS DATOS Y SE OBTIENE EL BUFFER
//     let decrypted = decipher.update(decrypted_data);
//     //SE CONCATENA EL BUFFER CON EL CIFRADO PARA DESCENCRIPTAR POR TOTAL LOS DATOS
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     //SE RETORNA LOS DATOS DESENCRIPTADOS
//     return JSON.parse(decrypted.toString());
// };

// export const encrypt = (
//     data: { [key: string]: boolean | string | number | [] | {} },
//     secret_encrypt: string
// ): string =>
//     createCipher("aes-256-ctr", secret_encrypt).update(
//         `${secret_encrypt}+${JSON.stringify(data)}+${secret_encrypt}`,
//         "hex",
//         "utf8"
//     );
// export const decrypt = (data: string, secret_encrypt: string) =>
//     createDecipher("aes-256-ctr", secret_encrypt).update(
//         `${secret_encrypt}+${data}+${secret_encrypt}`,
//         "hex",
//         "utf8"
//     );