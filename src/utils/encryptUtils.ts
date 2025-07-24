import crypto from 'crypto';

const algorithm = 'aes-256-cbc'
const secretKey = process.env.AES_SECRET as string
const ivLength = 16

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(ivLength)
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
    let encripted = cipher.final('hex')
    return iv.toString('hex') + ':' + encripted
}
export function decrypt(encrypted: string): string {
    const [ivHex, encryptedText] = encrypted.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
}