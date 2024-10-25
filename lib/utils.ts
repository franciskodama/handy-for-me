import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { name: 'Blue', code: '#1E90FF', foreground: '#FFFFFF' },
  { name: 'Green', code: '#32CD32', foreground: '#FFFFFF' },
  { name: 'Red', code: '#FF4500', foreground: '#FFFFFF' },
  { name: 'Yellow', code: '#FFD700', foreground: '#000000' },
  { name: 'Purple', code: '#8A2BE2', foreground: '#FFFFFF' },
  { name: 'Orange', code: '#FFA500', foreground: '#000000' },
  { name: 'Pink', code: '#FF69B4', foreground: '#000000' },
  { name: 'Teal', code: '#20B2AA', foreground: '#FFFFFF' },
  { name: 'Grey', code: '#808080', foreground: '#FFFFFF' },
  { name: 'Brown', code: '#A52A2A', foreground: '#FFFFFF' }
];
