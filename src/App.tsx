import { useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { persistWithIndexedDB } from './utils/index-db-store-adapter';
import Login from './pages/login-page/Login';
import Home from './pages/home-page/Home';
import SessionProvider from './providers/SessionProvider';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

const App = () => {
    const queryCache = useMemo(() => new QueryCache(), []);
    const queryClient = useMemo(
        () =>
            new QueryClient({
                queryCache,
                defaultOptions: {}
            }),
        [queryCache]
    );
    useEffect(() => {
        persistWithIndexedDB(queryClient);
    }, [queryClient]);

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <QueryClientProvider client={queryClient}>
                                <SessionProvider>
                                    <AppLayout />
                                </SessionProvider>
                            </QueryClientProvider>
                        }
                    />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
