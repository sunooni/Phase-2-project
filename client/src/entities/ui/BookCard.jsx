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
      console.error("Ошибка при добавлении в избранное:", error);
      alert(
        error.response?.data?.message || "Не удалось добавить книгу в избранное"
      );
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
          e.target.src = "https://via.placeholder.com/300x400?text=Обложка";
        }}
      />
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-subtitle">{book.author}</p>

        {(book.genre || book.genres) && (
          <div className="meta-row">
            {Array.isArray(book.genres) ? (
              book.genres.map((g, i) => (
                <span key={i} className="badge badge-secondary">
                  {g}
                </span>
              ))
            ) : (
              <span className="badge badge-secondary">{book.genre}</span>
            )}

            {/* rating support: graphical stars (normalize to 0-5) */}
            {(() => {
              const raw =
                book.rating ??
                book.avgRating ??
                book.ratingAvg ??
                book.averageRating ??
                book.average_rating;
              if (raw === undefined || raw === null) return null;
              let r = Number(raw);
              if (isNaN(r)) return null;
              // normalize common 0-10 scales to 0-5
              if (r > 5 && r <= 10) r = r / 2;
              r = Math.max(0, Math.min(5, r));
              const full = Math.floor(r);
              const half = r - full >= 0.5 ? 1 : 0;
              const stars = [];
              for (let i = 0; i < 5; i++) {
                if (i < full) stars.push("full");
                else if (i === full && half) stars.push("half");
                else stars.push("empty");
              }
              return (
                <span
                  className="rating-stars d-inline-flex align-items-center"
                  title={`Рейтинг: ${r.toFixed(1)}`}
                >
                  {stars.map((s, idx) => {
                    if (s === "full")
                      return (
                        <i
                          key={idx}
                          className="fas fa-star"
                          style={{ color: "#f1c40f", marginRight: 4 }}
                        ></i>
                      );
                    if (s === "half")
                      return (
                        <i
                          key={idx}
                          className="fas fa-star-half-alt"
                          style={{ color: "#f1c40f", marginRight: 4 }}
                        ></i>
                      );
                    return (
                      <i
                        key={idx}
                        className="far fa-star"
                        style={{ color: "#dcdcdc", marginRight: 4 }}
                      ></i>
                    );
                  })}
                </span>
              );
            })()}
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
