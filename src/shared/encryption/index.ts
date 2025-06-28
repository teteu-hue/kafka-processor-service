import { decrypt, encrypt } from "./crypt.utils";

export class Encryption {
    static encrypt(text: string) {
        return encrypt(text);
    }

    static decrypt(hash: string) {
        return decrypt(hash);
    }
}
