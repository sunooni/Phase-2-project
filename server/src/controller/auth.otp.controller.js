const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const { validatePhone, normalizePhone } = require('../utils/phoneValidator');

// Простое временное хранилище OTP. В проде замените на Redis.
const otpStore = new Map();

function genCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Удаление просроченных записей (каждую минуту)
setInterval(() => {
  const now = Date.now();
  for (const [phone, rec] of otpStore.entries()) {
    if (rec.expires < now) otpStore.delete(phone);
  }
}, 60 * 1000);

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!validatePhone(phone)) return res.status(400).json({ message: 'Invalid phone' });
    const normalized = normalizePhone(phone);
    const code = genCode();
    otpStore.set(normalized, { code, expires: Date.now() + 5 * 60 * 1000 });
    // TODO: интегрировать SMS-провайдера (Twilio и т.д.) вместо console.log
    console.log(`OTP for ${normalized}: ${code}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('sendOtp error', err);
    return res.status(500).json({ message: 'Internal error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!validatePhone(phone)) return res.status(400).json({ message: 'Invalid phone' });
    const normalized = normalizePhone(phone);
    const record = otpStore.get(normalized);
    if (!record || record.code !== String(code) || record.expires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired code' });
    }
    // OTP валиден — удаляем запись
    otpStore.delete(normalized);
    // Найти или создать пользователя
    let user = await User.findOne({ where: { phone: normalized } });
    if (!user) {
      user = await User.create({ phone: normalized, name: `user_${Date.now()}` });
    }
    const plainUser = user.get();
    delete plainUser.hashpass;
    const { accessToken, refreshToken } = generateTokens({ user: plainUser });
    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .json({ user: plainUser, accessToken });
  } catch (err) {
    console.error('verifyOtp error', err);
    return res.status(500).json({ message: 'Internal error' });
  }
};
