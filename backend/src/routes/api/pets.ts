import express from 'express';
import getRoutes from './pets/get.js';
import postRoutes from './pets/post.js';
import putRoutes from './pets/put.js';
import deleteRoutes from './pets/delete.js';

// Create router
const router = express.Router();

// Pets CRUD
router.use(getRoutes);
router.use(postRoutes);
router.use(putRoutes);
router.use(deleteRoutes);

// Export router
export default router;
