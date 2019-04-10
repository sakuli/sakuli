import {secret} from "@nut-tree/secrets";
import {EncryptionError} from "./exceptions/encryptionerror.class";

export const ENCRYPTION_KEY_VARIABLE = "SAKULI_ENCRYPTION_KEY";

const getKeyFromEnvironment = () => {
    const key = process.env[ENCRYPTION_KEY_VARIABLE];
    if (!key) {
        throw new Error(`'${ENCRYPTION_KEY_VARIABLE}' is empty. Missing master key for secrets.`);
    }
    return key;
};

export async function decryptSecret(encryptedInput: string): Promise<string> {
    try {
        const key = getKeyFromEnvironment();
        return secret.decrypt(encryptedInput, key);
    } catch (e) {
        throw new EncryptionError(e.message);
    }
}

export async function withEncryption<T>(encryptedInput: string, action: (input: string) => Promise<T>): Promise<T> {
    try {
        const key = getKeyFromEnvironment();
        const decrypted = await secret.decrypt(encryptedInput, key);
        return action(decrypted);
    } catch (e) {
        throw new EncryptionError(e.message);
    }
}
