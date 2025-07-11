import express from 'express';
import getRoutes from './notes/get.js';
import postRoutes from './notes/post.js';
import putRoutes from './notes/put.js';
import deleteRoutes from './notes/delete.js';

// Create router
const router = express.Router();

// Pets CRUD
router.use(getRoutes);
router.use(postRoutes);
router.use(putRoutes);
router.use(deleteRoutes);

// Export router
export default router;
