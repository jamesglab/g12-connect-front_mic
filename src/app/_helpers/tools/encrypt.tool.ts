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