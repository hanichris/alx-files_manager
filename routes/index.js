import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

// Status endpoint.
router.get('/status', AppController.getStatus);
// Stats endpoint.
router.get('/stats', AppController.getStats);
// create new user endpoint
router.post('/users', UsersController.postNew);

module.exports = router;
