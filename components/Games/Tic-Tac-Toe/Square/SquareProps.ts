import { TCellData } from '../types';
export interface SquarePropsI {
  children?: React.ReactNode;
  value: TCellData;
  onClick: () => void;
  disputive?: boolean;
}
