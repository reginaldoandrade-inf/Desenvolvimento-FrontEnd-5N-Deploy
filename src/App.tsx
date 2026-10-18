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
          <Route index element={<ListaTarefas />} />
          <Route path="tarefas/:id" element={<DetalheTarefa />} />
          <Route path="projetos" element={<ListaProjetos />} />
          <Route path="projetos/:id" element={<DetalheProjeto />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;