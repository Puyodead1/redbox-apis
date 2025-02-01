import { Buffer } from "buffer";
import { createCipheriv, pbkdf2Sync, randomBytes } from "crypto";

export class EncryptionService {
    private readonly saltSize = 32;
    private readonly iterationCount = 1000;
    private readonly key = Buffer.from(
        ",$=Aqy*)eChz+62ySJUTRX\\j5.hjeCO;8p*R+(90LQvCg?-K(}+at7'ns^IvL,CM+4;Dk3}Pt7@~ai(6u}Ub6Eg^tsl:KEB@&yX+,SK?:$6h[V4hwXEY#*|Oe5G9J6tmvNRDu*Gs4]lRzN4\\mzJkZ&?IOipWJZ6,DpXFh?t\"%LEb+At&V'Iwx|[w}R!.M`L6`{|q#u@o.@]16,v\\tmxe2\\\\[3o-UzFlEYV:We>5qq>eT7`]@c8$mVq;SELkHU3q\"R)x?XtFU\\B@<$qX;IE_'bSCsbf3ezF<'0<w}uQ(L0P*/x\"#:2<V![z0n'I;alt#8`<V)J];7__lNhD@?kD\\gzFI+GrmYsqT)\"`U[T(5/b$KKumUb+G+|>fe)IGQFaf^`X<`0ap-+cd_t{q8/weN6n/Jdqmu8*6EC7U{$[+3quaAiADOMz4k@d2yJ,Nv<pE=X`R^3.%WwZ|%)ge5[E@YBF1Eul9$w\"fm0Lu-7Jds{O?XDJ>'pUW[A"
    );

    public encrypt(plainText: string): string {
        const salt = randomBytes(this.saltSize);

        const iterationCount = 1000;

        const key = pbkdf2Sync(this.key, salt, iterationCount, 32, "sha1");
        const iv = pbkdf2Sync(this.key, salt, iterationCount, 16, "sha1");

        const aesCipher = createCipheriv("aes-256-cbc", key, iv);
        const encryptedChunks: Buffer[] = [];

        encryptedChunks.push(aesCipher.update(plainText, "utf8"));
        encryptedChunks.push(aesCipher.final());

        const encryptedData = Buffer.concat(encryptedChunks);

        const combinedData = Buffer.concat([salt, encryptedData]);

        return combinedData.toString("base64");
    }

    public decrypt(ciphetext: string): string {
        const source = Buffer.from(ciphetext, "base64");
        const salt = source.slice(0, this.saltSize);
        const encryptedData = source.slice(this.saltSize);

        const key = pbkdf2Sync(this.key, salt, this.iterationCount, 32, "sha1");
        const iv = pbkdf2Sync(this.key, salt, this.iterationCount, 16, "sha1");

        const aesCipher = createCipheriv("aes-256-cbc", key, iv);
        const decryptedChunks: Buffer[] = [];

        decryptedChunks.push(aesCipher.update(encryptedData));
        decryptedChunks.push(aesCipher.final());

        return Buffer.concat(decryptedChunks).toString("utf8");
    }
}
