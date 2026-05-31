import routerx from 'express-promise-router';
import shopController from '../controllers/shop_controllers.js';
//import auth from '../middlewares/auth.js';

const router = routerx();

router.post('/add', shopController.add);
router.get('/list', shopController.list);
router.get('/getbyId/:id', shopController.getById);
router.delete('/delete/:id', shopController.delete);
router.put('/update/:id', shopController.update);

export default router;