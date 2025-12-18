import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import axiosinstance from "../shared/axiosinstance";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await axiosinstance.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        console.error("Ошибка загрузки книги:", err);
        setError("Книга не найдена");
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
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container className="py-4 text-center">
        <h3>{error || "Книга не найдена"}</h3>
        <Button variant="primary" onClick={() => navigate("/")}>
          Вернуться на главную
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Назад
      </Button>
      <div className="row">
        <div className="col-md-4">
          <Card>
            <Card.Img variant="top" src={book.image} alt={book.title} />
          </Card>
        </div>
        <div className="col-md-8">
          <Card>
            <Card.Body>
              <Card.Title className="h2">{book.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted h4">
                {book.author}
              </Card.Subtitle>
              {book.description && (
                <Card.Text>{book.description}</Card.Text>
              )}
              {book.year && (
                <Card.Text>
                  <strong>Год издания:</strong> {book.year}
                </Card.Text>
              )}
              {book.genre && (
                <Card.Text>
                  <strong>Жанр:</strong> {book.genre}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

