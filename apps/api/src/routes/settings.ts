import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', SettingsController.get);
router.put('/', SettingsController.update);

export default router;
