import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { listarProjetos } from '../services/api'
import type { NovaTarefa, Prioridade, Projeto, Status } from '../tipos'

type Props = {
  valoresIniciais: NovaTarefa
  textoBotao: string
  onSalvar: (dados: NovaTarefa) => Promise<void>
}

export function FormularioTarefa({ valoresIniciais, textoBotao, onSalvar }: Props) {
  const [campos, setCampos] = useState<NovaTarefa>(valoresIniciais)
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarProjetos()
      .then(setProjetos)
      .catch(() => setErro('Não foi possível carregar os projetos.'))
  }, [])

  function alterarCampo<K extends keyof NovaTarefa>(campo: K, valor: NovaTarefa[K]) {
    setCampos((anterior) => ({ ...anterior, [campo]: valor }))
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (salvando) return

    const dados: NovaTarefa = {
      ...campos,
      titulo: campos.titulo.trim(),
      descricao: campos.descricao.trim(),
      responsavel: campos.responsavel.trim(),
    }

    if (!dados.titulo || !dados.projetoId || !dados.responsavel || !dados.prazo) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    setErro(null)
    setSalvando(true)
    try {
      await onSalvar(dados)
    } catch {
      setErro('Não foi possível salvar a tarefa. Verifique a API.')
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={enviar}>
      <div>
        <label htmlFor="titulo-tarefa">Título</label>
        <input
          id="titulo-tarefa"
          value={campos.titulo}
          onChange={(e) => alterarCampo('titulo', e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="descricao-tarefa">Descrição</label>
        <textarea
          id="descricao-tarefa"
          value={campos.descricao}
          onChange={(e) => alterarCampo('descricao', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="projeto-tarefa">Projeto</label>
        <select
          id="projeto-tarefa"
          value={campos.projetoId}
          onChange={(e) => alterarCampo('projetoId', e.target.value)}
          required
        >
          <option value="">Selecione um projeto</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status-tarefa">Status</label>
        <select
          id="status-tarefa"
          value={campos.status}
          onChange={(e) => alterarCampo('status', e.target.value as Status)}
        >
          <option value="a-fazer">A fazer</option>
          <option value="em-andamento">Em andamento</option>
          <option value="em-revisao">Em revisão</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <div>
        <label htmlFor="prioridade-tarefa">Prioridade</label>
        <select
          id="prioridade-tarefa"
          value={campos.prioridade}
          onChange={(e) => alterarCampo('prioridade', e.target.value as Prioridade)}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="responsavel-tarefa">Responsável</label>
        <input
          id="responsavel-tarefa"
          value={campos.responsavel}
          onChange={(e) => alterarCampo('responsavel', e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="prazo-tarefa">Prazo</label>
        <input
          id="prazo-tarefa"
          type="date"
          value={campos.prazo}
          onChange={(e) => alterarCampo('prazo', e.target.value)}
          required
        />
      </div>

      {erro && <p role="alert">{erro}</p>}

      <button type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  )
}
