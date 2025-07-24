import { Permission } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const requirePermission = (permission: Permission) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id
        const documentId = req.params.id

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { sharedWith: true }
        })

        if (!document) { res.status(404).json({ message: 'Documento no encontrado' }) }

        const isOwner = document!.ownerId === userId
        const isPermitted = document?.sharedWith.some(shared =>
            shared.userId === userId && shared.permissions.includes(permission)
        )

        if (!isOwner && !isPermitted) {
            res.status(403).json({ message: `Permiso ${permission} requerido` })
        }
        next()
    }
}