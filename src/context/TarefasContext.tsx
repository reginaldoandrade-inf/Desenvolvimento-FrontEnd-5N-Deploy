import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { listarTarefas } from '../services/api'
import type { Tarefa } from '../tipos'
import { ContextoTarefas } from './useTarefas'
import type { FiltrosTarefas, ValorContextoTarefas } from './useTarefas'


const filtrosIniciais: FiltrosTarefas = {
  busca: '',
  status: '',
  prioridade: '',
}

export function ProvedorTarefas({ children }: { children: ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [filtros, setFiltros] = useState<FiltrosTarefas>(filtrosIniciais)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let ativo = true

    listarTarefas()
      .then((dados) => {
        if (!ativo) return
        setTarefas(dados)
        setCarregando(false)
      })
      .catch(() => {
        if (!ativo) return
        setErro('Não foi possível carregar as tarefas.')
        setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const recarregarTarefas = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await listarTarefas()
      setTarefas(dados)
    } catch {
      setErro('Não foi possível carregar as tarefas.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const adicionarTarefaNoEstado = useCallback((tarefa: Tarefa) => {
    setTarefas((anteriores) => [...anteriores, tarefa])
  }, [])

  const atualizarTarefaNoEstado = useCallback((tarefa: Tarefa) => {
    setTarefas((anteriores) =>
      anteriores.map((atual) => atual.id === tarefa.id ? tarefa : atual),
    )
  }, [])

  const tarefasFiltradas = useMemo(() => {
    const busca = filtros.busca.trim().toLocaleLowerCase('pt-BR')

    return tarefas.filter((tarefa) => {
      const atendeBusca = tarefa.titulo.toLocaleLowerCase('pt-BR').includes(busca)
      const atendeStatus = !filtros.status || tarefa.status === filtros.status
      const atendePrioridade = !filtros.prioridade || tarefa.prioridade === filtros.prioridade

      return atendeBusca && atendeStatus && atendePrioridade
    })
  }, [tarefas, filtros])

  const valor = useMemo<ValorContextoTarefas>(() => ({
    tarefas,
    tarefasFiltradas,
    filtros,
    setFiltros,
    carregando,
    erro,
    recarregarTarefas,
    adicionarTarefaNoEstado,
    atualizarTarefaNoEstado,
  }), [
    tarefas,
    tarefasFiltradas,
    filtros,
    carregando,
    erro,
    recarregarTarefas,
    adicionarTarefaNoEstado,
    atualizarTarefaNoEstado,
  ])

  return <ContextoTarefas.Provider value={valor}>{children}</ContextoTarefas.Provider>
}

