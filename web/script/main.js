let dataList = [
    d3.json('data/tree2.json', d3.autoType),
    d3.csv('data/fossil8_20220207.csv', d3.autoType)
];

window.onload = function () {
    Promise.all(dataList).then(function (datas) {
        fossilData = datas[1];
        fossilDataforimg = _.cloneDeep(fossilData);

        // pre-load images
        fossilData.forEach(function (d) {
            let img = new Image();
            img.src = `images/graptolites/${d['fig_name']}`;
        });

        drawTree(datas[0], tree_g, clipTimeWidth, clipTimeHeight)
        projectMapData(_.cloneDeep(fossilData), node_g, map);
        mapboxSvg.on('mousemove', event => glyphMousemove(node_g, glyph_g, sunburst_node_g, sunburst_label_g, event, 'map'));
        // dragElement(document.getElementById('fsimg'));
    });
}


