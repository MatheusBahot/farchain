#!/bin/bash
# ============================================================
# FarChain - Script de Inicialização Completa
# Execute: chmod +x scripts/setup.sh && ./scripts/setup.sh
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "  ███████╗ █████╗ ██████╗  ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗"
echo "  ██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗██║████╗  ██║"
echo "  █████╗  ███████║██████╔╝██║     ███████║███████║██║██╔██╗ ██║"
echo "  ██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║██╔══██║██║██║╚██╗██║"
echo "  ██║     ██║  ██║██║  ██║╚██████╗██║  ██║██║  ██║██║██║ ╚████║"
echo "  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝"
echo -e "${NC}"
echo -e "${BLUE}Plataforma de Rastreabilidade Farmacêutica CEAF/SUS${NC}"
echo "========================================================="

# Verificar pré-requisitos
echo -e "\n${YELLOW}[1/6] Verificando pré-requisitos...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js não encontrado!${NC}"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}pnpm não encontrado!${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker não encontrado!${NC}"; exit 1; }
echo -e "${GREEN}✅ Pré-requisitos OK${NC}"

# Configurar .env
echo -e "\n${YELLOW}[2/6] Configurando variáveis de ambiente...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✅ .env criado a partir de .env.example${NC}"
  echo -e "${YELLOW}⚠️  Configure os valores em .env antes de continuar!${NC}"
else
  echo -e "${GREEN}✅ .env já existe${NC}"
fi

# Subir banco de dados
echo -e "\n${YELLOW}[3/6] Iniciando banco de dados PostgreSQL...${NC}"
docker compose -f docker/docker-compose.dev.yml up -d postgres redis
echo "Aguardando PostgreSQL iniciar..."
sleep 8
echo -e "${GREEN}✅ PostgreSQL e Redis iniciados${NC}"

# Instalar dependências
echo -e "\n${YELLOW}[4/6] Instalando dependências...${NC}"
pnpm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Executar migrations Prisma
echo -e "\n${YELLOW}[5/6] Executando migrations do banco...${NC}"
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
cd ../..
echo -e "${GREEN}✅ Banco de dados migrado${NC}"

# Seed inicial
echo -e "\n${YELLOW}[6/6] Populando banco com dados iniciais...${NC}"
cd apps/backend
pnpm prisma db seed || echo -e "${YELLOW}⚠️  Seed falhou ou não configurado ainda${NC}"
cd ../..

echo -e "\n${GREEN}=========================================================${NC}"
echo -e "${GREEN}✅ FarChain configurado com sucesso!${NC}"
echo -e "${GREEN}=========================================================${NC}"
echo ""
echo -e "Para iniciar o projeto, execute:"
echo -e "  ${BLUE}pnpm dev${NC}"
echo ""
echo -e "URLs:"
echo -e "  Frontend:  ${BLUE}http://localhost:5173${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:3001${NC}"
echo -e "  Swagger:   ${BLUE}http://localhost:3001/api/docs${NC}"
echo -e "  pgAdmin:   ${BLUE}http://localhost:5050${NC}"
echo ""
