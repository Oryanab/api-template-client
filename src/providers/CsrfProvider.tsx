import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { get } from '../utils/ajax';
import { API_MAP } from '../utils/api-map';

interface CsrfContextType {
    csrfToken: string;
}

const CsrfContext = createContext<CsrfContextType>({ csrfToken: '' });

export const CsrfProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [csrfToken, setCsrfToken] = useState<string>('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await get<CsrfContextType>(API_MAP.CSRF());
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    return (
        <CsrfContext.Provider value={{ csrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};

export const useCsrfToken = (): string => {
    const context = useContext(CsrfContext);
    if (context === undefined) {
        throw new Error('useCsrfToken must be used within a CsrfProvider');
    }
    return context.csrfToken;
};
