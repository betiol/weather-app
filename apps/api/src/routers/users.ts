import { z } from 'zod';
import { router, protectedProcedure, createTRPCError } from '../trpc';
import { UserService } from '../services/userService';
import { CreateUserSchema, UpdateUserSchema } from '@weather/shared-types';

export const usersRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await UserService.getAllUsers(ctx.user.uid);
      } catch (error) {
        throw createTRPCError(
          'INTERNAL_ERROR',
          error instanceof Error ? error.message : 'Failed to fetch users'
        );
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const user = await UserService.getUserById(input.id, ctx.user.uid);
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

  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await UserService.createUser(input, ctx.user.uid);
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

  update: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedUser = await UserService.updateUser(input.id, input, ctx.user.uid);
        if (!updatedUser) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        }
        return updatedUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
        
        if (errorMessage.includes('User not found')) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        } else if (errorMessage.includes('Invalid zip code')) {
          throw createTRPCError('INVALID_ZIP_CODE', errorMessage);
        } else if (errorMessage.includes('Weather API')) {
          throw createTRPCError('WEATHER_API_ERROR', errorMessage);
        }
        
        throw createTRPCError('INTERNAL_ERROR', errorMessage);
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await UserService.deleteUser(input.id, ctx.user.uid);
        if (!success) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        }
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
        
        if (errorMessage.includes('User not found')) {
          throw createTRPCError('USER_NOT_FOUND', 'User not found');
        }
        
        throw createTRPCError('INTERNAL_ERROR', errorMessage);
      }
    }),
}); 