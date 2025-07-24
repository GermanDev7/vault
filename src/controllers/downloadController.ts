import { Request, Response } from 'express';
import { getSignedDownloadUrl } from '../services/s3Service';
import { AuthRequest } from '../interface/generics';

export const downloadFile = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const signedUrl = await getSignedDownloadUrl(id, req.user!.id);
        res.status(200).json({ signedUrl });
    } catch (err: any) {
        res.status(500).json({ message: "Error al generar la descarga", error: err });
    }
}