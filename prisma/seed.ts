import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const players = await prisma.player.createManyAndReturn({
    data: [
      {
        name: 'Nezumikun',
        email: 'nezumikun@yandex.ru',
        role: 'ADMIN',
        password: await bcrypt.hash('12345678', 10),
        fullName: 'Кожевников Алексей'
      },
      {
        name: 'Katevnik',
        email: 'e.kozhevnikova@gmail.com',
        password: await bcrypt.hash('katevnik', 10),
        fullName: 'Кожевникова Екатерина'
      },
      {
        name: 'Sneppk',
        email: 'diana@murchat.ru',
        password: await bcrypt.hash('diana123', 10),
        fullName: 'Кожевникова Диана'
      },
      {
        name: 'Yonji',
        email: 'none@none',
        password: await bcrypt.hash('9874563112', 10),
        fullName: 'Четвёртый игрок'
      }
    ]
  })
  console.log(`Created users: `, players.map(x => x.name).join(', '))
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
