import { useCallback, useEffect, useState } from "react";
import BookCard from "../entities/ui/BookCard";
import axiosinstance from "../shared/axiosinstance";
import { useTranslation } from "react-i18next";

export default function FavoritePage() {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosinstance.get("/favorites");
        setCards(data || []);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const removeFavorite = useCallback((favoriteId) => {
    setRemovingIds((prev) => new Set(prev).add(favoriteId));
    axiosinstance
      .delete(`/favorites/${favoriteId}`)
      .then(() => {
        setCards((prev) =>
          prev.filter((card) => card.favoriteId !== favoriteId)
        );
        setRemovingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(favoriteId);
          return newSet;
        });
      })
      .catch((error) => {
        console.error("Ошибка удаления:", error);
        setRemovingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(favoriteId);
          return newSet;
        });
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="loading">
          {t("form.submit") /* use generic label for loading */}
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h2 className="mb-3">{t("favorite.title")}</h2>
        <p>{t("favorite.empty")}</p>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <h1 className="mb-4 text-center">⭐ Мои любимые книжки ⭐</h1>
      <div className="row">
        {cards.map((card, index) => (
          <div
            key={card.favoriteId || `card-${card.id}-${index}`}
            className="col-md-6 col-lg-4 col-xl-3"
            style={{ "--card-index": index }}
          >
            <BookCard
              book={card}
              user={{}}
              deleteHandler={(favoriteId) => {
                removeFavorite(favoriteId);
              }}
              isFavoritePage={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
