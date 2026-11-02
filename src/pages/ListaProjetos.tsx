
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { listarProjetos } from '../services/api'
import { EstadoCarregamento } from '../components/EstadoCarregamento'
import { EstadoErro } from '../components/EstadoErro'
import type { Projeto } from '../tipos'

export function ListaProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    async function carregarProjetos() {
      try {
        const dados = await listarProjetos()

        if (ativo) {
          setProjetos(dados)
        }
      } catch {
        if (ativo) {
          setErro('Não foi possível carregar os projetos.')
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarProjetos()

    return () => {
      ativo = false
    }
  }, [tentativa])

  function tentarNovamente() {
    setErro(null)
    setCarregando(true)
    setTentativa((atual) => atual + 1)
  }

  if (carregando) {
    return <EstadoCarregamento mensagem="Carregando projetos..." />
  }

  if (erro) {
    return <EstadoErro mensagem={erro} onTentarNovamente={tentarNovamente} />
  }

  return (
    <section>
      <h1>Meus projetos</h1>
      <p><Link to="/projetos/novo">+ Novo projeto</Link></p>

      {projetos.length === 0 ? (
        <p>Nenhum projeto cadastrado.</p>
      ) : (
        <ul>
          {projetos.map((projeto) => (
            <li key={projeto.id}>
              <article>
                <h2>{projeto.nome}</h2>
                <p>Disciplina: {projeto.disciplina}</p>
                <p>{projeto.descricao}</p>

                <Link to={`/projetos/${projeto.id}`}>
                  Ver detalhes
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
