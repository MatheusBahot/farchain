-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'GESTOR_ESTADUAL', 'GESTOR_MUNICIPAL', 'FARMACEUTICO', 'OPERADOR_CAF', 'AUDITOR', 'VISUALIZADOR', 'PACIENTE');

-- CreateEnum
CREATE TYPE "StatusLote" AS ENUM ('ATIVO', 'QUARENTENA', 'BLOQUEADO', 'VENCIDO', 'RECOLHIDO', 'DESCARTADO', 'DEVOLVIDO');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA_ESTOQUE', 'SAIDA_DISTRIBUICAO', 'TRANSFERENCIA_INTERNA', 'DISPENSACAO_PACIENTE', 'DEVOLUCAO_PACIENTE', 'DEVOLUCAO_FORNECEDOR', 'PERDA', 'VENCIMENTO', 'DESCARTE', 'BLOQUEIO_SANITARIO', 'RECOLHIMENTO', 'AJUSTE_INVENTARIO');

-- CreateEnum
CREATE TYPE "ClasseCEAF" AS ENUM ('COMPONENTE_I_A', 'COMPONENTE_I_B', 'COMPONENTE_II', 'COMPONENTE_III');

-- CreateEnum
CREATE TYPE "FormaFarmaceutica" AS ENUM ('COMPRIMIDO', 'CAPSULA', 'SOLUCAO_ORAL', 'SOLUCAO_INJETAVEL', 'SUSPENSAO_ORAL', 'POMADA', 'CREME', 'GEL', 'INALACAO', 'SUPOSITORIO', 'ADESIVO_TRANSDERMICO', 'PO_INJETAVEL', 'FRASCO_AMPOLA', 'SERINGA_PREENCHIDA', 'CANETA_APLICADORA');

-- CreateEnum
CREATE TYPE "StatusFarmacovigilancia" AS ENUM ('ABERTO', 'EM_INVESTIGACAO', 'ENCERRADO', 'NOTIFICADO_ANVISA');

-- CreateEnum
CREATE TYPE "TipoEventoBlockchain" AS ENUM ('CADASTRO_MEDICAMENTO', 'CRIACAO_LOTE', 'ENTRADA_ESTOQUE', 'MOVIMENTACAO', 'DISPENSACAO', 'FARMACOVIGILANCIA', 'AUDITORIA', 'RECOLHIMENTO', 'BLOQUEIO', 'TEMPERATURA_ALERTA');

