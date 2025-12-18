const aiService = require("../services/ai.service");

class AiController {
  static async askLibrary(req, res) {
    try {
      const { question, userBooks = [] } = req.body;
      const userId = res.locals.user.id;

      const answer = await aiService.askLibrary(question, userBooks);
      
      res.json({ 
        answer, 
        success: true 
      });
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ error: 'Библиотекарь отдыхает 😴' });
    }
  }

  static async recommend(req, res) {
    try {
      const { userBooks } = req.body;
      const recommendations = await aiService.recommendBooks(userBooks);
      
      res.json({ 
        recommendations, 
        success: true 
      });
    } catch (error) {
      res.status(500).json({ error: 'Не могу подобрать книги' });
    }
  }

  static async analyzeReview(req, res) {
    try {
      const { review } = req.body;
      const analysis = await aiService.analyzeReview(review);
      
      res.json({ analysis, success: true });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка анализа' });
    }
  }
}

module.exports = AiController;
