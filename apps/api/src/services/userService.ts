import { db, USERS_REF } from '../config/firebase';
import { WeatherService } from './weatherService';
import type { User, CreateUser, UpdateUser } from '@weather/shared-types';

export class UserService {
  static async createUser(userData: CreateUser): Promise<User> {
    try {
      const locationData = await WeatherService.getLocationFromZipCode(userData.zipCode);

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const user: User = {
        id,
        name: userData.name,
        zipCode: userData.zipCode,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone,
        createdAt: now,
        updatedAt: now,
      };

      await db.ref(`${USERS_REF}/${id}`).set(user);
      
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await db.ref(USERS_REF).once('value');
      const data = snapshot.val();
      
      if (!data) return [];
      
      return Object.values(data) as User[];
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const snapshot = await db.ref(`${USERS_REF}/${id}`).once('value');
      const user = snapshot.val();
      
      return user ? (user as User) : null;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  static async updateUser(updateData: UpdateUser): Promise<User> {
    try {
      const existingUser = await this.getUserById(updateData.id);
      
      if (!existingUser) {
        throw new Error('User not found');
      }

      let locationData = null;
      
      if (updateData.zipCode && updateData.zipCode !== existingUser.zipCode) {
        locationData = await WeatherService.getLocationFromZipCode(updateData.zipCode);
      }

      const updatedUser: User = {
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

      await db.ref(`${USERS_REF}/${updateData.id}`).set(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const existingUser = await this.getUserById(id);
      
      if (!existingUser) {
        throw new Error('User not found');
      }

      await db.ref(`${USERS_REF}/${id}`).remove();
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
} 