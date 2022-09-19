import { gql } from '@apollo/client';

export const gameEntitiesQuery = gql`
  {
    gameEntities {
      id
      gameId
      winner
      loser
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
