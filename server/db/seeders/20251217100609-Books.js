'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [
      {
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        description: 'Гениальный роман о любви, творчестве и вечных вопросах бытия. Сатана прибывает в Москву 1930-х годов, чтобы устроить бал и встретиться с Мастером — писателем, сжигающим свою рукопись.',
        image: 'https://ir.ozone.ru/s3/multimedia-w/c1000/6900779696.jpg',
        userId: 1, // Анна
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        title: '1984',
        author: 'Джордж Оруэлл',
        description: 'Антиутопия о тоталитарном обществе, где за каждым следят, историю переписывают, а любовь запрещена. "Большой Брат смотрит на тебя".',
        image: 'https://img.labirint.ru/images/comments_pic/2252/0_e5263dc8ed0d430a2643efcb176fc130_1672160753.jpg',
        userId: 1, // Максим
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        title: 'Маленький принц',
        author: 'Антуан де Сент-Экзюпери',
        description: 'Философская сказка-притча о самом важном: дружбе, любви и ответственности. "Мы в ответе за тех, кого приручили".',
        image: 'https://static.insales-cdn.com/images/products/1/6103/493508567/1.jpeg',
        userId: 2, // Елена
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        description: 'Роман о нравственных муках студента Раскольникова, совершившего убийство ради идеи. Глубокий психологический анализ совести.',
        image: 'https://book-present.ru/wp-content/uploads/2024/11/prestuplenie-i-nakazanie-ehksklyuzivnyj-kozhanyj-pereplet-ruchnoj-raboty-futlyar.jpg',
        userId: 1, // Анна
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        title: 'Гарри Поттер и философский камень',
        author: 'Дж. К. Роулинг',
        description: 'Первая книга культовой серии о юном волшебнике. Магия, дружба и борьба с тёмными силами.',
        image: 'https://avatars.mds.yandex.net/get-mpic/4973279/2a000001936758dde54cd5715de4dc60cac5/orig',
        userId: 3, // Дмитрий
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28')
      },
      {
        title: 'Война и мир',
        author: 'Лев Толстой',
        description: 'Эпический роман о судьбах русских аристократических семей на фоне войн с Наполеоном.',
        image: 'https://cdn.eksmo.ru/v2/ITD000000001087075/COVER/cover1__w820.jpg',
        userId: 1, // Максим
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        title: 'Шерлок Холмс: Собака Баскервилей',
        author: 'Артур Конан Дойл',
        description: 'Знаменитое дело Шерлока Холмса о проклятии рода Баскервилей и собаке-призраке.',
        image: 'https://s3-goods.ozstatic.by/1000/65/205/10/10205065_0.jpg',
        userId: 2, // Елена
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        title: 'Алхимик',
        author: 'Пауло Коэльо',
        description: 'Притча об андалузском пастухе Сантьяго, отправившемся на поиски своего сокровища и предназначения.',
        image: 'https://ir.ozone.ru/s3/multimedia-1-9/c1000/7633509345.jpg',
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
