import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ContentCard from "../entities/ui/ContentCard";
import axios from "axios";
import axiosinstance from "../shared/axiosinstance";
import AuthorPage from "./AuthorPage";

export default function HomePage({ user }) {
  const [contents, setContents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    fetch("/api/contents")
      .then((res) => res.json())
      .then((data) => setContents(data));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const response = await axios.post("/api/contents", data);
    setContents([...contents, response.data]);
  };

  const deleteHandler = async (id) => {
    await axiosinstance.delete(`contents/${id}`);
    setContents(contents.filter((el) => el.id !== id));
  };

  
  return (
    <Container>
      {!user ? (
        <h1 style={{ textAlign: "center" }}>Новости дня</h1>
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>Добро пожаловать {user.name}</h1>

          <Button onClick={() => setShowForm(!showForm)}>
            Создать свою новость
          </Button>
          {showForm && (
            <Form onSubmit={submitHandler}>
              Название темы
              <Form.Control type="text" name="title" />
              Контент
              <Form.Control type="text" name="content" />
              <Button type="submit">Создать</Button>
            </Form>
          )}
        </div>
      )}

      <Row>
        {contents.map((content) => (
          <Col sm={3} key={content.id}>
            <ContentCard
              news={content}
              user={user}
              deleteHandler={deleteHandler}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
