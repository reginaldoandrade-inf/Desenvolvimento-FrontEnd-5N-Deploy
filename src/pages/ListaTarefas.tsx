
import { Link } from 'react-router-dom';
import { useTarefas } from '../context/useTarefas';
import { TarefaCard } from '../components/TarefaCard';
import type { Status, Prioridade } from '../tipos';

export function ListaTarefas() {
  const {
    tarefasFiltradas,
    filtros,
    setFiltros,
    carregando,
    erro,
  } = useTarefas();

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      status: '',
      prioridade: '',
    });
  };

  if (carregando) return <p>Carregando tarefas...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;

  return (
    <div>
      <h1>Todas as Tarefas</h1>

      <Link to="/tarefas/nova">+ Nova tarefa</Link>

      {/* Área de busca e filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '20px',
          marginBottom: '20px',
          alignItems: 'center',
        }}
      >
        {/* Busca por título */}
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
            borderRadius: '6px',
            border: '1px solid #ccc',
            flex: '1 1 220px',
          }}
        />

        {/* Filtro por status */}
        <select
          aria-label="Filtrar por status"
          value={filtros.status}
          onChange={(evento) =>
            setFiltros((anteriores) => ({
              ...anteriores,
              status: evento.target.value as Status | '',
            }))
          }
          style={{ padding: '10px', borderRadius: '6px' }}
        >
          <option value="">Todos os status</option>
          <option value="a-fazer">A fazer</option>
          <option value="em-andamento">Em andamento</option>
          <option value="em-revisao">Em revisão</option>
          <option value="concluida">Concluída</option>
        </select>

        {/* Filtro por prioridade */}
        <select
          aria-label="Filtrar por prioridade"
          value={filtros.prioridade}
          onChange={(evento) =>
            setFiltros((anteriores) => ({
              ...anteriores,
              prioridade: evento.target.value as Prioridade | '',
            }))
          }
          style={{ padding: '10px', borderRadius: '6px' }}
        >
          <option value="">Todas as prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        {/* Limpar filtros */}
        <button type="button" onClick={limparFiltros}>
          Limpar filtros
        </button>
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
