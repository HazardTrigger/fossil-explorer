function filterByBrushToProject(data, selection, svg, map) {
    let filterData = data.filter(d => selection[1] <= +d.age_to && +d.age_from <= selection[0]);
    projectData(filterData, svg, map);
}

function filterByClickTreeToProject(data, age, node_g, palenode_g, map) {
    // https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
    let filterData = [];
    switch (age) {
        case 'Paleozoic':
            filterData = data;
            break;
        case 'Ordovician':
            filterData = data.filter(d => d.Subera === 'Ordovician');
            break;
        case 'Silurian':
            filterData = data.filter(d => d.Subera === 'Silurian');
            break;
        case 'Lower':
            filterData = data.filter(d => d.Epoch.includes('Lower'));
            break;
        case 'Middle':
            filterData = data.filter(d => d.Epoch.includes('Middle'));
            break;
        case 'Upper':
            filterData = data.filter(d => d.Epoch.includes('Upper'));
            break;
        case 'Llandovery':
            filterData = data.filter(d => d.Epoch.includes('Llandovery'));
            break;
        case 'Wenlock':
            filterData = data.filter(d => d.Epoch.includes('Wenlock'));
            break;
        case 'Ludlow':
            filterData = data.filter(d => d.Epoch.includes('Ludlow'));
            break;
        case 'Pridoli':
            filterData = data.filter(d => d.Epoch.includes('Pridoli'));
            break;
        default:
            filterData = data.filter(d => d.Age.includes(age));
    }

    if (filterData.length === 0 || age === '') {
        console.log("No Data");
        return;
    }

    // projPaleNodes(palenode_g, filterData);
    projectData(_.cloneDeep(filterData), node_g, map);

    let tempidlist = filterData.map(d => d.id);
    // filterByTreeSnet(tempidlist);
    // filterByTreeTnet(tempidlist);
    filterByTreeSnetf(tempidlist);
}



// dragElement(document.getElementById("fsimg"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function drag(simulation) {
    function dragStart(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnd(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on('start', dragStart)
        .on('drag', dragged)
        .on('end', dragEnd);
}

function isBrushed(selection, cx, cy) {
    let x0 = selection[0][0],
        x1 = selection[1][0],
        y0 = selection[0][1],
        y1 = selection[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}

function switchSnetDiv(isSwitch) {
    d3.select('#snetcontainer')
        .on("dblclick", function (event) {
            if (!isSwitch) {
                isSwitch = true;
                d3.select("#snet-force")
                    .style('display', 'none');
                d3.select('#snet-layout')
                    .style('display', 'block');
            } else {
                isSwitch = false;
                d3.select('#snet-layout')
                    .style('display', 'none');
                d3.select("#snet-force")
                    .style('display', 'block');
            }
        })
}

function closeImage() {
    d3.select('#imageWindow')
        .style('display', 'none')
        .style('z-index', -10);
    d3.select('#tooltip')
        .style('display', 'none')
        .style('z-index', -10);
    d3.select('#fsimg')
        .style('display', 'none');
    d3.selectAll('.node')
        .attr('stroke', '#222')
        .attr('stroke-width', 0.5);
}

function initAllNodeStroke() {
    node_g.selectAll('.fossil > circle')
        .style('stroke', '#777');

    tnetnode_g.selectAll('.node > circle')
        .style('stroke', '#777');

    snetnode_g.selectAll('.node > circle')
        .style('stroke', '#777');

    snetfnode_g.selectAll('.node > circle')
        .style('stroke', '#777');
}

function tooltipMouseIn(event, d) {
    d3.select('#tooltip')
        .style('display', 'block')
        .style('z-index', 10000)
        .style('transform', `translate(${event.x + 15}px, ${event.y}px)`)
        .html(`
            Family: ${d['family']}<br>
            Genus: ${d['genus']}<br>
            Age: ${d['age']}<br>
            CommunityID: ${d['communityID']}<br>
            Species: ${d['species'].length > 1 ? d['species'].join('/') : d['species'][0]}
        `);
}

function tootipMouseOut(event) {
    d3.select(this).style('stroke', '#777');
    d3.select('#tooltip')
        .style('display', 'none')
        .style('z-index', -10);

    initAllNodeStroke();
}

function brushNodeInit() {
    node_g.selectAll('.fossil')
        .style('display', 'block');
    palenode_g.selectAll('.fossil')
        .style('display', 'block');
    snetfnode_g.selectAll('.node > circle')
        .style('stroke', '#777');
    tnetnode_g.selectAll('.node > circle')
        .style('stroke', '#777');
}

function reorderImgGrid(selectedID, data) {
    let selectedData = data.filter(d => selectedID.indexOf(d.id) !== -1);
    let differenceData = Array.from(d3.difference(data, selectedData));
    selectedData = d3.sort(selectedData, (a, b) => d3.descending(a.age_from, b.age_from));
    differenceData = d3.sort(differenceData, (a, b) => d3.descending(a.age_from, b.age_from));
    let mergeData = d3.merge([selectedData, differenceData]);
    drawImgGrid(selectedData, 'imggrid')
}
