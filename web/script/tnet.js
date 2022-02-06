let tnetWidth = $('#snet-force').width(),
    tnetHeight = $('#snet-force').height(),
    tnetMargin = {left: 40, top: 40, bottom: 40, right: 40},
    tnetClipWidth = tnetWidth - tnetMargin.left - tnetMargin.right,
    tnetClipHeight = tnetHeight - tnetMargin.top - tnetMargin.bottom,
    tnetHypotenuse = Math.sqrt(tnetWidth * tnetWidth + tnetHeight * tnetHeight);

let tnetSvg = d3.select('#tnet-layout').append('svg')
    .attr('width', tnetWidth)
    .attr('height', tnetHeight)
    .append('g')
    .attr('transform', `translate(${tnetMargin.left}, ${tnetMargin.top})`);

let tnetXScale = d3.scaleLinear()
    .range([0, tnetClipWidth]);

let tnetYScale = d3.scaleLinear()
    .range([tnetClipHeight, 0]);

let tnetBrush = d3.brush()
    .extent([[-tnetMargin.left, -tnetMargin.top], [tnetWidth, tnetHeight]])
    .on('start', tnetBrushstart)
    .on('brush', tnetBrushed)
    .on('end', tnetBrushend);

let tnetSegmentScale = d3.scaleLinear()
    .domain([0, tnetHypotenuse])
    .range([1, segmentsNumber]);

let tnetBrush_g = tnetSvg.append('g')
    .attr('class', 'brush')
    .call(tnetBrush);

let tnetContour = d3.contourDensity()
    .x(d => d.x)
    .y(d => d.y)
    .size([tnetClipWidth, tnetClipHeight])
    .bandwidth(8)
    .thresholds(20);

let tnetcontour_g = tnetSvg.append('g')
    .attr('class', 'tnet_contour_g');

let tnetbundle_g = tnetSvg.append('g')
    .attr('class', 'tnet_bundle_g');

let tnetlink_g = tnetSvg.append('g')
    .attr('class', 'tnet_link_g');

let tnetnode_g = tnetSvg.append('g')
    .attr('class', 'tnet_node_g');

let tgc = {
    node: tnetnode_g,
    edge: tnetbundle_g,
    contour: tnetcontour_g
};

function highlightTnet(mouseoverNodes) {
    tnetnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return mouseoverNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function filterByTreeTnet(selectedNodes) {
    tnetnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return selectedNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function tnetBrushstart() {
    node_g.selectAll('.fossil > circle')
        .style('stroke', '#777');
    snetnode_g.selectAll('.node > circle')
        .style('stroke', '#777');
    tnetnode_g.selectAll('.node > circle')
        .style('stroke', '#777');
}

function tnetBrushed({selection}) {
    tnetnode_g.selectAll('.node')
        .filter(d => isBrushed(selection, d.x, d.y))
        .select('circle')
        .style('stroke', 'red');
}

function tnetBrushend({selection}) {
    if (!selection) {
        brushNodeInit();
    } else {
        let selectedID = tnetnode_g.selectAll('.node')
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

        snetnode_g.selectAll('.node > circle')
            .style('stroke', function (d) {
                return selectedID.indexOf(d.id) !== -1 ? 'red' : '#777';
            });
    }
}