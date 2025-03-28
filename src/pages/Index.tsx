
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/70 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl game-card border-game-purple">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-game-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gamepad2 size={36} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
            Cute Rock Paper Scissors
          </h1>
          <p className="text-lg text-muted-foreground">
            A fun and colorful game to play against the computer!
          </p>
        </div>
        
        <Link to="/game">
          <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 animate-pulse">
            Play Now
          </Button>
        </Link>
        
        <div className="mt-6 text-sm text-center text-muted-foreground">
          <p>Choose rock, paper, or scissors and see if you can beat the computer!</p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
