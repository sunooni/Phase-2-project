const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { validatePhone, normalizePhone } = require('../utils/phoneValidator');

class AuthService {
  static async register({ name, email, phone, password }) {
    if ((!email && !phone) || !password) {
      throw new Error('email or phone and password are required');
    }

    let normalizedPhone = null;
    if (phone) {
      if (!validatePhone(phone)) {
        throw new Error('Invalid phone number format');
      }
      normalizedPhone = normalizePhone(phone);
    }

    const hashpass = await bcrypt.hash(password, 10);

    const whereCondition = [];
    if (email) whereCondition.push({ email });
    if (normalizedPhone) whereCondition.push({ phone: normalizedPhone });

    const existingUser = await User.findOne({
      where: {
        [Op.or]: whereCondition,
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('this email is taken');
      }
      if (existingUser.phone === normalizedPhone) {
        throw new Error('this phone is taken');
      }
    }

    const userData = { name, hashpass };
    if (email) userData.email = email;
    if (normalizedPhone) userData.phone = normalizedPhone;

    const user = await User.create(userData);

    const plainUser = user.get();
    delete plainUser.hashpass;
    return plainUser;
  }

  static async login({ email, phone, password }) {
    if (!email && !phone) {
      throw new Error('Email or phone is required');
    }

    const whereCondition = {};
    if (email) {
      whereCondition.email = email;
    } else if (phone) {
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        throw new Error('Invalid phone number format');
      }
      whereCondition.phone = normalizedPhone;
    }

    const user = await User.findOne({ where: whereCondition });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.hashpass);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const plainUser = user.get();
    delete plainUser.hashpass;
    return plainUser;
  }
}

module.exports = AuthService;
