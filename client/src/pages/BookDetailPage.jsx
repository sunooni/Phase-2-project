import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosinstance from "../shared/axiosinstance";
import "../styles/modal.css";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axiosinstance.get(`/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        console.error("Ошибка при загрузке книги:", err);
        setError("Не удалось загрузить информацию о книге.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="loading">Загрузка</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container py-4 text-center">
        <h2>{error || "Книга не найдена"}</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Вернуться на главную
        </button>
      </div>
    );
  }

  const renderStars = (rating, isInteractive = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: isInteractive ? "pointer" : "default",
            color: i <= rating ? "#ffc107" : "#e0e0e0",
            fontSize: "24px",
            marginRight: "5px",
          }}
          onClick={() => isInteractive && setUserRating(i)}
          onMouseEnter={() => isInteractive && setHoverRating(i)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container py-4 fade-in">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Назад
      </button>
      
      <div className="row">
        <div className="col-md-4">
          <div className="book-detail-image">
            <img
              src={book.image}
              alt={`Обложка книги ${book.title}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=Обложка';
              }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <h1>{book.title}</h1>
          <h2 style={{ color: '#777', fontStyle: 'italic' }}>{book.author}</h2>
          {book.genre && (
            <div className="mb-3">
              <span className="badge badge-secondary">{book.genre}</span>
            </div>
          )}

          <div className="mb-3">
            <p>
              Оцени книгу: {renderStars(hoverRating || userRating)}
              {userRating > 0 && <span> ({userRating}/5)</span>}
            </p>
          </div>

          <div className="book-detail-actions mb-3">
            <button
              className="btn btn-info"
              onClick={() => setShowReadModal(true)}
            >
              📖 Читать
            </button>
            <button className="btn btn-info">
              ⬇ Скачать
            </button>
          </div>

          <form className="review-form" onSubmit={(e) => {
            e.preventDefault();
            alert('Отзыв отправлен!');
          }}>
            <input
              className="form-control"
              type="text"
              placeholder="Понравилась книга? Оставь отзыв!"
            />
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </form>
        </div>
      </div>

      {showReadModal && (
        <div className="modal-overlay" onClick={() => setShowReadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{book.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {book.description ? (
                <div dangerouslySetInnerHTML={{ __html: book.description }} />
              ) : (
                <p>Описание недоступно</p>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowReadModal(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
