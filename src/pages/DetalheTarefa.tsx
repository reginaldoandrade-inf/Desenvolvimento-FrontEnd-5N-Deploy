
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { buscarTarefa } from '../services/api'
import type { Tarefa } from '../tipos'

type ResultadoBusca = {
  id: string
  tarefa: Tarefa | null
  erro: string | null
}

export function DetalheTarefa() {
  const { id } = useParams<{ id: string }>()

  const [resultado, setResultado] = useState<ResultadoBusca | null>(null)

  useEffect(() => {
    if (!id) return

    let ativo = true

    buscarTarefa(id)
      .then((dados) => {
        if (ativo) {
          setResultado({
            id,
            tarefa: dados,
            erro: null,
          })
        }
      })
      .catch((err) => {
        console.error(err)

        if (ativo) {
          setResultado({
            id,
            tarefa: null,
            erro: 'Erro ao carregar os detalhes da tarefa.',
          })
        }
      })

    return () => {
      ativo = false
    }
  }, [id])

  if (!id) {
    return (
      <div>
        <p role="alert">ID da tarefa não foi informado.</p>
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </div>
    )
  }

  if (!resultado || resultado.id !== id) {
    return <p>Carregando detalhes...</p>
  }

  if (resultado.erro) {
    return (
      <div>
        <p role="alert">{resultado.erro}</p>
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </div>
    )
  }

  const tarefa = resultado.tarefa

  if (!tarefa) {
    return (
      <div>
        <p>Tarefa não encontrada!</p>
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>{tarefa.titulo}</h1>
      <p><strong>Descrição:</strong> {tarefa.descricao}</p>
      <p><strong>Status:</strong> {tarefa.status}</p>
      <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
      <p><strong>Responsável:</strong> {tarefa.responsavel}</p>
      <p><strong>Prazo:</strong> {tarefa.prazo}</p>

      <Link to={`/tarefas/${tarefa.id}/editar`}>
        Editar tarefa
      </Link>

      <br />

      <Link to="/tarefas">
        ← Voltar para a Lista de Tarefas
      </Link>
    </div>
  )
}
