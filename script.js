// The svg
const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
const projection = d3.geoNaturalEarth1()
    .scale(width / 5)
    .translate([width / 2, height / 2])

// Opacity tooltip

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load external data and boot
d3.json("world-map.geojson").then( function(data) {

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
            .attr("fill", "orange")
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "#fff")
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).style("fill", "lightsalmon");
                tooltip.transition().duration(200).style("opacity", .5);
                tooltip.html(d.properties.name)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).style("fill", "");
                tooltip.transition().duration(200).style("opacity", 0);
            });

})