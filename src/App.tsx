import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListaTarefas } from './pages/ListaTarefas';
import { DetalheTarefa } from './pages/DetalheTarefa';
import { ListaProjetos } from './pages/ListaProjetos';
import { DetalheProjeto } from './pages/DetalheProjeto';
import { NaoEncontrada } from './pages/NaoEncontrada';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Abre a lista de tarefas ao carregar a página inicial / */}
          <Route index element={<ListaTarefas />} />
          
          {/* Rotas de Tarefas */}
          <Route path="tarefas" element={<ListaTarefas />} />
          <Route path="tarefas/:id" element={<DetalheTarefa />} />
          
          {/* Rotas de Projetos */}
          <Route path="projetos" element={<ListaProjetos />} />
          <Route path="projetos/:id" element={<DetalheProjeto />} />
          
          {/* Rota para páginas não encontradas (404) */}
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;