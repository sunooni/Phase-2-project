const AuthController = require('../controller/auth.controller');
const OtpController = require('../controller/auth.otp.controller');

const authRouter = require('express').Router();

authRouter.post('/registration', AuthController.registration);
authRouter.post('/login', AuthController.login);
authRouter.post('/send-otp', OtpController.sendOtp);
authRouter.post('/verify-otp', OtpController.verifyOtp);
authRouter.get('/refresh', AuthController.refresh);
authRouter.delete('/logout', AuthController.logout);

module.exports = authRouter;
