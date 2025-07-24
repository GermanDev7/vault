
import { Request, Response, NextFunction } from 'express'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/pgn', 'image/jpeg']

export const fileValidator = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'Archivo no recibio' })
    }

    if (file!.size > MAX_FILE_SIZE) {
        res.status(400).json({ message: 'El archivo excede el tamaño permitido(5 MB)' })
    }

    if (!ALLOWED_MIME_TYPES.includes(file!.mimetype)) {
        res.status(400).json({ message: 'Tipo de archivo no permitido' })
    }

    next()
}