import { Collection } from 'fireorm';

export type Gender = 'Male' | 'Female';
export type UserType = 'Admin' | 'Traveler';

export interface IUser {
    id: string;
    fullname?: string;
    user_password?: string;
    user_mobile?: string;
    gender?: Gender;
    dateOfBirth?: Date;
    profile_image_path?: string;
    address?: string;
    city?: number;
    state?: number;
    country?: number;
    username: string;
    user_email: string;
    last_logged_in: Date;
    device_id: string;
    os_type: string;
    fcm_code: string;
    is_active: number;
    user_type: UserType;
    created_at: Date;
    updated_at: Date;
}

@Collection('user')
export class User {
    // Fireorm expects a string id; this represents the document id.
    public id!: string;

    // Optional fields (nullable in your table)
    public fullname?: string;
    public user_password?: string;
    public user_mobile?: string;
    public gender?: Gender;
    // Renamed from `date-of-birth` to follow TypeScript naming conventions.
    public dateOfBirth?: Date;
    public profile_image_path?: string;
    public address?: string;
    public city?: number;
    public state?: number;
    public country?: number;

    // Required fields (NOT NULL in your table)
    public username!: string;
    public user_email!: string;
    public last_logged_in!: Date;
    public device_id!: string;
    public os_type!: string;
    public fcm_code!: string;
    public is_active!: number; // using number since values can be 1, 0, or 2.
    public user_type!: UserType;
    public created_at!: Date;
    public updated_at!: Date;
}
