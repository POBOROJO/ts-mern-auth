import { Router } from 'express';
import { registerController, loginController, meController } from '../controllers/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authMiddleware, meController);

export default router;