import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/user-dto";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/envirenmentVariables";

class TokenService {
    async generateTokens(userDto: UserDto) {
        const accessToken = jwt.sign(userDto, JWT_ACCESS_SECRET!, { expiresIn: "30m" });
        const refreshToken = jwt.sign(userDto, JWT_REFRESH_SECRET!, { expiresIn: "30d" });
        return {
            accessToken,
            refreshToken
        };
    }
}

export default new TokenService();