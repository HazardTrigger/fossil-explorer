function drawImgGrid(data, id) {
    let container = d3.select(`#${id}`);

    container.selectAll('.imgcell')
        .data(data)
        .join(
            enter => enter.append('div')
                .attr('class', 'imgcell container')
                .style('background-image', d => `url("images/graptolites/${d['fig_name']}")`),
            update => update
                .attr('class', 'imgcell container')
                .style('background-image', d => `url("images/graptolites/${d['fig_name']}")`),
            exit => exit.remove()
        )
        .on('mouseover', function (event, d) {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('z-index', 10000)
                .style('transform', `translate(${event.x + 15}px, ${event.y}px)`)
                .html(`
                    Family: ${d.Family}<br>
                    Genus: ${d.Genus}<br>
                    Age: ${d.Age}<br>
                    Locality: ${d.Locality}<br>
                    Species: ${d.names_from_specimens_lables}
                `);
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
                .style('z-index', -10);
        });
}