import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type CV = Parameters<typeof clsx>;

function cn(...inputs: CV) {
  return twMerge(clsx(...inputs));
}

export { cn };
