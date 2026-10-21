import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div>
      <header>
        <div className="marca">
          <div className="marca-simbolo" aria-hidden="true">D</div>
          <div className="marca-texto">
            <h2>DEPLOY</h2>
            <span>Gerenciador de Tarefas</span>
          </div>
        </div>

        <nav aria-label="Navegação principal">
          <Link to="/tarefas">Tarefas</Link>
          <Link to="/projetos">Projetos</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}