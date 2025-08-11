/**
 * GameSelector provides buttons for the user to select which mini-game to play.
 * The selected game name is highlighted using a different button style.
 *
 * @param {Object} props
 * @param {string} props.selectedGame The currently selected game identifier.
 * @param {Function} props.setSelectedGame Function to update the selected game.
 */
const GameSelector = ({ selectedGame, setSelectedGame }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setSelectedGame('drone')}
        className={`${
          selectedGame === 'drone' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        } px-4 py-2 rounded font-semibold`}
      >
        Drone Race
      </button>
      <button
        onClick={() => setSelectedGame('quiz')}
        className={`${
          selectedGame === 'quiz' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        } px-4 py-2 rounded font-semibold`}
      >
        Quiz Blitz
      </button>
      <button
        onClick={() => setSelectedGame('emoji')}
        className={`${
          selectedGame === 'emoji' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        } px-4 py-2 rounded font-semibold`}
      >
        Emoji Sprint
      </button>
    </div>
  );
};

export default GameSelector;