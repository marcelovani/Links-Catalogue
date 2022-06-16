// @todo move this to configuration page.
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1lXAUo5RubChwo9NYxEi64ma-CS68S7uT541BAm_TQCU/export?exportFormat=csv';

/**
 * Fetches csv from remote
 *
 * @param func
 *    Callback function
 *
 * @return Csv contents
 */
function getCSV(func) {
    var rawFile = new XMLHttpRequest();
    var allText;

    rawFile.open("GET", CSV_URL, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4)
            if (rawFile.status === 200 || rawFile.status == 0)
                allText = rawFile.responseText;
        if (func != undefined && typeof (func) == "function") {
            func(allText);
        }
    };

    rawFile.send();
}

/**
 * Converts CSV to array
 *
 * @param str
 *    The CSV
 *
 * @param delimiter
 *    The delimiter
 *
 * @return
 *    The array
 */
function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    return rows;
}
