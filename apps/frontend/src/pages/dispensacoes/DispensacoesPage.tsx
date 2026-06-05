import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Hash,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Syringe,
  User,
  X,
} from 'lucide-react';
import { api } from '@services/api';

type MedicamentoLote = {
  medicamento: string;
  numeroLote: string;
};

const vazio = {
  nome: '',
  cpf: '',
  cns: '',
  dataNascimento: '',
  sexo: '',
  municipio: '',
  distritoSanitario: '',
  unidadeSaude: '',
  telefone: '',
  cid10: '',
  diagnostico: '',
  medico: '',
  crm: '',
  dataPrescricao: '',
  validadePrescricao: '',
  medicamento: '',
  lote: '',
  quantidade: '',
  dataDispensacao: '',
  farmaceutico: '',
  crf: '',
  localDispensacao: '',
  temperaturaSaida: '',
  status: '',
  latitude: '',
  longitude: '',
};

export default function DispensacoesPage() {
  const [open, setOpen] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(vazio);
  const [medicamentos, setMedicamentos] = useState<MedicamentoLote[]>([]);
  const [dispensacoes, setDispensacoes] = useState<any[]>([]);

  async function carregar() {
    try {
      const meds = await api.get('/tcc/medicamentos-lotes');
      setMedicamentos(meds.data?.data || meds.data || []);

      const disp = await api.get('/tcc/dispensacoes');
      setDispensacoes(disp.data?.data || disp.data || []);
    } catch (error) {
      console.error('Erro ao carregar dispensações:', error);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovaDispensacao() {
    setForm(vazio);
    setEtapa(1);
    setOpen(true);
  }

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function usarGPS() {
    if (!navigator.geolocation) {
      atualizar('latitude', '-12.9704');
      atualizar('longitude', '-38.5124');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        atualizar('latitude', String(pos.coords.latitude));
        atualizar('longitude', String(pos.coords.longitude));
      },
      () => {
        atualizar('latitude', '-12.9704');
        atualizar('longitude', '-38.5124');
      },
    );
  }

  async function finalizar() {
    if (!form.nome || !form.cpf || !form.cns || !form.medicamento || !form.lote) {
      alert('Preencha paciente, CPF, CNS, medicamento e lote.');
      return;
    }

    try {
      await api.post('/tcc/dispensacao', form);
      await carregar();

      setForm(vazio);
      setEtapa(1);
      setOpen(false);

      alert('Dispensação finalizada e registrada na blockchain.');
    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar dispensação.');
    }
  }

  return (
    <div className="space-y-5 text-slate-950">
      <section className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
          Assistência farmacêutica
        </p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.055em] md:text-5xl">
              Dispensações.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Registre a entrega do medicamento ao paciente com prescrição, hash,
              lote, localização GPS e trilha blockchain.
            </p>
          </div>

          <button
            onClick={abrirNovaDispensacao}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
          >
            <Plus size={17} />
            Nova dispensação
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Syringe} label="Dispensações" value={String(dispensacoes.length)} />
        <Metric icon={Hash} label="Hash paciente" value="SHA-256" />
        <Metric icon={MapPin} label="GPS" value="Ativo" />
        <Metric icon={ShieldCheck} label="LGPD" value="Pseudonimizado" />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
        <h2 className="text-lg font-black">Dispensações registradas</h2>
        <p className="mt-1 text-xs text-slate-500">
          As dispensações finalizadas aparecerão aqui.
        </p>

        <div className="mt-5 grid gap-4">
          {dispensacoes.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              Nenhuma dispensação registrada.
            </div>
          ) : (
            dispensacoes.map((d) => (
              <div key={d.id} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                      {d.status}
                    </p>
                    <h3 className="mt-2 text-xl font-black">{d.medicamento}</h3>
                    <p className="text-sm text-slate-500">
                      Lote {d.lote} · {d.quantidade}
                    </p>
                  </div>
                  <CheckCircle2 className="text-emerald-500" />
                </div>

                <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                  <Info label="Paciente" value={d.nome} />
                  <Info label="Hash do paciente" value={d.pacienteHash} />
                  <Info label="Farmacêutico" value={`${d.farmaceutico} · ${d.crf}`} />
                  <Info label="GPS" value={`${d.latitude}, ${d.longitude}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">
                  Etapa {etapa} de 3
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                  {etapa === 1 && 'Dados do paciente'}
                  {etapa === 2 && 'Prescrição médica'}
                  {etapa === 3 && 'Dados da dispensação'}
                </h2>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className={`h-2 rounded-full ${etapa >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  <div className={`h-2 rounded-full ${etapa >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  <div className={`h-2 rounded-full ${etapa >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {etapa === 1 && (
                <FormBlock title="Paciente" icon={User}>
                  <Input label="Nome" value={form.nome} onChange={(v: string) => atualizar('nome', v)} />
                  <Input label="CPF" value={form.cpf} onChange={(v: string) => atualizar('cpf', v)} />
                  <Input label="CNS" value={form.cns} onChange={(v: string) => atualizar('cns', v)} />
                  <Input label="Data de nascimento" value={form.dataNascimento} onChange={(v: string) => atualizar('dataNascimento', v)} />
                  <Input label="Sexo" value={form.sexo} onChange={(v: string) => atualizar('sexo', v)} />
                  <Input label="Município" value={form.municipio} onChange={(v: string) => atualizar('municipio', v)} />
                  <Input label="Distrito Sanitário" value={form.distritoSanitario} onChange={(v: string) => atualizar('distritoSanitario', v)} />
                  <Input label="Unidade de Saúde" value={form.unidadeSaude} onChange={(v: string) => atualizar('unidadeSaude', v)} />
                  <Input label="Telefone" value={form.telefone} onChange={(v: string) => atualizar('telefone', v)} />
                </FormBlock>
              )}

              {etapa === 2 && (
                <FormBlock title="Prescrição" icon={FileText}>
                  <Input label="CID-10" value={form.cid10} onChange={(v: string) => atualizar('cid10', v)} />
                  <Input label="Diagnóstico" value={form.diagnostico} onChange={(v: string) => atualizar('diagnostico', v)} />
                  <Input label="Médico" value={form.medico} onChange={(v: string) => atualizar('medico', v)} />
                  <Input label="CRM" value={form.crm} onChange={(v: string) => atualizar('crm', v)} />
                  <Input label="Data da Prescrição" value={form.dataPrescricao} onChange={(v: string) => atualizar('dataPrescricao', v)} />
                  <Input label="Validade da Prescrição" value={form.validadePrescricao} onChange={(v: string) => atualizar('validadePrescricao', v)} />
                </FormBlock>
              )}

              {etapa === 3 && (
                <FormBlock title="Dispensação" icon={Syringe}>
                  <Select
                    label="Medicamento"
                    value={form.medicamento}
                    onChange={(v: string) => atualizar('medicamento', v)}
                    options={[...new Set(medicamentos.map((m) => m.medicamento))]}
                  />

                  <Select
                    label="Lote"
                    value={form.lote}
                    onChange={(v: string) => atualizar('lote', v)}
                    options={medicamentos.map((m) => m.numeroLote)}
                  />

                  <Input label="Quantidade" value={form.quantidade} onChange={(v: string) => atualizar('quantidade', v)} />
                  <Input label="Data da Dispensação" value={form.dataDispensacao} onChange={(v: string) => atualizar('dataDispensacao', v)} />
                  <Input label="Farmacêutico" value={form.farmaceutico} onChange={(v: string) => atualizar('farmaceutico', v)} />
                  <Input label="CRF" value={form.crf} onChange={(v: string) => atualizar('crf', v)} />
                  <Input label="Local de Dispensação" value={form.localDispensacao} onChange={(v: string) => atualizar('localDispensacao', v)} />
                  <Input label="Temperatura de saída" value={form.temperaturaSaida} onChange={(v: string) => atualizar('temperaturaSaida', v)} />
                  <Input label="Status" value={form.status} onChange={(v: string) => atualizar('status', v)} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label="Latitude" value={form.latitude} onChange={(v: string) => atualizar('latitude', v)} />
                    <Input label="Longitude" value={form.longitude} onChange={(v: string) => atualizar('longitude', v)} />
                  </div>

                  <button
                    type="button"
                    onClick={usarGPS}
                    className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-700 hover:bg-slate-200"
                  >
                    <MapPin size={16} />
                    Capturar GPS
                  </button>
                </FormBlock>
              )}
            </div>

            <div className="flex justify-between gap-3 border-t border-slate-100 p-6">
              <button
                onClick={() => etapa === 1 ? setOpen(false) : setEtapa(etapa - 1)}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
              >
                {etapa === 1 ? 'Cancelar' : 'Voltar'}
              </button>

              {etapa < 3 ? (
                <button
                  onClick={() => setEtapa(etapa + 1)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
                >
                  Próximo <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  onClick={finalizar}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500"
                >
                  <Save size={17} />
                  Finalizar dispensação
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormBlock({ title, icon: Icon, children }: any) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      >
        <option value="">Selecione</option>
        {options.map((op: string) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,.08)]">
      <Icon className="text-blue-600" size={22} />
      <p className="mt-5 text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.05em]">{value}</p>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all font-bold text-slate-700">
        {value || '—'}
      </p>
    </div>
  );
}
