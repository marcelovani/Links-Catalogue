document.addEventListener('DOMContentLoaded', async () => {
    var input = document.getElementById("csv-url");
    const config = await StorageService.getStorage('config_csv_url');
    if (Object.values(config).length > 0) {
        input.value = config;
    }

    // Add button.
    var saveButton = document.getElementById("save");
    saveButton.onclick = async () => {
        var url = document.getElementById("csv-url").value;
        if (url != '') {
            await StorageService.saveStorage('config_csv_url', url);
        }
    };
});
