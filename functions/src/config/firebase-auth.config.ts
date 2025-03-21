// config/firebase-auth.config.ts
import { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export const configureFirebaseAuth = (app: App) => {
    try {
        const auth = getAuth(app);
        // Now auth is properly initialized and can be used
        console.log('Firebase Auth configured successfully');
        return auth;
    } catch (error) {
        console.error('Failed to configure Firebase Auth:', error);
        throw error;
    }
};

export const getAuthProvidersConfig = (): Record<string, boolean> => {
    return {
        google: process.env.FIREBASE_ENABLE_GOOGLE_AUTH === 'true',
        facebook: process.env.FIREBASE_ENABLE_FACEBOOK_AUTH === 'true',
        twitter: process.env.FIREBASE_ENABLE_TWITTER_AUTH === 'true',
        github: process.env.FIREBASE_ENABLE_GITHUB_AUTH === 'true',
        apple: process.env.FIREBASE_ENABLE_APPLE_AUTH === 'true',
        email: process.env.FIREBASE_ENABLE_EMAIL_AUTH === 'true',
        phone: process.env.FIREBASE_ENABLE_PHONE_AUTH === 'true'
    };
};

export const getEnabledAuthProviders = (): string[] => {
    const providers = getAuthProvidersConfig();
    return Object.keys(providers).filter(key => providers[key]);
};