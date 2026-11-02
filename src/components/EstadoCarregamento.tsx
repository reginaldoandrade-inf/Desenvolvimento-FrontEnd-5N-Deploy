import './EstadoCarregamento.css'

type Props = {
  mensagem?: string
  compacto?: boolean
}

export function EstadoCarregamento({
  mensagem = 'Carregando...',
  compacto = false,
}: Props) {
  const classes = compacto
    ? 'estado-carregamento estado-carregamento--compacto'
    : 'estado-carregamento'

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="estado-carregamento__spinner" aria-hidden="true" />
      <span>{mensagem}</span>
    </div>
  )
}
