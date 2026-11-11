import { useState } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTarefas } from '../context/useTarefas'
import { TarefaCard } from '../components/TarefaCard'
import { EstadoCarregamento } from '../components/EstadoCarregamento'
import { EstadoErro } from '../components/EstadoErro'
import { EstadoVazio } from '../components/EstadoVazio'
import { atualizarTarefa } from '../services/api'
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
  const {
    tarefas,
    tarefasFiltradas,
    filtros,
    setFiltros,
    carregando,
    erro,
    recarregarTarefas,
    atualizarTarefaNoEstado,
  } = useTarefas()

  // Issue #46: arrastar e soltar cartões entre as colunas
  const [idArrastando, setIdArrastando] = useState<string | null>(null)
  const [colunaAlvo, setColunaAlvo] = useState<Status | null>(null)
  const [erroMover, setErroMover] = useState<string | null>(null)

  function iniciarArraste(evento: DragEvent<HTMLLIElement>, id: string) {
    evento.dataTransfer.setData('text/plain', id)
    evento.dataTransfer.effectAllowed = 'move'
    setIdArrastando(id)
    setErroMover(null)
  }

  function finalizarArraste() {
    setIdArrastando(null)
    setColunaAlvo(null)
  }

  function passarSobreColuna(evento: DragEvent<HTMLElement>, status: Status) {
    if (!idArrastando) return
    evento.preventDefault() // sem isso o navegador não deixa soltar aqui
    evento.dataTransfer.dropEffect = 'move'
    if (colunaAlvo !== status) setColunaAlvo(status)
  }

  function sairDaColuna(evento: DragEvent<HTMLElement>) {
    // ignora quando o mouse só passou para um elemento dentro da coluna
    if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) {
      setColunaAlvo(null)
    }
  }

  async function soltarNaColuna(evento: DragEvent<HTMLElement>, novoStatus: Status) {
    evento.preventDefault()
    const id = evento.dataTransfer.getData('text/plain') || idArrastando
    finalizarArraste()

    const tarefa = tarefas.find((item) => item.id === id)
    if (!tarefa || tarefa.status === novoStatus) return

    // Atualiza a tela na hora e confirma na API; se falhar, volta como estava
    atualizarTarefaNoEstado({ ...tarefa, status: novoStatus })

    try {
      const tarefaSalva = await atualizarTarefa(tarefa.id, { status: novoStatus })
      atualizarTarefaNoEstado(tarefaSalva)
    } catch {
      atualizarTarefaNoEstado(tarefa)
      setErroMover(`Não foi possível mover "${tarefa.titulo}". Tente novamente.`)
    }
  }

  const filtrosAtivos = Boolean(filtros.busca.trim() || filtros.status || filtros.prioridade)

  const limparFiltros = () => {
    setFiltros({ busca: '', status: '', prioridade: '' })
  }

  if (carregando) return <EstadoCarregamento mensagem="Carregando quadro..." />
  if (erro) {
    return <EstadoErro mensagem={erro} onTentarNovamente={() => { void recarregarTarefas() }} />
  }

  return (
    <section className="quadro">
      <div className="quadro-topo">
        <h1>Quadro de tarefas</h1>
        <Link to="/tarefas/nova">+ Nova tarefa</Link>
      </div>

      {tarefas.length > 0 && (
        <p className="quadro-dica">
          Arraste um cartão para outra coluna para mudar o status.
          Também dá para usar o campo <strong>Status</strong> de cada cartão.
        </p>
      )}

      {erroMover && <EstadoErro compacto mensagem={erroMover} />}

      {filtrosAtivos && (
        <div className="quadro-aviso" role="status">
          <span>Mostrando só as tarefas que batem com os filtros da lista.</span>
          <button type="button" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      )}

      {tarefas.length === 0 ? (
        <EstadoVazio
          titulo="O quadro está vazio"
          mensagem="Ainda não há tarefas cadastradas para mostrar nas colunas."
        >
          <Link to="/tarefas/nova">+ Criar primeira tarefa</Link>
        </EstadoVazio>
      ) : filtrosAtivos && tarefasFiltradas.length === 0 ? (
        <EstadoVazio
          icone="🔍"
          titulo="Nenhuma tarefa encontrada"
          mensagem="Nenhuma tarefa corresponde aos filtros da lista."
        >
          <button type="button" onClick={limparFiltros}>Limpar filtros</button>
        </EstadoVazio>
      ) : (
      <div className="quadro-colunas">
        {colunas.map((coluna) => {
          const tarefasDaColuna = tarefasFiltradas
            .filter((tarefa) => tarefa.status === coluna.status)
            .sort(ordenarTarefas)
          const idTitulo = `coluna-${coluna.status}`

          return (
            <section
              key={coluna.status}
              className={[
                'quadro-coluna',
                `quadro-coluna--${coluna.status}`,
                colunaAlvo === coluna.status ? 'quadro-coluna--alvo' : '',
              ].join(' ')}
              aria-labelledby={idTitulo}
              onDragOver={(evento) => passarSobreColuna(evento, coluna.status)}
              onDragLeave={sairDaColuna}
              onDrop={(evento) => { void soltarNaColuna(evento, coluna.status) }}
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
                    <li
                      key={tarefa.id}
                      draggable
                      onDragStart={(evento) => iniciarArraste(evento, tarefa.id)}
                      onDragEnd={finalizarArraste}
                      className={idArrastando === tarefa.id ? 'quadro-item quadro-item--arrastando' : 'quadro-item'}
                    >
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
      )}
    </section>
  )
}
