export interface BoardPropsI {
  children?: React.ReactNode;
  squares: Array<string>;
  finished: boolean;
  onClick: (i: number) => void;
}
