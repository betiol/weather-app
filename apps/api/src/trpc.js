"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCError = exports.publicProcedure = exports.router = exports.createContext = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
// Create context
const createContext = () => {
    return {};
};
exports.createContext = createContext;
// Initialize tRPC
const t = server_1.initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.z.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
// Base router and procedure helpers
exports.router = t.router;
exports.publicProcedure = t.procedure;
// Custom error helper
const createTRPCError = (code, message) => {
    const statusCode = code === 'USER_NOT_FOUND' ? 404 :
        code === 'INVALID_ZIP_CODE' ? 400 :
            code === 'WEATHER_API_ERROR' ? 502 : 500;
    throw new server_1.TRPCError({
        code: statusCode === 404 ? 'NOT_FOUND' :
            statusCode === 400 ? 'BAD_REQUEST' :
                statusCode === 502 ? 'BAD_GATEWAY' : 'INTERNAL_SERVER_ERROR',
        message,
    });
};
exports.createTRPCError = createTRPCError;
