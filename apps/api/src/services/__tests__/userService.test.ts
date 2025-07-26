import { describe, it, expect, beforeEach, jest } from 'bun:test';
import { UserService } from '../userService';
import { WeatherService } from '../weatherService';

jest.mock('../../config/firebase', () => ({
  db: {
    ref: jest.fn().mockReturnValue({
      set: jest.fn(),
      once: jest.fn(),
      remove: jest.fn(),
    }),
  },
  USERS_REF: 'users',
}));

jest.mock('../weatherService', () => ({
  WeatherService: {
    getLocationFromZipCode: jest.fn(),
  },
}));

global.crypto = {
  randomUUID: jest.fn(() => 'mock-uuid-123'),
} as any;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (WeatherService.getLocationFromZipCode as any).mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'UTC-5',
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
      };

      const result = await UserService.createUser(userData);

      expect(result).toMatchObject({
        id: 'mock-uuid-123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'UTC-5',
      });
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw error when weather service fails', async () => {
      (WeatherService.getLocationFromZipCode as any).mockRejectedValue(
        new Error('Invalid zip code')
      );

      const userData = {
        name: 'John Doe',
        zipCode: 'invalid',
      };

      await expect(UserService.createUser(userData)).rejects.toThrow(
        'Failed to create user: Invalid zip code'
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'UTC-5',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const { db } = require('../../config/firebase');
      db.ref().once.mockResolvedValue({ val: () => mockUser });

      const result = await UserService.getUserById('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const { db } = require('../../config/firebase');
      db.ref().once.mockResolvedValue({ val: () => null });

      const result = await UserService.getUserById('nonexistent');
      expect(result).toBeNull();
    });
  });
}); 