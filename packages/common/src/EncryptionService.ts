import { Buffer } from "buffer";
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto";

export class EncryptionService {
    private readonly saltSize = 32;
    private readonly iterationCount = 1000;
    private readonly key =
        ",$=Aqy*)eChz+62ySJUTRX\\j5.hjeCO;8p*R+(90LQvCg?-K(}+at7'ns^IvL,CM+4;Dk3}Pt7@~ai(6u}Ub6Eg^tsl:KEB@&yX+,SK?:$6h[V4hwXEY#*|Oe5G9J6tmvNRDu*Gs4]lRzN4\\mzJkZ&?IOipWJZ6,DpXFh?t\"%LEb+At&V'Iwx|[w}R!.M`L6`{|q#u@o.@]16,v\\tmxe2\\\\[3o-UzFlEYV:We>5qq>eT7`]@c8$mVq;SELkHU3q\"R)x?XtFU\\B@<$qX;IE_'bSCsbf3ezF<'0<w}uQ(L0P*/x\"#:2<V![z0n'I;alt#8`<V)J];7__lNhD@?kD\\gzFI+GrmYsqT)\"`U[T(5/b$KKumUb+G+|>fe)IGQFaf^`X<`0ap-+cd_t{q8/weN6n/Jdqmu8*6EC7U{$[+3quaAiADOMz4k@d2yJ,Nv<pE=X`R^3.%WwZ|%)ge5[E@YBF1Eul9$w\"fm0Lu-7Jds{O?XDJ>'pUW[A";

    public encrypt(plainText: string): string {
        const salt = randomBytes(this.saltSize);
        const keyDerivation = pbkdf2Sync(this.key, salt, this.iterationCount, 48, "sha1");
        const key = keyDerivation.slice(0, 32);
        const iv = keyDerivation.slice(32, 48);

        const cipher = createCipheriv("aes-256-cbc", key, iv);
        let encrypted = cipher.update(plainText, "utf8");
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return Buffer.concat([salt, encrypted]).toString("base64");
    }

    public decrypt(ciphetext: string): string {
        const buffer = Buffer.from(ciphetext, "base64");
        const salt = buffer.slice(0, this.saltSize);
        const encryptedText = buffer.slice(this.saltSize);

        const keyDerivation = pbkdf2Sync(this.key, salt, this.iterationCount, 48, "sha1");

        const key = keyDerivation.slice(0, 32);
        const iv = keyDerivation.slice(32, 48);

        const decipher = createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString("utf8");
    }
}
