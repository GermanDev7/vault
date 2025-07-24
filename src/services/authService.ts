import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateToken } from '../config/jwt'


const prisma = new PrismaClient()

export const registerUser = async (email: string, password: string) => {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('Usuario ya existente')

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { email, password: hashed }
    })

    const token = generateToken({ id: user!.id, role: user!.role })
    return token
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Usuario no encontrado')

    const valid = await bcrypt.compare(password, user!.password)
    if (!valid) throw new Error('Credenciales invalidas')

    const token = generateToken({ id: user!.id, role: user!.role })
    return token

}