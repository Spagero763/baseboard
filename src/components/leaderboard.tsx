'use client';

import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import abi from '@/abi/LeaderboardManager.json';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Crown } from 'lucide-react';

const CONTRACT_ADDRESS = '0xE8C207DDb9B7B3E04Ef84c1CADBb10FC52506f30';

type Builder = {
  wallet: `0x${string}`;
  username: string;
  score: bigint;
};

const abbreviateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function Leaderboard() {
  const { isConnected } = useAccount();
  const [sortedBuilders, setSortedBuilders] = useState<Builder[]>([]);

  const { data, isError, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getAllBuilders',
    watch: true,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const sorted = [...(data as Builder[])].sort((a, b) => {
        const scoreA = Number(a.score);
        const scoreB = Number(b.score);
        return scoreB - scoreA;
      });
      setSortedBuilders(sorted);
    }
  }, [data]);

  const renderRank = (index: number) => {
    if (index === 0) {
      return <Crown className="w-6 h-6 text-yellow-500" />;
    }
    return <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Top Builders</CardTitle>
        <CardDescription>
          The most active and impactful builders in our ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <Skeleton className="h-8 w-8" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        )}
        {isError && !isConnected && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Wallet Not Connected</AlertTitle>
                <AlertDescription>
                Please connect your wallet to view the leaderboard and interact with the application.
                </AlertDescription>
            </Alert>
        )}
        {isError && isConnected && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                {error?.message.includes("chain mismatch")
                    ? "Please switch to the Base Sepolia network to view the leaderboard."
                    : "Failed to fetch leaderboard data. Please try again later."}
                </AlertDescription>
            </Alert>
        )}
        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Builder</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBuilders.length > 0 ? (
                sortedBuilders.map((builder, index) => (
                  <TableRow key={builder.wallet}>
                    <TableCell className="text-center">
                      {renderRank(index)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{builder.username}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {abbreviateAddress(builder.wallet)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default" className="text-lg bg-primary hover:bg-primary/90">
                        {builder.score.toString()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No builders on the leaderboard yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
