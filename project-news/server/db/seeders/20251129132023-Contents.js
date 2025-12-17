'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Contents', [
      { 
        title: 'Эксклюзив: интервью с CEO Tesla', 
        content: 'Мы встретились с Илоном Маском, чтобы обсудить будущее электромобилей и космических путешествий...',
        imageUrl: 'https://img.freepik.com/free-psd/3d-rendering-ui-icon_23-2149182295.jpg?semt=ais_hybrid&w=740&q=80',
        isNSFW: false,
        views: 890,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        title: 'Шокирующие разоблачения в политике', 
        content: 'Расследование наших журналистов раскрыло коррупционные схемы на высшем уровне...',
        imageUrl: 'https://img.freepik.com/free-psd/3d-rendering-ui-icon_23-2149182295.jpg?semt=ais_hybrid&w=740&q=80',
        isNSFW: false,
        views: 2100,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        title: '18+ Контент: Искусство или провокация?', 
        content: 'Современное искусство часто пересекает границы дозволенного. В этой статье мы исследуем...',
        imageUrl: 'https://img.freepik.com/free-psd/3d-rendering-ui-icon_23-2149182295.jpg?semt=ais_hybrid&w=740&q=80',
        isNSFW: true,  
        views: 450,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        title: 'Путешествие в самые опасные места планеты', 
        content: 'Наш корреспондент отправился в экспедицию по самым экстремальным локациям Земли...',
        imageUrl: 'https://img.freepik.com/free-psd/3d-rendering-ui-icon_23-2149182295.jpg?semt=ais_hybrid&w=740&q=80',
        isNSFW: false,
        views: 760,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
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
