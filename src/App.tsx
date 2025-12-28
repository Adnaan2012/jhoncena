import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import TetrisGame from './components/TetrisGame';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/game/tetris" element={<TetrisGame />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
