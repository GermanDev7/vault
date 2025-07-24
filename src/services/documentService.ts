import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '../config/s3'
import { PrismaClient, Permission } from '@prisma/client'
import { randomUUID, createHash } from 'crypto'
import { encrypt } from '../utils/encryptUtils'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { decrypt } from '../utils/encryptUtils'


const prisma = new PrismaClient()
const bucket = process.env.s3_BUCKET_NAME as string

export const uploadDocument = async (
    file: Express.Multer.File,
    userId: string
) => {
    const key = `documents/${randomUUID()}-${file.originalname}`

    const encriptedS3Key = encrypt(key)

    const hash = createHash('sha256').update(key).digest('hex')

    //subir a s3

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    await s3.send(command)

    const document = await prisma.document.create({
        data: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            s3Url: encriptedS3Key,
            keyHash: hash,
            ownerId: userId
        }
    })

    return document
}

export const sharewithUser = async (
    documentId: string,
    ownerId: string,
    targetUserId: string,
    permissions: Permission[]
) => {
    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) throw new Error('Documento no encontrado');
    if (document.ownerId !== ownerId) throw new Error('No autorizado');

    const existing = await prisma.sharedDocument.findFirst({
        where: {
            documentId,
            userId: targetUserId
        }
    });

    if (existing) throw new Error('Ya se compartio con este usuario');

    await prisma.sharedDocument.create({
        data: {
            documentId,
            userId: targetUserId,
            permissions
        }
    })
}

export const getDocumentsSharedWithUser = async (userId: string) => {
    const shareDocs = await prisma.sharedDocument.findMany({
        where: { userId },
        include: {
            document: {
                include: {
                    owner: {
                        select: { id: true, email: true }
                    }
                }

            }
        }
    })


    return shareDocs.map((s) => ({
        id: s.document.id,
        name: s.document.name,
        type: s.document.type,
        size: s.document.size,
        owner: s.document.owner,
        permission: s.permissions,
        createdAt: s.document.createdAt
    }))
}

export const deleteDocument = async (documentId: string, userId: string) => {
    const document = await prisma.document.findUnique({
        where: {
            id: documentId
        }
    })

    if (!document) throw new Error('Documento no encontrado')

    const decryptedKey = decrypt(document.s3Url)
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: decryptedKey
    })

    await s3.send(command)

    await prisma.sharedDocument.deleteMany({
        where:{id:documentId}
    })

    return {message:'Documento eliminado correctamente'}
}