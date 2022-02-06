d3.select('#closeButton')
    .on("click", function (event) {
        d3.select('#imageWindow')
            .style('display', 'none')
            .style('z-index', -10);

        d3.select('#fsimg').style('display', 'none');
    });

d3.select('#close')
    .on('click', function (event) {
        d3.select('#fsimg').style('display', 'none');
    });


d3.select('#amplify')
    .on('click', function (event) {
        let width = parseFloat(d3.select('#fsimg').style('width').replace('px', "")),
            height = parseFloat(d3.select('#fsimg').style('height').replace('px', ""));

        d3.select('#fsimg')
            .style('width', `${width + 100}px`)
            .style('height', `${height + 100}px`);
    });

d3.select('#narrow')
    .on('click', function (event) {
        let width = parseFloat(d3.select('#fsimg').style('width').replace('px', "")),
            height = parseFloat(d3.select('#fsimg').style('height').replace('px', ""));

        d3.select('#fsimg')
            .style('width', `${width - 100}px`)
            .style('height', `${height - 100}px`);
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