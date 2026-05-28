import routerx from 'express-promise-router';
import userController from '../controllers/user_controllers.js';
import authMiddleware from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = routerx();

router.post('/add', userController.add);
router.get('/list', authMiddleware, userController.list);
router.get('/getbyId/:id',authMiddleware, userController.GetById);
router.delete('/delete/:id',authMiddleware, userController.delete);
router.put('/update/:id', upload.single('profileImage'), userController.update);
router.post('/login', userController.login);

export default router;
