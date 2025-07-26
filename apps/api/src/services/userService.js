"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const firebase_1 = require("../config/firebase");
const weatherService_1 = require("./weatherService");
class UserService {
    static async createUser(userData) {
        try {
            // Fetch location data from weather API
            const locationData = await weatherService_1.WeatherService.getLocationFromZipCode(userData.zipCode);
            // Generate unique ID
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            const user = {
                id,
                name: userData.name,
                zipCode: userData.zipCode,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                timezone: locationData.timezone,
                createdAt: now,
                updatedAt: now,
            };
            // Save to Firebase
            await firebase_1.db.ref(`${firebase_1.USERS_REF}/${id}`).set(user);
            return user;
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async getAllUsers() {
        try {
            const snapshot = await firebase_1.db.ref(firebase_1.USERS_REF).once('value');
            const data = snapshot.val();
            if (!data)
                return [];
            return Object.values(data);
        }
        catch (error) {
            throw new Error('Failed to fetch users');
        }
    }
    static async getUserById(id) {
        try {
            const snapshot = await firebase_1.db.ref(`${firebase_1.USERS_REF}/${id}`).once('value');
            const user = snapshot.val();
            return user ? user : null;
        }
        catch (error) {
            throw new Error('Failed to fetch user');
        }
    }
    static async updateUser(updateData) {
        try {
            const existingUser = await this.getUserById(updateData.id);
            if (!existingUser) {
                throw new Error('User not found');
            }
            let locationData = null;
            // If zip code changed, re-fetch location data
            if (updateData.zipCode && updateData.zipCode !== existingUser.zipCode) {
                locationData = await weatherService_1.WeatherService.getLocationFromZipCode(updateData.zipCode);
            }
            const updatedUser = {
                ...existingUser,
                ...(updateData.name && { name: updateData.name }),
                ...(updateData.zipCode && { zipCode: updateData.zipCode }),
                ...(locationData && {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    timezone: locationData.timezone,
                }),
                updatedAt: new Date().toISOString(),
            };
            await firebase_1.db.ref(`${firebase_1.USERS_REF}/${updateData.id}`).set(updatedUser);
            return updatedUser;
        }
        catch (error) {
            throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async deleteUser(id) {
        try {
            const existingUser = await this.getUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }
            await firebase_1.db.ref(`${firebase_1.USERS_REF}/${id}`).remove();
        }
        catch (error) {
            throw new Error('Failed to delete user');
        }
    }
}
exports.UserService = UserService;
