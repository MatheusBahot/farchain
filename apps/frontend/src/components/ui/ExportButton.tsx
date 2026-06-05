import { useState } from 'react';
import { Download, FileText, FileJson, Table, Printer } from 'lucide-react';

type ExportFormat = 'csv' | 'json' | 'tsv' | 'pdf';

interface ExportButtonProps {
  filename?: string;
  data?: Record<string, any>[];

  nomeArquivo?: string;
  dados?: Record<string, any>[];
  titulo?: string;
  subtitulo?: string;
  colunas?: Array<{ key: string; label: string }>;
}

export default function ExportButton(props: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const filename = props.filename || props.nomeArquivo || 'farchain-export';
  const data = props.data || props.dados || [];

  function exportData(format: ExportFormat) {
    const rows = data.length ? data : [
      { modulo: 'FarmaChain', status: 'Ativo', conformidade: 'LGPD', auditoria: 'Blockchain' },
    ];

    if (format === 'pdf') {
      window.print();
      return;
    }

    let content = '';
    let mime = 'text/plain;charset=utf-8';

    if (format === 'json') {
      content = JSON.stringify(rows, null, 2);
      mime = 'application/json;charset=utf-8';
    }

    if (format === 'csv' || format === 'tsv') {
      const sep = format === 'csv' ? ',' : '\t';
      const headers = props.colunas?.length
        ? props.colunas.map((c) => c.key)
        : Object.keys(rows[0]);

      const labels = props.colunas?.length
        ? props.colunas.map((c) => c.label)
        : headers;

      content = '\uFEFF' + [
        labels.join(sep),
        ...rows.map((r) =>
          headers
            .map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`)
            .join(sep),
        ),
      ].join('\n');

      mime = format === 'csv'
        ? 'text/csv;charset=utf-8'
        : 'text/tab-separated-values;charset=utf-8';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();

    URL.revokeObjectURL(url);
    setOpen(false);
  }

  const items = [
    { label: 'CSV UTF-8', format: 'csv' as const, icon: FileText },
    { label: 'JSON', format: 'json' as const, icon: FileJson },
    { label: 'TSV', format: 'tsv' as const, icon: Table },
    { label: 'PDF / Print', format: 'pdf' as const, icon: Printer },
  ];

  return (
    <div className="relative print:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
      >
        <Download size={16} />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.format}
                type="button"
                onClick={() => exportData(item.format)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
