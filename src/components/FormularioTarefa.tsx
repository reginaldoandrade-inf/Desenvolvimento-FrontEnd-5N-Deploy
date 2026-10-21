import React, { useState, useEffect } from 'react';
import type { NovaTarefa, Projeto, Status, Prioridade } from '../tipos';
import { listarProjetos } from '../services/api';

interface ErrosForm {
  titulo?: string;
  responsavel?: string;
  prazo?: string;
}

interface FormularioTarefaProps {
  dadosIniciais?: Partial<NovaTarefa>;
  projetoIdPreSelecionado?: string;
  onSubmit: (dados: NovaTarefa) => Promise<void>;
  textoBotao?: string;
}

export const FormularioTarefa: React.FC<FormularioTarefaProps> = ({
  dadosIniciais,
  projetoIdPreSelecionado,
  onSubmit,
  textoBotao = 'Salvar',
}) => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [titulo, setTitulo] = useState(dadosIniciais?.titulo || '');
  const [descricao, setDescricao] = useState(dadosIniciais?.descricao || '');
  const [status, setStatus] = useState<Status>(dadosIniciais?.status || 'a-fazer');
  const [prioridade, setPrioridade] = useState<Prioridade>(dadosIniciais?.prioridade || 'media');
  const [responsavel, setResponsavel] = useState(dadosIniciais?.responsavel || '');
  const [prazo, setPrazo] = useState(dadosIniciais?.prazo || '');
  const [projetoId, setProjetoId] = useState(dadosIniciais?.projetoId || projetoIdPreSelecionado || '');

  const [erros, setErros] = useState<ErrosForm>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  let ativo = true

  listarProjetos()
    .then((data) => {
      if (!ativo) return

      setProjetos(data)

      if (data.length > 0) {
        setProjetoId((anterior) => anterior || data[0].id)
      }
    })
    .catch((err) => {
      if (ativo) {
        console.error('Erro ao carregar projetos:', err)
      }
    })

  return () => {
    ativo = false
  }
}, [])

  const validarCampos = (): boolean => {
    const novosErros: ErrosForm = {};
    if (!titulo.trim()) novosErros.titulo = 'O título é obrigatório.';
    if (!responsavel.trim()) novosErros.responsavel = 'O responsável é obrigatório.';
    if (!prazo) novosErros.prazo = 'O prazo é obrigatório.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ titulo, descricao, status, prioridade, responsavel, prazo, projetoId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Título */}
      <div className="campo">
        <label htmlFor="campo-titulo">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          id="campo-titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          aria-required="true"
          aria-invalid={!!erros.titulo}
          aria-describedby={erros.titulo ? 'erro-titulo' : undefined}
        />
        {erros.titulo && (
          <span id="erro-titulo" className="mensagem-erro" role="alert">
            ⚠️ {erros.titulo}
          </span>
        )}
      </div>

      {/* Seletor de Projeto */}
      <div className="campo">
        <label htmlFor="campo-projetoId">Projeto</label>
        <select
          id="campo-projetoId"
          value={projetoId}
          onChange={(e) => setProjetoId(e.target.value)}
        >
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div className="campo">
        <label htmlFor="campo-descricao">Descrição</label>
        <textarea
          id="campo-descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="campo">
        <label htmlFor="campo-status">Status</label>
        <select
          id="campo-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="a-fazer">A Fazer</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="em-revisao">Em Revisão</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      {/* Prioridade */}
      <div className="campo">
        <label htmlFor="campo-prioridade">Prioridade</label>
        <select
          id="campo-prioridade"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value as Prioridade)}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      {/* Responsável */}
      <div className="campo">
        <label htmlFor="campo-responsavel">
          Responsável <span aria-hidden="true">*</span>
        </label>
        <input
          id="campo-responsavel"
          type="text"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          aria-required="true"
          aria-invalid={!!erros.responsavel}
          aria-describedby={erros.responsavel ? 'erro-responsavel' : undefined}
        />
        {erros.responsavel && (
          <span id="erro-responsavel" className="mensagem-erro" role="alert">
            ⚠️ {erros.responsavel}
          </span>
        )}
      </div>

      {/* Prazo */}
      <div className="campo">
        <label htmlFor="campo-prazo">
          Prazo <span aria-hidden="true">*</span>
        </label>
        <input
          id="campo-prazo"
          type="date"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          aria-required="true"
          aria-invalid={!!erros.prazo}
          aria-describedby={erros.prazo ? 'erro-prazo' : undefined}
        />
        {erros.prazo && (
          <span id="erro-prazo" className="mensagem-erro" role="alert">
            ⚠️ {erros.prazo}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : textoBotao}
      </button>
    </form>
  );
};