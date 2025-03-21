import { UserRecord } from 'firebase-admin/auth';

// Extend Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
            token?: string;
        }
    }
}