import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LoginPage({ loginHandler, sendOtpHandler, verifyOtpHandler }) {
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
    <Container
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      <div className="login-card shadow-lg border-0 animate__animated animate__fadeInUp">
        <div
          className="card-header text-white text-center py-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: 150,
          }}
        >
          <h3 className="mb-0 fw-bold">
            <i className="fas fa-sign-in-alt me-2"></i>
            {t("login.login")}
          </h3>
        </div>

        <div className="card-body p-4">
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label fw-semibold text-muted">
                Данные для входа
              </Form.Label>

              <div className="mb-2">
                <Form.Check
                  inline
                  type="radio"
                  id="login-email"
                  name="loginType"
                  label="Email"
                  checked={loginType === "email"}
                  onChange={() => setLoginType("email")}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="login-phone-otp"
                  name="loginType"
                  label={t("login.phoneLabel")}
                  checked={loginType === "phone-otp"}
                  onChange={() => setLoginType("phone-otp")}
                />
              </div>

              {loginType === "email" && (
                <>
                  <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-envelope text-primary"></i>
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder={t("login.emailPlaceholder")}
                      className="form-control-lg border-start-0"
                      required
                    />
                  </div>
                  <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-lock text-primary"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder={t("login.passwordPlaceholder")}
                      className="form-control-lg border-start-0"
                      required
                    />
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 btn-lg fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? t("login.loading") : t("login.login")}
                  </Button>
                </>
              )}

              {loginType === "phone-otp" && (
                <>
                  <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-phone text-primary"></i>
                    </span>
                    <input
                      type="tel"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      className="form-control form-control-lg border-start-0"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary ms-2"
                      onClick={handleSendOtp}
                      disabled={isLoading || countdown > 0}
                    >
                      {countdown > 0
                        ? `Отправить снова ${countdown}s`
                        : t("login.sendCode")}
                    </button>
                  </div>
                  {otpSent && (
                    <div className="input-group input-group-lg mb-3">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="fas fa-key text-primary"></i>
                      </span>
                      <input
                        type="text"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        placeholder={t("login.codePlaceholder")}
                        className="form-control form-control-lg border-start-0"
                      />
                      <button
                        type="button"
                        className="btn btn-primary ms-2"
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                      >
                        {t("login.login")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </Form.Group>
          </Form>
        </div>

        <div className="card-footer bg-light text-center py-3">
          <small className="text-muted">
            {t("login.noAccount")}{" "}
            <a
              href="/registration"
              className="text-primary fw-semibold text-decoration-none"
            >
              {t("login.register")}
            </a>
          </small>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
