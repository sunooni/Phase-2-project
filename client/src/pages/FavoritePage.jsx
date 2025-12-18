import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import BookCard from "../entities/ui/BookCard";
import axiosinstance from "../shared/axiosinstance";

export default function FavoritePage() {
  const [cards, setCards] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosinstance.get("/favorites"); 
        console.log("Загруженные избранные книги:", data);
        setCards(data || []);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
        console.error("Детали ошибки:", error.response?.data);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const removeFavorite = useCallback((favoriteId) => {
    if (!favoriteId || favoriteId === 'undefined') {
      console.error('Некорректный favoriteId:', favoriteId);
      alert('Ошибка: не удалось определить ID избранного для удаления');
      return;
    }
    
    console.log('Удаление избранного с ID:', favoriteId);
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
      <Container className="py-4 text-center">
        <p>Загрузка...</p>
      </Container>
    );
  }

  if (cards.length === 0) {
    return (
      <Container className="py-4 text-center">
        <h3>Избранное пусто</h3>
        <p>Добавьте книги в избранное, чтобы они отображались здесь.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Мои любивые книжки</h1>
      <div className="row g-4">
        {cards.map((card, index) => {
          console.log(`Рендеринг карточки #${index}:`, {
            card,
            favoriteId: card.favoriteId,
            id: card.id,
            title: card.title,
            allKeys: Object.keys(card)
          });
          
          // Проверяем наличие favoriteId
          if (!card.favoriteId) {
            console.error('ВНИМАНИЕ: favoriteId отсутствует в карточке:', card);
          }
          
          return (
            <div key={card.favoriteId || `card-${card.id}-${index}`} className="col-md-6 col-lg-4 col-xl-3">
              <BookCard
                book={card}           
                user={{}}            
                deleteHandler={(favoriteId) => {
                  console.log('deleteHandler вызван с favoriteId:', favoriteId);
                  removeFavorite(favoriteId);
                }}
                isFavoritePage={true}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}
