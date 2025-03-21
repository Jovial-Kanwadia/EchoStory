import { Request, Response, NextFunction } from "express";
import { getRepository } from "fireorm";
import { User, UserType } from "../models/user.model";
import admin from 'firebase-admin';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/AsyncHandler';

// Get repository for User collection
const userRepository = getRepository(User);

// Types for different OAuth providers
// type OAuthProvider = 'google' | 'facebook' | 'apple';

const registerOAuthUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idToken, provider } = req.body;

        if (!idToken) {
            throw new ApiError(400, "ID token is required");
        }

        if (!provider || !['google', 'facebook', 'apple'].includes(provider)) {
            throw new ApiError(400, "Valid provider is required");
        }

        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken)
            .catch(error => {
                console.error("Token verification error:", error);
                throw new ApiError(401, `Invalid token: ${error.message}`);
            });

        const { email, name, picture, uid } = decodedToken;

        if (!email) {
            throw new ApiError(400, "Email is required for registration");
        }

        // Check if user already exists
        let user = null;
        try {
            user = await userRepository.findById(uid);
        } catch (error) {
            // User doesn't exist, which is fine for new registrations
            console.log(`User with ID ${uid} not found, will create new user`);
        }

        if (!user) {
            // Create new user
            user = new User();
            user.id = uid;
            user.username = email.split('@')[0]; // Default username from email
            user.user_email = email;
            user.fullname = name || '';
            user.profile_image_path = picture || '';
            user.last_logged_in = new Date();
            user.device_id = req.body.device_id || '';
            user.os_type = req.body.os_type || '';
            user.fcm_code = req.body.fcm_code || '';
            user.is_active = 1;
            user.user_type = (req.body.user_type as UserType) || 'Traveler'; // Default type
            user.created_at = new Date();
            user.updated_at = new Date();

            try {
                await userRepository.create(user);
                console.log(`Created new user with ID ${uid}`);
            } catch (error: any) {
                console.error("Error creating user:", error);
                throw new ApiError(500, `Failed to create user: ${error.message}`);
            }
        } else {
            // Update existing user
            user.last_logged_in = new Date();
            user.updated_at = new Date();
            if (req.body.device_id) user.device_id = req.body.device_id;
            if (req.body.os_type) user.os_type = req.body.os_type;
            if (req.body.fcm_code) user.fcm_code = req.body.fcm_code;

            try {
                await userRepository.update(user);
                console.log(`Updated user with ID ${uid}`);
            } catch (error: any) {
                console.error("Error updating user:", error);
                throw new ApiError(500, `Failed to update user: ${error.message}`);
            }
        }

        // Create a custom token for the client
        let customToken;
        try {
            customToken = await admin.auth().createCustomToken(uid);
            console.log(`Created custom token for user ${uid}`);
        } catch (error: any) {
            console.error("Error creating custom token:", error);
            throw new ApiError(500, `Failed to create custom token: ${error.message}`);
        }

        res.status(200).json(
            new ApiResponse(200, { user, customToken }, `${provider} authentication successful`)
        );
    } catch (error) {
        next(error);
    }
});

const registerGoogleUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.provider = 'google';

        // Validate required fields
        if (!req.body.idToken) {
            throw new ApiError(400, "Google ID token is required");
        }

        // Forward to the generic OAuth handler
        await registerOAuthUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

const registerFacebookUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.provider = 'facebook';

        // Validate required fields
        if (!req.body.idToken) {
            throw new ApiError(400, "Facebook access token is required");
        }

        // Forward to the generic OAuth handler
        await registerOAuthUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

const registerAppleUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.provider = 'apple';

        // Validate required fields
        if (!req.body.idToken) {
            throw new ApiError(400, "Apple ID token is required");
        }

        // Forward to the generic OAuth handler
        await registerOAuthUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Verify custom token endpoint
const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new ApiError(400, "Token is required");
        }

        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            throw new ApiError(401, "Invalid token");
        }

        // Get user from database
        const user = await userRepository.findById(decodedToken.uid);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).json(
            new ApiResponse(200, { user }, "Token verified successfully")
        );
    } catch (error) {
        next(error);
    }
});

// Logout endpoint
const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError(400, "Token is required");
        }

        // Verify the token to get the user
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Revoke all refresh tokens for the user
        await admin.auth().revokeRefreshTokens(decodedToken.uid);

        res.status(200).json(
            new ApiResponse(200, null, "Logged out successfully")
        );
    } catch (error) {
        next(error);
    }
});

export {
    registerOAuthUser,
    registerGoogleUser,
    registerFacebookUser,
    registerAppleUser,
    verifyToken,
    logout
};