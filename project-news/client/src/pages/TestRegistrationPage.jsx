import { Button, Container, Form, FormControl, Row } from "react-bootstrap";

export default function RegisterPage({ registerHandler }) {
  return (
    <Container>
      <h1>Регистрация</h1>
      <Form onSubmit={registerHandler}>
        <FormControl type="text" name="name" placeholder="Введите имя" />
        <FormControl type="email" name="email" placeholder="Введите email"/>
        <FormControl type="password" name="password" placeholder="Введите пароль"/>
        <Button type="submit">Зарегистрироваться</Button>
      </Form>
    </Container>
  );
}