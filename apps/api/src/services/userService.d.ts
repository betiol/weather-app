import type { User, CreateUser, UpdateUser } from '@weather/shared-types';
export declare class UserService {
    static createUser(userData: CreateUser): Promise<User>;
    static getAllUsers(): Promise<User[]>;
    static getUserById(id: string): Promise<User | null>;
    static updateUser(updateData: UpdateUser): Promise<User>;
    static deleteUser(id: string): Promise<void>;
}
//# sourceMappingURL=userService.d.ts.map