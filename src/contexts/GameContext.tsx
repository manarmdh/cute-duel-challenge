
import React, { createContext, useContext, useState, useEffect } from 'react';

type Choice = 'rock' | 'paper' | 'scissors' | null;

interface GameRound {
  playerChoice: Choice;
  computerChoice: Choice;
  result: 'win' | 'lose' | 'draw' | null;
  timestamp: Date;
}

interface GameContextType {
  playerScore: number;
  computerScore: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: 'win' | 'lose' | 'draw' | null;
  gameHistory: GameRound[];
  isAnimating: boolean;
  setPlayerChoice: (choice: Choice) => void;
  resetGame: () => void;
  playAgain: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Make computer choice and determine winner
  useEffect(() => {
    if (playerChoice) {
      setIsAnimating(true);
      
      // Delay computer choice for animation
      const timer = setTimeout(() => {
        const choices: Choice[] = ['rock', 'paper', 'scissors'];
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        setComputerChoice(randomChoice);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [playerChoice]);

  // Determine the winner once both choices are made
  useEffect(() => {
    if (playerChoice && computerChoice) {
      const timer = setTimeout(() => {
        let roundResult: 'win' | 'lose' | 'draw' | null = null;
        
        if (playerChoice === computerChoice) {
          roundResult = 'draw';
        } else if (
          (playerChoice === 'rock' && computerChoice === 'scissors') ||
          (playerChoice === 'paper' && computerChoice === 'rock') ||
          (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
          roundResult = 'win';
          setPlayerScore(prev => prev + 1);
        } else {
          roundResult = 'lose';
          setComputerScore(prev => prev + 1);
        }

        setResult(roundResult);
        
        // Add to game history
        setGameHistory(prev => [
          {
            playerChoice,
            computerChoice,
            result: roundResult,
            timestamp: new Date()
          },
          ...prev
        ]);

        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [playerChoice, computerChoice]);

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setGameHistory([]);
  };

  const playAgain = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <GameContext.Provider
      value={{
        playerScore,
        computerScore,
        playerChoice,
        computerChoice,
        result,
        gameHistory,
        isAnimating,
        setPlayerChoice,
        resetGame,
        playAgain
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
