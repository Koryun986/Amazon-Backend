import bcrypt from "bcrypt";
import uuid from "uuid";
import { User } from "../database/models/user";
import type { UserType } from "../types/auth-types";

class AuthService {
    async createUser(user: UserType) {
        const hashedPassword = await this.hashPassword(user.password);
        await User.create({...user, password: hashedPassword, is_verfied: false});
        const activationLink = uuid.v4();
    }

    private async hashPassword(password: string) {
        return await bcrypt.hash(password, 3);
    }
}