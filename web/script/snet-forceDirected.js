let snetfWidth = $('#snet-force').width(),
    snetfHeight = $('#snet-force').height(),
    snetfMargin = {left: 30, top: 30, bottom: 30, right: 30},
    snetfClipWidth = snetfWidth - snetfMargin.left - snetfMargin.right,
    snetfClipHeight = snetfHeight - snetfMargin.top - snetfMargin.bottom;

let snetfSvg = d3.select('#snet-force').append('svg')
    .attr('width', snetfWidth)
    .attr('height', snetfHeight)
    .append('g')
    .attr('transform', `translate(${snetfMargin.left}, ${snetfMargin.top})`);

let snetfBrush = d3.brush()
    .extent([[-snetfMargin.left, -snetfMargin.top], [snetfWidth, snetfHeight]])
    .on('start', snetfStarted)
    .on('brush', snetfBrushed)
    .on('end', snetfBrushend);

let snetfPolyBrush = d3.polyBrush()
    .x(d3.scaleLinear().range([-30, snetfWidth]))
    .y(d3.scaleLinear().range([-30, snetfHeight]))
    .on('start', snetfPolyBrushStarted)
    .on("brush", snetfPolyBrushed)
    .on('end', snetfPolyBrushend);

let snetfhull_g = snetfSvg.append('g')
    .attr('class', 'snet_forcehull_g');

let snetflink_g = snetfSvg.append('g')
    .attr('class', 'snet_forcelink_g');

let snetfBrush_g = snetfSvg.append('g')
    .attr('class', 'brush');

let snetfPolyBrush_g = snetfSvg.append('g')
    .attr('class', 'polybrush');

let snetfnode_g = snetfSvg.append('g')
    .attr('class', 'snet_forcenode_g');

let foci = [
    '',
    {x: (snetfClipWidth / 4) * 2, y: snetfClipHeight / 2},
    {x: (snetfClipWidth / 4) * 3, y: snetfClipHeight / 2},
    {x: 0, y: snetfClipHeight / 2},
    '',
    '',
    '',
    {x: (snetfClipWidth / 4), y: snetfClipHeight / 2}
];

function drawNetwork(ng, lg, hg, data, foci) {
    let simulation = d3.forceSimulation(data.nodes)
        .force('charge', d3.forceManyBody().strength(-80))
        // .force('center', d3.forceCenter(snetfClipWidth / 2, snetfClipHeight / 2))
        .force('collide', d3.forceCollide().radius(8))
        .force('link', d3.forceLink(data.links).distance(70))
        .on('tick', function () {
            let k = 0.1 * simulation.alpha();

            data.nodes.forEach(function (o, i) {
                o.y += (foci[o.communityID].y - o.y) * k;
                o.x += (foci[o.communityID].x - o.x) * k;
            });

            lg
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            ng.attr('transform', d => isNaN(d.x) && isNaN(d.y) ? `translate(${-40}, ${-40})` : `translate(${d.x}, ${d.y})`);

            hg
                .attr('d', d => {
                    if (d[1].length <= 1) return;
                    let hullPoints = d[1].map(p => [p.x, p.y]);
                    let hullData = d3.polygonHull(hullPoints);
                    // close the hull
                    hullData.push(hullData[0]);
                    return d3.line()(hullData);
                });

        });

    drawHull(d3.rollups(data.nodes, v => v, d => d.communityID));
    drawLinks(data.links);
    drawNodes(data.nodes);

    function drawHull(hulls) {
        hg = hg.selectAll('.hull')
            .data(hulls)
            .join(
                enter => enter.append('path')
                    .attr('class', 'hull')
                    .attr('stroke', 'red')
                    .attr('fill', 'green')
                    .attr('stroke-width', 5)
                    // .attr('stroke-opacity', 0.3)
                    .attr('fill-opacity', 0.3)
                    .attr('stroke-linejoin', 'round'),
                update => update
                    .attr('class', 'hull')
                    .attr('stroke', 'green')
                    .attr('fill', 'none')
                    .attr('stroke-width', 15)
                    // .attr('stroke-opacity', 0.3)
                    .attr('fill-opacity', 0.3)
                    .attr('stroke-linejoin', 'round'),
                exit => exit.remove()
            );
    }

    function drawLinks(links) {
        lg = lg.selectAll('.link')
            .data(links)
            .join(
                enter => enter.append('line')
                    .attr('class', 'link')
                    .attr('stroke-opacity', 0.5)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#999'),
                update => update
                    .attr('class', 'link')
                    .attr('stroke-width', 1)
                    .attr('stroke-opacity', 0.5)
                    .attr('stroke', '#999'),
                exit => exit.remove()
            )
    }

    function drawNodes(nodes) {
        ng = ng.selectAll('.node')
            .data(nodes)
            .join(
                enter => enter.append('g')
                    .attr('class', 'node'),
                update => update
                    .attr('class', 'node'),
                exit => exit.remove()
            )
            .call(g => {
                g.append('circle')
                    .attr('r', 8)
                    .style('fill', d => d.color)
                    .attr('stroke-width', 2)
                    .attr('stroke', '#777');

                g.append('text')
                    .style('font-size', 10)
                    .attr('dx', -4)
                    .attr('dy', 2)
                    .text(d => d.type);

            })
            .call(drag(simulation));
    }
}

function snetfStarted() {
    brushNodeInit();
    drawImgGrid(fossilDataforimg, 'imggrid');
}

function snetfBrushed({selection}) {
    snetfnode_g.selectAll('.node')
        .filter(d => isBrushed(selection, d.x, d.y))
        .select('circle')
        .style('stroke', 'red');
}

function snetfBrushend({selection}) {
    if (!selection) {
        brushNodeInit();
    } else {
        let selectedID = snetfnode_g.selectAll('.node')
            .filter(d => isBrushed(selection, d.x, d.y))
            .select('circle')
            .data().map(d => d.id);

        reorderImgGrid(selectedID, fossilDataforimg);

        node_g.selectAll('.fossil')
            .style('display', function (d) {
                return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
            });

        palenode_g.selectAll('.fossil')
            .style('display', function (d) {
                return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
            });
    }
}

function highlightSnetf(mouseoverNodes) {
    snetfnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return mouseoverNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function filterByTreeSnetf(selectedNodes) {
    snetfnode_g.selectAll('.node > circle')
        .style('stroke', function (d) {
            return selectedNodes.indexOf(d.id) !== -1 ? 'red' : '#777';
        });
}

function snetfPolyBrushStarted() {
    brushNodeInit();
    drawImgGrid(fossilDataforimg, 'imggrid');
}

function snetfPolyBrushed() {
    snetfnode_g.selectAll('.node')
        .filter(d => snetfPolyBrush.isWithinExtent(d.x, d.y))
        .select('circle')
        .style('stroke', 'red');
}

function snetfPolyBrushend() {
    let selectedID = snetfnode_g.selectAll('.node')
        .filter(d => snetfPolyBrush.isWithinExtent(d.x, d.y))
        .select('circle')
        .data().map(d => d.id);

    reorderImgGrid(selectedID, fossilDataforimg);

    node_g.selectAll('.fossil')
        .style('display', function (d) {
            return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
        });

    palenode_g.selectAll('.fossil')
        .style('display', function (d) {
            return selectedID.indexOf(d.id) === -1 ? 'none' : 'block';
        });
}
