import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTarefas } from '../services/api';
import { TarefaCard } from '../components/TarefaCard';
import type { Tarefa } from '../tipos';

export function ListaTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarTarefas()
      .then((dados) => setTarefas(dados))
      .catch((err) => {
        console.error(err);
        setErro('Erro ao carregar a lista de tarefas.');
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando tarefas...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

  return (
    <div>
      <h1>Todas as Tarefas</h1>

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        tarefas.map((tarefa) => (
          <div key={tarefa.id} style={{ marginBottom: '1rem' }}>
            <TarefaCard tarefa={tarefa} />
            <Link to={`/tarefas/${tarefa.id}`}>Ver Detalhes</Link>
          </div>
        ))
      )}
    </div>
  );
}