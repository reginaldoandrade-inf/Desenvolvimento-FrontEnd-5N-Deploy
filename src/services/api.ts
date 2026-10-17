import type { Projeto, Tarefa } from '../tipos'

const API_URL = 'http://localhost:3000'

export type ProjetoComTarefas = Projeto & {
  tarefas: Tarefa[]
}

async function requisitar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`)

  if (!resposta.ok) {
    throw new Error(`Erro ao acessar a API (${resposta.status})`)
  }

  return resposta.json() as Promise<T>
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