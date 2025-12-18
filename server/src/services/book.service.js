const { Book } = require('../../db/models');


class BookService {
  static async getAllBooks() {
    return Book.findAll();
  }

  static async getBookById(id) {
      return Book.findByPk(id);
    } 

  static async createBook(data) {
      return Book.create(data);
  }

  static async updateBook(id, data) {
      const book = await Book.findByPk(id);
      if (!book) {
        return null;
      }
      return book.update(data);
  }

  static async deleteBook(id) {
      await Book.destroy({ where: { id } });
      return true;
  }


  
}

module.exports = BookService;