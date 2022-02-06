let dataList = [
    d3.json('data/tree2.json', d3.autoType),
    d3.csv('data/fossil8_20220123.csv', d3.autoType),
    d3.json('data/graptolites-snet-20220120.json', d3.autoType),
    d3.json('data/graptolites-tnet-20220119.json', d3.autoType)
];

Promise.all(dataList).then(function (datas) {
    fossilData = datas[1];
    fossilDataforimg = _.cloneDeep(fossilData);

    drawTree(datas[0], tree_g, clipTimeWidth, clipTimeHeight)
    projectPaleMapData(_.cloneDeep(fossilData), palenode_g, palemap);
    projectMapData(_.cloneDeep(fossilData), node_g, map);
    drawImgGrid(_.cloneDeep(fossilData), 'imggrid');
    drawRiskLayout(sgc, _.cloneDeep(datas[2]), snetXScale, snetYScale, snetSegmentScale, snetContour, 1);
    drawNetwork(snetfnode_g, snetflink_g, snetfhull_g, _.cloneDeep(datas[2]), foci);
    drawRiskLayout(tgc, datas[3], tnetXScale, tnetYScale, tnetSegmentScale, tnetContour, 1);
});
