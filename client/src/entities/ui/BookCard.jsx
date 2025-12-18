import React from "react";
import { useNavigate } from "react-router";
import axiosinstance from "../../shared/axiosinstance";

function BookCard({ book, user, deleteHandler, isFavoritePage = false }) {
  const navigate = useNavigate();

  const addToFavorites = async () => {
    try {
      await axiosinstance.post("/favorites", { bookId: book.id });
      navigate("/favorites");
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      alert(error.response?.data?.message || 'Не удалось добавить книгу в избранное');
    }
  };

  const handleDetails = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="book-card">
      <img 
        src={book.image} 
        alt={book.title}
        className="book-card-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x400?text=Обложка';
        }}
      />
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-subtitle">{book.author}</p>
        {book.genre && (
          <div className="mb-2">
            <span className="badge badge-secondary">{book.genre}</span>
          </div>
        )}
        <div className="book-card-actions">
          <button className="btn btn-primary" onClick={handleDetails}>
            Подробнее
          </button>
          {user && !isFavoritePage && (
            <button className="btn btn-info" onClick={addToFavorites}>
              ⭐ В избранное
            </button>
          )}
          {isFavoritePage && deleteHandler && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (book.favoriteId) {
                  deleteHandler(book.favoriteId);
                }
              }}
            >
              Удалить из избранного
            </button>
          )}
          {user?.id === book.userId && !isFavoritePage && (
            <button 
              className="btn btn-danger" 
              onClick={() => deleteHandler(book.id)}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
