import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Link2, CheckCircle2, XCircle, RefreshCw, Database,
  Clock, Hash, Shield,
} from 'lucide-react';
import { blockchainApi } from '@services/api';
import { Badge } from '@components/ui/Badge';
import { Pagination } from '@components/ui/Pagination';
import { PageSpinner } from '@components/ui/Spinner';
import { usePagination } from '@hooks/usePagination';
import type { BlocoBlockchain } from '../../types';

function HashDisplay({ hash }: { hash: string }) {
  return (
    <span className="font-mono text-xs text-primary-600 dark:text-primary-400 break-all">
      {hash.substring(0, 16)}...{hash.substring(hash.length - 8)}
    </span>
  );
}

export default function BlockchainPage() {
  const { pagina, limite, irParaPagina } = usePagination(10);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['blockchain', 'blocos', pagina],
    queryFn: () => blockchainApi.listarBlocos({ pagina, limite }),
    refetchInterval: 15_000,
  });

  const { data: validacao, refetch: revalidar, isFetching: validando } = useQuery({
    queryKey: ['blockchain', 'validacao'],
    queryFn: blockchainApi.validar,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-white flex items-center gap-2">
            <Link2 size={24} className="text-primary-500" />
            Ledger Blockchain
          </h1>
          <p className="text-grafite-500 text-sm mt-0.5">
            SHA-256 · Permissionado · Imutável · Proof-of-Work
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => revalidar()}
            disabled={validando}
            className="btn-secondary text-sm gap-2"
          >
            <Shield size={15} /> Validar Cadeia
          </button>
          <button onClick={() => refetch()} className="btn-ghost p-2.5 rounded-xl">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Status da cadeia */}
      {validacao && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border ${
            validacao.valida
              ? 'bg-success-500/10 border-success-500/20'
              : 'bg-danger-500/10 border-danger-500/20'
          }`}
        >
          {validacao.valida ? (
            <CheckCircle2 size={20} className="text-success-500" />
          ) : (
            <XCircle size={20} className="text-danger-500" />
          )}
          <div>
            <p className={`font-semibold ${validacao.valida ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
              {validacao.valida ? 'Cadeia íntegra — Nenhuma adulteração detectada' : `Adulteração detectada: ${validacao.erro}`}
            </p>
            <p className="text-grafite-400 text-xs mt-0.5">
              Validação realizada em {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Blocos', valor: data?.total ?? 0, icon: Database, cor: 'text-primary-400' },
          { label: 'Algoritmo', valor: 'SHA-256', icon: Hash, cor: 'text-teal-400' },
          { label: 'Dificuldade PoW', valor: '2 zeros', icon: Shield, cor: 'text-warning-400' },
          { label: 'Atualização', valor: '15s', icon: Clock, cor: 'text-grafite-400' },
        ].map((m) => (
          <div key={m.label} className="card p-4 text-center">
            <m.icon size={20} className={`mx-auto mb-2 ${m.cor}`} />
            <p className="font-bold text-grafite-900 dark:text-white">{m.valor}</p>
            <p className="text-xs text-grafite-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Blocos */}
      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="space-y-3">
          {(data?.blocos ?? []).map((bloco: BlocoBlockchain, i: number) => (
            <motion.div
              key={bloco.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20
                                  flex items-center justify-center font-mono font-bold text-primary-500 text-sm">
                    #{bloco.indice}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-grafite-900 dark:text-white text-sm">
                        Bloco #{bloco.indice}
                      </span>
                      {bloco.validado ? (
                        <Badge variant="success" dot>Válido</Badge>
                      ) : (
                        <Badge variant="danger" dot>Inválido</Badge>
                      )}
                      {bloco.indice === 0 && (
                        <Badge variant="primary">Gênesis</Badge>
                      )}
                    </div>
                    <p className="text-xs text-grafite-400 mt-0.5">
                      {new Date(bloco.createdAt).toLocaleString('pt-BR')} ·
                      Nonce: {bloco.nonce} · Dif: {bloco.dificuldade}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-grafite-400">
                    {bloco.eventos?.length ?? 0} evento(s)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-grafite-50 dark:bg-grafite-800/50 rounded-xl p-3">
                  <p className="text-grafite-400 mb-1">Hash Anterior:</p>
                  <HashDisplay hash={bloco.hashAnterior} />
                </div>
                <div className="bg-primary-500/5 border border-primary-500/10 rounded-xl p-3">
                  <p className="text-grafite-400 mb-1">Hash Atual:</p>
                  <HashDisplay hash={bloco.hashAtual} />
                </div>
              </div>

              {bloco.eventos && bloco.eventos.length > 0 && (
                <div className="mt-3 pt-3 border-t border-grafite-100 dark:border-grafite-800">
                  <p className="text-xs text-grafite-400 mb-2">Eventos:</p>
                  <div className="flex flex-wrap gap-2">
                    {bloco.eventos.map((ev: any) => (
                      <span key={ev.id}
                        className="px-2 py-0.5 rounded-md bg-grafite-100 dark:bg-grafite-800 
                                   text-xs text-grafite-600 dark:text-grafite-400">
                        {ev.tipoEvento}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {data && (
        <Pagination pagina={pagina} total={data.total} limite={limite} onChange={irParaPagina} />
      )}
    </div>
  );
}
