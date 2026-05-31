import routerx from 'express-promise-router';
import productController from '../controllers/product_controllers.js';

const router = routerx();

router.post('/', productController.add);
router.get('/', productController.list);
router.get('/:id', productController.get);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

export default router;