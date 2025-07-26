import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export const createContext = () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const createTRPCError = (code: string, message: string) => {
  const statusCode = code === 'USER_NOT_FOUND' ? 404 : 
                     code === 'INVALID_ZIP_CODE' ? 400 :
                     code === 'WEATHER_API_ERROR' ? 502 : 500;
  
  throw new TRPCError({
    code: statusCode === 404 ? 'NOT_FOUND' : 
          statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
    message,
  });
}; 