import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarProjetoComTarefas } from '../services/api';
import { TarefaCard } from '../components/TarefaCard';
import type { Projeto, Tarefa } from '../tipos';

type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] };

export function DetalheProjeto() {
  const { id } = useParams<{ id: string }>();
  const [dados, setDados] = useState<ProjetoComTarefas | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) {
      buscarProjetoComTarefas(id)
        .then((resultado) => setDados(resultado))
        .catch((err) => console.error(err))
        .finally(() => setCarregando(false));
    }
  }, [id]);

  if (carregando) return <p>Carregando dados do projeto...</p>;
  if (!dados) return <p>Projeto não encontrado.</p>;

  return (
    <div>
      <h1>Projeto: {dados.nome}</h1>
      <p>{dados.descricao}</p>
      <p><strong>Disciplina:</strong> {dados.disciplina}</p>
      <p><Link to={`/projetos/${dados.id}/editar`}>Editar projeto</Link></p>

      <h2>Tarefas deste Projeto:</h2>
      {dados.tarefas.length === 0 ? (
        <p>Nenhuma tarefa cadastrada neste projeto.</p>
      ) : (
        dados.tarefas.map((tarefa) => (
          <div key={tarefa.id} style={{ marginBottom: '1rem' }}>
            <TarefaCard tarefa={tarefa} />
            <Link to={`/tarefas/${tarefa.id}`}>Ver Detalhes da Tarefa</Link>
          </div>
        ))
      )}
      <br />
      <Link to="/projetos">← Voltar para a lista de projetos</Link>
    </div>
  );
}
