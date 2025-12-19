import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosinstance from "../shared/axiosinstance";
import "../styles/modal.css";
import { useTranslation } from "react-i18next";

export default function BookDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  const [showReadModal, setShowReadModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Используем fetch для публичного запроса данных о книге (не требует токена)
        const response = await fetch(`/api/books/${id}`);

        if (!response.ok) {
          // Вызываем ошибку, если статус не 200
          throw new Error("Книга не найдена или произошла ошибка сервера.");
        }

        const data = await response.json();
        setBook(data);
        setComments(data.comments || []);

        // 2. Запрос на получение оценки пользователя - ТОЛЬКО если пользователь авторизован
        if (user) {
          try {
            const userRatingResponse = await axiosinstance.get(
              `/books/${id}/user-rating`
            );
            if (userRatingResponse.data.rating) {
              setUserRating(userRatingResponse.data.rating);
              setHasRated(true);
            }
          } catch (userRatingError) {
            // Это ожидаемо, если пользователь не ставил оценку
            console.log(
              "Пользователь еще не оценивал эту книгу или запрос на оценку не прошел без токена."
            );
          }
        } else {
          // Сброс пользовательских оценок при отсутствии пользователя
          setUserRating(0);
          setHasRated(false);
        }
      } catch (err) {
        console.error("Ошибка при загрузке книги:", err);
        setError(err.message || "Не удалось загрузить информацию о книге.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, user]); // Добавили user в зависимости для повторной загрузки при входе/выходе

  if (loading) {
    return (
      <div className="container py-4">
        <div className="loading">{t("common.loading")}</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container py-4 text-center">
        <h2>{error || t("bookDetail.notFound")}</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/") }>
          {t("common.returnHome")}
        </button>
      </div>
    );
  }

  // Функции submitRating, submitComment, updateComment, deleteComment
  // ДОЛЖНЫ быть защищены проверкой `if (!user) return;` или отключены в UI

  const submitRating = async (rating) => {
    if (!user || submittingRating || hasRated) return; // Проверка авторизации

    try {
      setSubmittingRating(true);
      await axiosinstance.post(`/books/${id}/rating`, { rating });

      const response = await axiosinstance.get(`/books/${id}`);
      setBook(response.data);
      setHasRated(true);
      setUserRating(rating); // Устанавливаем оценку сразу

      alert(
        t("bookDetail.commentAdded") ||
          `Спасибо за оценку! Вы поставили ${rating} звезд.`
      );
    } catch (error) {
      console.error("Ошибка при отправке оценки:", error);
      alert(
        "Не удалось отправить оценку. Попробуйте еще раз. Возможно, требуется авторизация."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating, isInteractive = true) => {
    const stars = [];
    // Если пользователь не авторизован, отключаем интерактивность
    const canInteract = isInteractive && !!user && !hasRated;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`rating-star ${canInteract ? "interactive" : ""}`}
          style={{
            cursor: canInteract ? "pointer" : "default",
            color: i <= rating ? "#ffc107" : "#e0e0e0",
            fontSize: "24px",
            marginRight: "5px",
            opacity: !canInteract && isInteractive ? 0.7 : 1, // Приглушаем неактивные звезды
          }}
          onClick={() => {
            if (canInteract) {
              submitRating(i);
            }
          }}
          onMouseEnter={() => canInteract && setHoverRating(i)}
          onMouseLeave={() => canInteract && setHoverRating(0)}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  const getCurrentRating = () => {
    const rating =
      book.rating ||
      book.avgRating ||
      book.averageRating ||
      book.average_rating;
    if (!rating) return 0;
    let r = Number(rating);
    if (isNaN(r)) return 0;
    if (r > 5 && r <= 10) r = r / 2;
    return Math.max(0, Math.min(5, r));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || submittingComment) return; // Проверка авторизации

    try {
      setSubmittingComment(true);
      const response = await axiosinstance.post(`/books/${id}/comments`, {
        text: newComment.trim(),
      });

      setComments([response.data, ...comments]);
      setNewComment("");
      alert(t("bookDetail.commentAdded"));
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      alert(t("bookDetail.commentAddError"));
    } finally {
      setSubmittingComment(false);
    }
  };

  const startEditComment = (comment) => {
    if (!user || comment.userId !== user.id) return;
    setEditingComment(comment.id);
    setEditText(comment.body);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditText("");
  };

  const updateComment = async (commentId) => {
    if (!user || !editText.trim()) return; // Проверка авторизации

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
      alert(t("bookDetail.commentUpdated"));
    } catch (error) {
      console.error("Ошибка при обновлении комментария:", error);
      alert(t("bookDetail.commentUpdateError"));
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm(t("bookDetail.confirmDeleteComment"))) return;

    try {
      await axiosinstance.delete(`/books/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      alert(t("bookDetail.commentDeleted"));
    } catch (error) {
      console.error("Ошибка при удалении комментария:", error);
      alert(t("bookDetail.commentDeleteError"));
    }
  };

  const handleReadBook = () => {
    setShowReadModal(true);
  };

  const closeReadModal = () => {
    setShowReadModal(false);
  };

  return (
    <div className="container py-4 fade-in">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        {t("common.back")}
      </button>

      <div className="book-detail-layout">
        <div className="book-detail-image-column">
          <div className="book-detail-image">
            <img
              src={book.image}
              alt={`${t("card.cover")} ${book.title}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#f8f8f8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#999">${t(
                      "card.cover"
                    )}</text></svg>`
                  );
              }}
            />
          </div>
        </div>

        <div className="book-detail-info-column">
          <h1>{book.title}</h1>
          <h2 style={{ color: "#777", fontStyle: "italic" }}>{book.author}</h2>

          {book.genre && (
            <div className="mb-3">
              <span className="badge badge-secondary">{book.genre}</span>
            </div>
          )}

          {book.description && (
            <div className="mb-4">
              <h4 style={{ color: "#333", marginBottom: "1rem" }}>
                {t("common.description")}
              </h4>
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

          <div className="mb-3">
            <h5 style={{ color: "#333", marginBottom: "0.5rem" }}>
              {t("common.rating")}
            </h5>
            <div className="rating-display">
              {renderStars(getCurrentRating(), false)}
              <span style={{ marginLeft: "10px", color: "#666" }}>
                {getCurrentRating() > 0
                  ? `${getCurrentRating().toFixed(1)}/5`
                  : t("bookDetail.noRatings")}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h5 style={{ color: "#333", marginBottom: "0.5rem" }}>
              {hasRated ? t("bookDetail.yourRating") : t("bookDetail.rateBook")}
            </h5>
            <div className="user-rating-display">
              {renderStars(hoverRating || userRating, true)}
              {submittingRating && (
                <span style={{ marginLeft: "10px", color: "#666" }}>
                  {t("bookDetail.sending")}
                </span>
              )}
              {user && hasRated && (
                <span style={{ marginLeft: "10px", color: "#28a745" }}>
                  ✓ {t("bookDetail.rated", { rating: userRating })}
                </span>
              )}
              {/* Сообщение для неавторизованных пользователей */}
              {!user && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#d9534f",
                    fontSize: "0.9rem",
                  }}
                >
                  <a href="/login">Войдите</a>, чтобы оценить книгу.
                </span>
              )}
              {user && !hasRated && userRating === 0 && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("bookDetail.rateBook")}
                </span>
              )}
            </div>
          </div>

          <div className="book-detail-actions mb-4">
            <button className="btn btn-info me-2" onClick={handleReadBook}>
              📖 {t("common.read")}
            </button>
            <button className="btn btn-info">⬇ {t("common.download")}</button>
          </div>
        </div>

        <div className="book-detail-comments-column">
          <div className="mb-4">
            <h5 style={{ color: "#333", marginBottom: "1rem" }}>
              {t("common.leaveComment")}
            </h5>
            <form onSubmit={submitComment} className="comment-form">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder={t("bookDetail.commentPlaceholder")}
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
                {submittingComment
                  ? t("bookDetail.sending")
                  : t("bookDetail.sendComment")}
              </button>
            </form>
          </div>

          <div className="comments-section">
            <h5 style={{ color: "#333", marginBottom: "1rem" }}>
              {t("common.comments")} ({comments.length})
            </h5>

            {comments.length === 0 ? (
              <p style={{ color: "#777", fontStyle: "italic" }}>
                {t("common.noComments")}
              </p>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item mb-3">
                    <div className="comment-header">
                      <div className="comment-user-info">
                        <strong style={{ color: "#333" }}>
                          {comment.user.name}
                        </strong>
                                    <small style={{ color: "#777", marginLeft: "10px" }}>
                                      {new Date(comment.createdAt).toLocaleDateString(
                                        i18n.language === 'en' ? 'en-US' : 'ru-RU',
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

                      {user && comment.userId === user.id && (
                        <div className="comment-actions">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => startEditComment(comment)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteComment(comment.id)}
                          >
                            🗑️
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
                              {t("common.save")}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEditComment}
                            >
                              {t("common.cancel")}
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

      {showReadModal && book.description && (
        <>
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
            <div
              className="modal-header"
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
              }}
            >
              <h3 style={{ margin: 0, color: "#333" }}>
                📖 {t("bookDetail.reading", { title: book.title })}
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

            <div
              className="modal-body"
              style={{ padding: "2rem", maxHeight: "60vh", overflowY: "auto" }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: book.description }}
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  fontFamily: "Georgia, serif",
                  fontSize: "1.1rem",
                }}
              />
            </div>

            <div
              className="modal-footer"
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
              }}
            >
              <button
                className="btn btn-secondary me-2"
                onClick={closeReadModal}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
