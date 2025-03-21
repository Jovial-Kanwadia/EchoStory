// middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { asyncHandler } from '../utils/AsyncHandler';
import { ApiError } from '../utils/ApiError';
import { getRepository } from 'fireorm';
import { User } from '../models/user.model';

// Get repository for User collection
const userRepository = getRepository(User);

const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Authentication token is required");
        }

        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            throw new ApiError(401, "Invalid token or token expired");
        }

        // Get the user from the database
        const user = await userRepository.findById(decodedToken.uid);

        if (!user) {
            throw new ApiError(401, "User not found or not authorized");
        }

        // If user is inactive
        if (user.is_active !== 1) {
            throw new ApiError(403, "User account is inactive or suspended");
        }

        // Add user and token to request object
        req.user = user;
        req.token = token;

        next();
    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') {
            throw new ApiError(401, "Token has expired. Please sign in again.");
        } else if (error.code === 'auth/id-token-revoked') {
            throw new ApiError(401, "Token has been revoked. Please sign in again.");
        } else if (error.code === 'auth/invalid-id-token') {
            throw new ApiError(401, "Invalid authentication token.");
        } else {
            throw new ApiError(401, error.message || "Authentication failed");
        }
    }
});

export default authMiddleware;