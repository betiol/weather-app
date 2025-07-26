export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {};
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    users: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {};
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
                code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                httpStatus: number;
                path?: string;
                stack?: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        getAll: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {};
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
                        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                        httpStatus: number;
                        path?: string;
                        stack?: string;
                    };
                    message: string;
                    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _ctx_out: {};
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: object;
        }, {
            name: string;
            zipCode: string;
            id: string;
            latitude: number;
            longitude: number;
            timezone: string;
            createdAt: string;
            updatedAt: string;
        }[]>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {};
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
                        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                        httpStatus: number;
                        path?: string;
                        stack?: string;
                    };
                    message: string;
                    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {};
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            name: string;
            zipCode: string;
            id: string;
            latitude: number;
            longitude: number;
            timezone: string;
            createdAt: string;
            updatedAt: string;
        }>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {};
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
                        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                        httpStatus: number;
                        path?: string;
                        stack?: string;
                    };
                    message: string;
                    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {};
            _input_in: {
                name: string;
                zipCode: string;
            };
            _input_out: {
                name: string;
                zipCode: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            name: string;
            zipCode: string;
            id: string;
            latitude: number;
            longitude: number;
            timezone: string;
            createdAt: string;
            updatedAt: string;
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {};
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
                        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                        httpStatus: number;
                        path?: string;
                        stack?: string;
                    };
                    message: string;
                    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {};
            _input_in: {
                id: string;
                name?: string | undefined;
                zipCode?: string | undefined;
            };
            _input_out: {
                id: string;
                name?: string | undefined;
                zipCode?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            name: string;
            zipCode: string;
            id: string;
            latitude: number;
            longitude: number;
            timezone: string;
            createdAt: string;
            updatedAt: string;
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {};
                meta: object;
                errorShape: {
                    data: {
                        zodError: import("zod").typeToFlattenedError<any, string> | null;
                        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_KEY;
                        httpStatus: number;
                        path?: string;
                        stack?: string;
                    };
                    message: string;
                    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
                };
                transformer: import("@trpc/server").DefaultDataTransformer;
            }>;
            _meta: object;
            _ctx_out: {};
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
        }>;
    }>;
}>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=router.d.ts.map