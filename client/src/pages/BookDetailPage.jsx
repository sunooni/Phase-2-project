import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosinstance from "../shared/axiosinstance";
import "../styles/modal.css";

export default function BookDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Состояния для комментариев
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  // Новое состояние для модального окна
  const [showReadModal, setShowReadModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axiosinstance.get(`/books/${id}`);
        setBook(response.data);
        setComments(response.data.comments || []);

        // Проверяем, есть ли оценка текущего пользователя
        try {
          const userRatingResponse = await axiosinstance.get(
            `/books/${id}/user-rating`
          );
          if (userRatingResponse.data.rating) {
            setUserRating(userRatingResponse.data.rating);
            setHasRated(true);
          }
        } catch (userRatingError) {
          console.log("Пользователь еще не оценивал эту книгу");
        }

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

  const submitRating = async (rating) => {
    if (submittingRating || hasRated) return;

    try {
      setSubmittingRating(true);
      await axiosinstance.post(`/books/${id}/rating`, { rating });

      // Обновляем книгу после оценки
      const response = await axiosinstance.get(`/books/${id}`);
      setBook(response.data);
      setHasRated(true);

      alert(`Спасибо за оценку! Вы поставили ${rating} звезд.`);
    } catch (error) {
      console.error("Ошибка при отправке оценки:", error);
      alert("Не удалось отправить оценку. Попробуйте еще раз.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating, isInteractive = true) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            cursor: isInteractive && !hasRated ? "pointer" : "default",
            color: i <= rating ? "#ffc107" : "#e0e0e0",
            fontSize: "24px",
            marginRight: "5px",
            opacity: hasRated && isInteractive ? 0.7 : 1,
          }}
          onClick={() => {
            if (isInteractive && !hasRated) {
              setUserRating(i);
              submitRating(i);
            }
          }}
          onMouseEnter={() => isInteractive && !hasRated && setHoverRating(i)}
          onMouseLeave={() => isInteractive && !hasRated && setHoverRating(0)}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  // Функция для отображения текущего рейтинга книги
  const getCurrentRating = () => {
    const rating =
      book.rating ||
      book.avgRating ||
      book.averageRating ||
      book.average_rating;
    if (!rating) return 0;
    let r = Number(rating);
    if (isNaN(r)) return 0;
    // Нормализуем рейтинг к шкале 0-5
    if (r > 5 && r <= 10) r = r / 2;
    return Math.max(0, Math.min(5, r));
  };

  // Функции для работы с комментариями
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const response = await axiosinstance.post(`/books/${id}/comments`, {
        text: newComment.trim(),
      });

      setComments([response.data, ...comments]);
      setNewComment("");
      alert("Комментарий добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      alert("Не удалось добавить комментарий. Попробуйте еще раз.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.body);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditText("");
  };

  const updateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axiosinstance.put(`/books/comments/${commentId}`, {
        text: editText.trim(),
      });

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingComment(null);
      setEditText("");
      alert("Комментарий обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении комментария:", error);
      alert("Не удалось обновить комментарий.");
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm("Вы уверены, что хотите удалить комментарий?")) return;

    try {
      await axiosinstance.delete(`/books/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      alert("Комментарий удален!");
    } catch (error) {
      console.error("Ошибка при удалении комментария:", error);
      alert("Не удалось удалить комментарий.");
    }
  };

  // Обработчик для кнопки "Читать"
  const handleReadBook = () => {
    setShowReadModal(true);
  };

  // Закрытие модального окна
  const closeReadModal = () => {
    setShowReadModal(false);
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
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#f8f8f8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#999">Обложка</text></svg>'
                  );
              }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <h1>{book.title}</h1>
          <h2 style={{ color: "#777", fontStyle: "italic" }}>{book.author}</h2>
          {book.genre && (
            <div className="mb-3">
              <span className="badge badge-secondary">{book.genre}</span>
            </div>
          )}

          {/* Описание книги */}
          {book.description && (
            <div className="mb-4">
              <h4 style={{ color: "#333", marginBottom: "1rem" }}>Описание</h4>
              <div
                className="book-description"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  lineHeight: "1.6",
                  color: "#555",
                }}
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </div>
          )}

          {/* Текущий рейтинг книги */}
          <div className="mb-3">
            <h5 style={{ color: "#333", marginBottom: "0.5rem" }}>
              Рейтинг книги
            </h5>
            <div className="d-flex align-items-center mb-2">
              {renderStars(getCurrentRating(), false)}
              <span style={{ marginLeft: "10px", color: "#666" }}>
                {getCurrentRating() > 0
                  ? `${getCurrentRating().toFixed(1)}/5`
                  : "Нет оценок"}
              </span>
            </div>
          </div>

          {/* Пользовательская оценка */}
          <div className="mb-4">
            <h5 style={{ color: "#333", marginBottom: "0.5rem" }}>
              {hasRated ? "Ваша оценка" : "Оцените книгу"}
            </h5>
            <div className="d-flex align-items-center">
              {renderStars(hoverRating || userRating, true)}
              {submittingRating && (
                <span style={{ marginLeft: "10px", color: "#666" }}>
                  Отправка...
                </span>
              )}
              {hasRated && (
                <span style={{ marginLeft: "10px", color: "#28a745" }}>
                  ✓ Оценено ({userRating}/5)
                </span>
              )}
              {!hasRated && userRating === 0 && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  Нажмите на звезду для оценки
                </span>
              )}
            </div>
          </div>

          <div className="book-detail-actions mb-3">
            <button className="btn btn-info me-2" onClick={handleReadBook}>
              📖 Читать
            </button>
            <button className="btn btn-info">⬇ Скачать</button>
          </div>

          {/* Форма добавления комментария */}
          <div className="mb-4">
            <h5 style={{ color: "#333", marginBottom: "1rem" }}>
              Оставить комментарий
            </h5>
            <form onSubmit={submitComment} className="comment-form">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Поделитесь своими впечатлениями о книге..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={submittingComment}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? "Отправка..." : "Отправить комментарий"}
              </button>
            </form>
          </div>

          {/* Отображение комментариев */}
          <div className="comments-section">
            <h5 style={{ color: "#333", marginBottom: "1rem" }}>
              Комментарии ({comments.length})
            </h5>

            {comments.length === 0 ? (
              <p style={{ color: "#777", fontStyle: "italic" }}>
                Пока нет комментариев. Будьте первым!
              </p>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item mb-3">
                    <div className="comment-header d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong style={{ color: "#333" }}>
                          {comment.user.name}
                        </strong>
                        <small style={{ color: "#777", marginLeft: "10px" }}>
                          {new Date(comment.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </small>
                      </div>

                      {/* Кнопки редактирования и удаления для автора комментария */}
                      {user && comment.userId === user.id && (
                        <div className="comment-actions">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => startEditComment(comment)}
                          >
                            ✏️ Изменить
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteComment(comment.id)}
                          >
                            🗑️ Удалить
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="comment-body">
                      {editingComment === comment.id ? (
                        <div className="edit-comment-form">
                          <textarea
                            className="form-control mb-2"
                            rows="3"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => updateComment(comment.id)}
                              disabled={!editText.trim()}
                            >
                              Сохранить
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEditComment}
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "1rem",
                            borderRadius: "8px",
                            margin: 0,
                            lineHeight: "1.5",
                          }}
                        >
                          {comment.body}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно для чтения книги */}
      {showReadModal && book.description && (
        <>
          {/* Затемнение фона */}
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
            onClick={closeReadModal}
          />
          
          {/* Модальное окно */}
          <div
            className="read-modal"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "80vh",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              zIndex: 1050,
              overflow: "hidden",
            }}
          >
            <div className="modal-header" style={{ padding: "1.5rem", borderBottom: "1px solid #e9ecef", backgroundColor: "#f8f9fa" }}>
              <h3 style={{ margin: 0, color: "#333" }}>
                📖 Чтение: {book.title}
              </h3>
              <button
                className="btn-close"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  padding: 0,
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={closeReadModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: "2rem", maxHeight: "60vh", overflowY: "auto" }}>
              <div
                dangerouslySetInnerHTML={{ __html: book.description }}
                style={{
                  lineHeight: "1.8",
                  color: "#333",
                  fontSize: "16px",
                }}
              />
            </div>
            
            <div className="modal-footer" style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e9ecef", backgroundColor: "#f8f9fa" }}>
              <button
                className="btn btn-secondary me-2"
                onClick={closeReadModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
