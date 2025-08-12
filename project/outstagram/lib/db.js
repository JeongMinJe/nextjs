// Prisma 데이터베이스 클라이언트를 생성하고 관리하는 파일
// 개발 중 hot reload로 인한 중복 연결을 방지합니다

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db