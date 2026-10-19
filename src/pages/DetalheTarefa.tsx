import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarTarefa } from '../services/api';
import type { Tarefa } from '../tipos';

export function DetalheTarefa() {
  const { id } = useParams<{ id: string }>();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErro('ID da tarefa não foi informado.');
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    buscarTarefa(id)
      .then((dados) => setTarefa(dados))
      .catch((err) => {
        console.error(err);
        setErro('Erro ao carregar os detalhes da tarefa.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) return <p>Carregando detalhes...</p>;

  if (erro) {
    return (
      <div>
        <p style={{ color: 'red' }}>{erro}</p>
        <Link to="/">← Voltar para a Lista de Tarefas</Link>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <div>
        <p>Tarefa não encontrada!</p>
        <Link to="/">← Voltar para a Lista de Tarefas</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{tarefa.titulo}</h1>
      <p><strong>Descrição:</strong> {tarefa.descricao}</p>
      <p><strong>Status:</strong> {tarefa.status}</p>
      <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
      <p><strong>Responsável:</strong> {tarefa.responsavel}</p>
      <p><strong>Prazo:</strong> {tarefa.prazo}</p>
      <Link to={`/tarefas/${tarefa.id}/editar`}>Editar tarefa</Link>
      <br />
      <Link to="/">← Voltar para a Lista de Tarefas</Link>
    </div>
  );
}