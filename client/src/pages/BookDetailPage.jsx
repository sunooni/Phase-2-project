import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Form,
  FormControl,
  Row,
  Col,
  Image,
  Modal,
} from "react-bootstrap";
import { useParams } from "react-router";
import axiosinstance from "../shared/axiosinstance";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [userRating, setUserRating] = useState(0); // 0 = не оценено, 1-5 = рейтинг
  const [hoverRating, setHoverRating] = useState(0); // для эффекта наведения

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
      <Container>
        <h1>Загрузка...</h1>
      </Container>
    );
  }

  const coverSource = book.image;
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
    <Container>
      <Row className="my-5">
        <Col md={4}>
          <Image
            src={coverSource}
            alt={`Обложка книги ${book.title}`}
            fluid
            style={{ maxHeight: "400px", width: "auto", objectFit: "contain" }}
          />
        </Col>
        <Col md={8}>
          <h1>{book.title}</h1>
          <h2>Автор: {book.author}</h2>
          {book.genre && (
            <div className="mb-3">
              <span className="badge bg-primary fs-6 px-3 py-2">
                {book.genre}
              </span>
            </div>
          )}

          <p>
            Оцени книгу: {renderStars(hoverRating || userRating)}
            {userRating > 0 && <span> ({userRating}/5)</span>}
          </p>

          {/* Кнопки */}
          <div className="d-flex gap-2 mb-3">
            <Button
              variant="success"
              size="lg"
              onClick={() => setShowReadModal(true)} // Открытие модалки
            >
              Читать
            </Button>
            <Button variant="info" size="lg">
              Скачать
            </Button>
          </div>

          {/* Форма отзыва */}
          <Form className="d-flex">
            <FormControl
              type="text"
              placeholder="Понравилась книга? Оставь отзыв!"
            />
            <Button type="submit" variant="primary">
              Отправить
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Модальное окно с текстом книги */}
      <Modal
        show={showReadModal}
        onHide={() => setShowReadModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {book.description ? (
            <div dangerouslySetInnerHTML={{ __html: book.description }} />
          ) : (
            <p>Описание недоступно</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReadModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
