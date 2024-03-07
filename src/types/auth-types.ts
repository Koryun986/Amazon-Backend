export type UserType = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export type LoginUserType = Omit<UserType, "first_name" | "last_name">;