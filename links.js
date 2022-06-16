/**
 * Displays linkes filtered by selected tags.
 *
 * @param array selectedTags
 *    The selected tags.
 *
 * @return {Promise<void>}
 */
const displayLinks = async (selectedTags) => {
    const linksList = document.getElementById('links');
    linksList.innerHTML = '';

    // Filter links.
    const selectedLinks = applyFilter(LINKS, selectedTags);
    if (selectedLinks.length < 1) {
        linksList.innerHTML = 'No results';
        return;
    }

    const tagUl = document.createElement('ul');
    linksList.appendChild(tagUl);

    selectedLinks.forEach(item => {
        const tagLi = document.createElement('li');
        tagUl.appendChild(tagLi);

        const link = document.createElement('a');
        link.title = item.url;
        link.href = item.url;
        link.innerHTML = item.url;
        link.className = 'link';
        link.onclick = async (ev) => {
            ev.preventDefault();
            await chrome.tabs.create({ url: ev.target.href, active: false });
        };
        tagLi.appendChild(link);
    });
}
