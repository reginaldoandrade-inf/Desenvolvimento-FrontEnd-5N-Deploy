import type { ReactNode } from 'react'
import './EstadoVazio.css'

// Issues #34 e #35: bloco padrão para telas sem conteúdo
// (lista vazia, busca sem resultado, registro não encontrado)
type Props = {
  titulo: string
  mensagem?: string
  icone?: string
  compacto?: boolean
  children?: ReactNode
}

export function EstadoVazio({
  titulo,
  mensagem,
  icone = '📭',
  compacto = false,
  children,
}: Props) {
  return (
    <div
      className={compacto ? 'estado-vazio estado-vazio--compacto' : 'estado-vazio'}
      role="status"
    >
      <span className="estado-vazio__icone" aria-hidden="true">
        {icone}
      </span>
      <p className="estado-vazio__titulo">{titulo}</p>
      {mensagem && <p className="estado-vazio__mensagem">{mensagem}</p>}
      {children && <div className="estado-vazio__acoes">{children}</div>}
    </div>
  )
}
