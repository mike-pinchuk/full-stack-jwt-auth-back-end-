const db = require("../models/index.js");
const User = db.users;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail.service.js");
const tokenService = require("./token.service.js");
const UserDto = require("../dto/user.dto.js");
const ApiError = require("../exceptions/api.error.js");

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ where: { email } });
    if (!candidate) {
      const hashPassword = await bcrypt.hash(password, 3);
      const activation_link = uuid.v4();
      const user = await User.create({
        email,
        password: hashPassword,
        activation_link,
      });

      // /* THIS STUFF DOESN'T WORK. ---CHECK IT----
      // await mailService.sendActivationMail(
      //   email,
      //   `${process.env.API_URL}/api/activate/${activation_link}`
      // );
      // */
      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });

      await tokenService.saveToken(userDto.id, tokens.refresToken);

      return {
        ...tokens,
        user: userDto,
      };
    }
    throw ApiError.BadRequest(`User with the email: ${email} already exists`);
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("User with this email doen't exist");
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest("Wrong credentials");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await User.update(
      {
        refresh_token: null,
      },
      {
        where: { refresh_token: refreshToken },
      }
    );
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await User.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refresToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }
}

module.exports = new UserService();
