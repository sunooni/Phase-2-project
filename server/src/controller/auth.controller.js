const cookieConfig = require('../config/cookie.config');
const AuthService = require('../services/auth.service');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

class AuthController {
  static async registration(req, res) {
    try {
      console.log('Registration data received:', req.body);
      const data = req.body;
      const user = await AuthService.register(data);

      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken: oldRefreshToken } = req.cookies;
      const { user } = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { accessToken, refreshToken } = generateTokens({ user });
      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (err) {
      console.log(err);
      res.sendStatus(401);
    }
  }

  static logout = async (req, res) => {
    res.clearCookie('refreshToken').sendStatus(204);
  };

  static login = async (req, res) => {
    try {
      const user = await AuthService.login(req.body);

      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ user, accessToken });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };
}

module.exports = AuthController;
