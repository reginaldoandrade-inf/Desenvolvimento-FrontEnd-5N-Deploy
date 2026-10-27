
import { Link } from 'react-router-dom';
import { useTarefas } from '../context/TarefasContext';
import { TarefaCard } from '../components/TarefaCard';

export function ListaTarefas() {
  const {
    tarefasFiltradas,
    filtros,
    setFiltros,
    carregando,
    erro,
  } = useTarefas();

  if (carregando) return <p>Carregando tarefas...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

  return (
    <div>
      <h1>Todas as Tarefas</h1>

      <Link to="/tarefas/nova">+ Nova tarefa</Link>

      {/* Campo de busca por título */}
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder="Buscar tarefa pelo título..."
          aria-label="Buscar tarefa pelo título"
          value={filtros.busca}
          onChange={(evento) =>
            setFiltros((anteriores) => ({
              ...anteriores,
              busca: evento.target.value,
            }))
          }
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Lista de tarefas filtradas */}
      {tarefasFiltradas.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        tarefasFiltradas.map((tarefa) => (
          <div key={tarefa.id} style={{ marginBottom: '1rem' }}>
            <TarefaCard tarefa={tarefa} />
            <Link to={`/tarefas/${tarefa.id}`}>Ver Detalhes</Link>
          </div>
        ))
      )}
    </div>
  );
}
