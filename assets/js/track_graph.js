// Function to get data from the HTML script tag
function getData() {
    var dataScript = document.getElementById('data');
    return JSON.parse(dataScript.textContent);
}

// Function to get graph info (title and image URL) from the HTML script tag
function getGraphInfo() {
    var graphInfoScript = document.getElementById('graphInfo');
    return JSON.parse(graphInfoScript.textContent);
}

function roundUpToNearest(num, nearest) {
    return Math.ceil(num / nearest) * nearest;
}

// Function to show table
function showTable() {
    var data = getData();
    var graphInfo = getGraphInfo();
    var tableContainer = document.getElementById('tableContainer');
    tableContainer.style.display = 'block';
    var graphContainer = document.getElementById('graphContainer');
    graphContainer.style.display = 'none';
    var table = document.getElementById('dataTable');
    var peakPos = graphInfo.peak_pos;
    var peakStreams = graphInfo.peak_streams;
    table.innerHTML = '<thead><tr><th>Week</th><th>Pos</th><th>Streams</th><th>Streams+</th><th>Streams+%</th></tr></thead><tbody>';
    data.forEach(function(item) {
        if (Number(item.streams).toLocaleString() != 0) {
            var streamValue = Number(item.streamschange.replace(/[^\d.]/g, '')).toLocaleString(); // Remove any non-numeric characters except '.' and '-'
            var streamHtml = '';

            if (item.streamschange.includes('+')) {
                streamHtml = '<span class="line4-green">+' + streamValue + '</span>';
            } else if (item.streamschange.includes('-')) {
                streamHtml = '<span class="line4-red">-' + streamValue + '</span>';
            } else {
                streamHtml = '';
            }
            var streamValue2 = Number(item.streamspercent.replace(/[^\d.]/g, '')).toLocaleString(); // Remove any non-numeric characters except '.' and '-'
            var streamHtml2 = '';

            if (item.streamspercent.includes('+')) {
                streamHtml2 = '<span class="line4-green">+' + streamValue2 + '%</span>';
            } else if (item.streamspercent.includes('-')) {
                streamHtml2 = '<span class="line4-red">-' + streamValue2 + '%</span>';
            } else {
                streamHtml2 = '';
            }
            
            if (item.pos == peakPos) {
                if (item.streams == peakStreams) {
                    table.innerHTML += '<tr><td><a href=../week/' + item.weekname + '.html>' + item.date + '</a></td><td style="vertical-align: middle;"><b>' + item.pos + '</b></td><td><span class="line2"><b>' + Number(item.streams).toLocaleString() + '</b></span></td><td>' + streamHtml  + '</td><td>' + streamHtml2 + '</td></tr>';
                } else {
                    table.innerHTML += '<tr><td><a href=../week/' + item.weekname + '.html>' + item.date + '</a></b></td><td style="vertical-align: middle;"><b>' + item.pos + '</b></td><td><span class="line2">' + Number(item.streams).toLocaleString() + '</span></td><td>' + streamHtml  + '</td><td>' + streamHtml2 + '</td></tr>';
                }
                
            }
            else {
                if (item.streams == peakStreams) {
                    table.innerHTML += '<tr><td><a href=../week/' + item.weekname + '.html>' + item.date + '</a></td><td style="vertical-align: middle;">' + item.pos + '</td><td><span class="line2"><b>' + Number(item.streams).toLocaleString() + '</b></span></td><td>' + streamHtml  + '</td><td>' + streamHtml2 + '</td></tr>';
                } else {
                    table.innerHTML += '<tr><td><a href=../week/' + item.weekname + '.html>' + item.date + '</a></td><td style="vertical-align: middle;">' + item.pos + '</td><td><span class="line2">' + Number(item.streams).toLocaleString() + '</span></td><td>' + streamHtml  + '</td><td>' + streamHtml2 + '</td></tr>';
                }
            }
        } else {
            table.innerHTML += '<tr><td>-</td><td></td><td></td><td></td><td></td></tr>';
        }
    });
    table.innerHTML += '</tbody>';
    document.getElementById('button1').className = 'button primary fit';
    document.getElementById('button2').className = 'button fit';
}

// Function to show graph using Plotly.js
function showGraph() {
    var data = getData();
    var graphInfo = getGraphInfo();
    var graphContainer = document.getElementById('graphContainer');
    graphContainer.style.display = 'block';
    var tableContainer = document.getElementById('tableContainer');
    tableContainer.style.display = 'none';

    var dates = data.map(function(item) { return item.date; });
    var positions = data.map(function(item) { return item.pos; });
    var streams = data.map(function(item) { return item.streams; });

    var maxStreams = Math.max(...streams);
    var roundedMaxStreams = roundUpToNearest(maxStreams, 100000);

    var trace1 = {
        x: dates,
        y: streams,
        type: 'bar',
        name: 'Streams',
        marker: { color: 'turquoise' },
        opacity: 0.8,
        yaxis: 'y1',
    };

    var trace2 = {
        x: dates,
        y: positions,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Pos',
        line: { color: 'green' },
        yaxis: 'y2',
    };

    var layout = {
        title: {
            text: graphInfo.title,
            font: {
                family: 'Neue Haas Grotesk Display Pro'
            }
        },
        xaxis: {
            title: {
                text: 'Date',
                font: {
                    family: 'Neue Haas Grotesk Display Pro'
                }
            },
            tickfont: {
                family: 'Neue Haas Grotesk Display Pro'
            }
        },
        yaxis: {
            title: 'Streams',
            side: 'right',
            tickmode: 'linear',
            range: [0, roundedMaxStreams], // Set range to 0 to roundedMaxStreams
            dtick: roundedMaxStreams / 10, // Set the interval between ticks
            tickfont: {
                family: 'Neue Haas Grotesk Display Pro'
            },
            showline: true,
            showticklabels: true, // Ensures tick labels are visible
            tickformat: ',',
            gridcolor: '#aaaaaa'
        },
        yaxis2: {
            title: 'Pos',
            overlaying: 'y',
            autorange: false,
            range: [200, 0],
            tickmode: 'linear',
            dtick: 10, // Set the interval between ticks
            tickfont: {
                family: 'Neue Haas Grotesk Display Pro'
            },
            showline: true,
            zeroline: false, // Removes the line at zero
            showticklabels: true, // Ensures tick labels are visible
            gridcolor: '#aaaaaa'
        },
        legend: {
            font: {
                family: 'Neue Haas Grotesk Display Pro'
            },
            x: 1.1, // Adjust legend position to the right of the graph
            y: 1 // Align legend to the top of the graph
        },
        margin: {
            r: 150, // Adjust right margin to make space for the legend
            t: 50, // Top margin
            b: 150, // Bottom margin
            l: 50 // Left margin
        },
        images: [
            {
                source: graphInfo.image_url,
                xref: 'paper',
                yref: 'paper',
                x: 0.5,
                y: 0.5,
                xanchor: 'center',
                yanchor: 'middle',
                sizex: 1,
                sizey: 1,
                opacity: 0.6,
                layer: 'below'
            }
        ],
        barmode: 'overlay',
        height: 700,
        font: {
            family: 'Neue Haas Grotesk Display Pro'
        }
    };

    Plotly.newPlot('graph', [trace1, trace2], layout);
    document.getElementById('button1').className = 'button fit';
    document.getElementById('button2').className = 'button primary fit';
}

// Initially show the first table and highlight the first button
document.addEventListener('DOMContentLoaded', function() {
    showTable();
});