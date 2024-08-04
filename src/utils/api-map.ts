type ApiMapPathType = 'CSRF' | 'Session' | 'Register' | 'Login' | 'Logout';

type ApiMapPath = Record<ApiMapPathType, (...rest: any[]) => string>;

export const API_MAP: ApiMapPath = {
    CSRF: () => '/csrf',
    Session: () => '/api/session',
    Register: () => '/api/register',
    Login: () => '/api/login',
    Logout: () => '/api/logout'
};
