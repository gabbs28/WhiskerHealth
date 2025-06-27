import express from 'express';
import getRoutes from './notes/get';
import postRoutes from './notes/post';
import putRoutes from './notes/put';
import deleteRoutes from './notes/delete';

// Create router
const router = express.Router();

// Pets CRUD
router.use(getRoutes);
router.use(postRoutes);
router.use(putRoutes);
router.use(deleteRoutes);

// Export router
export default router;
