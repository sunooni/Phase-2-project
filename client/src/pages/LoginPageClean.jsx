import React, { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function LoginPageClean({
  loginHandler,
  sendOtpHandler,
  verifyOtpHandler,
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");

  const [phoneValue, setPhoneValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let t;
    if (countdown > 0) t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneValue) return alert(t("login.enterPhone"));
    setIsLoading(true);
    try {
      await sendOtpHandler(phoneValue);
      setOtpSent(true);
      setCountdown(60);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!phoneValue || !codeValue) return alert(t("login.enterPhoneAndCode"));
    setIsLoading(true);
    try {
      await verifyOtpHandler({ phone: phoneValue, code: codeValue });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <div className="register-card shadow-lg border-0 animate__animated animate__fadeInUp">
        <div
          className="card-header text-white text-center"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            padding: "1.5rem",
          }}
        >
          <div className="user-icon mb-3">
            <i className="fas fa-sign-in-alt fa-2x"></i>
          </div>
          <h2 className="mb-0 fw-bold">{t("login.login")}</h2>
          <p className="mb-0 opacity-75 mt-2">{t("login.login")}</p>
        </div>

        <div className="card-body">
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group className="mb-4 position-relative">
              <Form.Label className="form-label fw-semibold text-muted">
                <i
                  className={`fas ${
                    loginType === "email" ? "fa-envelope" : "fa-phone"
                  } me-2`}
                ></i>
                {t("login.noAccount")}
              </Form.Label>

              <div className="mb-2">
                <Form.Check
                  type="radio"
                  id="login-email"
                  name="loginType"
                  label="Email"
                  checked={loginType === "email"}
                  onChange={() => setLoginType("email")}
                  inline
                />
                <Form.Check
                  type="radio"
                  id="login-phone-otp"
                  name="loginType"
                  label={t("login.phoneLabel")}
                  checked={loginType === "phone-otp"}
                  onChange={() => setLoginType("phone-otp")}
                  inline
                />
              </div>

              {loginType === "email" ? (
                <div className="input-group">
                  <span className="input-group-text bg-white"></span>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder={t("login.emailPlaceholder")}
                    className="form-control shadow-sm focus-ring"
                    required
                  />
                </div>
              ) : (
                <div className="input-group">
                  <span className="input-group-text bg-white"></span>
                  <input
                    type="tel"
                    name="phone"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    placeholder={t("login.phoneExample")}
                    className="form-control shadow-sm focus-ring"
                    pattern="[+]?[0-9\s\-\(\)]+"
                    required
                  />
                </div>
              )}
            </Form.Group>

            {loginType === "email" && (
              <Form.Group className="mb-4 position-relative">
                <Form.Label className="form-label fw-semibold text-muted">
                  <i className="fas fa-lock me-2"></i>
                  {t("login.passwordPlaceholder")}
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white"></span>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder={t("login.passwordPlaceholder")}
                    className="form-control shadow-sm focus-ring"
                    required
                  />
                </div>
              </Form.Group>
            )}

            {loginType === "phone-otp" && (
              <div className="mb-3">
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-outline-success me-2"
                    onClick={handleSendOtp}
                    disabled={isLoading || countdown > 0}
                  >
                    {countdown > 0
                      ? t("login.resend", { seconds: countdown })
                      : t("login.sendCode")}
                  </button>
                  {otpSent && (
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        placeholder={t("login.codePlaceholder")}
                        className="form-control"
                      />
                    </div>
                  )}
                  {otpSent && (
                    <button
                      type="button"
                      className="btn btn-success ms-2"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                    >
                      {t("login.login")}
                    </button>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-100 btn-lg fw-bold shadow-lg btn-gradient-success py-3"
              disabled={isLoading}
              onClick={(e) => loginType === "phone-otp" && e.preventDefault()}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {t("login.loading")}
                </>
              ) : loginType === "email" ? (
                t("login.login")
              ) : (
                t("login.useSms")
              )}
            </Button>
          </Form>
        </div>

        <div className="card-footer bg-light text-center">
          <small className="text-muted">
            {t("login.noAccount")}{" "}
            <a
              href="/registration"
              className="text-success fw-semibold text-decoration-none"
            >
              {t("login.register")}
            </a>
          </small>
        </div>
      </div>
    </Container>
  );
}
