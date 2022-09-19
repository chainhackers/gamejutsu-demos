import cn from 'classnames';
import { Square } from 'components/Games/Tic-Tac-Toe';
import { BoardPropsI } from './BoardProps';
import styles from './Board.module.scss';
// import { disputeMove } from 'gameApi';
export const Board: React.FC<BoardPropsI> = ({
  squares,
  onClick,
  isFinished,
  disputiveMove,
}) => {
  const renderSquare = (i: number) => (
    <Square value={squares[i]} onClick={() => onClick(i)} disputive={i === disputiveMove} />
  );
  return (
    <div className={cn(styles.container, isFinished ? styles.finished : null)}>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};
