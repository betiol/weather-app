import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AuthService } from './services/authService';

export const createContext = () => ({});

const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure
  .input((input: any) => ({
    ...input,
    token: z.string().min(1, 'Authentication token is required').parse(input.token)
  }))
  .use(async ({ input, next }) => {
    const user = await AuthService.verifyToken(input.token);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
    }
    
    return next({
      ctx: { user },
    });
  });

export const createTRPCError = (code: string, message: string) => {
  const errorCode = code === 'USER_NOT_FOUND' ? 'NOT_FOUND' :
    code === 'INVALID_ZIP_CODE' ? 'BAD_REQUEST' :
    code === 'WEATHER_API_ERROR' ? 'INTERNAL_SERVER_ERROR' : 
    'INTERNAL_SERVER_ERROR';

  throw new TRPCError({
    code: errorCode,
    message,
  });
}; 