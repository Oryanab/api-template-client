import { Navigate, Outlet } from 'react-router-dom';
import { useSessionContext } from '../providers/SessionProvider';

const PrivateRoute = () => {
    const { sessionInfo } = useSessionContext();
    return sessionInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
