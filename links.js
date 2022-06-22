/**
 * Displays links.
 *
 * @param array selectedLinks
 *    The selected links.
 *
 * @return {Promise<void>}
 */
const displayLinks = async (selectedLinks) => {
    const linksList = document.getElementById('links');
    linksList.innerHTML = '';

    if (selectedLinks.length < 1) {
        const message = document.createElement('span');
        message.className = 'center';
        message.innerHTML = '<b>No results</b>';
        linksList.appendChild(message);
        return;
    }

    const linkUl = document.createElement('ul');
    linksList.appendChild(linkUl);

    selectedLinks.forEach(item => {
        const linkLi = document.createElement('li');
        linkUl.appendChild(linkLi);

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
        linkLi.appendChild(link);
    });
}
