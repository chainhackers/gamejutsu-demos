export interface IPoweredByUnit {
  image: string;
  name: string;
  href: string;
}
export interface PoweredByPropsI {
  children?: React.ReactNode;
  poweredByList: IPoweredByUnit[];
}
