import axios from 'axios';
import qs from 'qs';
import { AjaxOptions, AjaxResponse } from '../types';
import { isString } from 'lodash';

const ajax = async function ajax<T>(
    path: string,
    options: AjaxOptions = {}
): Promise<AjaxResponse<T>> {
    try {
        const response = await axios({
            method: options.method,
            url: import.meta.env.VITE_API_URL + path,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...options.headers
            },
            withCredentials: true,
            withXSRFToken: true,
            data: options.body,
            params: options.params,
            paramsSerializer: (params: Record<string, unknown>) =>
                qs.stringify(params)
        });

        return {
            data: response.data,
            status: response.status
        };
    } catch (error: any) {
        let status = 0;
        let message = "Unknown error. We're on it.";

        if (error?.response) {
            status = error.response.status || status;
            switch (status) {
                case 504:
                    message = 'Request timeout, please try again.';
                    break;
                case 503:
                    message =
                        'There was an error connecting to the server. ' +
                        "It's just a temporary problem, please try again soon.";
                    break;
                case 502:
                    message =
                        'There was an error connecting to the server. ' +
                        "It's just a temporary problem, please try again.";
                    break;
                default:
                    message =
                        error.response.data.message &&
                        isString(error.response.data.message)
                            ? error.response.data.message
                            : message;
                    break;
            }
        } else {
            message =
                'There was a network error. ' +
                'Please ensure you are connected to the internet or try again later.';
        }
        throw new Error(message);
    }
};

export const get = <T>(
    path: string,
    options?: AjaxOptions
): Promise<AjaxResponse<T>> => ajax<T>(path, { method: 'GET', ...options });

export const post = <T>(
    path: string,
    options?: AjaxOptions
): Promise<AjaxResponse<T>> => ajax<T>(path, { method: 'POST', ...options });

export const put = <T>(
    path: string,
    options?: AjaxOptions
): Promise<AjaxResponse<T>> => ajax<T>(path, { method: 'PUT', ...options });

export const del = <T>(
    path: string,
    options?: AjaxOptions
): Promise<AjaxResponse<T>> => ajax<T>(path, { method: 'DELETE', ...options });

export default ajax;
