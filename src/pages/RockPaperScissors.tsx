
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Hand, Scissors, FileType, RefreshCw, History, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Choice component for the game
const ChoiceButton = ({ 
  choice, 
  onClick, 
  disabled = false, 
  selected = false,
  size = 'md'
}) => {
  // Get icon based on choice
  const getIcon = () => {
    switch (choice) {
      case 'rock':
        return <Hand className="stroke-game-purple" size={size === 'lg' ? 80 : size === 'md' ? 40 : 24} />;
      case 'paper':
        return <FileType className="stroke-game-blue" size={size === 'lg' ? 80 : size === 'md' ? 40 : 24} />;
      case 'scissors':
        return <Scissors className="stroke-game-pink" size={size === 'lg' ? 80 : size === 'md' ? 40 : 24} />;
      default:
        return null;
    }
  };

  // Get border color based on choice
  const getBorderColor = () => {
    switch (choice) {
      case 'rock':
        return 'border-game-purple';
      case 'paper':
        return 'border-game-blue';
      case 'scissors':
        return 'border-game-pink';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <button
      className={`choice-button ${getBorderColor()} ${selected ? 'ring-4 ring-yellow-300' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={choice || 'choice'}
    >
      {getIcon()}
      <span className="mt-2 capitalize">{choice}</span>
    </button>
  );
};

// Confetti component for wins
const Confetti = ({ count = 50 }) => {
  const colors = ['bg-game-pink', 'bg-game-purple', 'bg-game-blue', 'bg-game-yellow', 'bg-game-green'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`confetti ${colors[Math.floor(Math.random() * colors.length)]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

// Result message component
const ResultMessage = ({ result }) => {
  if (!result) return null;

  const messages = {
    win: {
      text: "You won! 🎉",
      class: "text-green-600 font-bold text-2xl animate-bounce"
    },
    lose: {
      text: "You lost! 😢",
      class: "text-red-500 font-bold text-2xl"
    },
    draw: {
      text: "It's a draw! 🤝",
      class: "text-yellow-500 font-bold text-2xl"
    }
  };

  return (
    <div className={`my-6 text-center ${messages[result].class}`}>
      {messages[result].text}
    </div>
  );
};

// Main Game Component
const RockPaperScissors = () => {
  const {
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
  } = useGame();

  // Handle player choice
  const handleChoice = (choice) => {
    if (isAnimating || playerChoice) return;
    setPlayerChoice(choice);
    toast(`You chose ${choice}!`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      {result === 'win' && <Confetti />}
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
            <Home className="mr-2" size={18} />
            <span>Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            Rock Paper Scissors
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetGame}
            className="flex items-center"
          >
            <RefreshCw className="mr-2" size={16} />
            Reset
          </Button>
        </div>

        <Card className="game-card mb-6">
          <div className="flex justify-between mb-4">
            <div className="text-center px-6 py-3 bg-game-pink/30 rounded-xl">
              <h2 className="text-xl font-bold">You</h2>
              <p className="text-3xl font-bold">{playerScore}</p>
            </div>
            
            <div className="text-center px-6 py-3 bg-game-blue/30 rounded-xl">
              <h2 className="text-xl font-bold">Computer</h2>
              <p className="text-3xl font-bold">{computerScore}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <h3 className="mb-4 text-lg font-semibold">Your Choice</h3>
              {playerChoice ? (
                <ChoiceButton choice={playerChoice} onClick={() => {}} size="lg" />
              ) : (
                <div className="h-[160px] w-[160px] flex items-center justify-center bg-muted/50 rounded-full border-4 border-dashed border-muted">
                  <p className="text-muted-foreground">Choose below</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="mb-4 text-lg font-semibold">Computer's Choice</h3>
              {computerChoice ? (
                <ChoiceButton choice={computerChoice} onClick={() => {}} size="lg" />
              ) : (
                <div className="h-[160px] w-[160px] flex items-center justify-center bg-muted/50 rounded-full border-4 border-dashed border-muted animate-pulse">
                  <p className="text-muted-foreground">{isAnimating ? "Thinking..." : "Waiting..."}</p>
                </div>
              )}
            </div>
          </div>

          <ResultMessage result={result} />

          {result ? (
            <Button 
              onClick={playAgain} 
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
            >
              Play Again
            </Button>
          ) : (
            <div className="flex flex-col">
              <p className="text-center mb-4 font-medium">Make your choice:</p>
              <div className="grid grid-cols-3 gap-4">
                <ChoiceButton 
                  choice="rock" 
                  onClick={() => handleChoice('rock')} 
                  disabled={!!playerChoice || isAnimating}
                  selected={playerChoice === 'rock'}
                />
                <ChoiceButton 
                  choice="paper" 
                  onClick={() => handleChoice('paper')} 
                  disabled={!!playerChoice || isAnimating}
                  selected={playerChoice === 'paper'}
                />
                <ChoiceButton 
                  choice="scissors" 
                  onClick={() => handleChoice('scissors')} 
                  disabled={!!playerChoice || isAnimating}
                  selected={playerChoice === 'scissors'}
                />
              </div>
            </div>
          )}
        </Card>

        <Card className="game-card">
          <div className="flex items-center mb-4">
            <History size={20} className="mr-2" />
            <h2 className="text-xl font-bold">Game History</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="max-h-40 overflow-y-auto">
            {gameHistory.length > 0 ? (
              <div className="space-y-2">
                {gameHistory.map((round, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ChoiceButton choice={round.playerChoice} onClick={() => {}} size="sm" />
                      <span className="font-bold">vs</span>
                      <ChoiceButton choice={round.computerChoice} onClick={() => {}} size="sm" />
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      round.result === 'win' ? 'bg-green-100 text-green-800' : 
                      round.result === 'lose' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {round.result === 'win' ? 'Win' : round.result === 'lose' ? 'Loss' : 'Draw'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No games played yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RockPaperScissors;
