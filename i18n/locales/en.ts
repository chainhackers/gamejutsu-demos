const en = {
  translation: {
    header: {
      title: 'GameJutsu',
    },
    navigation: {
      gameDemo: 'Game Demo',
      team: 'Meet the Team',
      gitHub: 'GitHub',
      documents: 'Documents',
    },
    buttons: {
      connectWAllet: 'Connect Wallet',
      tryDemo: 'Try Demo',
      play: 'Let’s play!',
      return: 'Return',
      connect: 'Press to connect',
    },
    frontpage: {
      introduction: { l1: 'Say goodbye 👋🏼', l2: 'to signing transactions on every game move' },
      description: {
        l1: 'GameJutsu is a gaming framework to take care of the on-chain / off-chain communication on Web3.',
        l2: 'Launch your awesome game on Web3 with us.',
      },
    },
    gameTypePage: {
      title: 'Try it yourself!',
      description: 'Experience the protocol. It just works. ✨',
      games: {
        ticTacToe: 'Tic-Tac-Toe',
        checkers: 'Checkers',
      },
    },
    selectGame: {
      unknownUser: 'unknown',
      title: 'How would you like to begin?',
      description: 'Start a game or join a game',
      new: {
        title: 'New?',
        description: 'Start a new game',
        button: 'START',
      },
      join: {
        title: 'Got a friend?',
        description: 'Join their game',
        button: 'JOIN',
      },
    },
    joinGame: {
      title: 'Join a game',
      description: 'Select from one of the sessions to join',
      accepting: 'Accepting game...',
      error: 'Accepting game failed. Please try again',
    },
    gamesList: {
      header: {
        id: 'id',
        winner: 'winner',
        loser: 'loser',
      },
    },
    selectPrize: {
      gameId: 'Created game ID:',
      acceptGameId: 'Accepted game ID:',
      title: '🏆 Winner gets',
      description: {
        free: 'A badge of honour',
        stake: '',
      },
      prize: {
        free: '🎖',
        stake: 'MATIC',
      },
      free: {
        title: 'Play for free',
        description: 'Winner gets a Sismo Badge',
      },
      stake: {
        title: 'Stake a prize pool',
        description: 'Winner gets MATIC Tokens',
      },
      notification: {
        p1: 'If each player stake',
        p2: 'the winner gets',
      },
    },
    poweredBy: {
      title: 'Powered By',
    },
    connectPage: {
      title: 'Let’s get you started',
      description: 'Connect with your wallet to continue',
      wallets: '👛👝',
      createWallet: 'Create wallet',
    },
    shade: {
      wait: 'Waiting for a new player. . .',
      connecting: 'Connecting to another player. . .',
      whatToReport: 'What do you want to report?',
      cheating: 'Cheating',
      inactive: 'Inactive',
      madeAppeal: { cheater: 'Opponent made an appeal to the Game Master you cheated.', runner: 'You appealed cheating to the Game Master.'},
      notice: 'Pending decision from Game Master',
      checking: {checkingWinner: 'Claim win', checkingLoser: 'Please wait for the winner\'s confirmation', checkingDraw: 'Confirm draw', checkingCheat: 'Finish game', winner: 'You win', loser: 'You lose',  draw: 'It\'s a draw',  cheatGame: 'The game ended with a cheat move',},
    },
    wins: 'wins!',
    players: {
      title: 'Players',
      timeout: 'Opponent requested timeout!',
      timeoutButtons: {
        finish: 'Finish timeout',
        resolve: 'Resolve timeout',
        init: 'Init timeout',
      },
      legend: {
        finish: 'You can finish timeout if you decide to stop forcing you opponent fo move.',
        resolve: 'You can reslove timeout after you make a move if timeout is requested',
        init: 'You can initiate timeout to force your opponent to make a new move.',
      }
    },
    leftpanel: {
      'gameId': 'Game ID'
    },
    games: {
      checkers: {
        disclaimer: {
          notice: 'Checkers rules notice',
          s1: 'This protocol demo shows the Arbiter using',
          l1: 'Checkers rules',
          s2: 'to judge if the game is played fair and square.The twist here is that a single move contains only one checker position change, i.e.when a player jumps multiple times, that is recorded as a sequence of separate moves, each containing one jump and a flag indicating who\'s to move next. This may not be the smoothest UX, it is done to demonstrate ways of encoding game rules on-chain that don\'t require complicated programming.'}
      }
    }
  },
};

export default en;
