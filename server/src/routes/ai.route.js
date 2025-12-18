const AiController = require('../controller/ai.controller');  
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const aiRouter = require('express').Router();  


aiRouter.post('/chat', verifyAccessToken, AiController.askLibrary);
aiRouter.post('/recommend', verifyAccessToken, AiController.recommend);
aiRouter.post('/review', verifyAccessToken, AiController.analyzeReview);

module.exports = aiRouter;
