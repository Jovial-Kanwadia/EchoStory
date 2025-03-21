// config/firebase.config.ts
import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

/**
 * Initializes the Firebase Admin SDK for server-side operations.
 * This function will configure Firebase with credentials from environment variables
 * or a local service account file.
 * 
 * @returns {App} The initialized Firebase Admin app instance
 */
const initializeFirebase = (): App => {
    try {
        let firebaseApp: App;

        // Check if app is already initialized
        if (getApps().length === 0) {
            console.log('Initializing Firebase Admin SDK...');
            
            // Method 1: Using environment variables (preferred for production)
            if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
                // Decode the base64 encoded service account
                const serviceAccountJson = Buffer.from(
                    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
                    'base64'
                ).toString('utf-8');

                const serviceAccount = JSON.parse(serviceAccountJson);

                firebaseApp = initializeApp({
                    credential: cert(serviceAccount),
                    databaseURL: process.env.FIREBASE_DATABASE_URL,
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
                });

                console.log('Firebase initialized with base64 encoded service account');
            }
            // Method 2: Using environment variables for specific credentials
            else if (process.env.FIREBASE_PROJECT_ID &&
                process.env.FIREBASE_CLIENT_EMAIL &&
                process.env.FIREBASE_PRIVATE_KEY) {

                const serviceAccount = {
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Handle private key newline characters properly
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                };

                firebaseApp = initializeApp({
                    credential: cert(serviceAccount),
                    databaseURL: process.env.FIREBASE_DATABASE_URL,
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
                });

                console.log('Firebase initialized with environment variables');
            }
            // Method 3: Using a local service account file (for development)
            else {
                // Determine the path to the service account file
                const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
                    path.resolve(process.cwd(), 'serviceAccountKey.json');

                if (!fs.existsSync(serviceAccountPath)) {
                    throw new Error(`Service account file not found at: ${serviceAccountPath}`);
                }

                // Use dynamic import to avoid require() issues with ESM
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

                firebaseApp = initializeApp({
                    credential: cert(serviceAccount),
                    databaseURL: process.env.FIREBASE_DATABASE_URL,
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
                });

                console.log(`Firebase initialized with service account from: ${serviceAccountPath}`);
            }
        } else {
            console.log('Firebase Admin SDK already initialized');
            firebaseApp = getApp();
        }

        return firebaseApp;
    } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
        throw error;
    }
};

/**
 * Validates that Firebase Admin SDK is properly initialized
 * @returns {boolean} True if Firebase Admin SDK is properly initialized
 */
export const validateFirebaseConnection = async (): Promise<boolean> => {
    try {
        // Try to access Firestore as a simple connection test
        const db = getFirestore();
        await db.listCollections(); // This will throw if not connected

        console.log('Firebase connection validated successfully');
        return true;
    } catch (error) {
        console.error('Firebase connection validation failed:', error);
        return false;
    }
};

export default initializeFirebase;