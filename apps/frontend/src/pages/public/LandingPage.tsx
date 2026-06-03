import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-grafite-950 text-grafite-900 dark:text-white">
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-sm font-semibold text-primary-500 mb-4">
          FarmaChain
        </p>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Rastreabilidade farmacêutica com blockchain permissionada.
        </h1>

        <p className="text-grafite-500 max-w-2xl mx-auto mb-8">
          Plataforma para gestão de medicamentos, lotes, movimentações,
          dispensações, farmacovigilância e auditoria imutável na assistência farmacêutica.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="btn-primary px-6 py-3 rounded-xl">
            Acessar sistema
          </Link>

          <a href="#solucao" className="btn-ghost px-6 py-3 rounded-xl">
            Conhecer solução
          </a>
        </div>
      </section>
    </main>
  );
}
