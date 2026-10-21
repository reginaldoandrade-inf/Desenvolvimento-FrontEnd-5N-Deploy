import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FormularioTarefa } from '../components/FormularioTarefa'
import { criarTarefa } from '../services/api'
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

// Issue #18: rota /tarefas/nova
// Aceita projeto pré-selecionado pela URL: /tarefas/nova?projetoId=1
export function NovaTarefa() {
  const navegar = useNavigate()
  const [parametros] = useSearchParams()
  const projetoId = parametros.get('projetoId') ?? ''

  async function salvar(dados: DadosTarefa) {
    await criarTarefa(dados)
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
