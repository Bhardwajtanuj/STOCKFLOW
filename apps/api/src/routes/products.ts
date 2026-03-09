import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', ProductController.list);
router.get('/:id', ProductController.get);
router.post('/', ProductController.create);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

router.post('/:id/adjust-stock', ProductController.adjustStock);
router.get('/:id/movements', ProductController.getMovements);

export default router;
