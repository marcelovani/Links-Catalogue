/**
 * Displays list of tags.
 *
 * @return {Promise<void>}
 */
const displayTags = async () => {
    // Display selected tags.
    const selectedTags = await tagsService.getTags();
    await displaySelectedTags(selectedTags);

    // Filter links.
    const selectedLinks = filterLinksByTags(LINKS, selectedTags);

    // Display links.
    displayLinks(selectedLinks);

    // Display available tags.
    let availableTags = getAvailableTags(selectedLinks);
    // Remove selected tags from available tags.
    availableTags = availableTags.filter(item => !selectedTags.includes(item));

    await displayAvailableTags(availableTags);
}

/**
 * Displays selected tags.
 *
 * @param array selectedTags
 *   The array of tags.
 *
 * @return {Promise<void>}
 */
const displaySelectedTags = async (selectedTags) => {
    const container = document.getElementById('selected-tags');
    container.innerHTML = '';

    const title = document.createElement('h4');
    title.innerHTML = 'Selected tags';
    container.appendChild(title);

    const tagUl = document.createElement('ul');
    tagUl.className = 'tag';
    container.appendChild(tagUl);

    selectedTags.forEach(item => {
        const tagLi = document.createElement('li');
        tagUl.appendChild(tagLi);

        const tag = document.createElement('span');
        tag.className = 'caption';
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
}

/**
 * Displays available tags.
 *
 * @param array availableTags
 *   The array of tags.
 *
 * @return {Promise<void>}
 */
const displayAvailableTags = async (availableTags) => {
    const container = document.getElementById('available-tags');
    container.innerHTML = '';

    const title = document.createElement('h4');
    title.innerHTML = 'Available tags';
    container.appendChild(title);

    const tagUl = document.createElement('ul');
    tagUl.className = 'tag';
    container.appendChild(tagUl);

    availableTags.forEach(item => {
        const tagLi = document.createElement('li');
        tagUl.appendChild(tagLi);

        const tag = document.createElement('span');
        tag.className = 'caption';
        tag.innerHTML = item;
        tag.dataset.tag_name = item;
        tagLi.appendChild(tag);
        tag.onclick = async (ev) => {
            ev.preventDefault();
            await tagsService.saveTag(ev.target.dataset.tag_name, 'add');
            await displayTags();
        };
    });
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
 * Filters out links based on selected tags.
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
const filterLinksByTags = (links, tags) => {
    const filterBytags = (links, tags) => {
        return links.filter( item => tags.every( tag => item.tags.includes(tag) ));
    }
    return filterBytags(links, tags);
}

/**
 * Get tags that are in the link results.
 *
 * @param array links
 *    The links
 *
 * @return array
 *    The filtered data
 */
const getAvailableTags = (links) => {
    let availableTags = [];
    links.forEach(item => {
        // Merge and remove duplicates.
        availableTags = Array.from(new Set([...availableTags, ...item.tags]));
    });
    return availableTags;
}
