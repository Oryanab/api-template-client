import { useSessionContext } from '../providers/SessionProvider';

const AppHeader = () => {
    const { sessionInfo } = useSessionContext();
    return (
        <div style={{ height: '75px' }}>
            Connected User: {JSON.stringify(sessionInfo)}
        </div>
    );
};

export default AppHeader;
