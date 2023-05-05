/* eslint-disable @next/next/no-img-element */
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';

import companies from 'data/partners.json';
import { useRouter } from 'next/router';

interface IHomePageProps {
  partners: { image: string; name: string; href: string }[];
}
const Home: NextPage<IHomePageProps> = () => {
  const router = useRouter();

  function redirectToGamesPage() {
    router.push('/v2/games');
  }

  function redirectToTeamPage() {
    router.push('/team');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GameJutsu</title>
        <meta
          name="description"
          content="Framework for on chain game developers"
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.mainImg}>
            <img
              src="/images/serveless-communication.svg"
              alt="serverless communication"
            />
          </div>
          <div className={styles.mainTitle}>
            <h2>Un-chain your game with peer-to-peer communication!</h2>
            <p>
              By using state channels for in-game communication, GameJutsu
              enables multiplayer games to bypass blockchain transactions and
              keep most of the communication off-chain, while keeping the
              guarantees provided by smart contracts
            </p>
            <button onClick={redirectToGamesPage}>
              {' '}
              <Image
                src="/images/dices.png"
                alt=""
                width="25px"
                height="24px"
              />{' '}
              Try Demo
            </button>
          </div>
        </div>
        <div className={styles.usingBlock}>
          <div className={styles.usingTitle}>
            <h2>How can I use it?</h2>
            <span>
              GameJutsu is a gaming framework to take care of the on-chain /
              off-chain communication on Web3.
            </span>
          </div>
          <div className={styles.cards}>
            <div className={styles.card}>
              <img src="/images/slider1.png" alt="" />
              <p>To improve UX of your game services</p>
            </div>
            <div className={styles.card}>
              <img src="/images/slider2.png" alt="" />
              <p>Make crypto games with clean UI</p>
            </div>
            <div className={styles.card}>
              <img src="/images/slider3.png" alt="" />
              <p>Spare on server infrastructure and maintenance</p>
            </div>
          </div>
        </div>
        <div className={styles.workBlock}>
          <div className={styles.titleWork}>
            <h2>
              The Limitations of Centralized Gaming: The Case for Reimagining
              Client-Server
            </h2>
            <h3>
              What does a typical flow look like for a turn-based online game
              with two players?
            </h3>
            <p>
              The server controls everything because, in general, players can’t
              be trusted to update the game state on their own. This is because
              players' client programs can be tampered with, hacked, or simply
              malfunction, leading to inconsistent game states and unfair play.
              With fast servers and networks, the user experience is smooth. One
              advantage of this approach is that centralized servers are
              generally fast, reliable, and well-studied, making them a common
              choice for game development. However, players must trust the game
              server to maintain fair play and not abuse their power
            </p>
            <div className={styles.cons}>
              <div className={styles.card}>
                <img src="/images/x-img.svg" alt="cross" />
                <p className={styles.cardText}>
                  Central point of failure, as the server is the single point of
                  control
                </p>
              </div>
              <div className={styles.card}>
                <img src="/images/x-img.svg" alt="cross" />
                <p className={styles.cardText}>
                  Requires trust from client users, as they have to trust the
                  server to process the game logic and not cheat
                </p>
              </div>
              <div className={styles.card}>
                <img src="/images/x-img.svg" alt="cross" />
                <p className={styles.cardText}>
                  Non-transparent, as the server can manipulate game data
                  without users knowing
                </p>
              </div>
            </div>
          </div>
          <div className={styles.workSec}>
            <img src="/images/game.svg"></img>
          </div>
          <div className={styles.workTitle2}>
            <h2>
              Blockchain Gaming: The Pitfalls of Porting Server Logic to
              Contracts
            </h2>
            <h3>
              Designing a trustless decentralized game by shifting from a server
              to an on-chain contract to handle all game logic seems like an
              ideal solution for decentralization
            </h3>
            <p>
              However, it requires users to communicate every move to the
              contract, resulting in multiple extra clicks per turn, which would
              ruin the gameplay experience. Moreover, the gas fees and waiting
              time required for each transaction make this option even less
              appealing. Players are unlikely to be interested in
              decentralization to the extent that they would perform numerous
              additional confirmations in Metamask to make a move in a game of
              checkers. This approach simply isn't feasible, particularly for
              fast-paced games.
            </p>
            <div className={styles.cons}>
              <div className={styles.card}>
                <img src="/images/x-img.svg" alt="cross" />
                <p className={styles.cardText}>
                  Transaction fees and delays: Can cause gameplay interruptions
                  and lag
                </p>
              </div>
              <div className={styles.card}>
                <img src="/images/x-img.svg" alt="cross" />
                <p className={styles.cardText}>
                  Public game state and actions: Privacy and complexity may be
                  compromised
                </p>
              </div>
            </div>
          </div>
          <div className={styles.gameBlock}>
            <img src="/images/game2.svg" />
          </div>
          <div className={styles.gameTitle}>
            <h2>
              Next-Gen Gaming: How GameJutsu Reworks Server Logic for Blockchain
            </h2>
            <h3>
              GameJutsu eliminates the need to involve other parties apart from
              the players themselves and their client software in most of the
              in-game communication via using state channels and session keys
            </h3>
            <p>
              Clients only broadcast a very few transactions per game, or even 1
              transaction per multiple games, the rest of in-game communication
              is off-chain. This includes the technical possibility of sending
              less than one transaction per game, for example, for account
              creation or to establish a payment channel between two players
            </p>
          </div>
          <div className={styles.gameBlock2}>
            <div className={styles.imgGame}>
              <img src="/images/game3.svg" alt="" />
            </div>
          </div>
        </div>
        <div className={styles.blockMes}>
          <div className={styles.messenBlock}>
            <div className={styles.itemMes}>
              <a href="https://xmtp.org/">
                <Image
                  src="/images/xmtp-logo.png"
                  alt=""
                  width="40px"
                  height="40px"
                />
                XMTP
              </a>
            </div>
            <div className={styles.itemMes}>
              <a href="https://thegraph.com/en/">
                <Image
                  src="/images/the-graph-logo.png"
                  alt=""
                  width="40px"
                  height="40px"
                />
                The graph
              </a>
            </div>
            <div className={styles.itemMes}>
              <a href="https://polygon.technology/">
                <Image
                  src="/images/polygon-logo.png"
                  alt=""
                  width="40px"
                  height="40px"
                />
                Polygon
              </a>
            </div>
            <div className={styles.itemMes}>
              <a href="https://www.sismo.io/">
                <Image
                  src="/images/sismo-logo.png"
                  alt=""
                  width="40px"
                  height="40px"
                />
                Sismo
              </a>
            </div>
          </div>
          <div className={styles.buttonMes}>
            <button onClick={redirectToGamesPage}>
              {' '}
              <Image
                src="/images/dices.png"
                alt=""
                width="25px"
                height="24px"
              />{' '}
              Try Demo
            </button>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoTitle}>
              <h2>Need more info?</h2>
            </div>
            <div className={styles.buttonInfo}>
              <a href="https://github.com/ChainHackers/GameJutsu#readme">
                <img src="/images/BracketsCurly.svg" alt="brackets curly" />
                GitHub Documentation
              </a>
              <button onClick={redirectToTeamPage}>
                <img src="/images/dices-purple.svg" alt="dices" /> Meet our team
              </button>
            </div>
          </div>
          <div className={styles.socialSet}>
            <a href="https://discord.gg/a5E9vWbp9R">
              <Image
                src="/images/discord.svg"
                alt=""
                width="40px"
                height="40px"
              />
            </a>
            <a href="https://github.com/ChainHackers">
              <Image
                src="/images/github.svg"
                alt=""
                width="40px"
                height="40px"
              />
            </a>
            <a href="https://twitter.com/ChainHackerClan">
              <Image
                src="/images/twitter.svg"
                alt=""
                width="40px"
                height="40px"
              />
            </a>
            <a href="https://www.youtube.com/@UtgardaLoki">
              <Image
                src="/images/youtube.svg"
                alt=""
                width="40px"
                height="40px"
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IHomePageProps> = () => {
  return {
    props: {
      partners: companies,
    },
  };
};
