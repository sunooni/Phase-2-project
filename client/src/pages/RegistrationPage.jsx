import { Button, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";

export default function RegisterPage({ registerHandler }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await registerHandler(e);
    setIsLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
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
            <Row>
              <div className="col-md-6 mb-4">
                <Form.Group className="position-relative">
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
              </div>
              <div className="col-md-6 mb-4">
                <Form.Group className="position-relative">
                  <Form.Label className="form-label fw-semibold text-muted">
                    <i className="fas fa-envelope me-2"></i>Email
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-envelope text-success"></i>
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Введите email"
                      className="form-control shadow-sm focus-ring"
                      required
                    />
                  </div>
                </Form.Group>
              </div>
            </Row>

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
