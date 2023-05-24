import WebScrapper  from '../controllers/webscrapper.js'
import express from 'express';

const router = express.Router();

router.post('/PostInsights',WebScrapper.postDetails);
router.get('/GetInsights',WebScrapper.getAllInsights);
router.put('/PutInsights/:id',WebScrapper.updateInsights);
router.delete('/DelInsights/:id',WebScrapper.deleteInsights);

export default router