"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const userService_1 = require("../services/userService");
const shared_types_1 = require("@rentredi/shared-types");
exports.usersRouter = (0, trpc_1.router)({
    // Get all users
    getAll: trpc_1.publicProcedure
        .query(async () => {
        try {
            return await userService_1.UserService.getAllUsers();
        }
        catch (error) {
            throw (0, trpc_1.createTRPCError)('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch users');
        }
    }),
    // Get user by ID
    getById: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ input }) => {
        try {
            const user = await userService_1.UserService.getUserById(input.id);
            if (!user) {
                throw (0, trpc_1.createTRPCError)('USER_NOT_FOUND', 'User not found');
            }
            return user;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('User not found')) {
                throw (0, trpc_1.createTRPCError)('USER_NOT_FOUND', 'User not found');
            }
            throw (0, trpc_1.createTRPCError)('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch user');
        }
    }),
    // Create user
    create: trpc_1.publicProcedure
        .input(shared_types_1.CreateUserSchema)
        .mutation(async ({ input }) => {
        try {
            return await userService_1.UserService.createUser(input);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
            if (errorMessage.includes('Invalid zip code')) {
                throw (0, trpc_1.createTRPCError)('INVALID_ZIP_CODE', errorMessage);
            }
            else if (errorMessage.includes('Weather API')) {
                throw (0, trpc_1.createTRPCError)('WEATHER_API_ERROR', errorMessage);
            }
            throw (0, trpc_1.createTRPCError)('INTERNAL_ERROR', errorMessage);
        }
    }),
    // Update user
    update: trpc_1.publicProcedure
        .input(shared_types_1.UpdateUserSchema)
        .mutation(async ({ input }) => {
        try {
            return await userService_1.UserService.updateUser(input);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
            if (errorMessage.includes('User not found')) {
                throw (0, trpc_1.createTRPCError)('USER_NOT_FOUND', errorMessage);
            }
            else if (errorMessage.includes('Invalid zip code')) {
                throw (0, trpc_1.createTRPCError)('INVALID_ZIP_CODE', errorMessage);
            }
            else if (errorMessage.includes('Weather API')) {
                throw (0, trpc_1.createTRPCError)('WEATHER_API_ERROR', errorMessage);
            }
            throw (0, trpc_1.createTRPCError)('INTERNAL_ERROR', errorMessage);
        }
    }),
    // Delete user
    delete: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        try {
            await userService_1.UserService.deleteUser(input.id);
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
            if (errorMessage.includes('User not found')) {
                throw (0, trpc_1.createTRPCError)('USER_NOT_FOUND', errorMessage);
            }
            throw (0, trpc_1.createTRPCError)('INTERNAL_ERROR', errorMessage);
        }
    }),
});
