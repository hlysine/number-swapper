import { useEffect, useMemo, useState } from 'react';
import Board from './Board';
import { FaArrowsAlt, FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';

export interface GameProps {
  board: string[][];
  onChange?: (board: string[][]) => void;
}

export interface RowSelection {
  type: 'row';
  indices: number[];
}

export interface ColumnSelection {
  type: 'column';
  indices: number[];
}

export interface CrossSelection {
  type: 'cross';
  indices: [number, number][];
}

export type Selection = RowSelection | ColumnSelection | CrossSelection;

const crossOffsets = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function isInBounds(board: string[][], x: number, y: number) {
  return x >= 0 && x < board[0].length && y >= 0 && y < board.length;
}

function executeSwap(board: string[][], selection: Selection) {
  const newBoard = board.map(row => [...row]);
  if (selection.indices.length !== 2) return newBoard;
  if (selection.type === 'row') {
    const [a, b] = selection.indices;
    for (let i = 0; i < newBoard[0].length; i++) {
      [newBoard[a][i], newBoard[b][i]] = [newBoard[b][i], newBoard[a][i]];
    }
  } else if (selection.type === 'column') {
    const [a, b] = selection.indices;
    for (let i = 0; i < newBoard.length; i++) {
      [newBoard[i][a], newBoard[i][b]] = [newBoard[i][b], newBoard[i][a]];
    }
  } else if (selection.type === 'cross') {
    const x1 = selection.indices[0][0];
    const y1 = selection.indices[0][1];
    const x2 = selection.indices[1][0];
    const y2 = selection.indices[1][1];
    if (x1 === x2) {
      const midY = (y1 + y2) / 2;
      for (let i = 0; i < crossOffsets.length; i++) {
        const [dx, dy] = crossOffsets[i];
        const [sx1, sy1] = [x1 + dx, y1 + dy];
        const [sx2, sy2] = [x1 + dx, Math.round(midY + (midY - y1 - dy))];
        if (!isInBounds(newBoard, sx1, sy1) || !isInBounds(newBoard, sx2, sy2)) continue;
        [newBoard[sy1][sx1], newBoard[sy2][sx2]] = [newBoard[sy2][sx2], newBoard[sy1][sx1]];
      }
    } else {
      const midX = (x1 + x2) / 2;
      for (let i = 0; i < crossOffsets.length; i++) {
        const [dx, dy] = crossOffsets[i];
        const [sx1, sy1] = [x1 + dx, y1 + dy];
        const [sx2, sy2] = [Math.round(midX + (midX - x1 - dx)), y1 + dy];
        if (!isInBounds(newBoard, sx1, sy1) || !isInBounds(newBoard, sx2, sy2)) continue;
        [newBoard[sy1][sx1], newBoard[sy2][sx2]] = [newBoard[sy2][sx2], newBoard[sy1][sx1]];
      }
    }
  }
  return newBoard;
}

export default function Game({ board, onChange }: GameProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const highlight = useMemo(() => {
    return Array.from({ length: board.length }, (_, i) => {
      return Array.from({ length: board[0].length }, (_, j) => {
        if (!selection) return false;
        if (selection.type === 'row') return selection.indices.includes(i);
        if (selection.type === 'column') return selection.indices.includes(j);
        return selection.indices.some(([x, y]) => Math.abs(x - j) + Math.abs(y - i) <= 1);
      });
    });
  }, [board, selection]);
  const onTileClick = (x: number, y: number) => {
    if (!selection) return;
    if (selection.type === 'row') {
      if (selection.indices.includes(y)) {
        setSelection({ ...selection, indices: selection.indices.filter(i => i !== y) });
      } else {
        setSelection({ ...selection, indices: [...selection.indices, y] });
      }
    } else if (selection.type === 'column') {
      if (selection.indices.includes(x)) {
        setSelection({ ...selection, indices: selection.indices.filter(i => i !== x) });
      } else {
        setSelection({ ...selection, indices: [...selection.indices, x] });
      }
    } else if (selection.type === 'cross') {
      if (selection.indices.some(([i, j]) => i === x && j === y)) {
        setSelection({ ...selection, indices: selection.indices.filter(([i, j]) => i !== x || j !== y) });
      } else if ((x === 0 || x === board[0].length - 1) && (y === 0 || y === board.length - 1)) {
        setSelection({ ...selection, indices: [] });
      } else if (selection.indices.length >= 1) {
        const selectedX = selection.indices[0][0];
        const selectedY = selection.indices[0][1];
        if (
          (selectedX !== x && selectedY !== y) ||
          (selectedX === x && Math.abs(selectedY - y) !== 3) ||
          (selectedY === y && Math.abs(selectedX - x) !== 3)
        ) {
          setSelection({ ...selection, indices: [] });
        } else {
          const existingSidedness =
            Math.min(2, Math.abs(selectedX - 0), Math.abs(selectedX - (board[0].length - 1))) +
            Math.min(2, Math.abs(selectedY - 0), Math.abs(selectedY - (board.length - 1)));
          const newSidedness =
            Math.min(2, Math.abs(x - 0), Math.abs(x - (board[0].length - 1))) +
            Math.min(2, Math.abs(y - 0), Math.abs(y - (board.length - 1)));
          if (existingSidedness !== newSidedness) {
            setSelection({ ...selection, indices: [] });
          } else {
            setSelection({ ...selection, indices: [...selection.indices, [x, y]] });
          }
        }
      } else {
        setSelection({ ...selection, indices: [...selection.indices, [x, y]] });
      }
    }
  };

  useEffect(() => {
    if (selection && selection.indices.length === 2) {
      onChange?.(executeSwap(board, selection));
      setSelection({ ...selection, indices: [] });
    }
  }, [board, selection, onChange]);

  return (
    <div className="flex flex-col max-w-full">
      <Board board={board} highlight={highlight} onClick={onTileClick} />
      <ul className="menu menu-lg menu-horizontal bg-base-200 rounded-box mt-6 justify-center">
        <li>
          <a
            className={`tooltip ${selection?.type === 'row' ? 'active' : ''}`}
            data-tip="Swap rows"
            onClick={() => setSelection({ type: 'row', indices: [] })}
          >
            <FaArrowsAltH />
          </a>
        </li>
        <li>
          <a
            className={`tooltip ${selection?.type === 'column' ? 'active' : ''}`}
            data-tip="Swap columns"
            onClick={() => setSelection({ type: 'column', indices: [] })}
          >
            <FaArrowsAltV />
          </a>
        </li>
        <li>
          <a
            className={`tooltip ${selection?.type === 'cross' ? 'active' : ''}`}
            data-tip="Swap cross"
            onClick={() => setSelection({ type: 'cross', indices: [] })}
          >
            <FaArrowsAlt />
          </a>
        </li>
      </ul>
    </div>
  );
}
