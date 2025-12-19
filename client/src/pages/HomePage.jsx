import { useEffect, useState } from "react";
import ContentCard from "../entities/ui/BookCard";
import axiosinstance from "../shared/axiosinstance";
import "../styles/forms.css";

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

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filters.genre, filters.author, filters.sortByRating]);

  const fetchGenres = async () => {
    try {
      const response = await fetch("/api/books/genres");
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

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

      if (!filters.genre && !filters.author && !filters.sortByRating) {
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
    try {
      const formData = new FormData(e.target);
      formData.append("userId", user.id);

      if (imageType === "url" && formData.get("imageUrl")) {
        formData.set("image", formData.get("imageUrl"));
        formData.delete("imageUrl");
      }
      if (textType === "url" && formData.get("textUrl")) {
        formData.set("bookText", formData.get("textUrl"));
        formData.delete("textUrl");
      }

      const response = await axiosinstance.post("/books", formData);
      const newBook = response.data;

      setShowForm(false);
      setImageType("file");
      setTextType("file");

      setBooks((prev) => [newBook, ...prev]);
      setFilteredBooks((prev) => [newBook, ...prev]);

      setStats((prev) => ({
        totalBooks: prev.totalBooks + 1,
        totalAuthors: prev.totalAuthors,
        totalRatings: prev.totalRatings,
      }));
    } catch (error) {
      console.error(
        "Ошибка создания книги:",
        error.response?.data || error.message
      );
      alert(
        "Ошибка при создании книги: " + (error.response?.data || error.message)
      );
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axiosinstance.delete(`/books/${id}`);
      setBooks(books.filter((el) => el.id !== id));
      setFilteredBooks(filteredBooks.filter((el) => el.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  return (
    <div className="container fade-in">
      {!user ? (
        <>
          <h1 className="text-center mb-4">
            📚 Добро пожаловать в книжный уголок
          </h1>

          <div className="stats-section">
            <div className="row justify-center">
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalBooks}</h2>
                <p className="stat-label">книг</p>
              </div>
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalAuthors}</h2>
                <p className="stat-label">авторов</p>
              </div>
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalRatings}</h2>
                <p className="stat-label">оценок</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-center mb-4">Личный кабинет {user.name}</h2>

          <button
            className="btn btn-primary mb-4"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setImageType("file");
                setTextType("file");
              }
            }}
          >
            {showForm ? "✕ Отмена" : "+ Добавить книгу"}
          </button>

          {showForm && (
            <form className="book-form" onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label">Название книги</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Автор книги</label>
                <input
                  className="form-control"
                  type="text"
                  name="author"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Жанр</label>
                <input
                  className="form-control"
                  type="text"
                  name="genre"
                  placeholder="Введите жанр книги (например: Фантастика, Детектив, Роман...)"
                />
                <small className="form-text">
                  Популярные жанры: Фантастика, Фэнтези, Детектив, Классическая
                  литература, Философская проза, Антиутопия
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Краткое описание книги</label>
                <input
                  className="form-control"
                  type="text"
                  name="descriptions"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Личные комментарии</label>
                <input className="form-control" type="text" name="comment" />
              </div>

              <div className="form-group">
                <label className="form-label">Фото обложки</label>
                <div className="radio-group mb-2">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      checked={imageType === "file"}
                      onChange={() => setImageType("file")}
                    />
                    Загрузить файл
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      checked={imageType === "url"}
                      onChange={() => setImageType("url")}
                    />
                    Ссылка на изображение
                  </label>
                </div>
                {imageType === "file" ? (
                  <input
                    className="form-control"
                    type="file"
                    name="cover"
                    accept="image/*"
                  />
                ) : (
                  <input
                    className="form-control"
                    type="url"
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Создать
              </button>
            </form>
          )}
        </div>
      )}

      {/* Фильтры */}
      <div className="filters-section mb-4">
        <div className="filters-header">
          <button
            className="btn btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? "Скрыть" : "Показать"} фильтры
            <span className="chevron">{showFilters ? "▲" : "▼"}</span>
          </button>

          {(filters.genre || filters.author || filters.sortByRating) && (
            <div className="active-filters">
              <small>Активные фильтры:</small>
              {filters.genre && (
                <span className="badge badge-secondary">
                  Жанр: {filters.genre}
                </span>
              )}
              {filters.author && (
                <span className="badge badge-secondary">
                  Автор: {filters.author}
                </span>
              )}
              {filters.sortByRating && (
                <span className="badge badge-secondary">
                  Сортировка:{" "}
                  {filters.sortByRating === "desc"
                    ? "Высокий рейтинг"
                    : "Низкий рейтинг"}
                </span>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                Очистить
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Жанр</label>
                  <select
                    className="form-select"
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
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Автор</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Поиск по автору"
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Сортировка по рейтингу</label>
                  <select
                    className="form-select"
                    value={filters.sortByRating}
                    onChange={(e) =>
                      handleFilterChange("sortByRating", e.target.value)
                    }
                  >
                    <option value="">По умолчанию</option>
                    <option value="desc">Сначала высокий рейтинг</option>
                    <option value="asc">Сначала низкий рейтинг</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn btn-secondary" onClick={clearFilters}>
                Очистить все фильтры
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowFilters(false)}
              >
                Применить фильтры
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="row">
        {filteredBooks.map((book, index) => (
          <div
            key={book.id}
            className="col-md-6 col-lg-4 col-xl-3"
            style={{ "--card-index": index }}
          >
            <ContentCard
              book={book}
              user={user}
              deleteHandler={deleteHandler}
            />
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="col">
            <p
              className="text-center"
              style={{ color: "#777", padding: "2rem" }}
            >
              Книги не найдены
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
