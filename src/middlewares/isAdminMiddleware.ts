import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../interface/generics'


export const isAdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Acceso denegado se requiere el tol de admin' })
    }
    next()
}