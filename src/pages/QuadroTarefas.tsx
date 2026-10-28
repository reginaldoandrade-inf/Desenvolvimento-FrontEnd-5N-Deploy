import { Link } from 'react-router-dom'
import { useTarefas } from '../context/useTarefas'
import { TarefaCard } from '../components/TarefaCard'
import type { Prioridade, Status, Tarefa } from '../tipos'
import './QuadroTarefas.css'

const colunas: { status: Status; titulo: string }[] = [
  { status: 'a-fazer', titulo: 'A fazer' },
  { status: 'em-andamento', titulo: 'Em andamento' },
  { status: 'em-revisao', titulo: 'Em revisão' },
  { status: 'concluida', titulo: 'Concluída' },
]

const pesoPrioridade: Record<Prioridade, number> = {
  alta: 0,
  media: 1,
  baixa: 2,
}

function ordenarTarefas(a: Tarefa, b: Tarefa) {
  const porPrioridade = pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]
  if (porPrioridade !== 0) return porPrioridade
  return a.prazo.localeCompare(b.prazo)
}

export function QuadroTarefas() {
  const { tarefasFiltradas, filtros, setFiltros, carregando, erro } = useTarefas()

  const filtrosAtivos = Boolean(filtros.busca.trim() || filtros.status || filtros.prioridade)

  const limparFiltros = () => {
    setFiltros({ busca: '', status: '', prioridade: '' })
  }

  if (carregando) return <p>Carregando quadro...</p>
  if (erro) return <p role="alert">{erro}</p>

  return (
    <section className="quadro">
      <div className="quadro-topo">
        <h1>Quadro de tarefas</h1>
        <Link to="/tarefas/nova">+ Nova tarefa</Link>
      </div>

      {filtrosAtivos && (
        <div className="quadro-aviso" role="status">
          <span>Mostrando só as tarefas que batem com os filtros da lista.</span>
          <button type="button" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      )}

      <div className="quadro-colunas">
        {colunas.map((coluna) => {
          const tarefasDaColuna = tarefasFiltradas
            .filter((tarefa) => tarefa.status === coluna.status)
            .sort(ordenarTarefas)
          const idTitulo = `coluna-${coluna.status}`

          return (
            <section
              key={coluna.status}
              className={`quadro-coluna quadro-coluna--${coluna.status}`}
              aria-labelledby={idTitulo}
            >
              <header className="quadro-coluna-cabecalho">
                <h2 id={idTitulo}>{coluna.titulo}</h2>
                <span
                  className="quadro-contador"
                  aria-label={`${tarefasDaColuna.length} tarefa(s)`}
                >
                  {tarefasDaColuna.length}
                </span>
              </header>

              {tarefasDaColuna.length === 0 ? (
                <p className="quadro-vazio">Nenhuma tarefa aqui.</p>
              ) : (
                <ul>
                  {tarefasDaColuna.map((tarefa) => (
                    <li key={tarefa.id}>
                      <TarefaCard tarefa={tarefa} />
                      <Link to={`/tarefas/${tarefa.id}`}>Ver detalhes</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}
