import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  zipCode: z.string().min(5, 'Valid zip code is required').optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const WeatherResponseSchema = z.object({
  coord: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  timezone: z.number(),
  name: z.string(),
});

export const ApiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
});

export const ApiResponseSchema = z.union([ApiSuccessResponseSchema, ApiErrorResponseSchema]);

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof UserSchema>;
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
export type ApiSuccessResponse<T = any> = {
  success: true;
  data: T;
};
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export const ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_ZIP_CODE: 'INVALID_ZIP_CODE',
  WEATHER_API_ERROR: 'WEATHER_API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export type AppRouter = any; 