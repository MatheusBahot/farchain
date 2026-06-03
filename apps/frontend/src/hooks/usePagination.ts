import { useState } from 'react';

export function usePagination(limiteInicial = 20) {
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(limiteInicial);

  const irParaPagina = (p: number) => setPagina(p);
  const proximaPagina = () => setPagina((p) => p + 1);
  const paginaAnterior = () => setPagina((p) => Math.max(1, p - 1));
  const resetar = () => setPagina(1);

  return { pagina, limite, irParaPagina, proximaPagina, paginaAnterior, resetar };
}
