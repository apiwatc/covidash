am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "";
    polygonTemplate.polygon.fillOpacity = 0.6;


    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    // Add image series
    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipHTML =
        `<center><strong>{title}</strong></center>
        <table>
            <tr>
                <th align="left"><span style="color:blue;">&#9679;</span> Cases: </th>
                <td align="right">{cases}</td>
            </tr>
            <tr>
                <th align="left"><span style="color:orange;">&#9679;</span> Decease: </th>
                <td align="right">{deaths}</td>
            </tr>
        </table>`;
    imageSeries.mapImages.template.propertyFields.url = "url";

    var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3;
    circle.propertyFields.fill = "color";

    var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";

    circle2.events.on("inited", function (event) {
        animateBullet(event.target);
    })

    function animateBullet(circle) {
        var animation = circle.animate(
            [
                { property: "scale", from: 1, to: 1 },
                { property: "opacity", from: 1, to: 0 }
            ],
            1000,
            am4core.ease.circleOut);
        animation.events.on("animationended", function (event) {
            animateBullet(event.target.object);
        })
    }

    var colorSet = new am4core.ColorSet();

    var country = JSON.parse(document.getElementById('countries').textContent);
    for (const i in country) {
        imageSeries.data.push(
            {
                "title": country[i]['country'],
                "latitude": country[i]['countryInfo']['lat'],
                "longitude": country[i]['countryInfo']['long'],
                "cases": country[i]['cases'],
                "recovered": country[i]['casrecoveredes'],
                "deaths": country[i]['deaths'],
                "color": "#ccc"
            }
        );
    }

    // imageSeries.data = data
    // [
    //     {
    //         "title": "Washington",
    //         "case": 12345,
    //         "latitude": 37.09024,
    //         "longitude": -95.71289,
    //         // "color": colorSet.next()
    //     },
    //     {
    //         "title": "Thailand",
    //         "case": 12345,
    //         "latitude": 15.870032,
    //         "longitude": 100.992541,
    //         // "color": colorSet.next()
    //     }
    // ];
}); // end am4core.ready()