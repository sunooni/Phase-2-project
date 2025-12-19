import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function LoginPage({ loginHandler }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await loginHandler(e);
    setIsLoading(false);
  };

  return (
    <Container className="auth-container">
      <div className="login-card shadow-lg border-0 animate__animated animate__fadeInUp">
        <div
          className="card-header text-white text-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "120px",
          }}
        >
          <h3 className="mb-0 fw-bold">
            <i className="fas fa-sign-in-alt me-2"></i>
            Вход в аккаунт
          </h3>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4 position-relative">
              <Form.Label className="form-label fw-semibold text-muted">
                <i
                  className={`fas ${
                    loginType === "email" ? "fa-envelope" : "fa-phone"
                  } me-2`}
                ></i>
                Данные для входа
              </Form.Label>

              {/* Переключатель типа входа */}
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
                  id="login-phone"
                  name="loginType"
                  label="Телефон"
                  checked={loginType === "phone"}
                  onChange={() => setLoginType("phone")}
                  inline
                />
              </div>

              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"></span>
                {loginType === "email" ? (
                  <Form.Control
                    type="email"
                    placeholder="Введите email"
                    name="email"
                    className="form-control border-start-0 shadow-sm focus-ring"
                    required
                  />
                ) : (
                  <Form.Control
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    name="phone"
                    className="form-control border-start-0 shadow-sm focus-ring"
                    pattern="[+]?[0-9\s\-\(\)]+"
                    required
                  />
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-4 position-relative">
              <Form.Label className="form-label fw-semibold text-muted">
                <i className="fas fa-lock me-2"></i>Пароль
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"></span>
                <Form.Control
                  type="password"
                  placeholder="Введите пароль"
                  name="password"
                  className="form-control border-start-0 shadow-sm focus-ring"
                  required
                />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 btn-lg fw-bold shadow-lg btn-gradient-primary py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </Form>
        </div>
        <div className="card-footer bg-light text-center">
          <small className="text-muted">
            Нет аккаунта?{" "}
            <a
              href="/registration"
              className="text-primary fw-semibold text-decoration-none"
            >
              Зарегистрироваться
            </a>
          </small>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
