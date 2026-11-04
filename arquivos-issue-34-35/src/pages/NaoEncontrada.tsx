import { Link } from 'react-router-dom';
import { EstadoVazio } from '../components/EstadoVazio';

// Rota coringa (*): endereço que não existe no app (#35)
export function NaoEncontrada() {
  return (
    <section>
      <h1>404 - Página não encontrada</h1>
      <EstadoVazio
        icone="🧭"
        titulo="Esta página não existe"
        mensagem="Confira o endereço ou volte para uma das telas principais."
      >
        <Link to="/tarefas">Ver tarefas</Link>
        <Link to="/projetos">Ver projetos</Link>
      </EstadoVazio>
    </section>
  );
}
