// import admin from 'firebase-admin';
// import { v4 as uuidv4 } from 'uuid';

// // User types - customize based on your application needs
// export type UserType = 'Traveler' | 'Admin' | 'Guide';

// export class User {
//     id: string = '';
//     username: string = '';
//     user_email: string = '';
//     fullname: string = '';
//     profile_image_path: string = '';
//     last_logged_in: Date = new Date();
//     device_id: string = '';
//     os_type: string = '';
//     fcm_code: string = '';
//     is_active: number = 1;
//     user_type: UserType = 'Traveler';
//     created_at: Date = new Date();
//     updated_at: Date = new Date();
// }

// class UserRepository {
//     private readonly collectionName = 'users';
//     private db = admin.firestore();
    
//     // Convert Firestore document to User object
//     private convertToUser(doc: FirebaseFirestore.DocumentSnapshot): User {
//         if (!doc.exists) {
//             throw new Error('User not found');
//         }
        
//         const data = doc.data()!;
//         const user = new User();
        
//         user.id = doc.id;
//         user.username = data.username || '';
//         user.user_email = data.user_email || '';
//         user.fullname = data.fullname || '';
//         user.profile_image_path = data.profile_image_path || '';
//         user.last_logged_in = data.last_logged_in ? data.last_logged_in.toDate() : new Date();
//         user.device_id = data.device_id || '';
//         user.os_type = data.os_type || '';
//         user.fcm_code = data.fcm_code || '';
//         user.is_active = data.is_active ?? 1;
//         user.user_type = data.user_type || 'Traveler';
//         user.created_at = data.created_at ? data.created_at.toDate() : new Date();
//         user.updated_at = data.updated_at ? data.updated_at.toDate() : new Date();
        
//         return user;
//     }
    
//     // Find user by ID
//     async findById(id: string): Promise<User> {
//         try {
//             const userDoc = await this.db.collection(this.collectionName).doc(id).get();
//             return this.convertToUser(userDoc);
//         } catch (error) {
//             console.error(`Error finding user with ID ${id}:`, error);
//             throw error;
//         }
//     }
    
//     // Find user by email
//     async findByEmail(email: string): Promise<User | null> {
//         try {
//             const querySnapshot = await this.db.collection(this.collectionName)
//                 .where('user_email', '==', email)
//                 .limit(1)
//                 .get();
                
//             if (querySnapshot.empty) {
//                 return null;
//             }
            
//             return this.convertToUser(querySnapshot.docs[0]);
//         } catch (error) {
//             console.error(`Error finding user with email ${email}:`, error);
//             throw error;
//         }
//     }
    
//     // Create a new user
//     async create(user: User): Promise<User> {
//         try {
//             // If no ID is provided, generate one
//             if (!user.id) {
//                 user.id = uuidv4();
//             }
            
//             await this.db.collection(this.collectionName).doc(user.id).set({
//                 username: user.username,
//                 user_email: user.user_email,
//                 fullname: user.fullname,
//                 profile_image_path: user.profile_image_path,
//                 last_logged_in: admin.firestore.Timestamp.fromDate(user.last_logged_in),
//                 device_id: user.device_id,
//                 os_type: user.os_type,
//                 fcm_code: user.fcm_code,
//                 is_active: user.is_active,
//                 user_type: user.user_type,
//                 created_at: admin.firestore.Timestamp.fromDate(user.created_at),
//                 updated_at: admin.firestore.Timestamp.fromDate(user.updated_at)
//             });
            
//             return user;
//         } catch (error) {
//             console.error('Error creating user:', error);
//             throw error;
//         }
//     }
    
//     // Update an existing user
//     async update(user: User): Promise<User> {
//         try {
//             if (!user.id) {
//                 throw new Error('User ID is required for update');
//             }
            
//             // Update the timestamp
//             user.updated_at = new Date();
            
//             await this.db.collection(this.collectionName).doc(user.id).update({
//                 username: user.username,
//                 fullname: user.fullname,
//                 profile_image_path: user.profile_image_path,
//                 last_logged_in: admin.firestore.Timestamp.fromDate(user.last_logged_in),
//                 device_id: user.device_id,
//                 os_type: user.os_type,
//                 fcm_code: user.fcm_code,
//                 is_active: user.is_active,
//                 user_type: user.user_type,
//                 updated_at: admin.firestore.Timestamp.fromDate(user.updated_at)
//             });
            
//             return user;
//         } catch (error) {
//             console.error(`Error updating user with ID ${user.id}:`, error);
//             throw error;
//         }
//     }
    
//     // Delete a user
//     async delete(id: string): Promise<void> {
//         try {
//             await this.db.collection(this.collectionName).doc(id).delete();
//         } catch (error) {
//             console.error(`Error deleting user with ID ${id}:`, error);
//             throw error;
//         }
//     }
    
//     // Get all users
//     async findAll(): Promise<User[]> {
//         try {
//             const querySnapshot = await this.db.collection(this.collectionName).get();
//             return querySnapshot.docs.map(doc => this.convertToUser(doc));
//         } catch (error) {
//             console.error('Error getting all users:', error);
//             throw error;
//         }
//     }
    
//     // Get users by type
//     async findByUserType(userType: UserType): Promise<User[]> {
//         try {
//             const querySnapshot = await this.db.collection(this.collectionName)
//                 .where('user_type', '==', userType)
//                 .get();
                
//             return querySnapshot.docs.map(doc => this.convertToUser(doc));
//         } catch (error) {
//             console.error(`Error finding users with type ${userType}:`, error);
//             throw error;
//         }
//     }
// }

// // Export a singleton instance
// const userRepository = new UserRepository();
// export default userRepository;