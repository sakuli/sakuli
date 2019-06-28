import {secret} from "@nut-tree/secrets";
import {EncryptionError} from "./exceptions/encryptionerror.class";

export const MASTERKEY_ENV_KEY = "SAKULI_ENCRYPTION_KEY";
export const MASTERKEY_CLI_KEY = "masterkey";
export const MASTERKEY_PROPERTY_KEY = "sakuli.encryption.key";

const getKeyFromEnvironment = () => {
    const key = process.env[MASTERKEY_ENV_KEY];
    if (!key) {
        throw new Error(`'${MASTERKEY_ENV_KEY}' is empty. Missing master key for secrets.`);
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
