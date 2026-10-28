import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormularioTarefa } from '../components/FormularioTarefa'
import { atualizarTarefa, buscarTarefa } from '../services/api'
import { useTarefas } from '../context/useTarefas'
import type { NovaTarefa } from '../tipos'

export function EditarTarefa() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const { atualizarTarefaNoEstado } = useTarefas()
  const [valores, setValores] = useState<NovaTarefa | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    buscarTarefa(id)
      .then(({ id: _id, ...dados }) => setValores(dados))
      .catch(() => setErro('Não foi possível carregar esta tarefa.'))
  }, [id])

  async function salvar(dados: NovaTarefa) {
    if (!id) return
    const tarefaAtualizada = await atualizarTarefa(id, dados)
    atualizarTarefaNoEstado(tarefaAtualizada)
    navegar(`/tarefas/${id}`)
  }

  if (erro) {
    return (
      <section>
        <p role="alert">{erro}</p>
        <Link to="/">Voltar para a lista de tarefas</Link>
      </section>
    )
  }

  if (!valores) return <p>Carregando tarefa...</p>

  return (
    <section>
      <h1>Editar tarefa</h1>
      <FormularioTarefa
        dadosIniciais={valores}
        textoBotao="Salvar alterações"
        onSubmit={salvar}
      />
      <Link to={`/tarefas/${id}`}>Cancelar</Link>
    </section>
  )
}
