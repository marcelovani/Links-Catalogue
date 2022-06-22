/** @private */
const TAGS_KEY = 'tags';
let LINKS = [];
let TAGS = [];

class tagsService {
    /**
     *
     * @returns {Promise<Array>}
     */
    static getLinks = async (csv_url) => {
        const promise = toPromise((resolve, reject) => {
            getCSV(csv_url, function(contents) {
                const list = csvToArray(contents);
                tagsService.extractLinksTags(list);
                resolve(LINKS);
            })
        });

        return promise;
    }

    /**
     * Extracts links and tags from CSV and stores on global variables to be used by autocomplete search.
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
     * Get tags from storage.
     *
     * @returns {Promise<Array>}
     */
    static getTags = async () => {
        const result = await StorageService.getStorage(TAGS_KEY);
        if (Object.values(result).length > 0) {
            return result;
        }
        else {
            return [];
        }
    }

    /**
     * Saves tags.
     *
     * @param tag
     *   Tag to save
     *
     * @param action
     *   Action [remove/add].
     *
     * @return {Promise<unknown>}
     */
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

        return StorageService.saveStorage(TAGS_KEY, updateTags);
    }

    /**
     * Clear tags.
     *
     * @return {Promise}
     */
    static clearTags = async () => {
        return StorageService.clearStorage(TAGS_KEY);
    }
}
