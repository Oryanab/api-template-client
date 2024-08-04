import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { CsrfProvider } from './providers/CsrfProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <CsrfProvider>
        <App />
    </CsrfProvider>
);
