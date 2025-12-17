'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [
      {
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        description: 'Гениальный роман о любви, творчестве и вечных вопросах бытия. Сатана прибывает в Москву 1930-х годов, чтобы устроить бал и встретиться с Мастером — писателем, сжигающим свою рукопись.',
        image: 'https://cv6.litres.ru/pub/c/elektronnaya-kniga/cover_415/66924623-mihail-bulgakov-master-i-margarita-66924623.jpg',
        userId: 1, // Анна
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        title: '1984',
        author: 'Джордж Оруэлл',
        description: 'Антиутопия о тоталитарном обществе, где за каждым следят, историю переписывают, а любовь запрещена. "Большой Брат смотрит на тебя".',
        image: 'https://cv9.litres.ru/pub/c/elektronnaya-kniga/cover_415/171041-dzhordzh-oruell-1984-171041.jpg',
        userId: 1, // Максим
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        title: 'Маленький принц',
        author: 'Антуан де Сент-Экзюпери',
        description: 'Философская сказка-притча о самом важном: дружбе, любви и ответственности. "Мы в ответе за тех, кого приручили".',
        image: 'https://cv5.litres.ru/pub/c/elektronnaya-kniga/cover_415/168064-antuan-de-sent-ekzyuperi-malenkiy-princ-168064.jpg',
        userId: 2, // Елена
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        description: 'Роман о нравственных муках студента Раскольникова, совершившего убийство ради идеи. Глубокий психологический анализ совести.',
        image: 'https://cv5.litres.ru/pub/c/elektronnaya-kniga/cover_415/170110-fedor-dostoevskiy-prestuplenie-i-nakazanie-170110.jpg',
        userId: 1, // Анна
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        title: 'Гарри Поттер и философский камень',
        author: 'Дж. К. Роулинг',
        description: 'Первая книга культовой серии о юном волшебнике. Магия, дружба и борьба с тёмными силами.',
        image: 'https://cv4.litres.ru/pub/c/elektronnaya-kniga/cover_415/10412508-dzh-k-rouling-garri-potter-i-filosofskiy-kamen-10412508.jpg',
        userId: 3, // Дмитрий
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28')
      },
      {
        title: 'Война и мир',
        author: 'Лев Толстой',
        description: 'Эпический роман о судьбах русских аристократических семей на фоне войн с Наполеоном.',
        image: 'https://cv4.litres.ru/pub/c/elektronnaya-kniga/cover_415/169806-lev-tolstoy-voyna-i-mir-169806.jpg',
        userId: 1, // Максим
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        title: 'Шерлок Холмс: Собака Баскервилей',
        author: 'Артур Конан Дойл',
        description: 'Знаменитое дело Шерлока Холмса о проклятии рода Баскервилей и собаке-призраке.',
        image: 'https://cv1.litres.ru/pub/c/elektronnaya-kniga/cover_415/175234-artur-konan-doyl-sobaka-baskerviley-175234.jpg',
        userId: 2, // Елена
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        title: 'Алхимик',
        author: 'Пауло Коэльо',
        description: 'Притча об андалузском пастухе Сантьяго, отправившемся на поиски своего сокровища и предназначения.',
        image: 'https://cv5.litres.ru/pub/c/elektronnaya-kniga/cover_415/180464-paulo-koel-alhimik-180464.jpg',
        userId: 3, // Анна
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
