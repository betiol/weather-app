import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { UserService } from '../userService';

const mockUserRef = {
  set: mock(),
  key: 'mock-push-id-123',
};

const mockDb = {
  ref: mock().mockReturnValue({
    set: mock(),
    once: mock(),
    remove: mock(),
    push: mock(() => mockUserRef),
  }),
};

mock.module('../../config/firebase', () => ({
  db: mockDb,
}));

const mockWeatherService = {
  getLocationFromZipCode: mock(),
};

mock.module('../weatherService', () => ({
  WeatherService: mockWeatherService,
}));

describe('UserService', () => {
  const mockUserAuthId = 'test-user-auth-id';

  beforeEach(() => {
    mockDb.ref.mockClear();
    mockWeatherService.getLocationFromZipCode.mockClear();
    mockUserRef.set.mockClear();
    
    mockWeatherService.getLocationFromZipCode.mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'UTC-5',
    });

   
    mockDb.ref.mockReturnValue({
      set: mock(),
      once: mock(),
      remove: mock(),
      push: mock(() => mockUserRef),
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
      };

      const result = await UserService.createUser(userData, mockUserAuthId);

      expect(result).toMatchObject({
        id: 'mock-push-id-123',
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'UTC-5',
      });
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${mockUserAuthId}/resources`);
      expect(mockUserRef.set).toHaveBeenCalled();
    });

    it('should throw error when weather service fails', async () => {
      mockWeatherService.getLocationFromZipCode.mockRejectedValue(
        new Error('Invalid zip code')
      );

      const userData = {
        name: 'John Doe',
        zipCode: 'invalid',
      };

      await expect(UserService.createUser(userData, mockUserAuthId)).rejects.toThrow(
        'Failed to create user: Invalid zip code'
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users for a given userAuthId', async () => {
      const mockUsers = {
        'id1': { 
          id: 'id1', 
          name: 'User 1',
          zipCode: '10001',
          latitude: 40.7128,
          longitude: -74.0060,
          timezone: 'UTC-5',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        'id2': { 
          id: 'id2', 
          name: 'User 2',
          zipCode: '10002',
          latitude: 40.7589,
          longitude: -73.9851,
          timezone: 'UTC-5',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      };

      const mockRef = {
        once: mock().mockResolvedValue({ val: () => mockUsers }),
      };
      mockDb.ref.mockReturnValue(mockRef);

      const result = await UserService.getAllUsers(mockUserAuthId);
      
      expect(result).toEqual([
        { 
          id: 'id1', 
          name: 'User 1',
          zipCode: '10001',
          latitude: 40.7128,
          longitude: -74.0060,
          timezone: 'UTC-5',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        { 
          id: 'id2', 
          name: 'User 2',
          zipCode: '10002',
          latitude: 40.7589,
          longitude: -73.9851,
          timezone: 'UTC-5',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]);
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${mockUserAuthId}/resources`);
    });

    it('should return empty array when no users found', async () => {
      const mockRef = {
        once: mock().mockResolvedValue({ val: () => null }),
      };
      mockDb.ref.mockReturnValue(mockRef);

      const result = await UserService.getAllUsers(mockUserAuthId);
      expect(result).toEqual([]);
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

      const mockRef = {
        once: mock().mockResolvedValue({ val: () => mockUser }),
      };
      mockDb.ref.mockReturnValue(mockRef);

      const result = await UserService.getUserById('123', mockUserAuthId);
      expect(result).toEqual(mockUser);
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${mockUserAuthId}/resources/123`);
    });

    it('should return null when user not found', async () => {
      const mockRef = {
        once: mock().mockResolvedValue({ val: () => null }),
      };
      mockDb.ref.mockReturnValue(mockRef);

      const result = await UserService.getUserById('nonexistent', mockUserAuthId);
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = { id: '123', name: 'John Doe' };
      
     
      const mockGetRef = {
        once: mock().mockResolvedValue({ val: () => mockUser }),
      };
      
     
      const mockDeleteRef = {
        remove: mock().mockResolvedValue(undefined),
      };
      
      mockDb.ref
        .mockReturnValueOnce(mockGetRef) 
        .mockReturnValueOnce(mockDeleteRef);

      const result = await UserService.deleteUser('123', mockUserAuthId);
      
      expect(result).toBe(true);
      expect(mockDeleteRef.remove).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      const mockGetRef = {
        once: mock().mockResolvedValue({ val: () => null }),
      };
      mockDb.ref.mockReturnValue(mockGetRef);

      await expect(UserService.deleteUser('nonexistent', mockUserAuthId)).rejects.toThrow(
        'Failed to delete user'
      );
    });
  });
}); 