let timeWidth = $('#time').width(),
    timeHeight = $('#time').height(),
    timeMargin = {left: 2, top: 0, right: 2, bottom: 20},
    clipTimeWidth = timeWidth - timeMargin.left - timeMargin.right,
    clipTimeHeight = timeHeight - timeMargin.top - timeMargin.bottom;

let timeSvg = d3.select('#time').append('svg')
    .attr('width', timeWidth)
    .attr('height', timeHeight)
    .append('g')
    .attr('transform', `translate(${timeMargin.left}, ${timeMargin.top})`);

let tree_g = timeSvg.append('g')
    .attr('class', 'tree_g');

let timeXScale = d3.scaleLinear()
    .domain([485.4, 419.2])
    .range([0, clipTimeWidth]);

let timeXAxis = timeSvg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${clipTimeHeight})`)
    .call(
        d3.axisBottom(timeXScale)
            .tickFormat(d => d + 'MA')
    );

// let brush = d3.brushX()
//     .extent([[0, clipTimeHeight - 10], [clipTimeWidth, clipTimeHeight + 10]])
//     .on("end", function ({selection}) {
//         if (selection) {
//             filterByBrushToProject(fossilData, selection.map(timeXScale.invert), node_g, map);
//         }
//     });
//
// timeSvg.append("g")
//     .attr("class", "brush")
//     .call(brush);

function drawTree(data, tree_g, width, height) {
    let root = partition(data, width, height);

    const cell = tree_g
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
        .style('font-family', 'Sansation-Bold');

    cell.append("rect")
        .attr('class', 'treerect')
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill-opacity", 0.6)
        .attr("fill", d => d.data.color)
        .style('cursor', 'pointer')
        .on('click', function (event, d) {
            filterByClickTreeToProject(fossilData, d.data.name, node_g, map);
            d3.selectAll('.treerect').attr('stroke', 'none');
            d3.select(this).attr('stroke', '#222').attr('stroke-width', 2);
        })
        .on("dblclick", function (event) {
            d3.selectAll('.treerect').attr('stroke', 'none');
            d3.selectAll('.fossil').remove();
        })
        .on('mouseover', function (event) {
            d3.select(this).attr("fill", d => d3.color(d.data.color).brighter())
        })
        .on('mouseout', function (event) {
            d3.select(this).attr("fill", d => d.data.color);
        })

    let text = cell.append("text")
        // https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting
        .style('user-select', 'none')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('x', 5)
        // .attr("x", d => (d.x1 - d.x0) / 2 - 35)
        .attr("y", 13)
        .style('cursor', 'pointer')
        .text(d => d.data.name)
        .on('click', function (event, d) {
            filterByClickTreeToProject(fossilData, d.data.name, node_g, map);
        });

    let numText = cell.append("text")
        // https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting
        .style('user-select', 'none')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('x', 5)
        // .attr("x", d => (d.x1 - d.x0) / 2 - 35)
        .attr("y", 23)
        .style('cursor', 'pointer')
        .text(d => d.data.name === '' ? '' : `(${d.data.num} specimens)`)
        .on('click', function (event, d) {
            filterByClickTreeToProject(fossilData, d.data.name, node_g, map);
        });

    cell.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}`);
}

function partition(data, width, height) {
    return d3.partition()
        .size([width, height])
        .padding(2)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height))
}