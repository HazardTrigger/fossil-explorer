let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [97.57214200492949, 33.89186708166135],
    pitch: 0, // pitch in degrees
    bearing: 0, // bearing in degrees
    zoom: 2.8,
    attributionControl: false
});

let mapbox_canvas = map.getCanvasContainer();
let mapboxSvg = d3.select(mapbox_canvas).append("svg")
    .style("position", "absolute")
    .style("z-index", "0")
    .style("width", "100%")
    .style("height", "100%");

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// https://stackoverflow.com/questions/55130943/is-there-a-way-to-disable-double-touch-zoom
map.doubleClickZoom.disable();

let node_g = mapboxSvg.append('g')
    .attr('class', 'node_g');

let glyph_g = mapboxSvg.append('g')
    .attr('class', 'glyph_g');

let anchorCircle = glyph_g.append('g')
    .attr('class', 'anchor-circle')
    .append('circle')
    .attr('r', radius)
    .attr('fill', 'none')
    .attr('stroke', '#aaa');

let sunburst_node_g = glyph_g.append('g')
    .attr('class', 'sunburst_node_g')
    .attr('fill-opacity', 0.9)
    .attr('stroke', '#222')
    .attr('stroke-width', 0.5);

let sunburst_label_g = glyph_g.append('g')
    .attr('class', 'sunburst_text_g')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10);

function projectMapData(data, svg, map) {
    let node = svg.selectAll('.fossil')
        .data(data)
        .join(
            enter => enter.append('g')
                .attr('class', 'fossil')
                .style('display', 'block')
                .attr('transform', function (d) {
                    d.x = project(d).x;
                    d.y = project(d).y;
                    return `translate(${d.x}, ${d.y})`;
                }),
            update => update
                .attr('class', 'fossil')
                .style('display', 'block')
                .attr('transform', function (d) {
                    d.x = project(d).x;
                    d.y = project(d).y;
                    return `translate(${d.x}, ${d.y})`;
                }),
            exit => exit.remove()
        )
        .call(g => {
            g.append('circle')
                .attr('stroke', '#777')
                .attr("stroke-width", 2)
                .attr('r', 8)
                .attr('fill', d => d.color);
        })

    // Update on map interaction
    map.on("pitch", updateloc);
    map.on("pitchned", updateloc);
    map.on("move", updateloc);
    map.on("moveend", updateloc);
    map.on('drag', updateloc);
    map.on('dragend', updateloc);
    map.on("zoom", updateloc);
    map.on("zoomend", updateloc);

    function updateloc() {
        svg.selectAll(".fossil")
            .attr('transform', function (d) {
                d.x = project(d).x;
                d.y = project(d).y;
                return `translate(${d.x}, ${d.y})`;
            });
    }

    function project(d) {
        return map.project(new mapboxgl.LngLat(+d.Longitude, +d.Latitude));
    }
}