import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus); // GET /status.
router.get('/stats', AppController.getStats); // GET /stats.
router.post('/users', UsersController.postNew); // POST /users.
// router.get('/users/me', UsersController.getMe); // GET /users/me
router.get('/connect', AuthController.getConnect); // GET /connect
router.get('/disconnect', AuthController.getDisconnect); // GET /disconnect

module.exports = router;
