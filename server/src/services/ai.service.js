require('dotenv').config();
const { GigaChat } = require('gigachat');

class AiService {
  constructor() {
    this.client = new GigaChat({
      model: "GigaChat-2", 
      credentials: process.env.GIGACHAT_KEY
    });
  }

 
  async askLibrary(question, userBooks = []) {
    const booksContext = userBooks.length ? `Твои книги: ${userBooks.join(', ')}.` : '';
    
    const response = await this.client.chat({
      messages: [{
        role: "system", 
        content: `Ты уютный библиотекарь книжного клуба "Читайдом". 
Отвечай коротко, с эмодзи, предлагай действия. 
Примеры:
"Как добавить книгу?" → "📖 Нажми '+' → название, автор → 'Опубликовать'! ✨"
"Где избранное?" → "❤️ Профиль → сердечко"
${booksContext}`
      }, { 
        role: "user", 
        content: question 
      }]
    });

    return response.choices[0].message.content;
  }

 
  async recommendBooks(userBooks) {
    const response = await this.client.chat({
      messages: [{
        role: "system", 
        content: `Ты литературный советчик. 
Рекомендуй 3 похожие книги по списку: ${userBooks.join(', ')}.
Формат:
1. "Название" - Автор (почему похожа)
2. ...
"Зайди в обсуждение!"`
      }, { 
        role: "user", 
        content: "Рекомендации" 
      }]
    });

    return response.choices[0].message.content;
  }

  async analyzeReview(review) {
    const response = await this.client.chat({
      messages: [{
        role: "system", 
        content: `Проанализируй тональность отзыва: "${review}"
Ответь JSON: {"sentiment": "восторг|положительный|нейтральный|критика|негатив"}`
      }]
    });

    return response.choices[0].message.content;
  }
}

module.exports = new AiService();
