'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Проверяем, есть ли уже рейтинги в базе
    const existingRatings = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "Ratings";',
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (existingRatings[0].count > 0) {
      console.log('Ratings already exist, skipping seeder');
      return;
    }

    // Получаем существующих пользователей и книги
    const users = await queryInterface.sequelize.query('SELECT id FROM "Users";', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const books = await queryInterface.sequelize.query('SELECT id FROM "Books";', {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (users.length === 0 || books.length === 0) {
      console.log('No users or books found, skipping ratings seeder');
      return;
    }

    const ratings = [];
    const usedCombinations = new Set();

    // Создаем случайные рейтинги для книг
    books.forEach((book) => {
      // Каждая книга получает от 1 до Math.min(users.length, 5) рейтингов
      const maxRatings = Math.min(users.length, 5);
      const ratingsCount = Math.floor(Math.random() * maxRatings) + 1;

      // Создаем копию массива пользователей для перемешивания
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

      for (let i = 0; i < ratingsCount; i++) {
        const user = shuffledUsers[i];
        const combinationKey = `${user.id}-${book.id}`;

        // Проверяем, что такая комбинация еще не использовалась
        if (!usedCombinations.has(combinationKey)) {
          const rating = Math.floor(Math.random() * 5) + 1; // от 1 до 5

          ratings.push({
            mark: rating,
            userId: user.id,
            bookId: book.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          usedCombinations.add(combinationKey);
        }
      }
    });

    if (ratings.length > 0) {
      await queryInterface.bulkInsert('Ratings', ratings, {});
      console.log(`Created ${ratings.length} ratings`);
    } else {
      console.log('No ratings to create');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null, {});
  },
};

