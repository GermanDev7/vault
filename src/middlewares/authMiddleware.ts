import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../interface/generics'



export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: 'Token no proporcionado' })
    }

    const token = authHeader!.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
            (req as AuthRequest).user = decoded as { id: string; role: string }
        }
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token invalido o expirado' });
    }
}