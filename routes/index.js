import { AppController } from '../controllers/AppController';
import { express } from 'express';

const router = express.Router();

// Status endpoint.
router.get('/status', AppController.getStatus);

// Stats endpoint.
router.get('/stats', AppController.getStats);

module.exports = router;
