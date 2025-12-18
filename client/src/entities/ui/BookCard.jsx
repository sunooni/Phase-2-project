import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router";
import axiosinstance from "../../shared/axiosinstance";

function BookCard({ book, user, deleteHandler, isFavoritePage = false }) {
  const navigate = useNavigate();

  const addToFavorites = async () => {
    await axiosinstance.post("/favorites", { bookId: book.id });
    navigate("/favorites");
  };

  const handleDetails = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <>
      <Card className="mb-2" style={{ width: "20rem" }}>
        <Card.Img variant="top" src={book.image} />
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {book.author}
          </Card.Subtitle>
          {book.genre && (
            <div className="mb-2">
              <span className="badge bg-secondary">{book.genre}</span>
            </div>
          )}

          <Button onClick={handleDetails}>Подробнее</Button>
          {user && !isFavoritePage && (
            <Button variant="info" onClick={addToFavorites}>
              ⭐ В избранное
            </Button>
          )}

          {isFavoritePage && deleteHandler && (
            <Button
              variant="danger"
              onClick={() => {
                deleteHandler(book.favoriteId);
              }}
            >
              Удалить из избранного
            </Button>
          )}
          {user?.id === book.userId && !isFavoritePage && (
            <>
              <Button variant="danger" onClick={() => deleteHandler(book.id)}>
                Удалить
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default BookCard;
