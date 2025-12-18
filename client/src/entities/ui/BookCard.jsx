
import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router";
import axiosinstance from "../../shared/axiosinstance";

function BookCard({ book, user, deleteHandler, isFavoritePage = false}) {
  const navigate = useNavigate()

  const addToFavorites = async () => {
      try {
        await axiosinstance.post('/favorites', { bookId: book.id });
        navigate('/favorites');  
      } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
        alert(error.response?.data?.message || 'Не удалось добавить книгу в избранное');
      }
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
          <Card.Title>{book.author}</Card.Title>
          
          <Button onClick={handleDetails}>Подробнее</Button>
          {!isFavoritePage && (
            <Button variant="info" onClick={addToFavorites}>⭐ В избранное</Button>
          )}
          {isFavoritePage && deleteHandler && (
            <Button 
              variant="danger" 
              onClick={() => {
                if (!book.favoriteId) {
                  console.error('favoriteId не найден для книги:', book);
                  alert('Ошибка: не удалось определить ID избранного');
                  return;
                }
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
              <Button variant="warning">Изменить</Button>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default BookCard;
