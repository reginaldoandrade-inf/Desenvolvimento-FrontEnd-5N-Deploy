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
  const [errosCampos, setErrosCampos] = useState<
    Partial<Record<keyof NovaTarefa, string>>
  >({})

  useEffect(() => {
    listarProjetos()
      .then(setProjetos)
      .catch(() => setErro('Não foi possível carregar os projetos.'))
  }, [])

  function alterarCampo<K extends keyof NovaTarefa>(
  campo: K,
  valor: NovaTarefa[K]
) {
  // Atualiza o valor digitado pelo usuário
  setCampos((anterior) => ({
    ...anterior,
    [campo]: valor,
  }))

  // Remove a mensagem de erro quando o campo é preenchido
  if (typeof valor === 'string' && valor.trim() !== '') {
    setErrosCampos((anterior) => ({
      ...anterior,
      [campo]: undefined,
    }))
  }
}

  function validarCampos(dados: NovaTarefa): boolean {
  const novosErros: Partial<Record<keyof NovaTarefa, string>> = {}

  if (!dados.titulo.trim()) {
    novosErros.titulo = 'O título é obrigatório.'
  }

  if (!dados.projetoId) {
    novosErros.projetoId = 'Selecione um projeto.'
  }

  if (!dados.responsavel.trim()) {
    novosErros.responsavel = 'Informe o responsável.'
  }

  if (!dados.prazo) {
    novosErros.prazo = 'Informe o prazo.'
  }

  setErrosCampos(novosErros)

  return Object.keys(novosErros).length === 0
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

    if (!validarCampos(dados)) {
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
          aria-invalid={!!errosCampos.titulo}
          aria-describedby={errosCampos.titulo ? 'erro-titulo' : undefined}
        />

        {errosCampos.titulo && (
          <p id="erro-titulo" role="alert" style={{ color: 'red' }}>
            {errosCampos.titulo}
          </p>
        )}
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
          aria-invalid={!!errosCampos.projetoId}
          aria-describedby={errosCampos.projetoId ? 'erro-projeto' : undefined}
        >
          <option value="">Selecione um projeto</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </select>

        {errosCampos.projetoId && (
          <p id="erro-projeto" role="alert" style={{ color: 'red' }}>
            {errosCampos.projetoId}
          </p>
        )}    

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
          aria-invalid={!!errosCampos.responsavel}
          aria-describedby={
            errosCampos.responsavel ? 'erro-responsavel' : undefined
          }
        />

        {errosCampos.responsavel && (
          <p id="erro-responsavel" role="alert" style={{ color: 'red' }}>
            {errosCampos.responsavel}
          </p>
        )}    
      </div>

      <div>
        <label htmlFor="prazo-tarefa">Prazo</label>
        <input
          id="prazo-tarefa"
          type="date"
          value={campos.prazo}
          onChange={(e) => alterarCampo('prazo', e.target.value)}
          aria-invalid={!!errosCampos.prazo}
          aria-describedby={errosCampos.prazo ? 'erro-prazo' : undefined}
        />

        {errosCampos.prazo && (
          <p id="erro-prazo" role="alert" style={{ color: 'red' }}>
            {errosCampos.prazo}
          </p>
        )}
      </div>

      {erro && <p role="alert">{erro}</p>}

      <button type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  )
}
