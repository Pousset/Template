export type UserRole = 'user' | 'admin';
export declare class User {
    id: string;
    username: string | null;
    email: string | null;
    passwordHash: string | null;
    googleId: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
