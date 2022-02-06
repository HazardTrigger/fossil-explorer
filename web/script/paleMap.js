let palemap = new mapboxgl.Map({
    container: 'palemap',
    minZoom: -2,
    zoom: 5,
    center: [0, 0],
    attributionControl: false
});

let initbounds = palemap.getBounds();
palemap.setMaxBounds(palemap.getBounds());

let pale_canvas = palemap.getCanvasContainer();
let paleSvg = d3.select(pale_canvas).append("svg")
    .style("position", "absolute")
    .style("z-index", "0")
    .style("width", "100%")
    .style("height", "100%");

// https://stackoverflow.com/questions/55130943/is-there-a-way-to-disable-double-touch-zoom
palemap.doubleClickZoom.disable();
palemap.dragRotate.disable();

let palenode_g = paleSvg.append('g')
    .attr('class', 'node_g');

let pale_glyph_g = paleSvg.append('g')
    .attr('class', 'glyph_g');

let pale_anchorCircle = pale_glyph_g.append('g')
    .attr('class', 'anchor-circle')
    .append('circle')
    .attr('r', radius)
    .attr('fill', 'none')
    .attr('stroke', '#aaa');

let pale_sunburst_node_g = pale_glyph_g.append('g')
    .attr('class', 'sunburst_node_g')
    .attr('fill-opacity', 0.9)
    .attr('stroke', '#222')
    .attr('stroke-width', 0.5);

let pale_sunburst_label_g = pale_glyph_g.append('g')
    .attr('class', 'sunburst_text_g')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10);

layersName.forEach(function (name, i) {
    palemap.addSource(name, {
        'type': 'image',
        'url': `./images/map/${name}.jpg`,
        'coordinates': [
            [-initbounds._ne.lng, initbounds._ne.lat],
            [initbounds._ne.lng, initbounds._ne.lat],
            [-initbounds._sw.lng, initbounds._sw.lat],
            [initbounds._sw.lng, initbounds._sw.lat]
        ]
    });
    palemap.addLayer({
        id: name,
        'type': 'raster',
        'source': name,
        'layout': {
            'visibility': i === 0 ? 'visible' : 'none',
        },
        'paint': {
            'raster-fade-duration': 0
        }
    });
})

paleSvg
    .on('mousemove', event => glyphMousemove(palenode_g, pale_glyph_g, pale_sunburst_node_g, pale_sunburst_label_g, event, 'palemap'));

function projectPaleMapData(data, svg, map) {
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

            g.append('text')
                .style('font-size', 10)
                .attr('dx', -4)
                .attr('dy', 2)
                .text(d => d.type);
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
        let bounds = map.getBounds();
        let xScale = d3.scaleLinear()
            .domain(xdomain(initbounds, bounds))
            .range([bounds._sw.lng, bounds._ne.lng]);

        let yScale = d3.scaleLinear()
            .domain(ydomain(initbounds, bounds))
            .range([bounds._sw.lat, bounds._ne.lat]);
        return map.project(new mapboxgl.LngLat(xScale(d.geoLongitude), yScale(d.geoLatitude)));
    }

    function xdomain(initbounds, currentbounds) {
        return [
            (-180 / initbounds._sw.lng) * currentbounds._sw.lng,
            (180 / initbounds._ne.lng) * currentbounds._ne.lng
        ];
    }

    function ydomain(initbounds, currentbounds) {
        return [
            (-180 / initbounds._sw.lat) * currentbounds._sw.lat,
            (180 / initbounds._ne.lat) * currentbounds._ne.lat
        ];
    }
}

function hideAllMapLayers(map, layersName) {
    layersName.forEach(function (name) {
        map.setLayoutProperty(name, 'visibility', 'none');
    });
}