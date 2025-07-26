import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { UserService } from '../userService';

const mockDb = {
  ref: mock().mockReturnValue({
    set: mock(),
    once: mock(),
    remove: mock(),
  }),
};

mock.module('../../config/firebase', () => ({
  db: mockDb,
  USERS_REF: 'users',
}));

const mockWeatherService = {
  getLocationFromZipCode: mock(),
};

mock.module('../weatherService', () => ({
  WeatherService: mockWeatherService,
}));

global.crypto = {
  randomUUID: mock(() => 'mock-uuid-123'),
} as any;

describe('UserService', () => {
  beforeEach(() => {
    mockDb.ref.mockClear();
    mockWeatherService.getLocationFromZipCode.mockClear();
    (global.crypto.randomUUID as any).mockClear();
    
    mockWeatherService.getLocationFromZipCode.mockResolvedValue({
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
      mockWeatherService.getLocationFromZipCode.mockRejectedValue(
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

      mockDb.ref().once.mockResolvedValue({ val: () => mockUser });

      const result = await UserService.getUserById('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockDb.ref().once.mockResolvedValue({ val: () => null });

      const result = await UserService.getUserById('nonexistent');
      expect(result).toBeNull();
    });
  });
}); 