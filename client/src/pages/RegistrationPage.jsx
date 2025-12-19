import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";

export default function RegisterPage({ registerHandler }) {
  const [isLoading, setIsLoading] = useState(false);
  const [contactType, setContactType] = useState("email"); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await registerHandler(e);
    setIsLoading(false);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "calc(100vh - 72px)" }}
    >
      <div className="register-card shadow-lg border-0 animate__animated animate__fadeInUp">
        <div
          className="card-header text-white text-center py-5"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            minHeight: "220px",
          }}
        >
          <div className="user-icon mb-3">
            <i className="fas fa-user-plus fa-3x"></i>
          </div>
          <h2 className="mb-0 fw-bold">Присоединяйтесь к нам!</h2>
          <p className="mb-0 opacity-75 mt-2">Создайте аккаунт</p>
        </div>
        <div className="card-body p-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4 position-relative">
              <Form.Label className="form-label fw-semibold text-muted">
                <i className="fas fa-user me-2"></i>Имя
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="fas fa-user text-success"></i>
                </span>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Введите имя"
                  className="form-control shadow-sm focus-ring"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4 position-relative">
              <Form.Label className="form-label fw-semibold text-muted">
                <i
                  className={`fas ${
                    contactType === "email" ? "fa-envelope" : "fa-phone"
                  } me-2`}
                ></i>
                Контактные данные
              </Form.Label>

              <div className="mb-2">
                <Form.Check
                  type="radio"
                  id="contact-email"
                  name="contactType"
                  label="Email"
                  checked={contactType === "email"}
                  onChange={() => setContactType("email")}
                  inline
                />
                <Form.Check
                  type="radio"
                  id="contact-phone"
                  name="contactType"
                  label="Телефон"
                  checked={contactType === "phone"}
                  onChange={() => setContactType("phone")}
                  inline
                />
              </div>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i
                    className={`fas ${
                      contactType === "email" ? "fa-envelope" : "fa-phone"
                    } text-success`}
                  ></i>
                </span>
                {contactType === "email" ? (
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Введите email"
                    className="form-control shadow-sm focus-ring"
                    required
                  />
                ) : (
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+7 (999) 123-45-67"
                    className="form-control shadow-sm focus-ring"
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
                <span className="input-group-text bg-white">
                  <i className="fas fa-lock text-success"></i>
                </span>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Создайте пароль"
                  className="form-control shadow-sm focus-ring"
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-lg fw-bold shadow-lg btn-gradient-success py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Регистрация...
                </>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </Form>
        </div>
        <div className="card-footer bg-light text-center py-4">
          <small className="text-muted">
            Уже есть аккаунт?{" "}
            <a
              href="/login"
              className="text-success fw-semibold text-decoration-none"
            >
              Войти
            </a>
          </small>
        </div>
      </div>
    </Container>
  );
}
