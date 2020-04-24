// chart data from Chart.js

// get data from Python-converted-to-JSON object 
var data = JSON.parse(document.getElementById('timeline').textContent);
var date = [];
var cases = [];
for (const d in data) {
    date.push(d)
    cases.push(data[d])
}


// Line Chart
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        labels: date,
        datasets: [{
            label: 'Last 7 days',
            backgroundColor: "rgba(255,99,132,0.1)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            pointHoverRadius: 1,
            // hoverBackgroundColor: "rgba(255,99,132,0.4)",
            // hoverBorderColor: "rgba(255,99,132,1)",
            data: cases
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                stacked: true,
                gridLines: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                },
                ticks: {
                    fontColor: "white",
                    fontSize: 10,
                    stepSize: 200000,
                    beginAtZero: true
                },
            }],
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontColor: "white",
                    fontSize: 10,
                },
            }],
        },
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 12
            }
        }
    }
});


// get data from Python-converted-to-JSON object 
var dataTotal = JSON.parse(document.getElementById('total').textContent);
var number = [];
for (const s in dataTotal) {
    number.push(Number(dataTotal[s]))
}


// Doughnut Chart
var ctx = document.getElementById('myChartDoughnut').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ["cases",
            "todayCases",
            "deaths",
            "todayDeaths",
            "recovered",
            "active",
            "critical"],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['#58508d',
                '#4355db',
                '#34bbe6',
                '#49da9a',
                '#f7d038',
                '#FF7F00',
                '#e6261f'
            ],
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 0,
            data: number.slice(3, 10)
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        legend: {
            position: "right",
            align: "middle",
            labels: {
                fontColor: "white",
            }
        },
    }
});