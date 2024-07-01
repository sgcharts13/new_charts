// Function to parse date strings in the format "Month Day, Year"
function parseDateString(dateString) {
    return new Date(dateString);
}

// Function to parse time strings in the format "mm:ss"
function parseTimeString(timeString) {
    var parts = timeString.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

// Function to remove thousand separators and convert to integer
function parseNumberString(numberString) {
    return parseInt(numberString.replace(/,/g, ''));
}

// Function to sort the table
function sortTable(columnIndex) {
    var table = document.getElementById("sortable-table");
    var rows = Array.from(table.rows).slice(1); // Get rows, excluding the header
    var isAscending = table.rows[0].cells[columnIndex].getAttribute("data-order") === "asc";
    
    rows.sort(function(a, b) {
        var aText = a.cells[columnIndex].innerText.trim().toLowerCase();
        var bText = b.cells[columnIndex].innerText.trim().toLowerCase();

        if (columnIndex === 4 || columnIndex === 6 || columnIndex === 8) {
            // Compare numbers
            aText = parseInt(aText);
            bText = parseInt(bText);
            return isAscending ? aText - bText : bText - aText;
        } else if (columnIndex === 3 || columnIndex === 5) {
            // Compare dates for "First Week on Chart" and "Peak Week" columns
            var aDate = parseDateString(aText);
            var bDate = parseDateString(bText);
            return isAscending ? aDate - bDate : bDate - aDate;
        } else if (columnIndex === 7) {
            // Compare numbers with thousand separators for "Peak Streams" column
            var aNum = parseNumberString(aText);
            var bNum = parseNumberString(bText);
            return isAscending ? aNum - bNum : bNum - aNum;
        } else if (columnIndex === 9) {
            // Compare time strings for "Song Length" column
            var aTime = parseTimeString(aText);
            var bTime = parseTimeString(bText);
            return isAscending ? aTime - bTime : bTime - aTime;
        } else {
            // Compare strings
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });

    // Update table with sorted rows
    rows.forEach(function(row) {
        table.tBodies[0].appendChild(row);
    });

    // Toggle sort order attribute
    table.rows[0].cells[columnIndex].setAttribute("data-order", isAscending ? "desc" : "asc");
}

// Sort the table by the "First Week on Chart" column (index 3) in descending order when the page loads
window.onload = function() {
    var columnIndex1 = 4;
    var columnIndex2 = 3;
    var table = document.getElementById("sortable-table");
    table.rows[0].cells[columnIndex1].setAttribute("data-order", "asc"); // Set initial sort order to ascending
    table.rows[0].cells[columnIndex2].setAttribute("data-order", "desc"); // Set initial sort order to ascending
    sortTable(columnIndex1); // Sort the column
    sortTable(columnIndex2); // Sort the column
};