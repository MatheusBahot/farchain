/**
 * FarChain — Utilitários de Exportação
 * Suporta: CSV, JSON, PDF (via print), XLSX-like (TSV)
 */

// ── CSV ──────────────────────────────────────────────────────
export function exportarCSV<T extends Record<string, any>>(
  dados: T[],
  nomeArquivo: string,
  colunas?: { key: keyof T; label: string }[],
) {
  if (!dados.length) return;

  const cols = colunas ?? Object.keys(dados[0]).map(k => ({ key: k as keyof T, label: k }));
  const header = cols.map(c => `"${String(c.label)}"`).join(',');

  const rows = dados.map(row =>
    cols.map(c => {
      const val = row[c.key];
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(','),
  );

  const bom = '\uFEFF';
  const csv = bom + [header, ...rows].join('\r\n');
  baixarArquivo(csv, `${nomeArquivo}.csv`, 'text/csv;charset=utf-8;');
}

// ── JSON ─────────────────────────────────────────────────────
export function exportarJSON<T>(dados: T, nomeArquivo: string) {
  const json = JSON.stringify(dados, null, 2);
  baixarArquivo(json, `${nomeArquivo}.json`, 'application/json');
}

// ── TSV (compatível Excel) ───────────────────────────────────
export function exportarTSV<T extends Record<string, any>>(
  dados: T[],
  nomeArquivo: string,
) {
  if (!dados.length) return;
  const header = Object.keys(dados[0]).join('\t');
  const rows = dados.map(r =>
    Object.values(r).map(v => String(v ?? '')).join('\t'),
  );
  const bom = '\uFEFF';
  const tsv = bom + [header, ...rows].join('\r\n');
  baixarArquivo(tsv, `${nomeArquivo}.tsv`, 'text/tab-separated-values');
}

// ── PDF via print ────────────────────────────────────────────
export function exportarPDF(
  titulo: string,
  conteudoHtml: string,
  subtitulo?: string,
) {
  const win = window.open('', '_blank');
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>${titulo} — FarChain</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 12px;
          color: #1e293b;
          padding: 32px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 2px solid #2563eb;
          margin-bottom: 24px;
        }
        .logo {
          font-size: 20px;
          font-weight: 800;
          color: #2563eb;
        }
        .logo span { color: #0d9488; }
        .meta { text-align: right; font-size: 10px; color: #64748b; }
        h1 { font-size: 18px; color: #0f172a; margin-bottom: 4px; }
        h2 { font-size: 12px; color: #64748b; font-weight: 400; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          font-size: 11px;
        }
        th {
          background: #1e3a8a;
          color: white;
          padding: 8px 12px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 7px 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        tr:nth-child(even) td { background: #f8fafc; }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          font-size: 10px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { padding: 16px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Far<span>Chain</span></div>
          <p style="font-size:10px;color:#64748b">Plataforma CEAF/SUS · Salvador, BA</p>
        </div>
        <div class="meta">
          <p>${new Date().toLocaleString('pt-BR')}</p>
          <p>Relatório gerado automaticamente</p>
        </div>
      </div>
      <h1>${titulo}</h1>
      ${subtitulo ? `<h2>${subtitulo}</h2>` : ''}
      ${conteudoHtml}
      <div class="footer">
        <span>FarChain — Rastreabilidade Farmacêutica CEAF/SUS</span>
        <span>Documento gerado em ${new Date().toLocaleDateString('pt-BR')}</span>
      </div>
    </body>
    </html>
  `);

  win.document.close();
  setTimeout(() => {
    win.print();
    win.close();
  }, 600);
}

// ── Helper interno ───────────────────────────────────────────
function baixarArquivo(conteudo: string, nome: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Construtor de tabela HTML para PDF ───────────────────────
export function tabelaHTML<T extends Record<string, any>>(
  dados: T[],
  colunas: { key: keyof T; label: string }[],
): string {
  if (!dados.length) return '<p>Nenhum registro encontrado.</p>';

  const header = colunas.map(c => `<th>${c.label}</th>`).join('');
  const rows = dados.map(row =>
    `<tr>${colunas.map(c => `<td>${row[c.key] ?? '—'}</td>`).join('')}</tr>`,
  ).join('');

  return `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`;
}
