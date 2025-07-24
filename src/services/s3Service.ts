import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '../config/s3'
import { PrismaClient } from "@prisma/client";
import fs from 'fs'
import { decrypt } from '../utils/encryptUtils';

const prisma = new PrismaClient()

export const uploadFileToS3 = async (filePath: string, fileName: string) => {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileStream
    });

    await s3.send(command)
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export const getFileUrlFromS3 = async (fileName: string) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName
    })

    return await getSignedUrl(s3, command, { expiresIn: 3600 })
}

export const getSignedDownloadUrl = async (docId: string, userId: string) => {

    const doc = await prisma.document.findUnique({
        where: { id: docId },
        include: {
            sharedWith: true
        }
    })

    if (!doc) throw new Error('Documento no encontrado')

    const isOwner = doc.ownerId === userId
    const isShared = doc.sharedWith.some(s => s.userId === userId)

    if (!isOwner && !isShared) {

        throw new Error('No tienes acceso a este documento')
    }

    const decriptedKey = decrypt(doc.s3Url)

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: decriptedKey,
    });



    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}
