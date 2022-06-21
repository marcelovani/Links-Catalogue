document.addEventListener('DOMContentLoaded', async () => {
    // Get CSV url from configuration.
    const csv_url = await StorageService.getStorage('config_csv_url');
    if (!csv_url || Object.values(csv_url).length == 0) {
        const linksList = document.getElementById('links');
        const message = document.createElement('span');
        message.className = 'error center';
        message.innerHTML = 'Source CSV not configured yet. You can configure it in the options page.';
        linksList.appendChild(message);
    }

    // Get links from CSV.
    await tagsService.getLinks(csv_url);

    // Display tags.
    await displayTags();

    /* initiate the autocomplete function on the "search-text" element, and pass along the countries array as possible autocomplete values: */
    var searchInput = document.getElementById("search-text");
    autocomplete(searchInput, TAGS);

    // Add button.
    var addTagButton = document.getElementById("add-tag");
    addTagButton.onclick = async () => {
        var tag = document.getElementById("search-text").value;
        if (tag != '') {
            await addTag(tag);
            await displayTags();
            searchInput.value = '';
        }
    };
});
