import { RequestHandler, Request, Response } from 'express'
import { sharewithUser, getDocumentsSharedWithUser, deleteDocument } from '../services/documentService'
import { uploadDocument } from '../services/documentService'
import { AuthRequest } from '../interface/generics'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
export const upload: RequestHandler<any, any, any, any> = async (
    req,
    res
) => {
    const file = (req as AuthRequest).file
    const user = (req as AuthRequest).user

    if (!file) {
        res.status(400).json({ message: 'Archivo no recibido' })
        return
    }

    try {
        const document = await uploadDocument(file, user!.id)
        res.status(201).json({ message: 'Archivo subido', document })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: 'Error al subir el documento' })
    }
}

export const shareDocument = async (req: AuthRequest, res: Response) => {
    const { id: documentId } = req.params;
    const { targetUserId, permission } = req.body;

    try {
        await sharewithUser(documentId, req.user!.id, targetUserId, permission);
        res.status(200).json({ message: 'Documento compartido exitosamente' });
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}

export const getSharedWithMe = async (req: AuthRequest, res: Response) => {
    try {
        const documents = await getDocumentsSharedWithUser(req.user!.id);
        res.status(200).json(documents)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener documentos compartidos', error })
    }
}


export const getMyDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const documents = await prisma.document.findMany({
            where: { ownerId: req.user!.id },

        });
        res.status(200).json(documents)

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener tus documentos', error: err });
    }
}

export const deleteDocumentController = async (req: AuthRequest, res: Response) => {

    const documentId = req.params.id
    const userId = (req as any).user?.id

    try {
        const result = await deleteDocument(documentId, userId)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el documento', error: err })
    }
}


