import { config } from "dotenv";
import jwt from "jsonwebtoken"
config()

class JwtService {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }
  generateTokens(payload) {

    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

export default {
  UserJwt: new JwtService(
    process.env.user_access_key,
    process.env.user_refresh_key,
    "10h",
    "7d"
  )
}