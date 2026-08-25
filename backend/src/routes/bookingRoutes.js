import { Router } from 'express';
import BookingController from '../controllers/bookingController.js';

const router = Router();

router.get('/', BookingController.getAll);
router.get('/:id', BookingController.getById);
router.post('/', BookingController.create);
router.put('/:id', BookingController.update);
router.delete('/:id', BookingController.remove);

export default router;
