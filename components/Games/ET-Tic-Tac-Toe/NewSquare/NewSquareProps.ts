import { TCellData } from '../types';
export interface NewSquarePropsI {
  value: TCellData;
  onClick: () => void;
  disputable: boolean;
}
