const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.users;

class TokenService {
  generateTokens(payload) {
    const accesssToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "10s",
    });
    const refresToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "20s",
    });
    return {
      accesssToken,
      refresToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await User.findOne({ where: { id: userId } });
    if (tokenData) {
      await User.update(
        { refresh_token: refreshToken },
        { where: { id: userId } }
      );
    }
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
      return userData;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
