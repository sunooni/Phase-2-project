import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ContentCard from "../entities/ui/BookCard";
import axios from "axios";
import axiosinstance from "../shared/axiosinstance";

export default function HomePage({ user }) {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const response = await axios.post("/api/books", data);
    setBooks([...books, response.data]);
  };

  const deleteHandler = async (id) => {
    await axiosinstance.delete(`books/${id}`);
    setBooks(books.filter((el) => el.id !== id));
  };

  return (
    <Container>
      {!user ? (
        <h1 style={{ textAlign: "center" }}>
          Добро пожаловать в книжный уголок
        </h1>
      ) : (
        <div>
          <h2 style={{ textAlign: "center" }}>Личный кабинет {user.name}</h2>

          <Button onClick={() => setShowForm(!showForm)}>
            +Добавить книгу
          </Button>
          {showForm && (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Название книги</Form.Label>
                <Form.Control type="text" name="title" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Автор книги</Form.Label>
                <Form.Control type="text" name="author" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Краткое описание книги</Form.Label>
                <Form.Control type="text" name="descriptions" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Личные комментарии</Form.Label>
                <Form.Control type="text" name="comment" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фото обложки</Form.Label>
                <Form.Control type="file" name="cover" accept="image/*" />
              </Form.Group>
              <Button type="submit">Создать</Button>
            </Form>
          )}
        </div>
      )}

      <Row>
        {books.map((book) => (
          <Col sm={3} key={book.id}>
            <ContentCard
              book={book}
              user={user}
              deleteHandler={deleteHandler}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