-- CreateEnum
CREATE TYPE "StatusAlerta" AS ENUM ('ATIVO', 'RECONHECIDO', 'RESOLVIDO', 'IGNORADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VISUALIZADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "mfaAtivo" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "avatarUrl" TEXT,
    "telefone" TEXT,
    "crfNumero" TEXT,
    "unidadeId" TEXT,
    "ultimoLogin" TIMESTAMP(3),
    "refreshTokenHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distritos_sanitarios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "municipio" TEXT NOT NULL DEFAULT 'Salvador',
    "uf" TEXT NOT NULL DEFAULT 'BA',
    "populacao" INTEGER,
    "area" DOUBLE PRECISION,
    "responsavel" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distritos_sanitarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_saude" (
    "id" TEXT NOT NULL,
    "cnes" TEXT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "cep" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "ehCAF" BOOLEAN NOT NULL DEFAULT false,
    "distritoId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "id" TEXT NOT NULL,
    "dcb" TEXT NOT NULL,
    "nomeComercial" TEXT,
    "principioAtivo" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "distribuidor" TEXT,
    "registroSanitario" TEXT,
    "classeTerapeutica" TEXT NOT NULL,
    "subclasse" TEXT,
    "formaFarmaceutica" "FormaFarmaceutica" NOT NULL,
    "concentracao" TEXT NOT NULL,
    "apresentacao" TEXT NOT NULL,
    "viaAdministracao" TEXT,
    "classeCEAF" "ClasseCEAF" NOT NULL,
    "protocoloClinico" TEXT,
    "cid10" TEXT,
    "gtin" TEXT,
    "codigoEAN" TEXT,
    "temperaturaMin" DOUBLE PRECISION,
    "temperaturaMax" DOUBLE PRECISION,
    "requireCadeiaFria" BOOLEAN NOT NULL DEFAULT false,
    "condicoesArmazenamento" TEXT,
    "custoCentral" DOUBLE PRECISION,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "bula" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id" TEXT NOT NULL,
    "identificadorUnico" TEXT NOT NULL,
    "numeroLote" TEXT NOT NULL,
    "medicamentoId" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "dataFabricacao" TIMESTAMP(3) NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "quantidadeProduzida" INTEGER NOT NULL,
    "quantidadeRecebida" INTEGER NOT NULL,
    "qrCodeUrl" TEXT,
    "qrCodeHash" TEXT,
    "statusSanitario" "StatusLote" NOT NULL DEFAULT 'ATIVO',
    "hashCriptografico" TEXT NOT NULL,
    "notaFiscal" TEXT,
    "fornecedor" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque_lotes" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "localizacao" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estoque_lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "origemId" TEXT,
    "destinoId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "justificativa" TEXT,
    "documentoRef" TEXT,
    "hashBlockchain" TEXT,
    "ip" TEXT,
    "geolocalizacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "cpfHash" TEXT NOT NULL,
    "cartaoSusHash" TEXT,
    "nomeHash" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "genero" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispensacoes" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "medicamentoId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "dataDispensacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dosagem" TEXT,
    "duracaoTratamento" TEXT,
    "cid10" TEXT,
    "prescricaoRef" TEXT,
    "hashBlockchain" TEXT,
    "observacoes" TEXT,

    CONSTRAINT "dispensacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacovigilancia" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "gravidade" TEXT NOT NULL,
    "status" "StatusFarmacovigilancia" NOT NULL DEFAULT 'ABERTO',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataOcorrencia" TIMESTAMP(3) NOT NULL,
    "acaoTomada" TEXT,
    "notificacaoRef" TEXT,
    "hashBlockchain" TEXT,
    "resolucao" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmacovigilancia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocos_blockchain" (
    "id" TEXT NOT NULL,
    "indice" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hashAnterior" TEXT NOT NULL,
    "hashAtual" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "dificuldade" INTEGER NOT NULL DEFAULT 2,
    "dadosJson" TEXT NOT NULL,
    "validado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocos_blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_blockchain" (
    "id" TEXT NOT NULL,
    "blocoId" TEXT,
    "tipoEvento" "TipoEventoBlockchain" NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "entidadeTipo" TEXT NOT NULL,
    "usuarioId" TEXT,
    "dados" TEXT NOT NULL,
    "hashDados" TEXT NOT NULL,
    "assinatura" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_temperatura" (
    "id" TEXT NOT NULL,
    "loteId" TEXT NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "umidade" DOUBLE PRECISION,
    "sensor" TEXT,
    "localizacao" TEXT,
    "conformidade" BOOLEAN NOT NULL DEFAULT true,
    "alertaGerado" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_temperatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "entidadeTipo" TEXT NOT NULL,
    "usuarioId" TEXT,
    "status" "StatusAlerta" NOT NULL DEFAULT 'ATIVO',
    "prioridade" TEXT NOT NULL DEFAULT 'MEDIA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvidoEm" TIMESTAMP(3),

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "valorAntes" TEXT,
    "valorDepois" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "geolocalizacao" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "distritos_sanitarios_codigo_key" ON "distritos_sanitarios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_saude_cnes_key" ON "unidades_saude"("cnes");

-- CreateIndex
CREATE UNIQUE INDEX "lotes_identificadorUnico_key" ON "lotes"("identificadorUnico");

-- CreateIndex
CREATE UNIQUE INDEX "lotes_hashCriptografico_key" ON "lotes"("hashCriptografico");

-- CreateIndex
CREATE UNIQUE INDEX "estoque_lotes_loteId_unidadeId_key" ON "estoque_lotes"("loteId", "unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpfHash_key" ON "pacientes"("cpfHash");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cartaoSusHash_key" ON "pacientes"("cartaoSusHash");

-- CreateIndex
CREATE UNIQUE INDEX "blocos_blockchain_indice_key" ON "blocos_blockchain"("indice");

-- CreateIndex
CREATE UNIQUE INDEX "blocos_blockchain_hashAtual_key" ON "blocos_blockchain"("hashAtual");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_saude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_saude" ADD CONSTRAINT "unidades_saude_distritoId_fkey" FOREIGN KEY ("distritoId") REFERENCES "distritos_sanitarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "medicamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_lotes" ADD CONSTRAINT "estoque_lotes_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_lotes" ADD CONSTRAINT "estoque_lotes_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_saude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "unidades_saude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "unidades_saude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacoes" ADD CONSTRAINT "dispensacoes_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacoes" ADD CONSTRAINT "dispensacoes_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "medicamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacoes" ADD CONSTRAINT "dispensacoes_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacoes" ADD CONSTRAINT "dispensacoes_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades_saude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacoes" ADD CONSTRAINT "dispensacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacovigilancia" ADD CONSTRAINT "farmacovigilancia_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacovigilancia" ADD CONSTRAINT "farmacovigilancia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_blockchain" ADD CONSTRAINT "eventos_blockchain_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos_blockchain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_blockchain" ADD CONSTRAINT "eventos_blockchain_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_blockchain" ADD CONSTRAINT "fk_evento_lote" FOREIGN KEY ("entidadeId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_temperatura" ADD CONSTRAINT "registros_temperatura_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
