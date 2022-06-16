/** @private */
const TAGS_KEY = 'tags';
let LINKS = [];
let TAGS = [];

class PageService {
    /**
     *
     * @returns {Promise<Array>}
     */
    static getLinks = () => {
        const promise = toPromise((resolve, reject) => {
            getCSV(function(contents) {
                const list = csvToArray(contents);
                PageService.extractLinksTags(list);
                resolve(LINKS);
            })
        });

        return promise;
    }

    /**
     * Extracts links and from CSV and stores on global variables to be used by autocomplete search.
     *
     * @param list
     *    The array of links
     */
    static extractLinksTags = (list) => {
        list.forEach(function (link) {
            const [url, ...tags ] = link.split(',');

            // Push individual tags for the autocomplete search.
            const linkTags = [];
            tags.forEach(function (tag) {
                // Remove line breaks and spaces.
                tag = tag.trim();
                if (tag != '') {
                    linkTags.push(tag);
                }
            });

            // Check if the url is not present before adding it.
            const exists = LINKS.find(o => o.url === url);
            if (!exists) {
                // Push data to global link register.
                LINKS.push({
                    url: url,
                    tags: linkTags,
                });
            }

            // Merge with global register and remove duplicated values.
            TAGS = Array.from(new Set([...TAGS, ...linkTags]));
        });
    }

    /**
     *
     * @returns {Promise<Array>}
     */
    static getTags = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([TAGS_KEY], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                const tags = result.tags ?? [];
                resolve(tags);
            });
        });

        return promise;
    }

    static saveTag = async (tag, action) => {
        const tags = await this.getTags();
        let updateTags = [];
        switch (action) {
            case 'remove':
                updateTags = tags.filter(item => item !== tag)
                break;

            case 'add':
            default:
                // Merge and remove duplicates.
                updateTags = Array.from(new Set([...tags, tag]));
                break;
        }

        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.set({[TAGS_KEY]: updateTags}, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(updateTags);
            });
        });

        return promise;
    }

    static clearTags = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.remove([TAGS_KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve();
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