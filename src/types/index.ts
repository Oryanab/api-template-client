export interface AjaxResponse<T = unknown> {
    status: number;
    data: T;
    headers?: Record<string, unknown>;
}
type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export type AjaxOptions = {
    token?: string;
    method?: HttpMethod;
    body?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, unknown>;
};

export interface SessionInfo {}
