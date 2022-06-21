/**
 * Displays list of tags.
 *
 * @return {Promise<void>}
 */
const displayTags = async () => {
    const selectedTags = await tagsService.getTags();
    const tagList = document.getElementById('selected-tags');
    tagList.innerHTML = '';

    const tagUl = document.createElement('ul');
    tagList.appendChild(tagUl);

    selectedTags.forEach(item => {
        const tagLi = document.createElement('li');
        tagUl.appendChild(tagLi);

        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = item;
        tagLi.appendChild(tag);

        const removeLink = document.createElement('a');
        removeLink.title = 'Remove tag';
        removeLink.innerHTML = 'X';
        removeLink.href = '#';
        removeLink.className = 'remove-tag';
        removeLink.dataset.tag_name = item;
        removeLink.onclick = async (ev) => {
            ev.preventDefault();
            await tagsService.saveTag(ev.target.dataset.tag_name, 'remove');
            await displayTags();
        };
        tagLi.appendChild(removeLink);
    });

    // Display links.
    displayLinks(selectedTags);
}

/**
 * Adds tags to the list.
 *
 * @param tag
 *    The tag
 *
 * @return {Promise<void>}
 */
const addTag = async (tag) => {
    await tagsService.saveTag(tag, 'add');
    await displayTags();
}

/**
 * Removes tags from the list.
 *
 * @param tag
 *    The tag
 *
 * @return {Promise<void>}
 */
const removeTag = async (tag) => {
    await tagsService.saveTag(tag, 'remove');
    await displayTags();
}

/**
 * Filters out urls based on selected tags.
 *
 * @param array links
 *    The links
 *
 * @param array tags
 *    The tags
 *
 * @return array
 *    The filtered data
 */
const applyFilter = (links, tags) => {
    const filterBytags = (links, tags) => {
        return links.filter( item => tags.every( tag => item.tags.includes(tag) ));
    }
    return filterBytags(links, tags);
}
