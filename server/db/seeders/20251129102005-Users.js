'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Users', [
            {
        name: 'Анна Книголюбова',
        email: 'anna@example.com',
        phone: '+79161234567',
        hashpass: 'password123',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Максим Читайкин',
        email: 'maxim@example.com',
        phone: '+79162345678',
        hashpass: 'password123',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Елена Литературная',
        email: 'elena@example.com',
        phone: '+79163456789',
        hashpass: 'password123',
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Дмитрий Книжный',
        email: 'dmitry@example.com',
        phone: '+79164567890',
        hashpass: 'password123',
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
        role: 'moderator',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Администратор',
        email: 'admin@bookworm.com',
        phone: '+79160000000',
        hashpass:'admin123',
        avatarUrl: 'https://i.pravatar.cc/150?img=60',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
