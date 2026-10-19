
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { listarProjetos } from '../services/api'
import type { Projeto } from '../tipos'

export function ListaProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

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
  }, [])

  if (carregando) {
    return <p>Carregando projetos...</p>
  }

  if (erro) {
    return <p role="alert">{erro}</p>
  }

  return (
    <section>
      <h1>Meus projetos</h1>

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
