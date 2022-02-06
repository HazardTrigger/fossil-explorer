let tsneWidth = $('#tsne').width(),
    tsneHeight = $('#tsne').height(),
    tsneMargin = {left: 20, top: 20, bottom: 20, right: 20},
    tsneClipWidth = tsneWidth - tsneMargin.left - tsneMargin.right,
    tsneClipHeight = tsneHeight - tsneMargin.top - tsneMargin.bottom;

let tsneSvg = d3.select('#tsne').append('svg')
    .attr('width', tsneWidth)
    .attr('height', tsneHeight)
    .append('g')
    .attr('transform', `translate(${tsneMargin.left}, ${tsneMargin.top})`);

let tsneXscale = d3.scaleLinear()
    .range([0, tsneClipWidth]);

let tsneYscale = d3.scaleLinear()
    .range([tsneClipHeight, 0]);

let tsneBrush = d3.brush()
    .extent([[-tsneMargin.left, -tsneMargin.top], [tsneWidth, tsneHeight]])
    .on('start', tsneBrushstart)
    .on('brush', tsneBrushed)
    .on('end', tsneBrushend);

let tsneBrush_g = tsneSvg.append('g')
    .attr('class', 'brush')
    .call(tsneBrush);

let scatter_g = tsneSvg.append('g')
    .attr('class', 'scatter_g');

function drawScatter(g, data, xScale, yScale) {
    xScale.domain(d3.extent(data, d => d.lx));
    yScale.domain(d3.extent(data, d => d.ly));

    g.selectAll('.embedding')
        .data(data)
        .join(
            enter => enter.append('circle')
                .attr('class', 'embedding')
                .attr('cx', function (d) {
                    d.x = xScale(d.lx);
                    return xScale(d.lx);
                })
                .attr('cy', function (d) {
                    d.y = yScale(d.ly);
                    return yScale(d.ly);
                })
                .attr('r', 5)
                .attr('fill', d => d.color)
                .attr('stroke-width', 2)
                .attr('stroke', '#777'),
            update => update
                .attr('class', 'embedding')
                .attr('cx', function (d) {
                    d.x = xScale(d.lx);
                    return xScale(d.lx);
                })
                .attr('cy', function (d) {
                    d.y = yScale(d.ly);
                    return yScale(d.ly);
                })
                .attr('r', 5)
                .attr('fill', d => d.color)
                .attr('stroke-width', 2)
                .attr('stroke', '#777'),
            exit => exit.remove()
        );
}

function highlightScatter(mouseoverNodes) {
    scatter_g.selectAll('.embedding')
        .style('stroke', function (d) {
            return mouseoverNodes.indexOf(d.ID) !== -1 ? 'red' : '#777';
        });
}

function tsneBrushstart() {
    node_g.selectAll('.fossil')
        .style('stroke', '#777');
    scatter_g.selectAll('.embedding')
        .style('stroke', '#777');
    netnode_g.selectAll('.node > circle')
            .style('stroke', '#777');
}

function tsneBrushed({selection}) {
    if (selection) {
        let selectedID = scatter_g.selectAll('.embedding')
            .filter(d => isBrushed(selection, d.x, d.y))
            .style('stroke', 'red')
            .data().map(d => d.ID);

        node_g.selectAll('.fossil')
            .style('stroke', function (d) {
                return selectedID.indexOf(d.species_id) !== -1 ? 'red' : '#777';
            });

       netnode_g.selectAll('.node > circle')
            .style('stroke', function (d) {
                return selectedID.indexOf(d.id) !== -1 ? 'red' : '#777';
            });
    }
}

function tsneBrushend() {

}