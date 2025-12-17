import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

function ContentCard({ news, user, deleteHandler}) {
  return (
    <>
      <Card className="mb-2" style={{ width: "20rem" }}>
        <Card.Img variant="top" src={news.imageUrl} />
        <Card.Body>
          <Card.Title>{news.title}</Card.Title>
          <Card.Text>{news.content}</Card.Text>
          <Button>Подробнее</Button>
          {user?.id === news.userId && (
            <>
              <Button variant="danger" onClick={() => deleteHandler(news.id)}>
                Удалить
              </Button>
              <Button variant="warning" >Изменить</Button>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default ContentCard;
