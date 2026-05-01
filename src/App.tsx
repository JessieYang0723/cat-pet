import { GameProvider } from './context/GameContext';
import { Game } from './components/Game/Game';
import './styles/variables.css';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;