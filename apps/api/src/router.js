"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const users_1 = require("./routers/users");
exports.appRouter = (0, trpc_1.router)({
    users: users_1.usersRouter,
});
