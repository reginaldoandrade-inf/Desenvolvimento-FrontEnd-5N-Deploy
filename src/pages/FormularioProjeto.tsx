import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  atualizarProjeto,
  buscarProjeto,
  criarProjeto,
} from '../services/api'
import type { NovoProjeto } from '../services/api'

const camposIniciais: NovoProjeto = {
  nome: '',
  descricao: '',
  disciplina: '',
  criadoEm: '',
}

export function FormularioProjeto() {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const editando = Boolean(id)

  const [campos, setCampos] = useState<NovoProjeto>(camposIniciais)
  const [carregando, setCarregando] = useState(Boolean(id))
  const [salvando, setSalvando] = useState(false)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)
  const [erroSalvamento, setErroSalvamento] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let ativo = true

    buscarProjeto(id)
      .then((projeto) => {
        if (!ativo) return
        setCampos({
          nome: projeto.nome,
          descricao: projeto.descricao,
          disciplina: projeto.disciplina,
          criadoEm: projeto.criadoEm,
        })
        setCarregando(false)
      })
      .catch(() => {
        if (!ativo) return
        setErroCarregamento('Não foi possível carregar este projeto.')
        setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  function alterarCampo(campo: keyof NovoProjeto, valor: string) {
    setCampos((anterior) => ({ ...anterior, [campo]: valor }))
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (salvando) return

    const dados: NovoProjeto = {
      nome: campos.nome.trim(),
      descricao: campos.descricao.trim(),
      disciplina: campos.disciplina.trim(),
      criadoEm: campos.criadoEm,
    }

    if (Object.values(dados).some((valor) => !valor)) {
      setErroSalvamento('Preencha todos os campos obrigatórios.')
      return
    }

    setErroSalvamento(null)
    setSalvando(true)

    try {
      const projeto = id
        ? await atualizarProjeto(id, dados)
        : await criarProjeto(dados)

      navegar(`/projetos/${projeto.id}`)
    } catch {
      setErroSalvamento('Não foi possível salvar o projeto. Verifique a API.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <p>Carregando projeto...</p>

  if (erroCarregamento) {
    return (
      <section>
        <p role="alert">{erroCarregamento}</p>
        <Link to="/projetos">Voltar para projetos</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>{editando ? 'Editar projeto' : 'Novo projeto'}</h1>

      <form onSubmit={salvar}>
        <div>
          <label htmlFor="nome-projeto">Nome</label>
          <input
            id="nome-projeto"
            name="nome"
            value={campos.nome}
            onChange={(e) => alterarCampo('nome', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="descricao-projeto">Descrição</label>
          <textarea
            id="descricao-projeto"
            name="descricao"
            value={campos.descricao}
            onChange={(e) => alterarCampo('descricao', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="disciplina-projeto">Disciplina</label>
          <input
            id="disciplina-projeto"
            name="disciplina"
            value={campos.disciplina}
            onChange={(e) => alterarCampo('disciplina', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="data-projeto">Data de criação</label>
          <input
            id="data-projeto"
            name="criadoEm"
            type="date"
            value={campos.criadoEm}
            onChange={(e) => alterarCampo('criadoEm', e.target.value)}
            required
          />
        </div>

        {erroSalvamento && <p role="alert">{erroSalvamento}</p>}

        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar projeto'}
        </button>
        {' '}
        <Link to={id ? `/projetos/${id}` : '/projetos'}>Cancelar</Link>
      </form>
    </section>
  )
}
