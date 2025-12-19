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
          // prevent infinite onError loop and use embedded SVG placeholder
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#888">Обложка</text></svg>'
            );
        }}
      />
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-subtitle">{book.author}</p>

        {/* Жанры */}
        {(book.genre || book.genres) && (
          <div className="meta-row mb-2">
            {Array.isArray(book.genres) ? (
              book.genres.map((g, i) => (
                <span key={i} className="badge badge-secondary">
                  {g}
                </span>
              ))
            ) : (
              <span className="badge badge-secondary">{book.genre}</span>
            )}
          </div>
        )}

        {/* Рейтинг звездочками */}
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
            <div className="rating-row mb-3">
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
                        style={{ color: "#f1c40f", marginRight: 2 }}
                      ></i>
                    );
                  if (s === "half")
                    return (
                      <i
                        key={idx}
                        className="fas fa-star-half-alt"
                        style={{ color: "#f1c40f", marginRight: 2 }}
                      ></i>
                    );
                  return (
                    <i
                      key={idx}
                      className="far fa-star"
                      style={{ color: "#dcdcdc", marginRight: 2 }}
                    ></i>
                  );
                })}
                <span
                  className="rating-text ms-2 text-muted"
                  style={{ fontSize: "0.85rem" }}
                >
                  {r.toFixed(1)}
                </span>
              </span>
            </div>
          );
        })()}
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
