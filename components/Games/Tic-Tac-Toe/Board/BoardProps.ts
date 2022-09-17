type TCellData = null | 0 | 1;
export interface BoardPropsI {
  children?: React.ReactNode;
  squares: TCellData[];
  onClick: (i: number) => void;
  isFinished: boolean;
}
