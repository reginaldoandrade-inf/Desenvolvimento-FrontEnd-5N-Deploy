import type { NovaTarefa, Projeto, Tarefa } from '../tipos'

const API_URL = 'http://localhost:3000'

export type ProjetoComTarefas = Projeto & {
  tarefas: Tarefa[]
}

export type NovoProjeto = Omit<Projeto, 'id'>
export type AtualizacaoTarefa = Partial<NovaTarefa>
export type AtualizacaoProjeto = Partial<NovoProjeto>

async function requisitar<T>(
  caminho: string,
  opcoes?: RequestInit,
): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes)

  if (!resposta.ok) {
    throw new Error(`Erro ao acessar a API (${resposta.status})`)
  }

  return resposta.json() as Promise<T>
}

function enviarDados<TResposta, TDados>(
  caminho: string,
  metodo: 'POST' | 'PATCH',
  dados: TDados,
): Promise<TResposta> {
  return requisitar<TResposta>(caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}

export function listarTarefas(): Promise<Tarefa[]> {
  return requisitar<Tarefa[]>('/tarefas')
}

export function buscarTarefa(id: string): Promise<Tarefa> {
  return requisitar<Tarefa>(`/tarefas/${encodeURIComponent(id)}`)
}

export function listarProjetos(): Promise<Projeto[]> {
  return requisitar<Projeto[]>('/projetos')
}

export function buscarProjeto(id: string): Promise<Projeto> {
  return requisitar<Projeto>(`/projetos/${encodeURIComponent(id)}`)
}

export function buscarProjetoComTarefas(
  id: string,
): Promise<ProjetoComTarefas> {
  return requisitar<ProjetoComTarefas>(
    `/projetos/${encodeURIComponent(id)}?_embed=tarefas`,
  )
}

export function criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
  return enviarDados<Tarefa, NovaTarefa>('/tarefas', 'POST', dados)
}

export function atualizarTarefa(
  id: string,
  dados: AtualizacaoTarefa,
): Promise<Tarefa> {
  return enviarDados<Tarefa, AtualizacaoTarefa>(
    `/tarefas/${encodeURIComponent(id)}`,
    'PATCH',
    dados,
  )
}

export function criarProjeto(dados: NovoProjeto): Promise<Projeto> {
  return enviarDados<Projeto, NovoProjeto>('/projetos', 'POST', dados)
}

export function atualizarProjeto(
  id: string,
  dados: AtualizacaoProjeto,
): Promise<Projeto> {
  return enviarDados<Projeto, AtualizacaoProjeto>(
    `/projetos/${encodeURIComponent(id)}`,
    'PATCH',
    dados,
  )
}