import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AuthService } from './services/authService';

export const createContext = (opts: { req: any }) => {
  const authHeader = opts.req.headers.authorization || opts.req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  return {
    token,
    req: opts.req,
  };
};

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
  .use(async ({ ctx, next }) => {
    if (!ctx.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication token is required',
      });
    }

    const user = await AuthService.verifyToken(ctx.token);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
    }
    
    return next({
      ctx: { 
        ...ctx,
        user 
      },
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