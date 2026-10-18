import { Link } from 'react-router-dom';

export function NaoEncontrada() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>404 - Página Não Encontrada</h1>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}