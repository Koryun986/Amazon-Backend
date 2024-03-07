import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/user-dto";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/envirenmentVariables";

class TokenService {
    generateTokens(userDto: UserDto) {
        const accessToken = jwt.sign(userDto, JWT_ACCESS_SECRET!, { expiresIn: "30m" });
        const refreshToken = jwt.sign(userDto, JWT_REFRESH_SECRET!, { expiresIn: "30d" });
        return {
            accessToken,
            refreshToken
        };
    }

    validateRefreshToken(refreshToken: string) {
        try {
            const userDto = jwt.verify(refreshToken, JWT_REFRESH_SECRET!);
            return userDto;
        } catch (e) {
            return null;
        }
    }

    validateAccessToken(accessToken: string) {
        try {            
            const userDto = jwt.verify(accessToken, JWT_ACCESS_SECRET!);
            return userDto;
        } catch (e) {
            return null;
        }
    }
}

export default new TokenService();