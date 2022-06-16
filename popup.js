document.addEventListener('DOMContentLoaded', async () => {
    // Get links from CSV.
    await PageService.getLinks();

    // Display tags.
    await displayTags();

    // Display links.
    //await displayLinks();

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
