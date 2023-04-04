import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Status endpoint.
router.get('/status', AppController.getStatus);

// Stats endpoint.
router.get('/stats', AppController.getStats);

module.exports = router;
