import { TLastMove } from "types/game";
export function shallowClone<T extends Object>(source: T): T {
    let destination  = Object.create(Object.getPrototypeOf(source));
    Object.assign(destination, source);
    // console.log('shallowClone', source, destination)
    return destination;
}

const isFirstColumn = (a: number): boolean => (a - 3) % 8 === 0;
const isLastColumn = (a: number): boolean => (a - 4) % 8 === 0
export const isEvenRow = (a: number) => Math.floor(a / 4) % 2 === 0;
export const shortenAddress = (str: string) => {
    return `${str.slice(0, 5)}...${str.slice(-4)}`
}
