type TCellData = 0 | 1 | 2;
export interface BoardPropsI {
  children?: React.ReactNode;
  squares: TCellData[];
  onClick: (i: number) => void;
  isFinished: boolean;
}
