import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import ContentCard from "../entities/ui/BookCard";
import axios from "axios";
import axiosinstance from "../shared/axiosinstance";
import { useNavigate } from "react-router";

export default function HomePage({ user }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [imageType, setImageType] = useState("file");
  const [textType, setTextType] = useState("file");
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    sortByRating: "",
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalRatings: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/books/genres");
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.author) params.append("author", filters.author);
      if (filters.sortByRating)
        params.append("sortByRating", filters.sortByRating);

      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();

      setBooks(data);
      setFilteredBooks(data);

      // Обновляем статистику только при первой загрузке (без фильтров)
      if (
        !filters.genre &&
        !filters.author &&
        !filters.sortByRating
      ) {
        const uniqueAuthors = [...new Set(data.map((book) => book.author))]
          .length;
        setStats({
          totalBooks: data.length,
          totalAuthors: uniqueAuthors,
          totalRatings: data.reduce(
            (acc, book) => acc + (book.ratings?.length || 0),
            0
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      author: "",
      sortByRating: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Если выбрана ссылка на изображение, добавляем её в данные
    if (imageType === "url" && data.imageUrl) {
      data.image = data.imageUrl;
      delete data.imageUrl;
    }

    // Если выбрана ссылка на текст книги, добавляем её в данные
    if (textType === "url" && data.textUrl) {
      data.bookText = data.textUrl;
      delete data.textUrl;
    }

    const response = await axios.post("/api/books", data);
    setBooks([...books, response.data]);
    setShowForm(false);
    setImageType("file");
    setTextType("file");

    // Обновляем список жанров, если добавлен новый жанр
    if (data.genre && !genres.includes(data.genre)) {
      fetchGenres();
    }
  };

  const deleteHandler = async (id) => {
    await axiosinstance.delete(`books/${id}`);
    setBooks(books.filter((el) => el.id !== id));
  };

  return (
    <Container>
      {!user ? (
        <>
          <h1 style={{ textAlign: "center" }}>
            Добро пожаловать в книжный уголок
          </h1>

          <div style={{ margin: "3rem 0", textAlign: "center" }}>
            <Row className="justify-content-center">
              <Col md={4} className="mb-3">
                <div>
                  <h2 style={{ fontSize: "3rem", margin: "0", color: "#333" }}>
                    {stats.totalBooks}
                  </h2>
                  <p style={{ margin: "0", color: "#666" }}>книг</p>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div>
                  <h2 style={{ fontSize: "3rem", margin: "0", color: "#333" }}>
                    {stats.totalAuthors}
                  </h2>
                  <p style={{ margin: "0", color: "#666" }}>авторов</p>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div>
                  <h2 style={{ fontSize: "3rem", margin: "0", color: "#333" }}>
                    {stats.totalRatings}
                  </h2>
                  <p style={{ margin: "0", color: "#666" }}>оценок</p>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div>
          <h2 style={{ textAlign: "center" }}>Личный кабинет {user.name}</h2>

          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setImageType("file");
                setTextType("file");
              }
            }}
          >
            +Добавить книгу
          </Button>
          {showForm && (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Название книги</Form.Label>
                <Form.Control type="text" name="title" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Автор книги</Form.Label>
                <Form.Control type="text" name="author" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Жанр</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  placeholder="Введите жанр книги (например: Фантастика, Детектив, Роман...)"
                />
                <Form.Text className="text-muted">
                  Популярные жанры: Фантастика, Фэнтези, Детектив, Классическая
                  литература, Философская проза, Антиутопия
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Краткое описание книги</Form.Label>
                <Form.Control type="text" name="descriptions" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Личные комментарии</Form.Label>
                <Form.Control type="text" name="comment" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Фото обложки</Form.Label>
                <div className="mb-2">
                  <Form.Check
                    type="radio"
                    id="image-file"
                    name="imageType"
                    label="Загрузить файл"
                    checked={imageType === "file"}
                    onChange={() => setImageType("file")}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    id="image-url"
                    name="imageType"
                    label="Ссылка на изображение"
                    checked={imageType === "url"}
                    onChange={() => setImageType("url")}
                    inline
                  />
                </div>
                {imageType === "file" ? (
                  <Form.Control type="file" name="cover" accept="image/*" />
                ) : (
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </Form.Group>
              <Button type="submit">Создать</Button>
            </Form>
          )}
        </div>
      )}

            {/* Кнопка фильтров */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowFilters(!showFilters)}
            className="d-flex align-items-center"
          >
            <i className={`fas fa-filter me-2`}></i>
            Отфильтровать по
            <i
              className={`fas fa-chevron-${showFilters ? "up" : "down"} ms-2`}
            ></i>
          </Button>

          {/* Показываем активные фильтры */}
          {(filters.genre ||
            filters.author ||
            filters.sortByRating) && (
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">Активные фильтры:</small>
              {filters.genre && (
                <span className="badge bg-primary me-1">
                  Жанр: {filters.genre}
                </span>
              )}
              {filters.author && (
                <span className="badge bg-success me-1">
                  Автор: {filters.author}
                </span>
              )}
              {filters.sortByRating && (
                <span className="badge bg-info me-1">
                  Сортировка:{" "}
                  {filters.sortByRating === "desc"
                    ? "Высокий рейтинг"
                    : "Низкий рейтинг"}
                </span>
              )}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={clearFilters}
                className="ms-2"
              >
                Очистить
              </Button>
            </div>
          )}
        </div>

        {/* Скрываемые фильтры */}
        {showFilters && (
          <div className="border rounded p-3 bg-light">
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Жанр</Form.Label>
                  <Form.Select
                    value={filters.genre}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                  >
                    <option value="">Все жанры</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Автор</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Поиск по автору"
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Сортировка по рейтингу</Form.Label>
                  <Form.Select
                    value={filters.sortByRating}
                    onChange={(e) =>
                      handleFilterChange("sortByRating", e.target.value)
                    }
                  >
                    <option value="">По умолчанию</option>
                    <option value="desc">Сначала высокий рейтинг</option>
                    <option value="asc">Сначала низкий рейтинг</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={clearFilters}
                className="me-2"
              >
                Очистить все фильтры
              </Button>
              <Button variant="primary" onClick={() => setShowFilters(false)}>
                Применить фильтры
              </Button>
            </div>
          </div>
        )}
      </div>

      <Row>
        {filteredBooks.map((book) => (
          <Col sm={3} key={book.id}>
            <ContentCard
              book={book}
              user={user}
              deleteHandler={deleteHandler}
            />
          </Col>
        ))}
        {filteredBooks.length === 0 && (
          <Col>
            <p className="text-center text-muted">Книги не найдены</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
