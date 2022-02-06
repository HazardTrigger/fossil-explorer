function glyphMousemove(node_g, glyph_g, sunburst_node_g, sunburst_label_g, event, id) {
    // https://stackoverflow.com/questions/64189608/d3-v6-pointer-function-not-adjusting-for-scale-and-translate
    let [x, y] = d3.pointer(event, d3.select(`#${id}`).node())

    glyph_g.attr('transform', `translate(${x}, ${y})`);

    let selectedData = node_g.selectAll('.fossil')
        .filter(function (d) {
            return isWithinGlyph(d, x, y) && d3.select(this).style('display') === 'block';
        })
        .data();

    if (selectedData.length !== 0) {
        let sunbrustData = d3.rollup(selectedData, v => v, d => d.Family, d => d.Genus);
        drawSunBurst(sunburst_node_g, sunburst_label_g, sunbrustData, sunburstRadius);
    } else {
        sunburst_node_g.selectAll('.node').remove();
        sunburst_label_g.selectAll('.sunburstLabel').remove();
    }
}

function drawSunBurst(node_g, label_g, data, radius) {
    let root = partition2(data);
    root.data[0] = 'Pterobranchia';
    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root.children.length + 1));
    let filterData = root.descendants()
        .filter(d => d.depth === 1)
        .map(function (d) {
            d.isClick = false;
            return d;
        });

    updateSunburst(node_g, label_g, filterData, color)
}

function updateSunburst(node_g, label_g, data, color) {
    let arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    node_g.selectAll('.node')
        .data(data)
        .join(
            enter => enter.append('path')
                .attr('class', 'node')
                .attr('stroke', '#bbb')
                .attr('stroke-width', 0.5)
                .attr('fill', d => {
                    d.color = '#f6f5ee';
                    return '#f6f5ee';
                })
                .attr('d', arc),
            update => update
                .attr('class', 'node')
                .attr('stroke', '#bbb')
                .attr('stroke-width', 0.5)
                .attr('fill', d => {
                    d.color = '#f6f5ee';
                    return '#f6f5ee';
                })
                .attr('d', arc),
            exit => exit.transition().remove()
        )
        .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', d3.color(d.color).brighter());
            if (isPin) {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('z-index', 10000)
                    .style('transform', `translate(${event.x + 10}px, ${event.y}px)`)
                    .html(`
                    ${d.ancestors().map(d => d.data[0]).reverse().join("/")} <br> 
                    Fossil: ${d.value}
                `)
            }
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr('fill', d.color);
            d3.select('#tooltip')
                .style('display', 'none')
                .style('z-index', -10);
        })
        .on('click', function (event, d) {
            if (!d.isClick && d.depth === 1) {
                node_g.selectAll('.node')
                    .style('stroke', '#bbb')
                    .style('stroke-width', 0.5);

                d.isClick = true;
                d3.select(this).style('stroke', '#222');

                let updateData = d3.merge([data, d.descendants()
                    .filter(d => d.depth === 2)
                    .map(function (e) {
                        e.popup = d.data[0];
                        return e;
                    })]);

                updateSunburst(node_g, label_g, updateData, color);
            } else {
                d.isClick = false;
                d3.select(this).style('stroke', '#bbb');
                data = data.filter(e => e.depth === 1);
                node_g.selectAll('.node').filter(e => e.popup === d.data[0] && !d.isClick).remove();
                label_g.selectAll('.sunburstLabel').filter(e => e.popup === d.data[0] && !d.isClick).remove();
                d3.select('#imageWindow')
                    .style('display', 'none')
                    .style('z-index', -10);
            }

            if (d.depth === 2) {
                d3.select('#fsimg').style('display', 'none');
                d3.selectAll('.node').filter(d => d.depth === 2).style('stroke', '#bbb').style('stroke-width', 0.5);
                d3.select(this).style('stroke', '#222');
                loadImgs(d3.select('#imageWindow'), d.data[1], event);
                $('#imgsContainer').scrollTop(0);
            }
        })

    label_g.selectAll('.sunburstLabel')
        .data(data.filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
        .join(
            enter => enter.append('text')
                .attr('class', 'sunburstLabel')
                .attr('transform', function (d) {
                    let x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                    let y = (d.y0 + d.y1) / 2;
                    return `rotate(${x - 90}) translate(${y}, 0) rotate(${x < 180 ? 0 : 180})`;
                })
                .attr('dy', '0.35em')
                .text(d => d.value),
            update => update
                .attr('class', 'sunburstLabel')
                .attr('transform', function (d) {
                    let x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                    let y = (d.y0 + d.y1) / 2;
                    return `rotate(${x - 90}) translate(${y}, 0) rotate(${x < 180 ? 0 : 180})`;
                })
                .attr('dy', '0.35em')
                .text(d => d.value),
            exit => exit.remove()
        );
}

function isWithinGlyph(d, tx, ty) {
    let dx = Math.abs(tx - d.x),
        dy = Math.abs(ty - d.y),
        dis = Math.sqrt(dx * dx + dy * dy);
    return dis < radius;
}

function loadImgs(div, data, event) {
    div.style('display', 'grid')
        .style('z-index', 10000)
        .style('transform', `translate(${$('#main').width() - $('#imageWindow').width() - 50}px, ${40}px)`);

    dragElement(document.getElementById("imageWindow"));

    div.select('#imgsContainer')
        .style('grid-template-columns', `${$('#imageWindow').width() * 0.98}px`)
        .style('grid-template-rows', `repeat(${data.length}, ${500}px)`)
        .selectAll('.imgInfo')
        .data(data)
        .join(
            enter => enter.append('div')
                .attr('class', 'imgInfo')
                .style('border', '1px solid #777')
                .html(d => {
                    return `
                         <div class="imgInfoText">
                            <div>Order: ${d['Order']} &nbsp Family: ${d['Family']}</div>
                            <div>Genus: ${d['Genus']} &nbsp Species: ${d['names_from_specimens_lables']}</div>
                            <div>Specimens ID: ${d['specimens_Serial_No']} &nbsp Age: ${d['Age']}</div>
                            <div>Locality: ${d['Locality']}</div>
                            <div>File name: ${d['fig_name']}</div>
                        </div>
                        <div class="imglist"></div>
                `
                }),
            update => update
                .attr('class', 'imgInfo')
                .style('border', '1px solid #777')
                .html(d => {
                    return `
                         <div class="imgInfoText">
                            <div>Order: ${d['Order']} &nbsp Family: ${d['Family']}</div>
                            <div>Genus: ${d['Genus']} &nbsp Species: ${d['names_from_specimens_lables']}</div>
                            <div>Specimens ID: ${d['specimens_Serial_No']} &nbsp Age: ${d['Age']}</div>
                            <div>Locality: ${d['Locality']}</div>
                            <div>File name: ${d['fig_name']}</div>
                        </div>
                        <div class="imglist"></div>
                `
                }),
            exit => exit.remove()
        )
        .each(function (d) {
            d3.select(this).select('.imglist')
                .style('background-image', `url("images/graptolites/${d['fig_name']}")`)
                .on('click', function (event, d) {
                    d3.select('#fsimg')
                        .style('display', 'block')
                        .style("z-index", 5000)
                        .select('img')
                        .attr('src', `images/graptolites/${d['fig_name']}`);
                })
        })

}

function partition2(data) {
    return d3.partition()
        .size([2 * Math.PI, sunburstRadius])
        (d3.hierarchy(data).count().sort((a, b) => d3.descending(a.value, b.value)));
}