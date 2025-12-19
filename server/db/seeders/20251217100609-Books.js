'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [
      {
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        description: 'Гениальный роман о любви, творчестве и вечных вопросах бытия. Сатана прибывает в Москву 1930-х годов, чтобы устроить бал и встретиться с Мастером — писателем, сжигающим свою рукопись.',
        image: 'https://cdn.ast.ru/v2/ASE000000000865363/COVER/cover1__w410.jpg',
        genre: 'Фантастика',
        userId: 1, 
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        title: '1984',
        author: 'Джордж Оруэлл',
        description: 'Антиутопия о тоталитарном обществе, где за каждым следят, историю переписывают, а любовь запрещена. "Большой Брат смотрит на тебя".',
        image: 'https://cdn.ast.ru/v2/ASE000000000866365/COVER/cover1__w410.jpg',
        genre: 'Антиутопия',
        userId: 1, 
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        title: 'Маленький принц',
        author: 'Антуан де Сент-Экзюпери',
        description: 'Философская сказка-притча о самом важном: дружбе, любви и ответственности. "Мы в ответе за тех, кого приручили".',
        image: 'https://cdn.ast.ru/v2/ASE000000000842761/COVER/cover1__w410.jpg',
        genre: 'Философская проза',
        userId: 2, 
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        description: 'Роман о нравственных муках студента Раскольникова, совершившего убийство ради идеи. Глубокий психологический анализ совести.',
        image: 'https://cdn.ast.ru/v2/ASE000000000703427/COVER/cover1__w410.jpg',
        genre: 'Классическая литература',
        userId: 1, 
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        title: 'Гарри Поттер и философский камень',
        author: 'Дж. К. Роулинг',
        description: 'Первая книга культовой серии о юном волшебнике. Магия, дружба и борьба с тёмными силами.',
        image: 'https://s.f.kz/prod/4141/4140703_1000.jpg',
        genre: 'Фэнтези',
        userId: 3, 
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28')
      },
      {
        title: 'Война и мир',
        author: 'Лев Толстой',
        description: 'Эпический роман о судьбах русских аристократических семей на фоне войн с Наполеоном.',
        image: 'https://cdn.ast.ru/v2/ASE000000000894906/COVER/cover1__w410.jpg',
        genre: 'Классическая литература',
        userId: 1, 
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        title: 'Шерлок Холмс: Собака Баскервилей',
        author: 'Артур Конан Дойл',
        description: 'Знаменитое дело Шерлока Холмса о проклятии рода Баскервилей и собаке-призраке.',
        image: 'https://cdn.ast.ru/v2/ASE000000000889592/COVER/cover1__w410.jpg',
        genre: 'Детектив',
        userId: 2, 
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        title: 'Алхимик',
        author: 'Пауло Коэльо',
        description: 'Притча об андалузском пастухе Сантьяго, отправившемся на поиски своего сокровища и предназначения.',
        image: 'https://cdn.ast.ru/v2/ASE000000000840762/COVER/cover1__w410.jpg',
        genre: 'Философская проза',
        userId: 3, 
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
