import React from 'react';
import { IChatLogMessage } from 'types/chat';

export interface IChatLogProps {
  children?: React.ReactNode;
  anyMessages: { moves: IChatLogMessage[] } | null;
  isLoading?: boolean;
}
