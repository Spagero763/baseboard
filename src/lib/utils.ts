import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('User rejected the request')) {
      return 'Transaction rejected by user.';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction.';
    }
    if (error.message.includes("Connector not connected")) {
      return "Wallet not connected. Please connect your wallet and try again.";
    }
  }

  // Attempt to parse known structures for contract errors
  let message = error.shortMessage || error.message;

  if (message) {
    const match = message.match(/reason="([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
    // Remove RPC URL if present
    message = message.replace(/URL: .*/, '').trim();
    return message;
  }
  
  try {
    const errorJson = JSON.stringify(error);
    return errorJson;
  } catch {
    return 'An unknown error occurred.';
  }
}
