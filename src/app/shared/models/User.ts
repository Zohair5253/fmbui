import { Person } from './Person';

export class User extends Person {
    userId?: string;
    // itsId: string;
    username: string;
    password: string;
    role: string;
    isActive: boolean;
    token?: string;
}