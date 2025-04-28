import { Buffer } from "buffer";
import { createCipheriv, createDecipheriv } from "crypto";

export enum EncryptionType {
  CUSTOMER,
  LOCAL,
}

export class EncryptionService {
  private readonly ENCRYPTION_CONSTANTS = {
    [EncryptionType.CUSTOMER]: {
      key: "{776DA6AF-3033-43ee-B379-2D4F28B5F1FC}",
      iv: "{F375D7E0-4572-4518-9C2F-E8F022F42AA7}",
    },
    [EncryptionType.LOCAL]: {
      key: "{02CAD7C4-E0F5-4b1b-BD04-808B840A61D2}",
      iv: "{AD186FCD-2ACD-41a8-958D-6CA7DAEB1DE5}",
    },
  };

  private guidToByteArray(guidStr: string): Buffer {
    const hex = guidStr.replace(/[{}-]/g, "");
    const bytes = Buffer.from(hex, "hex");

    // little-endian format
    return Buffer.concat([
      Buffer.from([bytes[3], bytes[2], bytes[1], bytes[0]]),
      Buffer.from([bytes[5], bytes[4]]),
      Buffer.from([bytes[7], bytes[6]]),
      bytes.slice(8),
    ]);
  }

  /**
   * Encrypts a string
   * @param data Plaintext to encrypt
   * @returns Encrypted string
   */
  public encrypt(data: string, type: EncryptionType): string {
    const enc = this.ENCRYPTION_CONSTANTS[type];
    const m_keyValueBase = this.guidToByteArray(enc.key);
    const m_initialVector = this.guidToByteArray(enc.iv).slice(0, 8); // only 1st 8 bytes

    // extend to 24 bytes (repeat 1st 8)
    const m_keyValue = Buffer.concat([
      m_keyValueBase,
      m_keyValueBase.slice(0, 8),
    ]);

    const bytes = Buffer.from(data, "binary");
    const cipher = createCipheriv("des-ede3-cbc", m_keyValue, m_initialVector);

    let encrypted = cipher.update(bytes);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString("base64");
  }

  /**
   * Decrypts a string
   * @param data The text to decrypt
   * @returns The decrypted text
   */
  public decrypt(data: string, type: EncryptionType): string {
    const enc = this.ENCRYPTION_CONSTANTS[type];
    // guid to byte arr
    const m_keyValueBase = this.guidToByteArray(enc.key);
    const m_initialVector = this.guidToByteArray(enc.iv).slice(0, 8); // only 1st 8 bytes

    // extend to 24 bytes (repeat 1st 8)
    const m_keyValue = Buffer.concat([
      m_keyValueBase,
      m_keyValueBase.slice(0, 8),
    ]);

    const encBytes = Buffer.from(data, "base64");
    const decipher = createDecipheriv(
      "des-ede3-cbc",
      m_keyValue,
      m_initialVector,
    );

    let decrypted = decipher.update(encBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("binary");
  }
}
