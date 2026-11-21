import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  addOffer,
  updateOffer,
} from '../Controllers/articleController.js';

const router = Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/offers', addOffer);
router.patch('/:id/offers/:offerId', updateOffer);

export default router;
