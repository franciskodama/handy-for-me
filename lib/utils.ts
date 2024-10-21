import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { name: 'Blue', code: '#1E90FF' },
  { name: 'Green', code: '#32CD32' },
  { name: 'Red', code: '#FF4500' },
  { name: 'Yellow', code: '#FFD700' },
  { name: 'Purple', code: '#8A2BE2' },
  { name: 'Orange', code: '#FFA500' },
  { name: 'Pink', code: '#FF69B4' },
  { name: 'Teal', code: '#20B2AA' },
  { name: 'Gray', code: '#808080' },
  { name: 'Brown', code: '#A52A2A' }
];
