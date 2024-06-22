function showTable(tableId, buttonId) {
    // Hide all tables
    var tables = document.querySelectorAll('.table-wrapper');
    tables.forEach(function(table) {
        table.classList.remove('active');
    });

    // Show the selected table
    document.getElementById(tableId).classList.add('active');

    // Reset all button classes
    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        if (button.id === buttonId) {
            button.className = 'button primary fit';
        } else {
            button.className = 'button fit';
        }
    });
}

// Initially show the first table and highlight the first button
document.addEventListener('DOMContentLoaded', function() {
    var isMobile = window.innerWidth < 764;

    if (isMobile) {
        document.getElementById('table1').classList.remove('active');
        document.getElementById('table2').classList.add('active');
        document.getElementById('button2').className = 'button primary fit';
        document.getElementById('button1').className = 'button fit';
    } else {
        document.getElementById('table2').classList.remove('active');
        document.getElementById('table1').classList.add('active');
        document.getElementById('button1').className = 'button primary fit';
        document.getElementById('button2').className = 'button fit';
    }
});
