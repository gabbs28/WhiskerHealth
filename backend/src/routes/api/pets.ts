import express from 'express';
import getRoutes from './pets/get';
import postRoutes from './pets/post';
import putRoutes from './pets/put';
import deleteRoutes from './pets/delete';

// Create router
const router = express.Router();

// Pets CRUD
router.use(getRoutes);
router.use(postRoutes);
router.use(putRoutes);
router.use(deleteRoutes);

// Export router
export default router;
