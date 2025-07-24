import { Router } from 'express'
import { downloadFile } from '../controllers/downloadController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { requireOwnershipOrSharedAccess } from '../middlewares/requireOwnershipOrSharedAccess';

const router = Router();

router.get('/download/:id', authMiddleware, requireOwnershipOrSharedAccess, downloadFile);

export default router;