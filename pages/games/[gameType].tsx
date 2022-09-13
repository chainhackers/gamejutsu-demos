import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { TicTacToe } from 'components/Games';
import { ParsedUrlQuery } from 'querystring';
interface IGamePageProps {
    gameType?: string;
}

interface IParams extends ParsedUrlQuery {
    gameType: string;
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
    if (!!gameType && gameType === 'tic-tac-toe') {
        return <TicTacToe />;
    }
    return <div>No Games Available</div>;
};

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
    console.log('context', context.params?.gameType);
    return {
        props: {
            gameType: context.params?.gameType,
        },
    };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
    const gamesType = ['tic-tac-toe', 'other'];
    const paths = gamesType.map((gameType) => ({ params: { gameType } }));
    return {
        paths,
        fallback: false,
    };
};

export default Game;
