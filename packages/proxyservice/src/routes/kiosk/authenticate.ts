import fs from "fs/promises";
import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { KioskAuthenticateRequest } from "../../interfaces";
import { KioskAuthenticateRequestSchema } from "../../schemas";
import { EncryptionService, EncryptionType } from "@redbox-apis/common";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: "../../.env" });

const dbPath = process.env.DATABASE_PATH || 'database';
const database = path.isAbsolute(dbPath) ? dbPath : path.join('../../', dbPath);

const getLocalCredentials = async (username: string, type: string) => {
    try {
        const data = await fs.readFile(path.join(database, 'credentials.json'), "utf8");
        const cred = JSON.parse(data);
        
        return cred[type]?.find((user: any) => user.username === username) || null;
    } catch (error) {
        return null;
    }
};

export const post = [
    celebrate({
        [Segments.BODY]: KioskAuthenticateRequestSchema,
    }),
    async (req: Request, res: Response) => {
        if (req.method !== "POST") return res.status(405);

        const { Username, Password, UseNtAuthentication } = req.body as KioskAuthenticateRequest;
        const credentials = await getLocalCredentials(Username, UseNtAuthentication ? "desktop" : "field");
        const encService = new EncryptionService();

        if (credentials && encService.decrypt(Password, EncryptionType.LOCAL) === credentials.password) {
            console.log(`A new login has been authorized for ${UseNtAuthentication ? "Redbox Desktop" : "Field Maintenance"} (user ${Username}).`);
    
            return res.json({ success: true });
        } else {
            console.log(`A new login has been rejected for ${UseNtAuthentication ? "Redbox Desktop" : "Field Maintenance"}.`);
            console.log(`Username: ${Username} (${credentials ? "found" : "not found"})`);
            console.log("Password:", encService.decrypt(Password, EncryptionType.LOCAL));
    
            return res.status(401).json({ success: false });
        }
    },
];
