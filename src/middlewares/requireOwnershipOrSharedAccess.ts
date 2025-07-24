import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../interface/generics'

const prisma = new PrismaClient();

export const requireOwnershipOrSharedAccess = (permission: 'DOWNLOAD' | 'DELETE' | 'SHARE') => {
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.id
        const docId = req.params.id;

        try {

            const document = await prisma.document.findUnique({
                where: { id: docId },
                include: { sharedWith: true }
            })

            if (!document) {
                res.status(404).json({ message: 'Documento no encontrado' });

            }

            const isOwner = document?.ownerId === userId;
            const isShared = document?.sharedWith.some(shared => shared.userId === userId && shared.permissions.includes(permission))

            if (!isOwner && !isShared) {
                res.status(403).json({ message: 'No tiene acceso a este documento' })
            }

            (req as any).document = document
        }
        catch (err) {
            res.status(500).json({ message: 'Error validando el acceso al documento' })
        }
    }
}

