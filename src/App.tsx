import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProvedorTarefas } from './context/TarefasContext';
import { Layout } from './components/Layout';
import { ListaTarefas } from './pages/ListaTarefas';
import { DetalheTarefa } from './pages/DetalheTarefa';
import { NovaTarefa } from './pages/NovaTarefa';
import { EditarTarefa } from './pages/EditarTarefa';
import { ListaProjetos } from './pages/ListaProjetos';
import { DetalheProjeto } from './pages/DetalheProjeto';
import { FormularioProjeto } from './pages/FormularioProjeto';
import { NaoEncontrada } from './pages/NaoEncontrada';

export function App() {
  return (
    <BrowserRouter>
      <ProvedorTarefas>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ListaTarefas />} />

            {/* Rotas de Tarefas */}
            <Route path="tarefas" element={<ListaTarefas />} />
            <Route path="tarefas/nova" element={<NovaTarefa />} />
            <Route path="tarefas/:id/editar" element={<EditarTarefa />} />
            <Route path="tarefas/:id" element={<DetalheTarefa />} />

            {/* Rotas de Projetos */}
            <Route path="projetos" element={<ListaProjetos />} />
            <Route path="projetos/novo" element={<FormularioProjeto />} />
            <Route path="projetos/:id/editar" element={<FormularioProjeto />} />
            <Route path="projetos/:id" element={<DetalheProjeto />} />

            {/* Rota para páginas não encontradas (404) */}
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
      </ProvedorTarefas>
    </BrowserRouter>
  );
}

export default App;