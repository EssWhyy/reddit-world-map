// Svg Canvas
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


// Modal Functions

function showModal(content, x, y) {
    const modal = d3.select("#modal");
    modal.html(content)
        .style("left", `${x}px`)
        .style("top", `${y}px`)
        .style("display", "block");
}


function hideModal() {
    d3.select("#modal").style("display", "none");
}

// Define a logarithmic color scale
const color = d3.scaleLog()
    .domain([100, 10000000])  // Adjust the domain according to your field values
    .range(["#ccc", "#ff4500"]);  // Color range from light to dark

// Load external data and boot
d3.json("./data/world-map.geojson").then( function(data) {
    d3.json("./data/subreddit_counts.json").then(function(info) {

    // Map to color scale
    const memberCountMap = new Map(info.map(i => [i.country, +i.members]));
    const urlMap = new Map(info.map(i => [i.country, i.subreddit]));

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
            .attr("fill", function(d) {
                // Get the field value for the country
                const value = memberCountMap.get(d.properties.name);
                // Return the corresponding color
                return value ? color(value) : "#ccc";  // Default color for missing data
            }

            )
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            .style("stroke", "#fff")
            .on("mouseover", (event, d) => {
                
                // Modal Data
                const countryName = d.properties.name; 
                const modalContent = `<strong>${countryName}</strong>
                <br>
                <italics>r/</italics>`;

                d3.select(event.currentTarget).style("fill", "lightsalmon");
                tooltip.transition().duration(200).style("opacity", .5);
                tooltip.html(d.properties.name)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                
                showModal(modalContent, event.pageX, event.pageY);
                
            })
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).style("fill", "");
                tooltip.transition().duration(200).style("opacity", 0);
                hideModal();
            })
            .on("click", function(event, d) {
                // Get the URL for the clicked country
                const subreddit = urlMap.get(d.properties.name);
                    // Open the URL in a new tab
                const url = "https://www.reddit.com/r/" + subreddit
                window.open(url, "_blank");
            })
        });;
    })