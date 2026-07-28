import { userRepository } from "@/repositories/user.repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  setTokenCookies,
  clearTokenCookies,
  getRefreshTokenFromCookie,
  type TokenPayload,
} from "@/lib/auth";
import { AppError } from "@/lib/errors";
import bcrypt from "bcryptjs";

interface LoginInput {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: "ADMIN" | "EDITOR";
    avatar: string | null;
  };
}

export class AuthService {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { username, password } = input;

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw AppError.unauthorized("نام کاربری یا رمز عبور اشتباه است");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw AppError.unauthorized("نام کاربری یا رمز عبور اشتباه است");
    }

    const tokenPayload: Omit<TokenPayload, "iat" | "exp" | "iss"> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload),
    ]);

    await setTokenCookies(accessToken, refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role as "ADMIN" | "EDITOR",
        avatar: user.avatar,
      },
    };
  }

  async logout(): Promise<void> {
    await clearTokenCookies();
  }

  async getCurrentUser(userId: string): Promise<AuthResponse["user"]> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role as "ADMIN" | "EDITOR",
      avatar: user.avatar,
    };
  }

  async refreshSession(): Promise<AuthResponse> {
    const refreshToken = await getRefreshTokenFromCookie();
    if (!refreshToken) {
      throw AppError.unauthorized("No refresh token found");
    }

    const payload = await verifyToken(refreshToken);

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw AppError.unauthorized("User not found");
    }

    const tokenPayload: Omit<TokenPayload, "iat" | "exp" | "iss"> = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, newRefreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload),
    ]);

    await setTokenCookies(accessToken, newRefreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role as "ADMIN" | "EDITOR",
        avatar: user.avatar,
      },
    };
  }
}

export const authService = new AuthService();
