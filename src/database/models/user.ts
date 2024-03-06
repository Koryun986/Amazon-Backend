import { Model, DataType, InferAttributes, InferCreationAttributes, CreationOptional } from "@sequelize/core";
import { UserAttributes } from "../attributes/user-attributes";
export class User extends Model<UserAttributes> {
    
    declare id: number;

    first_name!: string;

    
    last_name!: string;

    email!: string;
    
    password!: string;
}