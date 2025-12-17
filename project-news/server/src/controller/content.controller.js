const ContentService = require('../services/content.service');

class ContentController {
  static async getAllContent(req, res) {
    const content = await ContentService.getAllContent();
    return res.json(content);
  }

  static async getContentById(req, res) {
    const { id } = req.params;
    const content = await ContentService.getContentById(id);
    if (!content) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }
    return res.json(content);
  }

  static async createContent(req, res) {
    const data = req.body;
    const content = await ContentService.createContent({
      ...data,
      userId: res.locals.user.id,
    });
    return res.status(201).json(content);
  }

  static async updateContent(req, res) {
    const { id } = req.params;
    const data = req.body;
    const content = await ContentService.updateContent(id, data);
    if (!content) {
      return res.sendStatus(404);
    }
    return res.json(content);
  }

  static async deleteContent(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    const content = await ContentService.getContentById(id);
    if (!content) {
      return res.sendStatus(404);
    }
    if (content.userId !== user.id) {
      return res.sendStatus(403);
    }
    await ContentService.deleteContent(id);
    res.sendStatus(204);
  }

  static async getContentByAuthor(req, res) {
    const { user } = res.locals;
    const content = await ContentService.getContentByAuthor(user.id);
    return res.json(content);
  }
}

module.exports = ContentController;
