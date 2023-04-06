export interface GameDemoPropsI {
    children?:React.ReactNode
    games: { name: string; image: string; url: string; description: string }[];
}