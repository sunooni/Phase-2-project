import React from 'react';
import { Container, Button, Form, FormControl } from 'react-bootstrap';

export default function BookPage() {
  return (
    <Container>
        <h1>Страница одной книги</h1>
      <Form className="d-flex">
        <FormControl type="text" placeholder="Введите текст" />
        <Button type="submit" variant="primary">ff</ Button>
      </Form>
    </Container>
  );
}
