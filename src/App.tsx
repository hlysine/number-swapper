import { useState } from 'react';
import Game from './Game';
import { BiReset, BiUndo } from 'react-icons/bi';

const defaultBoard = [
  ['', '', '', '', '', '', '', '', ''],
  ['', '1', '2', '3', '4', '5', '6', '7', ''],
  ['', '8', '9', '10', '11', '12', '13', '14', ''],
  ['', '15', '16', '17', '18', '19', '20', '21', ''],
  ['', '22', '23', '24', '25', '26', '27', '28', ''],
  ['', '29', '30', '31', '32', '33', '34', '35', ''],
  ['', '36', '37', '38', '39', '40', '41', '42', ''],
  ['', '43', '44', '45', '46', '47', '48', '49', ''],
  ['', '', '', '', '', '', '', '', ''],
];

export default function App() {
  const [history, setHistory] = useState<string[][][]>([]);
  const [start, setStart] = useState(defaultBoard);
  const [board, setBoard] = useState(defaultBoard);

  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const generateGrid = () => {
    const list = Array.from({ length: width * height }, (_, i) => i + 1);
    const newBoard = Array.from({ length: height + 2 }, (_, i) => {
      return Array.from({ length: width + 2 }, (_, j) => {
        if (i === 0 || i === height + 1 || j === 0 || j === width + 1) return '';
        const index = Math.floor(Math.random() * list.length);
        const value = list[index];
        list.splice(index, 1);
        return value.toString();
      });
    });
    setBoard(newBoard);
    setStart(newBoard);
    setHistory([]);
  };

  const setBoardWithHistory = (newBoard: string[][]) => {
    setHistory([...history, board]);
    setBoard(newBoard);
  };

  const undo = () => {
    if (history.length === 0) return;
    setBoard(history[history.length - 1]);
    setHistory(history.slice(0, history.length - 1));
  };

  const reset = () => {
    if (board === start) return;
    setBoardWithHistory(start);
  };

  return (
    <div className="flex flex-wrap h-dvh w-dvw">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body gap-4">
            <h2 className="card-title">Number swapper</h2>
            <p>Pick a grid size and press start. Your goal is to arrange the numbers in ascending order.</p>
            <div className="flex gap-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Width</span>
                </div>
                <input
                  type="number"
                  placeholder="Width"
                  className="input input-bordered w-full max-w-xs"
                  min={3}
                  max={20}
                  value={width}
                  onChange={e => setWidth(Number(e.currentTarget.value))}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Height</span>
                </div>
                <input
                  type="number"
                  placeholder="Height"
                  className="input input-bordered w-full max-w-xs"
                  min={3}
                  max={20}
                  value={height}
                  onChange={e => setHeight(Number(e.currentTarget.value))}
                />
              </label>
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={generateGrid}>
                New game
              </button>
            </div>
          </div>
        </div>
        <ul className="menu menu-lg menu-horizontal bg-base-200 rounded-box mt-6 justify-center">
          <li className={history.length === 0 ? 'disabled' : ''}>
            <a className="tooltip" data-tip="Undo" onClick={undo}>
              <BiUndo />
            </a>
          </li>
          <li>
            <a className="tooltip" data-tip="Reset" onClick={reset}>
              <BiReset />
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 flex justify-center items-center max-w-full">
        <Game board={board} onChange={newBoard => setBoardWithHistory(newBoard)} />
      </div>
    </div>
  );
}
