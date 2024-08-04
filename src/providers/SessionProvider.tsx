import { createContext, useContext } from 'react';
import { API_MAP } from '../utils/api-map';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MAX_STALE_TIME } from '../utils/constants';
import { SessionInfo } from '../types';
import { useNavigate } from 'react-router-dom';
import { get } from '../utils/ajax';

const useGetUserSession = (): {
    sessionInfo: SessionInfo | undefined;
    isLoadingSessionInfo: boolean;
    sessionInfoError: Error | null | any;
} => {
    const {
        data: sessionInfo,
        isLoading: isLoadingSessionInfo,
        error: sessionInfoError
    } = useQuery({
        queryKey: [API_MAP.Session],
        queryFn: async () => {
            const { data } = await get<SessionInfo>(API_MAP.Session());
            return data;
        },
        staleTime: MAX_STALE_TIME,
        placeholderData: keepPreviousData
    });
    return {
        sessionInfo,
        isLoadingSessionInfo,
        sessionInfoError
    };
};

interface SessionContextReturnType {
    sessionInfo: SessionInfo | undefined;
    isLoadingSessionInfo: boolean;
    sessionInfoError: Error | null;
    handleLogout: () => void;
}

const SessionContext = createContext<SessionContextReturnType>({
    sessionInfo: {} as any,
    isLoadingSessionInfo: false,
    sessionInfoError: null,
    handleLogout: () => null
});

export default function SessionProvider({
    children
}: {
    children: JSX.Element;
}) {
    const navigate = useNavigate();
    const { sessionInfo, isLoadingSessionInfo, sessionInfoError } =
        useGetUserSession();

    const handleLogout = async () => {
        try {
            await get(API_MAP.Logout());
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    if (sessionInfoError) {
        navigate('/login');
    }

    const props: SessionContextReturnType = {
        sessionInfo,
        isLoadingSessionInfo,
        sessionInfoError,
        handleLogout
    };

    return (
        <SessionContext.Provider value={props}>
            {isLoadingSessionInfo ? 'Loading An Amazing app' : children}
        </SessionContext.Provider>
    );
}

export const useSessionContext = () => useContext(SessionContext);
