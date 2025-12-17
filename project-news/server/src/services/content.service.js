const { Content } = require('../../db/models');
const { User } = require('../../db/models')

class ContentService {
  static async getAllContent() {
    return Content.findAll();
  }

  static async getContentById(id) {
      return Content.findByPk(id);
    } 

  static async createContent(data) {
      return Content.create(data);
  }

  static async updateContent(id, data) {
      const content = await Content.findByPk(id);
      if (!content) {
        return null;
      }
      return content.update(data);
  }

  static async deleteContent(id) {
      await Content.destroy({ where: { id } });
      return true;
  }

  static async getContentByAuthor(userId) {
      return Content.findAll({
        where: { userId },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } 

}

module.exports = ContentService;
