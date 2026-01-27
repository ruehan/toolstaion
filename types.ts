
import { ReactNode } from 'react';

export type Category = 'image' | 'text' | 'dev' | 'utility';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: ReactNode;
}

export interface ImageFile {
  file: File;
  preview: string;
  originalSize: number;
  compressedSize?: number;
  outputUrl?: string;
  status: 'idle' | 'processing' | 'done' | 'error';
}
