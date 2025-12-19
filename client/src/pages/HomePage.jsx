import { useEffect, useState } from "react";
import ContentCard from "../entities/ui/BookCard";
import axiosinstance from "../shared/axiosinstance";
import "../styles/forms.css";
import { useTranslation } from "react-i18next";

export default function HomePage({ user }) {
  const { t } = useTranslation();
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
        t("errors.createBook"),
        error.response?.data || error.message
      );
      alert(
        `${t("errors.createBook")} ${error.response?.data || error.message}`
      );
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axiosinstance.delete(`/books/${id}`);
      setBooks(books.filter((el) => el.id !== id));
      setFilteredBooks(filteredBooks.filter((el) => el.id !== id));
    } catch (error) {
      console.error(t("errors.deleteError"), error);
    }
  };

  return (
    <div className="container fade-in">
      {!user ? (
        <>
          <h1 className="text-center mb-4">{t("home.welcome")}</h1>

          <div className="stats-section">
            <div className="row justify-center">
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalBooks}</h2>
                <p className="stat-label">{t("stats.books")}</p>
              </div>
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalAuthors}</h2>
                <p className="stat-label">{t("stats.authors")}</p>
              </div>
              <div className="col-md-4 stat-card">
                <h2 className="stat-number">{stats.totalRatings}</h2>
                <p className="stat-label">{t("stats.ratings")}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-center mb-4">
            {t("home.personalCabinet", { name: user.name })}
          </h2>

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
            {showForm ? t("home.addBookCancel") : t("home.addBook")}
          </button>

          {showForm && (
            <form className="book-form" onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label">{t("bookForm.titleLabel")}</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("bookForm.authorLabel")}
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="author"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t("bookForm.genreLabel")}</label>
                <input
                  className="form-control"
                  type="text"
                  name="genre"
                  placeholder={t("home.genrePlaceholder")}
                />
                <small className="form-text">
                  {t("bookForm.popularGenres")}
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("bookForm.descriptionLabel")}
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="descriptions"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("bookForm.commentLabel")}
                </label>
                <input className="form-control" type="text" name="comment" />
              </div>

              <div className="form-group">
                <label className="form-label">{t("bookForm.coverLabel")}</label>
                <div className="radio-group mb-2">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      checked={imageType === "file"}
                      onChange={() => setImageType("file")}
                    />
                    {t("form.fileUpload")}
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="imageType"
                      checked={imageType === "url"}
                      onChange={() => setImageType("url")}
                    />
                    {t("form.imageUrl")}
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
                {t("form.create")}
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
            🔍 {showFilters ? t("home.filters.hide") : t("home.filters.show")}
            <span className="chevron">{showFilters ? "▲" : "▼"}</span>
          </button>

          {(filters.genre || filters.author || filters.sortByRating) && (
            <div className="active-filters">
              <small>{t("filters.activeFiltersLabel")}</small>
              {filters.genre && (
                <span className="badge badge-secondary">
                  {t("filters.genrePrefix")} {filters.genre}
                </span>
              )}
              {filters.author && (
                <span className="badge badge-secondary">
                  {t("filters.authorPrefix")} {filters.author}
                </span>
              )}
              {filters.sortByRating && (
                <span className="badge badge-secondary">
                  {t("filters.sortPrefix")}{" "}
                  {filters.sortByRating === "desc"
                    ? t("home.filters.sortHigh")
                    : t("home.filters.sortLow")}
                </span>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                {t("filters.clear")}
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">
                    {t("filters.genreLabel")}
                  </label>
                  <select
                    className="form-select"
                    value={filters.genre}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                  >
                    <option value="">{t("filters.allGenres")}</option>
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
                  <label className="form-label">
                    {t("filters.authorLabel")}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder={t("home.filters.searchAuthor")}
                    value={filters.author}
                    onChange={(e) =>
                      handleFilterChange("author", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">{t("filters.sortLabel")}</label>
                  <select
                    className="form-select"
                    value={filters.sortByRating}
                    onChange={(e) =>
                      handleFilterChange("sortByRating", e.target.value)
                    }
                  >
                    <option value="">{t("filters.default")}</option>
                    <option value="desc">{t("home.filters.sortHigh")}</option>
                    <option value="asc">{t("home.filters.sortLow")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn btn-secondary" onClick={clearFilters}>
                {t("filters.clearAll")}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowFilters(false)}
              >
                {t("filters.apply")}
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
              {t("home.notFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
