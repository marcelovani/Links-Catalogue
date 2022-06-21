class StorageService {
    /**
     * Save to storage.
     *
     * @param key
     *   The key for the storage
     * @param value
     *   The vakye to store
     *
     * @return {Promise<unknown>}
     */
    static saveStorage = async (key, value) => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.set({[key]: value}, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(value);
            });
        });

        return promise;
    }

    /**
     * Clear storage.
     *
     * @param key
     *   The storage key.
     *
     * @return {Promise}
     */
    static clearStorage = async (key) => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.remove([key], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve();
            });
        });

        return promise;
    }

    /**
     * Get values from storage
     *
     * @param key
     *   The storage key.
     *
     * @return {Promise}
     */
    static getStorage = (key) => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve(result[key]);
            });
        });

        return promise;
    }
}

/**
 * Promisify a callback.
 * @param {Function} callback
 * @returns {Promise}
 */
const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        } catch (err) {
            reject(err);
        }
    });
    return promise;
}