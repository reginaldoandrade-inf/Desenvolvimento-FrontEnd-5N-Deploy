import { Link, Outlet } from 'react-router-dom';
export function Layout() {
  return (
    <div>
      {/* Cabeçalho comum que aparece em todas as páginas */}
      <header style={{ padding: '1rem', backgroundColor: '#f4f4f4', marginBottom: '1rem' }}>
        <h2>Gerenciador de Tarefas</h2>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          {/* O Link troca de página sem recarregar o navegador (SPA) */}
          <Link to="/">Tarefas</Link>
          <Link to="/projetos">Projetos</Link>
        </nav>
      </header>

      {/* O Outlet é onde a página atual (Lista, Detalhe, etc.) vai ser desenhada */}
      <main style={{ padding: '0 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}