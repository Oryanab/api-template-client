import { QueryClient, dehydrate, hydrate } from '@tanstack/react-query';
import { get, set, del } from 'idb-keyval';
import logger from './logger';

interface IndexedDBCache {
    timestamp: number;
    cacheState: any;
}

interface Options {
    IndexedDBKey?: string;
    throttleTime?: number;
    maxAge?: number;
}

function throttle(func: (...args: any[]) => any, wait = 100) {
    let timer: number | null | NodeJS.Timeout = null;
    return function (...args: any[]) {
        if (timer === null) {
            timer = setTimeout(() => {
                func(...args);
                timer = null;
            }, wait);
        }
    };
}

const checkDatabaseExists = (dbName: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        let existed = true;
        request.onsuccess = function () {
            request.result.close();
            if (!existed) {
                indexedDB.deleteDatabase(dbName);
            }
            resolve(existed);
        };

        request.onupgradeneeded = function () {
            existed = false;
            request.transaction!.abort();
            resolve(false);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
};

const createIndexDBDaatabase = () => {
    const request = window.indexedDB.open('keyval-store', 1);
    request.onupgradeneeded = function (e: IDBVersionChangeEvent) {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('keyval')) {
            db.createObjectStore('keyval');
        }
    };
    request.onerror = function (e: Event) {
        logger.error(
            `Error opening database: ${(e.target as IDBOpenDBRequest).error}`
        );
    };
};

export const removeIndexedDBDatabase = () => {
    const deleteRequest = window.indexedDB.deleteDatabase('keyval-store');
    deleteRequest.onerror = function (e: Event) {
        logger.error(
            `Error deleting database: ${(e.target as IDBOpenDBRequest).error}`
        );
    };
    deleteRequest.onblocked = function () {
        logger.error(
            'Database deletion blocked. Please close all other tabs or windows using this database and try again.'
        );
    };
};

export async function persistWithIndexedDB(
    queryClient: QueryClient,
    {
        IndexedDBKey: indexedDBKey = `MANAGBL_CLIENT_CACHE`,
        throttleTime = 1000,
        maxAge = 1000 * 60 * 60 * 24 * 7
    }: Options = {}
) {
    if (typeof window !== 'undefined') {
        const saveCache = throttle(async () => {
            try {
                const storageCache: IndexedDBCache = {
                    timestamp: Date.now(),
                    cacheState: dehydrate(queryClient)
                };

                await set(indexedDBKey, JSON.stringify(storageCache));
            } catch (error) {
                logger.error(`Error saving cache: ${error}`);
            }
        }, throttleTime);

        queryClient.getQueryCache().subscribe(saveCache);

        // Attempt restore
        let cacheStorage;
        try {
            const exist = await checkDatabaseExists('keyval-store');
            if (exist) {
                cacheStorage = await get(indexedDBKey);
            } else {
                // Create database if not exist and cache storage
                createIndexDBDaatabase();
                cacheStorage = await get(indexedDBKey);
            }

            if (!cacheStorage) {
                const initialCache: IndexedDBCache = {
                    timestamp: Date.now(),
                    cacheState: dehydrate(queryClient)
                };
                await set(indexedDBKey, JSON.stringify(initialCache));
                hydrate(queryClient, initialCache.cacheState);
                return;
            }

            const cache: IndexedDBCache = JSON.parse(cacheStorage);

            if (cache.timestamp) {
                const expired = Date.now() - cache.timestamp > maxAge;
                if (expired) {
                    await del(indexedDBKey); // Delete from Indexed DB if expired
                } else {
                    hydrate(queryClient, cache.cacheState);
                }
            } else {
                await del(indexedDBKey);
            }
        } catch (error: any) {
            logger.error(error.message);
        }
    }
}
