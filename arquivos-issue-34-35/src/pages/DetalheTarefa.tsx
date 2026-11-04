
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { buscarTarefa, ehNaoEncontrado } from '../services/api'
import { EstadoCarregamento } from '../components/EstadoCarregamento'
import { EstadoErro } from '../components/EstadoErro'
import { EstadoVazio } from '../components/EstadoVazio'
import type { Tarefa } from '../tipos'

type ResultadoBusca = {
  id: string
  tarefa: Tarefa | null
  erro: string | null
}

export function DetalheTarefa() {
  const { id } = useParams<{ id: string }>()

  const [resultado, setResultado] = useState<ResultadoBusca | null>(null)
  const [tentativa, setTentativa] = useState(0)

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
            // 404 não é falha da API: a tarefa simplesmente não existe (#35)
            erro: ehNaoEncontrado(err) ? null : 'Erro ao carregar os detalhes da tarefa.',
          })
        }
      })

    return () => {
      ativo = false
    }
  }, [id, tentativa])

  function tentarNovamente() {
    setResultado(null)
    setTentativa((atual) => atual + 1)
  }

  if (!id) {
    return (
      <EstadoVazio icone="❓" titulo="Tarefa não informada">
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </EstadoVazio>
    )
  }

  if (!resultado || resultado.id !== id) {
    return <EstadoCarregamento mensagem="Carregando detalhes da tarefa..." />
  }

  if (resultado.erro) {
    return (
      <div>
        <EstadoErro mensagem={resultado.erro} onTentarNovamente={tentarNovamente} />
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </div>
    )
  }

  const tarefa = resultado.tarefa

  if (!tarefa) {
    return (
      <EstadoVazio
        icone="❓"
        titulo="Tarefa não encontrada"
        mensagem="Ela pode ter sido excluída ou o endereço está incorreto."
      >
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </EstadoVazio>
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
