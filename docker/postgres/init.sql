-- FarChain - Inicialização do Banco de Dados
-- Este script é executado apenas na primeira criação do container

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurações de timezone
SET timezone = 'America/Bahia';

-- Comentário de identificação
COMMENT ON DATABASE farchain_db IS 'FarChain - Plataforma de Rastreabilidade Farmacêutica CEAF/SUS';
