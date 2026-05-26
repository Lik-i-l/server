import { Router } from 'express';
import * as bookController from '../controllers/bookController';

const router = Router();

router.get('/books', bookController.getBooks);
router.post('/books', bookController.createBook);
router.get('/books/:isbn', bookController.getBook);
router.patch('/books/:isbn', bookController.updateBook);
router.delete('/books/:isbn', bookController.deleteBook);
router.get('/books/:isbn/status', bookController.getBookStatus);

export default router;
