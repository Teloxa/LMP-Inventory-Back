import routerx from 'express-promise-router';
import providerController from '../controllers/provider_controllers.js';
//import auth from '../middlewares/auth.js';

const router = routerx();

router.post('/add', providerController.add);
router.get('/list', providerController.list);
router.get('/getbyId/:id', providerController.getById);
router.delete('/delete/:id', providerController.delete);
router.put('/update/:id', providerController.update);

export default router;