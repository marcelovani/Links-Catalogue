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
        const message = document.createElement('span');
        message.className = 'center';
        message.innerHTML = '<b>No results</b>';
        linksList.appendChild(message);
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
            if (ev.altKey) {
                // Open link on new tab when Alt key is pressed while clicking.
                await chrome.tabs.create({url: ev.target.href, active: true});
            } else {
                // Open link on same tab.
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    var tab = tabs[0];
                    chrome.tabs.update(tab.id, {url: ev.target.href});
                    window.close();
                });
            }
        };
        tagLi.appendChild(link);
    });
}
