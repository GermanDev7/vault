import { Router } from 'express'
import { upload, shareDocument, getSharedWithMe, getMyDocuments } from '../controllers/documentController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { upload as UploadMiddleware } from '../middlewares/upploadMiddleware'
import { deleteDocumentController } from '../controllers/documentController'
import { requirePermission } from '../middlewares/requirePermission'
const router = Router()

router.post('/', authMiddleware, UploadMiddleware.single('file'), upload)
router.post('/:id/share', authMiddleware, shareDocument)
router.get('/shared-with-me', authMiddleware, getSharedWithMe)
router.get('/my', authMiddleware, getMyDocuments)
router.delete('/:id', authMiddleware, requirePermission('DELETE'), deleteDocumentController)

export default router;