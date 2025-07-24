import { Router } from 'express'
import authRoutes from './authRoutes'
import documentRoutes from './documentRoutes'
import s3Routes from './s3Routes'
const router = Router();

router.use('/auth', authRoutes)
router.use('/documents', documentRoutes)
router.use('/s3', s3Routes);

export default router;