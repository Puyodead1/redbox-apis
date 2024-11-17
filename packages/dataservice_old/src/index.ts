import express from "express";
import { IKioskClientServiceEvent } from "./types";

const app = express();

app.use(express.json());

app.post("/api/kioskdata/KioskClientServiceEvent", (req, res) => {
    const data = req.body as IKioskClientServiceEvent;
});

app.post("/api/kioskdata/kioskalert", (req, res) => {});
