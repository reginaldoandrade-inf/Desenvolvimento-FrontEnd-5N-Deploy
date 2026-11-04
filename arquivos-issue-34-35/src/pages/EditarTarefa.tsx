import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormularioTarefa } from '../components/FormularioTarefa'
import { atualizarTarefa, buscarTarefa, ehNaoEncontrado } from '../services/api'
import { useTarefas } from '../context/useTarefas'
import { EstadoCarregamento } from '../components/EstadoCarregamento'
import { EstadoErro } from '../components/EstadoErro'
import { EstadoVazio } from '../components/EstadoVazio'
import type { NovaTarefa } from '../tipos'

export function EditarTarefa() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const { atualizarTarefaNoEstado } = useTarefas()
  const [valores, setValores] = useState<NovaTarefa | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [naoEncontrada, setNaoEncontrada] = useState(false)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (!id) return
    let ativo = true

    buscarTarefa(id)
      .then(({ id: _id, ...dados }) => {
        if (ativo) setValores(dados)
      })
      .catch((err) => {
        if (!ativo) return
        if (ehNaoEncontrado(err)) setNaoEncontrada(true)
        else setErro('Não foi possível carregar esta tarefa.')
      })

    return () => { ativo = false }
  }, [id, tentativa])

  function tentarNovamente() {
    setErro(null)
    setValores(null)
    setTentativa((atual) => atual + 1)
  }

  async function salvar(dados: NovaTarefa) {
    if (!id) return
    const tarefaAtualizada = await atualizarTarefa(id, dados)
    atualizarTarefaNoEstado(tarefaAtualizada)
    navegar(`/tarefas/${id}`)
  }

  if (naoEncontrada) {
    return (
      <EstadoVazio
        icone="❓"
        titulo="Tarefa não encontrada"
        mensagem="Não é possível editar uma tarefa que não existe."
      >
        <Link to="/tarefas">Voltar para a lista de tarefas</Link>
      </EstadoVazio>
    )
  }

  if (erro) {
    return (
      <section>
        <EstadoErro mensagem={erro} onTentarNovamente={tentarNovamente} />
        <Link to="/">Voltar para a lista de tarefas</Link>
      </section>
    )
  }

  if (!valores) return <EstadoCarregamento mensagem="Carregando tarefa para edição..." />

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
