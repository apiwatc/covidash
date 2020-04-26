am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_usaLow;

    // Set projection
    chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: am4core.color("#0000ff").brighten(0.1).lighten(1),
        max: am4core.color("#ff0066").brighten(1)
    });

    // polygonSeries.mapPolygons.template.adapter.add("fill", function (fill, target) {
    //     if (target.dataItem.value > 5000) {
    //         return am4core.color("#ff0066");
    //     }
    //     else if (target.dataItem.value > 4000) {
    //         return am4core.color("#b8249c").brighten(1);
    //     }
    //     else if (target.dataItem.value > 3000) {
    //         return am4core.color("#9933b2").brighten(1);
    //     }
    //     else if (target.dataItem.value > 2000) {
    //         return am4core.color("#853dc2").brighten(1);
    //     }
    //     else if (target.dataItem.value > 1000) {
    //         return am4core.color("#7047d1").brighten(1);
    //     }
    //     else {
    //         return am4core.color("#5c52e0").brighten(1);
    //     }
    // });

    // Show where in the overall spectrum of values it stands
    polygonSeries.mapPolygons.template.events.on("over", function (ev) {
        if (!isNaN(ev.target.dataItem.value)) {
            heatLegend.valueAxis.showTooltipAt(ev.target.dataItem.value)
        }
        else {
            heatLegend.valueAxis.hideTooltip();
        }
    });
    polygonSeries.mapPolygons.template.events.on("out", function (ev) {
        heatLegend.valueAxis.hideTooltip();
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Set heatmap values for each state
    var data = JSON.parse(document.getElementById('state').textContent);
    polygonSeries.data = [];
    state_abbrev = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'District of Columbia': 'DC',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    }

    // Add data to dict-like following library format in order to display on the map
    for (var i = 0; i < data.length; i++) {
        polygonSeries.data.push({
            id: 'US-' + state_abbrev[data[i].state],
            value: data[i].cases,
            cases: data[i].cases,
            decease: data[i].deaths
        });
    }

    // Set up heat legend
    var heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.id = "heatLegend";
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.valign = "bottom";
    heatLegend.width = am4core.percent(15);
    heatLegend.marginRight = am4core.percent(5);
    heatLegend.background.fill = am4core.color("#111");
    heatLegend.background.fillOpacity = 0.05;
    heatLegend.padding(5, 5, 5, 5);
    heatLegend.margin(5, 5, 5, 5);

    // Set up custom heat map legend labels using axis ranges
    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.label.horizontalCenter = "min";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.label.horizontalCenter = "max";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
        return "";
    });

    // Update heat legend value labels
    polygonSeries.events.on("datavalidated", function (ev) {
        var heatLegend = ev.target.map.getKey("heatLegend");

        var min = heatLegend.series.dataItem.values.value.low;
        var minRange = heatLegend.valueAxis.axisRanges.getIndex(0);
        minRange.value = min;
        minRange.label.text = "" + heatLegend.numberFormatter.format(min);

        var max = heatLegend.series.dataItem.values.value.high;
        var maxRange = heatLegend.valueAxis.axisRanges.getIndex(1);
        maxRange.value = max;
        maxRange.label.text = "" + heatLegend.numberFormatter.format(max);
    });

    // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.1;
    polygonTemplate.tooltipHTML =
        `<center><strong>{name}</strong></center><p></p>
        <table>
            <tr>
                <th align="left"><span style="color:blue;">&#9679;</span> Cases</th>
                <td>{cases}</td>
            </tr>
            <tr>
                <th align="left"><span style="color:orange;">&#9679;</span> <span style="font-size:10">Desease:</span></th>
                <td>{decease}</td>
            </tr>
        </table>`;

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("darkblue");
});
// end am4core.ready()