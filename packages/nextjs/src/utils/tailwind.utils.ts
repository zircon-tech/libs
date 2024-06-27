import { clsx, type ClassValue } from 'clsx';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type ClassValues<T extends HTMLElement> = HTMLAttributes<T>['className'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
