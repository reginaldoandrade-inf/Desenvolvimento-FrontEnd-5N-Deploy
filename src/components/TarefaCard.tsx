import { useState } from 'react'
import { useTarefas } from '../context/useTarefas'
import { atualizarTarefa } from '../services/api'
import type { Status, Tarefa } from '../tipos'

type Props = {
  tarefa: Tarefa
}

const opcoesStatus: { value: Status; label: string }[] = [
  { value: 'a-fazer', label: 'A fazer' },
  { value: 'em-andamento', label: 'Em andamento' },
  { value: 'em-revisao', label: 'Em revisão' },
  { value: 'concluida', label: 'Concluída' },
]

export function TarefaCard({ tarefa }: Props) {
  const { tarefas, atualizarTarefaNoEstado } = useTarefas()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const tarefaAtual = tarefas.find((item) => item.id === tarefa.id) ?? tarefa

  async function alterarStatus(novoStatus: Status) {
    if (salvando || novoStatus === tarefaAtual.status) return

    setSalvando(true)
    setErro(null)

    try {
      const tarefaSalva = await atualizarTarefa(tarefaAtual.id, { status: novoStatus })
      atualizarTarefaNoEstado(tarefaSalva)
    } catch {
      setErro('Não foi possível alterar o status. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <article className="cartao-tarefa" style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
      <h3>{tarefaAtual.titulo}</h3>
      <p>
        <label htmlFor={`status-tarefa-${tarefaAtual.id}`}><strong>Status:</strong></label>{' '}
        <select
          id={`status-tarefa-${tarefaAtual.id}`}
          value={tarefaAtual.status}
          disabled={salvando}
          onChange={(evento) => { void alterarStatus(evento.target.value as Status) }}
          aria-label={`Alterar status da tarefa ${tarefaAtual.titulo}`}
        >
          {opcoesStatus.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
          ))}
        </select>
        {salvando && <span role="status"> Salvando...</span>}
      </p>
      {erro && <p role="alert">{erro}</p>}
      <p><strong>Prioridade:</strong> {tarefaAtual.prioridade}</p>
      <p><strong>Responsável:</strong> {tarefaAtual.responsavel}</p>
      <p><strong>Prazo:</strong> {tarefaAtual.prazo}</p>
    </article>
  )
}
