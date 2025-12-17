import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

function AuthorCard({ news, user, deleteHandler }) {
  return (
    <>
      <Card className="mb-2" style={{ width: "20rem" }}>
        <Card.Img variant="top" src={news.imageUrl} />
        <Card.Body>
          <Card.Title>{news.title}</Card.Title>
          <Card.Text>{news.content}</Card.Text>
          {user ? (
            <>
              <Button variant="warning" className="me-2">
                Редактировать
              </Button>
              <Button variant="danger" onClick={() => deleteHandler(news.id)}>
                Удалить
              </Button>
            </>
          ) : (
            <Button>Подробнее</Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default AuthorCard;
