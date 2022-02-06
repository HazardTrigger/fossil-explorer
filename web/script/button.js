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

let isMapSwitch = false;
d3.select('#mapcontainer .switch')
    .on("click", function (event) {
        // TODO: smooth switch div
        if (!isMapSwitch) {
            isMapSwitch = true;
            $("#palemap").fadeOut(500);
            setTimeout(function () {
                $("#map").fadeIn(500);
                // https://stackoverflow.com/questions/42150367/how-to-fix-canvas-size-in-mapbox-gl
                map.resize();
            }, 500)
            paleSvg.on('mousemove', null);
            mapboxSvg.on('mousemove', event => glyphMousemove(node_g, glyph_g, sunburst_node_g, sunburst_label_g, event, 'map'));
        } else {
            isMapSwitch = false;
            $("#map").fadeOut(500);
            setTimeout(function () {
                $("#palemap").fadeIn(500);
            }, 500)
            mapboxSvg.on('mousemove', null);
            paleSvg
                .on('mousemove', event => glyphMousemove(palenode_g, pale_glyph_g, pale_sunburst_node_g, pale_sunburst_label_g, event, 'palemap'));
        }
    });

let islayerClick = false;
d3.select('#layerSwitch > .layerswitch')
    .on("click", function (event) {
        if (!islayerClick) {
            islayerClick = true;
            d3.select('#layerSwitch > .dropdown-content')
                .style("display", 'block')
                .selectAll('.maplayer')
                .on("click", function (event) {
                    hideAllMapLayers(palemap, layersName);
                    palemap.setLayoutProperty(d3.select(this).html(), 'visibility', 'visible');
                });
        } else {
            islayerClick = false;
            d3.select('#layerSwitch > .dropdown-content')
                .style("display", 'none')
                .selectAll('.maplayer')
                .on("click", null);
        }
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

let ispalePin = false;
d3.select('#palemap')
    .on('dblclick', function (event) {
        if (!ispalePin) {
            ispalePin = true;
            paleSvg.on('mousemove', null);
        } else {
            ispalePin = false;
            paleSvg
                .on('mousemove', event => glyphMousemove(palenode_g, paleglyph_g, palesunburst_node_g, palesunburst_label_g, event, 'palemap'));
            closeImage();
        }
    });

let isSwitch = false;
d3.select('#snetcontainer').select('.switch')
    .on("click", function (event) {
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
    });

let isBrush = false;
d3.select('#rectBrush')
    .on('click', function (event, d) {
        if (!isBrush) {
            isBrush = true;
            d3.select(this).style('background-color', '#d4d4d4');
            if (!isSwitch) {
                activatedBrush(snetfBrush_g, snetfBrush);
            } else {
                activatedBrush(networkBrush_g, snetBrush);
            }
        } else {
            isBrush = false;
            d3.select(this).style('background-color', '#fff');
            deactivatedBrush(snetfBrush_g);
            deactivatedBrush(networkBrush_g);
        }
    });

let isPolyBrush = false;
d3.select('#polyBrush')
    .on('click', function (event) {
        if (!isPolyBrush) {
            isPolyBrush = true;
            d3.select(this).style('background-color', '#d4d4d4');
            if (!isSwitch) {
                activatedBrush(snetfPolyBrush_g, snetfPolyBrush);
            } else {
                activatedBrush(snetPolyBrush_g, snetPolyBrush)
            }
        } else {
            isPolyBrush = false;
            d3.select(this).style('background-color', '#fff');
            deactivatedBrush(snetfPolyBrush_g);
            deactivatedBrush(snetPolyBrush_g)
        }
    })

function activatedBrush(brush_g, brush) {
    brush_g.call(brush);
}

function deactivatedBrush(brush_g) {
    brush_g.selectAll('*').remove();
}

let isHightlighlink = false;
d3.select('#linkHightlight')
    .on('click', function () {
        if (!isHightlighlink) {
            isHightlighlink = true;
            d3.select(this).style('background-color', '#d4d4d4');
            if (!isSwitch) {
                activatedHightlightLink(snetfnode_g, snetflink_g);
            } else {
                activatedHightlightLink(snetnode_g, snetbundle_g);
            }
        } else {
            isHightlighlink = false;
            d3.select(this).style('background-color', '#fff');
            deactivatedHightlightLink(snetfnode_g);
            deactivatedHightlightLink(snetnode_g);
        }
    });

function activatedHightlightLink(node_g, link_g) {
    node_g.selectAll('.node > circle')
        .on("mouseover", function (event, d) {
            link_g.selectAll('.link')
                .filter(l => l.source ? l.source.id === d.id : l[0] === d)
                .raise()
                .style('stroke-width', 2)
                .style("stroke", 'red');
        })
        .on("mouseout", function (event) {
            link_g.selectAll('.link')
                .style('stroke-width', 1)
                .style("stroke", '#999');
        })

}

function deactivatedHightlightLink(node_g) {
    node_g.selectAll('.node > circle')
        .on("mouseover", null)
        .on("mouseout", null);
}

let isShowTip = false;
d3.select('#showTip')
    .on('click', function (event) {
        if (!isShowTip) {
            isShowTip = true;
            d3.select(this).style('background-color', '#d4d4d4');
            if (!isSwitch) {
                activatedTooltip(snetfnode_g, snetfSvg)
            } else {
                activatedTooltip(snetnode_g, snetSvg)
            }
        } else {
            isShowTip = false;
            d3.select(this).style('background-color', '#fff');
            deactivatedTooltip(snetfnode_g);
            deactivatedTooltip(snetnode_g)
        }
    })

function activatedTooltip(g, svg) {
    g.selectAll('.node > circle')
        .on('mouseover', function (event, d) {
            d3.select(this).style('stroke', 'red');
            tooltipMouseIn(event, d);
        })
        .on('mouseout', tootipMouseOut);
}

function deactivatedTooltip(g) {
    g.selectAll('.node > circle')
        .on('mouseover', null)
        .on('mouseout', null);
}

let isTransform = false;
d3.select('#transform')
    .on('click', function (event) {
        if (!isTransform) {
            isTransform = true;
            d3.select(this).style('background-color', '#d4d4d4');
            $('.shownet').fadeOut(500);
            setTimeout(function () {
                $("#snet-layout").fadeIn(500);
            }, 500)
        } else {
            isTransform = false;
            d3.select(this).style('background-color', '#fff');
            $('.shownet').fadeOut(500);
            setTimeout(function () {
                $("#snet-force").fadeIn(500);
            }, 500)
        }
    });

let isTnet = false;
d3.select('#timenet')
    .on('click', function (event) {
        if (!isTransform) {
            isTransform = true;
            d3.select(this).style('background-color', '#d4d4d4');
            $('.shownet').fadeOut(500);
            setTimeout(function () {
                $("#tnet-layout").fadeIn(500);
            }, 500)
        } else {
            isTransform = false;
            d3.select(this).style('background-color', '#fff');
            $('.shownet').fadeOut(500);
            setTimeout(function () {
                $("#snet-force").fadeIn(500);
            }, 500)
        }
    });

let isClickNode = false;
d3.select('#clickNode')
    .on('click', function () {
        if (!isClickNode) {
            isClickNode = true;
            d3.select(this).style('background-color', '#d4d4d4');
            snetfnode_g.selectAll('.node')
                .on('click', function (event, d) {
                    if (!isMapSwitch) {
                        palenode_g.selectAll('.fossil')
                            .style('display', 'none')
                            .filter(e => e.id === d.id)
                            .style('display', 'block');
                        drawImgGrid(palenode_g.selectAll('.fossil').filter(e => e.id === d.id).data(), 'imggrid');
                    } else {
                        node_g.selectAll('.fossil')
                            .style('display', 'none')
                            .filter(e => e.id === d.id)
                            .style('display', 'block');
                        drawImgGrid(node_g.selectAll('.fossil').filter(e => e.id === d.id).data(), 'imggrid');
                    }
                    d3.select('#tooltip')
                        .style('display', 'block')
                        .style('z-index', 10000)
                        .style('transform', `translate(${event.x + 15}px, ${event.y}px)`)
                        .html(`
                            Family: ${d['family']}<br>
                            Genus: ${d['genus']}<br>
                            Age: ${d['age']}<br>
                            Species: ${d['species'].length > 1 ? d['species'].join('/') : d['species'][0]}
                        `);
                });
        } else {
            isClickNode = false;
            d3.select(this).style('background-color', '#fff');
            d3.select('#tooltip')
                .style('display', 'none')
                .style('z-index', -10);
            initAllNodeStroke();
            snetfnode_g.selectAll('.node > circle')
                .on('click', null);
            palenode_g.selectAll('.fossil')
                .style('display', 'block');
            node_g.selectAll('.fossil')
                .style('display', 'block');
            drawImgGrid(fossilDataforimg, 'imggrid');
        }
    })