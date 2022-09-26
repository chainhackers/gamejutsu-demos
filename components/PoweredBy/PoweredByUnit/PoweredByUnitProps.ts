export interface IPoweredByUnit {
  image: string;
  name: string;
  href: string;
}
export interface PoweredByUnitPropsI extends IPoweredByUnit {
  children?: React.ReactNode;
}
