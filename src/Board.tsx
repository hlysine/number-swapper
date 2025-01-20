import { useEffect, useMemo } from 'react';
import anime from 'animejs';

export interface BoardProps {
  board: string[][];
  highlight: boolean[][];
  onClick?: (x: number, y: number) => void;
}

function isSolved(board: string[][]) {
  return board
    .flat()
    .filter(x => x.length > 0)
    .every((cell, i) => Number(cell) === i + 1);
}

export default function Board({ board, highlight, onClick }: BoardProps) {
  const solved = useMemo(() => isSolved(board), [board]);

  useEffect(() => {
    if (solved) {
      anime({
        targets: '.animated-cell',
        scale: [
          { value: 0.1, easing: 'easeOutSine', duration: 500 },
          { value: 1, easing: 'easeInOutQuad', duration: 1200 },
        ],
        delay: anime.stagger(200, { grid: [board.length, board[0].length], from: 'center' }),
      });
    }
  }, [solved, board]);

  // render with css grid
  return (
    <div className="overflow-auto p-2 w-full">
      <div
        className="grid gap-1 w-fit"
        style={{
          gridTemplateColumns: `repeat(${board[0].length + 1}, auto)`,
        }}
      >
        <div></div>
        {board[0].map((_, i) => (
          <div className="flex items-center justify-center w-8 h-8">{i + 1}</div>
        ))}
        {board.map((row, i) => (
          <>
            <div className="flex items-center justify-center w-8 h-8">{i + 1}</div>
            {row.map((cell, j) => (
              <button
                className={`btn btn-lg flex items-center justify-center w-8 h-8 animated-cell ${
                  highlight[i][j] ? 'btn-primary' : cell === '' ? '' : solved ? 'btn-secondary' : 'btn-neutral'
                }`}
                key={`${i}-${j}`}
                onClick={() => onClick?.(j, i)}
              >
                {cell || ''}
              </button>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
