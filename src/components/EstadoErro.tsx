import './EstadoErro.css'

type Props = {
  mensagem: string
  onTentarNovamente?: () => void
  compacto?: boolean
}

export function EstadoErro({
  mensagem,
  onTentarNovamente,
  compacto = false,
}: Props) {
  return (
    <div
      className={compacto ? 'estado-erro estado-erro--compacto' : 'estado-erro'}
      role="alert"
    >
      <p className="estado-erro__mensagem">{mensagem}</p>
      {onTentarNovamente && (
        <button type="button" className="estado-erro__botao" onClick={onTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
