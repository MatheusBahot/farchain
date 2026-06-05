import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await argon2.hash('FarChain@2024');

  const user = await prisma.usuario.upsert({
    where: { email: 'admin@farchain.gov.br' },
    update: {
      nome: 'Administrador FarmaChain',
      senhaHash,
      ativo: true,
      emailVerificado: true,
      role: 'SUPER_ADMIN',
    },
    create: {
      nome: 'Administrador FarmaChain',
      email: 'admin@farchain.gov.br',
      cpf: '00000000001',
      senhaHash,
      role: 'SUPER_ADMIN',
      ativo: true,
      emailVerificado: true,
    },
  });

  console.log('Admin criado/atualizado:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
