import { TLastMove } from "types/game";
export function shallowClone<T extends Object>(source: T): T {
    let destination  = Object.create(Object.getPrototypeOf(source));
    Object.assign(destination, source);
    console.log('shallowClone', source, destination)
    return destination;
}

const isFirstColumn = (a: number): boolean => (a - 3) % 8 === 0;
const isLastColumn = (a: number): boolean => (a - 4) % 8 === 0
const isEvenRow = (a: number) => Math.floor(a / 4) % 2 === 0;

export const isJumpMove = (lastMove: TLastMove) => {
    console.log('lastmove', lastMove)
    if (!lastMove) return false;
    const oddRowOffset = isEvenRow(lastMove.from) ? 0 : 1;
    const BOTTOM_LEFT_CORNER_DISTANCE = -4;
    const BOTTOM_RIGHT_CORNER_DISTANCE = -3;
    const TOP_RIGHT_CORNER_DISTANCE = 4;
    const TOP_LEFT_CORNER_DISTANCE = 5;
    
    const nearestMoves = [
        lastMove.from + BOTTOM_LEFT_CORNER_DISTANCE - oddRowOffset,
        lastMove.from + BOTTOM_RIGHT_CORNER_DISTANCE - oddRowOffset,
        lastMove.from + TOP_LEFT_CORNER_DISTANCE - oddRowOffset,
        lastMove.from + TOP_RIGHT_CORNER_DISTANCE - oddRowOffset,
    ].filter((move) => {
        if (isFirstColumn(lastMove.from)) return move >= 0 && move % 2 !== 0;
        if (isLastColumn(lastMove.from)) return move >= 0 && move % 2 === 0;
        return move >= 0 && move <= 31
    });

    return !nearestMoves.includes(lastMove.to);
};
