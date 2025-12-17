import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router";

export default function CustomNavbar({ user, logoutHandler }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Главная
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/registration">
                  Зарегистрироваться
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Войти
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav>
              <Nav.Link as={Link} to="/books/myFavorite">Избранное</Nav.Link>
              <Nav.Link onClick={logoutHandler}>Выйти</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
