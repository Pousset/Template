import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { usePassThrough } from 'primereact/passthrough';
import Tailwind from 'primereact/passthrough/tailwind';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import './index.css';
import App from './App.tsx';
import { customTheme } from './prime/index.tsx';

const CustomTailwind = usePassThrough(
  Tailwind,
  customTheme,
  {
    mergeSections: true,
    mergeProps: false,
  },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={CustomTailwind}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
);
