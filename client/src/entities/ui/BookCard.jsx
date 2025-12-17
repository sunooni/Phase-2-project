import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";

function ContentCard({ book, user, deleteHandler}) {
  return (
    <>
      <Card className="mb-2" style={{ width: "20rem" }}>
        <Card.Img variant="top" src={book.image} />
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <Card.Title>{book.author}</Card.Title>
          
         <Button>Подробнее</Button>
          <Button variant="info" >В избранное</Button>
          {user?.id === book.userId && (
            <>
            
              <Button variant="danger" onClick={() => deleteHandler(book.id)}>
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
