import type { Tarefa } from '../tipos';

type Props = {
  tarefa: Tarefa;
};

export function TarefaCard({ tarefa }: Props) {
  return (
    <article className="cartao-tarefa" style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
      <h3>{tarefa.titulo}</h3>
      <p><strong>Status:</strong> {tarefa.status}</p>
      <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
      <p><strong>Responsável:</strong> {tarefa.responsavel}</p>
      <p><strong>Prazo:</strong> {tarefa.prazo}</p>
    </article>
  );
}
