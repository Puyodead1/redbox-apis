import * as x509 from "@peculiar/x509";
import { Crypto } from "@peculiar/webcrypto";
import fs from "fs/promises";
import forge from "node-forge";
import path from "path";

const crypto = new Crypto();
x509.cryptoProvider.set(crypto);

export abstract class Certificate {
  cert?: x509.X509Certificate;
  privateKey?: CryptoKey;
  publicKey?: CryptoKey;

  constructor(public certPath: string, public keyPath: string) {}

  abstract validityYears: number;
  abstract subject: string;
  abstract isCA: boolean;
  abstract getExtensions(issuer?: Certificate): Promise<x509.Extension[]>;

  async exists(): Promise<boolean> {
    try {
      await fs.access(this.certPath);
      await fs.access(this.keyPath);
      return true;
    } catch {
      return false;
    }
  }

  async load(): Promise<void> {
    const certPem = await fs.readFile(this.certPath, "utf-8");
    const keyPem = await fs.readFile(this.keyPath, "utf-8");

    this.cert = new x509.X509Certificate(certPem);

    const keyDer = this.pemToDer(keyPem);
    this.privateKey = await crypto.subtle.importKey(
      "pkcs8",
      keyDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["sign"],
    );

    this.publicKey = await this.cert.publicKey.export();
  }

  async save(): Promise<void> {
    if (!this.cert || !this.privateKey) {
      throw new Error("Cannot save empty cert/key");
    }

    await fs.mkdir(path.dirname(this.certPath), { recursive: true });
    await fs.mkdir(path.dirname(this.keyPath), { recursive: true });

    await fs.writeFile(this.certPath, this.cert.toString("pem"));

    const keyData = await crypto.subtle.exportKey("pkcs8", this.privateKey);
    const keyPem = this.derToPem(keyData, "PRIVATE KEY");
    await fs.writeFile(this.keyPath, keyPem);
  }

  async generate(issuer?: Certificate): Promise<void> {
    const keys = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"],
    );

    this.privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;

    const notBefore = new Date();
    const notAfter = new Date();
    notBefore.setMilliseconds(0);

    notAfter.setFullYear(notBefore.getFullYear() + this.validityYears);
    notAfter.setMilliseconds(0);

    const serialNumber = crypto.getRandomValues(new Uint8Array(16));

    this.cert = await x509.X509CertificateGenerator.create({
      serialNumber: this.arrayBufferToHex(serialNumber),
      subject: this.subject,
      issuer: issuer?.cert?.subject || this.subject,
      notBefore,
      notAfter,
      publicKey: this.publicKey,
      signingKey: issuer?.privateKey || this.privateKey,
      extensions: await this.getExtensions(issuer),
    });

    await this.save();
  }

  getCertificatePEM(): string {
    if (!this.cert) throw new Error("Cert not loaded");
    return this.cert.toString("pem");
  }

  async getPrivateKeyPEM(): Promise<string> {
    if (!this.privateKey) throw new Error("Key not loaded");
    const keyData = await crypto.subtle.exportKey("pkcs8", this.privateKey);
    return this.derToPem(keyData, "PRIVATE KEY");
  }

  async getPrivateKeyForge(): Promise<forge.pki.rsa.PrivateKey> {
    if (!this.privateKey) throw new Error("Key not loaded");
    const derBuffer = await crypto.subtle.exportKey("pkcs8", this.privateKey);
    const derBytes = String.fromCharCode(...new Uint8Array(derBuffer));
    const asn1 = forge.asn1.fromDer(derBytes);
    return forge.pki.privateKeyFromAsn1(asn1);
  }

  async getCertificateForge(): Promise<forge.pki.Certificate> {
    if (!this.cert) throw new Error("Cert not loaded");
    const pem = this.cert.toString("pem");
    return forge.pki.certificateFromPem(pem);
  }

  private pemToDer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace(/-----BEGIN [^-]+-----/, "")
      .replace(/-----END [^-]+-----/, "")
      .replace(/\s/g, "");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private derToPem(der: ArrayBuffer, label: string): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(der)));
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join(
      "\n",
    )}\n-----END ${label}-----\n`;
  }

  private arrayBufferToHex(buffer: ArrayBuffer | Uint8Array): string {
    const bytes =
      buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
