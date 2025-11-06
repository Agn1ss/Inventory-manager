import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client.js";

class TokenService {
  generateToken(payload) {
    if (!payload) throw new Error("Payload is required for token generation");

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "60m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const existingToken = await prisma.token.findUnique({ where: { userId } });

    if (existingToken) {
      return await prisma.token.update({
        where: { userId },
        data: { refreshToken },
      });
    }

    return await prisma.token.create({
      data: { userId, refreshToken },
    });
  }



  async removeToken(refreshToken) {
    const tokenData = await prisma.token.deleteMany({ where: { refreshToken } });
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const tokenData = await prisma.token.findFirst({ where: { refreshToken } });
    return tokenData;
  }
}

const tokenService = new TokenService();
export default tokenService;
