import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FormularioTarefa } from '../components/FormularioTarefa'
import { criarTarefa } from '../services/api'
import { useTarefas } from '../context/useTarefas'
import type { NovaTarefa as DadosTarefa } from '../tipos'

const tarefaVazia: DadosTarefa = {
  projetoId: '',
  titulo: '',
  descricao: '',
  status: 'a-fazer',
  prioridade: 'media',
  responsavel: '',
  prazo: '',
}

export function NovaTarefa() {
  const navegar = useNavigate()
  const { adicionarTarefaNoEstado } = useTarefas()
  const [parametros] = useSearchParams()
  const projetoId = parametros.get('projetoId') ?? ''

  async function salvar(dados: DadosTarefa) {
    const tarefa = await criarTarefa(dados)
    adicionarTarefaNoEstado(tarefa)
    navegar(projetoId ? `/projetos/${projetoId}` : '/')
  }

  return (
    <section>
      <h1>Nova tarefa</h1>
      <FormularioTarefa
        dadosIniciais={tarefaVazia}
        projetoIdPreSelecionado={projetoId}
        textoBotao="Cadastrar tarefa"
        onSubmit={salvar}
      />
      <Link to={projetoId ? `/projetos/${projetoId}` : '/'}>Cancelar</Link>
    </section>
  )
}
