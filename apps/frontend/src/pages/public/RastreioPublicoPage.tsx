import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { qrCodeApi } from '@services/api';
import {
  CheckCircle2, AlertTriangle, XCircle, Clock, Package,
  Building2, Link2, ArrowRight, Shield,
} from 'lucide-react';
import clsx from 'clsx';

const statusConfig = {
  INTEGRO: { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-500/10', border: 'border-success-500/30', label: '✓ Produto íntegro e autenticado' },
  VALIDADE_PROXIMA: { icon: Clock, color: 'text-warning-500', bg: 'bg-warning-500/10', border: 'border-warning-500/30', label: '⚠ Validade próxima ao vencimento' },
  VENCIDO: { icon: XCircle, color: 'text-danger-500', bg: 'bg-danger-500/10', border: 'border-danger-500/30', label: '✗ Produto vencido' },
  BLOQUEADO: { icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-500/10', border: 'border-danger-500/30', label: '✗ Produto bloqueado pela ANVISA' },
};

export default function RastreioPublicoPage() {
  const { hash } = useParams<{ hash: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rastreio', hash],
    queryFn: () => qrCodeApi.consultar(hash!),
    enabled: !!hash,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grafite-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-grafite-400">Consultando blockchain...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-grafite-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <XCircle size={48} className="text-danger-500 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Produto não encontrado</h2>
          <p className="text-grafite-400 text-sm">
            O QR Code consultado não corresponde a nenhum produto 
            registrado no FarChain. Verifique a autenticidade do medicamento.
          </p>
        </div>
      </div>
    );
  }

  const status = statusConfig[data.statusConsulta as keyof typeof statusConfig] || statusConfig.INTEGRO;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-grafite-950 text-white">
      {/* Header */}
      <div className="bg-grafite-900 border-b border-grafite-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 
                            flex items-center justify-center">
              <Link2 size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">
              Far<span className="text-primary-400">Chain</span>
            </span>
            <span className="text-grafite-500 text-sm ml-2">— Consulta Pública</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-grafite-500">
            <Shield size={12} />
            LGPD
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx('rounded-2xl border p-6', status.bg, status.border)}
        >
          <div className="flex items-center gap-3">
            <StatusIcon size={28} className={status.color} />
            <div>
              <p className={clsx('font-bold text-lg', status.color)}>{status.label}</p>
              <p className="text-grafite-400 text-sm mt-1">
                Consulta realizada em {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Medicamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Package size={18} className="text-primary-400" />
            Informações do Medicamento
          </h3>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <dt className="text-grafite-500">DCB</dt>
              <dd className="text-white font-medium">{data.medicamento?.dcb}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Nome Comercial</dt>
              <dd className="text-white">{data.medicamento?.nomeComercial || '—'}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Fabricante</dt>
              <dd className="text-white">{data.medicamento?.fabricante}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Forma Farmacêutica</dt>
              <dd className="text-white">{data.medicamento?.formaFarmaceutica}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Classe CEAF</dt>
              <dd className="text-white">{data.medicamento?.classeCEAF}</dd>
            </div>
            {data.medicamento?.requireCadeiaFria && (
              <div className="col-span-2">
                <dd className="badge badge-warning">❄ Requer Cadeia Fria</dd>
              </div>
            )}
          </dl>
        </motion.div>

        {/* Lote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Package size={18} className="text-teal-400" />
            Dados do Lote
          </h3>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <dt className="text-grafite-500">Nº do Lote</dt>
              <dd className="text-white font-mono">{data.lote?.numeroLote}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Fabricante</dt>
              <dd className="text-white">{data.lote?.fabricante}</dd>
            </div>
            <div>
              <dt className="text-grafite-500">Fabricação</dt>
              <dd className="text-white">
                {data.lote?.dataFabricacao
                  ? new Date(data.lote.dataFabricacao).toLocaleDateString('pt-BR')
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-grafite-500">Validade</dt>
              <dd className={clsx('font-medium',
                data.diasParaVencer <= 0 ? 'text-danger-400' :
                data.diasParaVencer <= 30 ? 'text-warning-400' : 'text-success-400'
              )}>
                {data.lote?.dataValidade
                  ? new Date(data.lote.dataValidade).toLocaleDateString('pt-BR')
                  : '—'}
                {data.diasParaVencer > 0 && (
                  <span className="text-grafite-500 font-normal ml-1">
                    ({data.diasParaVencer} dias)
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-4 pt-4 border-t border-grafite-700">
            <dt className="text-grafite-500 text-xs mb-1">Hash criptográfico</dt>
            <dd className="text-grafite-400 font-mono text-xs break-all">
              {data.lote?.hashCriptografico}
            </dd>
          </div>
        </motion.div>

        {/* Localização atual */}
        {data.localizacaoAtual?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-primary-400" />
              Localização Atual
            </h3>
            {data.localizacaoAtual.map((loc: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm py-2">
                <div>
                  <p className="text-white font-medium">{loc.unidade}</p>
                  <p className="text-grafite-500">{loc.tipo} · {loc.municipio}</p>
                </div>
                <span className="badge badge-primary">{loc.quantidade} un.</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Histórico */}
        {data.historico?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowRight size={18} className="text-teal-400" />
              Histórico Logístico
            </h3>
            <div className="space-y-3">
              {data.historico.map((h: any, i: number) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                  <div className="flex-1">
                    <span className="text-white">{h.tipo.replace(/_/g, ' ')}</span>
                    {h.origem && <span className="text-grafite-500 ml-1">de {h.origem}</span>}
                    {h.destino && <span className="text-grafite-500 ml-1">→ {h.destino}</span>}
                  </div>
                  <span className="text-grafite-600 text-xs">
                    {new Date(h.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blockchain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 border-primary-500/20"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Link2 size={18} className="text-primary-400" />
            Registro Blockchain
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-primary-400">{data.blockchain?.totalEventos}</p>
              <p className="text-grafite-500 text-xs">Eventos registrados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-400">
                <CheckCircle2 size={28} className="mx-auto" />
              </p>
              <p className="text-grafite-500 text-xs">Cadeia íntegra</p>
            </div>
            <div>
              <p className="text-xs font-mono text-grafite-400 break-all">
                {data.blockchain?.ultimoHash?.substring(0, 12)}...
              </p>
              <p className="text-grafite-500 text-xs mt-1">Último hash</p>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-grafite-600 pb-8">
          Esta consulta não exibe dados pessoais. Informações protegidas pela LGPD.
          <br />FarChain · Plataforma de Rastreabilidade CEAF/SUS
        </p>
      </div>
    </div>
  );
}
