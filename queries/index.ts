import { gql } from '@apollo/client';

export const gameEntitiesQuery = gql`
  {
    gameEntities {
      id
      gameId
      rules
      stake
      proposer
      winner
      loser
      cheater
      isDraw
      started
      resigned
      finished
    }
  }
`;

export const inRowCounterEntitiesQuery = gql`
  {
    inRowCounterEntities(first: 5) {
      id
      winnerCount
      loserCount
      cheaterCount
    }
  }
`;

export const badgesQuery = gql`
  query MyQuery($id: String) {
    inRowCounterEntities(where: { id: $id }) {
      cheaterMaxValue
      drawCount
      cheaterCount
      drawMaxValue
      id
      loserCount
      loserMaxValue
      winnerCount
      winnerMaxValue
    }
  }
`;
