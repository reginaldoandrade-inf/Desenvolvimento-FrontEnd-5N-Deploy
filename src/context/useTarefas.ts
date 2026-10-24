import { createContext, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Prioridade, Status, Tarefa } from '../tipos'

// '' significa "todos" nos filtros de status e prioridade.
export type FiltrosTarefas = {
  busca: string
  status: Status | ''
  prioridade: Prioridade | ''
}

export type ValorContextoTarefas = {
  tarefas: Tarefa[]
  tarefasFiltradas: Tarefa[]
  filtros: FiltrosTarefas
  setFiltros: Dispatch<SetStateAction<FiltrosTarefas>>
  carregando: boolean
  erro: string | null
  recarregarTarefas: () => Promise<void>
  adicionarTarefaNoEstado: (tarefa: Tarefa) => void
  atualizarTarefaNoEstado: (tarefa: Tarefa) => void
}

export const ContextoTarefas = createContext<ValorContextoTarefas | null>(null)

export function useTarefas() {
  const contexto = useContext(ContextoTarefas)
  if (!contexto) {
    throw new Error('useTarefas deve ser usado dentro de ProvedorTarefas.')
  }
  return contexto
}
