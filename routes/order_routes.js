import routerx from 'express-promise-router';
import orderController from '../controllers/order_controllers.js';

const router = routerx();

router.post('/add', orderController.add);
router.get('/list', orderController.list);
router.get('/getbyid/:id', orderController.get);
router.put('/update/:id', orderController.update);
router.delete('/delete/:id', orderController.delete);

export default router;