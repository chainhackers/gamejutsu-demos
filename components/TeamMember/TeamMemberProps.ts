export interface TeamMemberPropsI {
    children?: React.ReactNode;
    image: string;
    name: string;
    role: string;
    description: string;
    link: string | null;
    contacts: { type: string; ref: string; image: string }[];
}
