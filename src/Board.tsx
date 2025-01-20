export interface BoardProps {
  board: string[][];
  highlight: boolean[][];
  onClick?: (x: number, y: number) => void;
}

export default function Board({ board, highlight, onClick }: BoardProps) {
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
                className={`btn btn-lg flex items-center justify-center w-8 h-8 ${
                  highlight[i][j] ? 'btn-primary' : cell === '' ? '' : 'btn-neutral'
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
