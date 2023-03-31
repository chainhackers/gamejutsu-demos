/* eslint-disable @next/next/no-img-element */
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
// import styles from '../../styles/Home.module.scss';
import styles from './/Home.module.scss';
// import 'i18n/index';
import { Button } from 'components';
import { PoweredBy } from 'components/PoweredBy';

import companies from 'data/partners.json';
import { useRouter } from 'next/router';

interface IHomePageProps {
  partners: { image: string; name: string; href: string }[];
}
const Home: NextPage<IHomePageProps> = ({ partners }) => {
  const { t } = useTranslation();

  const router = useRouter();

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
            <Image
              src="/images/serveless-communication.png"
              alt="serverless communication"
              width="344px"
              height="362px"
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
            <a href="#">
              {' '}
              <Image
                src="/images/dices.png"
                alt=""
                width="25px"
                height="24px"
              />{' '}
              Try Dem /o
            </a>

            <span>
              GameJutsu is a gaming framework to take care of the on-chain /
              off-chain communication on Web3.
            </span>
          </div>
        </div>
        <div className={styles.sliderCan}>
          <div className={styles.sliderTitle}>
            <h2>How can I use it?</h2>
          </div>
          <div className={styles.swiper + ' ' + styles.mySwiper1}>
            <div className={styles.swiperWrapper}>
              <div className={styles.swiperSlide}>
                <div className={styles.itemSlid}>
                  <Image
                    src="/images/slider1.png"
                    width="166px"
                    height="190px"
                    alt=""
                  />
                  <p>To improve UX of your game services</p>
                </div>
              </div>
              <div className={styles.swiperSlide}>
                <div className={styles.itemSlid}>
                  <Image
                    src="/images/slider2.png"
                    width="166px"
                    height="190px"
                    alt=""
                  />
                  <p>Make crypto games with clean UI</p>
                </div>
              </div>
              <div className={styles.swiperSlide}>
                <div className={styles.itemSlid}>
                  <Image
                    src="/images/slider3.png"
                    width="166px"
                    height="190px"
                    alt=""
                  />
                  <p>Spare on server infrastructure and maintenance</p>
                </div>
              </div>
              <div className={styles.swiperSlide}>
                <div className={styles.itemSlid}>
                  <Image
                    src="/images/slider1.png"
                    width="166px"
                    height="190px"
                    alt=""
                  />
                  <p>To improve UX of your game services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.workBlock}>
          <div className={styles.titleWork}>
            <h2>How it works?</h2>
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
          </div>
          <div className={styles.workSec}>
            <Image
              src="/images/work1.svg"
              alt=""
              width="291px"
              height="264px"
            />
            <Image
              src="/images/work2.svg"
              alt=""
              width="383px"
              height="357px"
            />
          </div>
          <div className={styles.workTitle2}>
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
          </div>
          <div className={styles.gameBlock}>
            <div className="item_block">
              <h3>Game events</h3>
              <Image
                src="/images/game1.svg"
                width="123px"
                height="625px"
                alt=""
              />
            </div>
            <div className="item_block">
              <h3>Extra clicks</h3>
              <Image
                src="/images/game2.svg"
                width="77px"
                height="421px"
                alt=""
              />
            </div>
            <div className="item_block">
              <h3>Users’ vibe</h3>
              <Image
                src="/images/game3.svg"
                width="142px"
                height="521px"
                alt=""
              />
            </div>
          </div>
          <div className={styles.gameTitle}>
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
              creation or to establish a payment channel between two players.
            </p>
          </div>
          <div className={styles.gameBlock2}>
            <div className={styles.itemTitle}>
              <h3>Game events</h3>
              <h3>Extra clicks</h3>
            </div>
            <div className={styles.imgGame}>
              <Image
                src="/images/game4.svg"
                width="373px"
                height="936px"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className={styles.sponsorBlock}>
          <div className={styles.logo}>
            <Image
              src="/logo/front-ninja.png"
              alt="GameJutsu Logo"
              width="600px"
              height="400px"
              // layout="fill"
            />
          </div>
          <PoweredBy poweredByList={partners} />
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
