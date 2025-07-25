'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { contractAddress } from '@/config';
import abi from '@/abi/LeaderboardManager.json';
import { Loader2, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { parseError } from '@/lib/utils';
import { useEffect } from 'react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  score: z.coerce.number().min(0, {
    message: 'Score must be a positive number.',
  }),
});

export function UpdateScore() {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const {
    data: hash,
    writeContract,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      score: 0,
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Transaction Error',
        description: parseError(error),
      });
    }
  }, [error, toast]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'addOrUpdateBuilder',
      args: [values.username, BigInt(values.score)],
    });
  }

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Update Your Score</CardTitle>
        <CardDescription>
          Update your username and score on the leaderboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConfirmed ? (
            <Alert>
              <PartyPopper className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your score has been updated. The leaderboard will refresh shortly.
              </AlertDescription>
            </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Satoshi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1337" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending || isConfirming}>
                {(isPending || isConfirming) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isConfirming && 'Confirming...'}
                {isPending && !isConfirming && 'Submitting...'}
                {!isPending && !isConfirming && 'Update Score'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
