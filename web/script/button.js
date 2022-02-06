d3.select('#closeButton')
    .on("click", function (event) {
        d3.select('#imageWindow')
            .style('display', 'none')
            .style('z-index', -10);
        d3.select('#fsimg').style('display', 'none');
    });

d3.select('#closeimg')
    .on('click', function (event) {
        d3.select('#fsimg').style('display', 'none');
    });

let isPin = false;
d3.select('#map')
    .on('dblclick', function (event) {
        if (!isPin) {
            isPin = true;
            mapboxSvg.on('mousemove', null);
        } else {
            isPin = false;
            mapboxSvg.on('mousemove', event => glyphMousemove(node_g, glyph_g, sunburst_node_g, sunburst_label_g, event, 'map'));
            closeImage();
        }
    });