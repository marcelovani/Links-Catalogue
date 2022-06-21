/**
 * Fetches csv from remote
 *
 * @param url
 *    The source url for the CSV
 *
 * @param func
 *    Callback function
 *
 * @return Csv contents or error message
 */
const getCSV = async (url, func) => {
    var rawFile = new XMLHttpRequest();
    var allText;

    rawFile.open("GET", url, false);
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
