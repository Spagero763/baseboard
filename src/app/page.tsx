import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Leaderboard } from '@/components/leaderboard';
import { Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen w-full text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="font-headline text-4xl font-bold flex items-center gap-3 text-primary">
            <Trophy className="w-10 h-10" />
            BaseBoard
          </h1>
          <ConnectButton />
        </header>
        <Leaderboard />
      </div>
    </main>
  );
}
