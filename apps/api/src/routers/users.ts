import { z } from 'zod';
import { router, publicProcedure, createTRPCError } from '../trpc';
import { UserService } from '../services/userService';
import { CreateUserSchema, UpdateUserSchema } from '@weather/shared-types';

export const usersRouter = router({
  getAll: publicProcedure
    .query(async () => {
      try {
        return await UserService.getAllUsers();
      } catch (error) {
        throw createTRPCError(
          'INTERNAL_ERROR',
          error instanceof Error ? error.message : 'Failed to fetch users'
        );
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await UserService.getUserById(input.id);
        if (!user) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        }
        return user;
      } catch (error) {
        if (error instanceof Error && error.message.includes('User not found')) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        }
        throw createTRPCError(
          'INTERNAL_ERROR',
          error instanceof Error ? error.message : 'Failed to fetch user'
        );
      }
    }),

  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      try {
        return await UserService.createUser(input);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        
        if (errorMessage.includes('Invalid zip code')) {
          throw createTRPCError('INVALID_ZIP_CODE', errorMessage);
        } else if (errorMessage.includes('Weather API')) {
          throw createTRPCError('WEATHER_API_ERROR', errorMessage);
        }
        
        throw createTRPCError('INTERNAL_ERROR', errorMessage);
      }
    }),

  update: publicProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input }) => {
      try {
        return await UserService.updateUser(input);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
        
        if (errorMessage.includes('User not found')) {
          throw createTRPCError('USER_NOT_FOUND', errorMessage);
        } else if (errorMessage.includes('Invalid zip code')) {
          throw createTRPCError('INVALID_ZIP_CODE', errorMessage);
        } else if (errorMessage.includes('Weather API')) {
          throw createTRPCError('WEATHER_API_ERROR', errorMessage);
        }
        
        throw createTRPCError('INTERNAL_ERROR', errorMessage);
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await UserService.deleteUser(input.id);
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
        
        if (errorMessage.includes('User not found')) {
          throw createTRPCError('USER_NOT_FOUND', errorMessage);
        }
        
        throw createTRPCError('INTERNAL_ERROR', errorMessage);
      }
    }),
}); 