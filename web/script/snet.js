let snetWidth = $('#snet-force').width(),
    snetHeight = $('#snet-force').height(),
    snetMargin = {left: 30, top: 30, bottom: 30, right: 30},
    snetClipWidth = snetWidth - snetMargin.left - snetMargin.right,
    snetClipHeight = snetHeight - snetMargin.top - snetMargin.bottom,
    snetHypotenuse = Math.sqrt(snetWidth * snetWidth + snetHeight + snetHeight);

let snetSvg = d3.select('#snet-layout').append('svg')
    .attr('width', snetWidth)
    .attr('height', snetHeight)
    .append('g')
    .attr('transform', `translate(${snetMargin.left}, ${snetMargin.top})`);

let snetXScale = d3.scaleLinear()
    .range([0, snetClipWidth]);

let snetYScale = d3.scaleLinear()
    .range([snetClipHeight, 0])

let snetBrush = d3.brush()
    .extent([[-snetMargin.left, -snetMargin.top], [snetWidth, snetHeight]])
    .on('brush', snetBrushed)
    .on('end', snetBrushend);

let snetPolyBrush = d3.polyBrush()
    .x(d3.scaleLinear().range([-30, snetWidth]))
    .y(d3.scaleLinear().range([-30, snetHeight]))
    .on('start', snetPolyBrushStarted)
    .on("brush", snetPolyBrushed)
    .on('end', snetPolyBrushend);

let snetSegmentScale = d3.scaleLinear()
    .domain([0, snetHypotenuse])
    .range([1, segmentsNumber]);

let snetContour = d3.contourDensity()
    .x(d => d.x)
    .y(d => d.y)
    .size([snetClipWidth, snetClipHeight])
    .bandwidth(8)
    .thresholds(20);

let snetcontour_g = snetSvg.append('g')
    .attr('class', 'snet_contour_g');

let snetbundle_g = snetSvg.append('g')
    .attr('class', 'snet_bundle_g');

let networkBrush_g = snetSvg.append('g')
    .attr('class', 'brush');

let snetPolyBrush_g = snetSvg.append('g')
    .attr('class', 'polybrush');

let snetnode_g = snetSvg.append('g')
    .attr('class', 'snet_node_g');

let sgc = {
    node: snetnode_g,
    edge: snetbundle_g,
    contour: snetcontour_g
}

function highlightSnet(mouseoverNodes) {
    snetnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return mouseoverNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function filterByTreeSnet(selectedNodes) {
    snetnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return selectedNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function snetBrushed({selection}) {
    snetnode_g.selectAll('.node')
        .filter(d => isBrushed(selection, d.x, d.y))
        .select('circle')
        .style('stroke', 'red');
}

function snetBrushend({selection}) {
    if (!selection) {
        initAllNodeStroke();
    } else {
        let selectedID = snetnode_g.selectAll('.node')
            .filter(d => isBrushed(selection, d.x, d.y))
            .select('circle')
            .data().map(d => d.id);

        node_g.selectAll('.fossil')
            .style('display', function (d) {
                return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
            });

        palenode_g.selectAll('.fossil')
            .style('display', function (d) {
                return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
            });

        tnetnode_g.selectAll('.node > circle')
            .style('stroke', function (d) {
                return selectedID.indexOf(d.id) !== -1 ? 'red' : '#777';
            });
    }
}

function snetPolyBrushStarted() {
    brushNodeInit();
}

function snetPolyBrushed() {
    snetnode_g.selectAll('.node')
        .filter(d => snetPolyBrush.isWithinExtent(d.x, d.y))
        .select('circle')
        .style('stroke', 'red');
}

function snetPolyBrushend() {
    let selectedID = snetnode_g.selectAll('.node')
        .filter(d => snetPolyBrush.isWithinExtent(d.x, d.y))
        .select('circle')
        .data().map(d => d.id);

    node_g.selectAll('.fossil')
        .style('display', function (d) {
            return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
        });

    palenode_g.selectAll('.fossil')
        .style('display', function (d) {
            return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
        });

    tnetnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return selectedID.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

