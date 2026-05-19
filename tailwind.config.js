import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, './src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'portfolio-accent': '#9e4123',
        'portfolio-paper': '#fffaf4',
        'portfolio-ink': '#1f1710',
      },
    },
  },
  plugins: [],
  /** 避免与 Ant Design 样式冲突 */
  corePlugins: {
    preflight: false,
  },
};
