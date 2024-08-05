import AppHeader from './AppHeader';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                padding: '0 18px 18px 18px'
            }}
        >
            <AppHeader />
            <div
                style={{
                    height: 'calc(100vh - 75px)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '26px',
                    background: '#f2f3f7',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    overflow: 'scroll'
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;
