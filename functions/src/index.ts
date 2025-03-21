// File: src/index.ts
import * as functions from "firebase-functions";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { initialize } from "fireorm";
import * as admin from "firebase-admin";


// Initialize Firebase Admin
admin.initializeApp();

// Initialize Fireorm
const firestore = admin.firestore();
initialize(firestore);

import setupRoutes from "./app";

// Express app setup
const app: Application = express();

app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        firebase: 'connected'
    });
});

// Setup API routes
setupRoutes(app);

// Export the API as a Firebase Function
export const api = functions.https.onRequest(app);