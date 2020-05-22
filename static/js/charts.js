// chart data from Chart.js

// get data from Python-converted-to-JSON object 
var data = JSON.parse(document.getElementById('timeline').textContent);
var date = data.date;
var cases = data.cases;


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
            // label: 'Last 7 days',
            // backgroundColor: "rgba(255, 255, 255)",
            borderColor: "#0099ff",
            borderWidth: 3,
            pointHoverRadius: 3,
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
                    color: "rgba(0,0,0,0.1)"
                },
                ticks: {
                    fontColor: "black",
                    fontSize: 10,
                    stepSize: 10000,
                    beginAtZero: true
                },
            }],
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontColor: "black",
                    fontSize: 10,
                },
            }],
        },
        legend: false
        // {
        //     labels: {
        //         fontColor: "black",
        //         fontSize: 12
        //     }
        // }
    }
});


// get data from Python-converted-to-JSON object 
var dataTotal = JSON.parse(document.getElementById('total').textContent);
var number = [];
var label = [];
for (const s in dataTotal) {
    if (s.includes("Million")) {
        number.push(dataTotal[s])
        label.push(s.slice(0, s.indexOf("PerOneMillion")))
    }
}


// Doughnut Chart
var ctx = document.getElementById('myChartDoughnut').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        // labels: ['Cases', 'Deaths', 'Tests'],
        labels: label,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['#49da9a', 'blue', '#FFA600', 'red', 'green', '#6CA0DC'],
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 0,
            data: number
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        legend: {
            position: "right",
            align: "middle",
            labels: {
                fontColor: "black",
            }
        },
    }
});
