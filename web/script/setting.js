let accessToken = 'pk.eyJ1IjoiaGF6YXJkdHJpZ2dlciIsImEiOiJjanl3d2d0NmQwMmNjM2NxbDhwNmVsYmkzIn0.oap8KJPjiF__xdNVrVPmvQ';
mapboxgl.accessToken = accessToken;

let fossilData = [];

let radius = 50;

let filterMagnifierData = [];

let displayKeys = [
    ['specimens_Serial_No', 'Specimens No'],
    ['Order', 'Order'],
    ['Family', 'Family'],
    ['Genus', 'Genus'],
    ['names_from_specimens_lables', 'Specimens'],
    ['Age', 'Age'],
    ['Locality', 'Locality']
];

let clickTimes = 0;

let isSpace = false;

let preTree = null;

let AgeColorMap = {
    'Tremadocian': '#68D2C4',
    'Floian': '#69D4C8',
    'Dapingian': '#9FDBCE',
    'Darriwilian': '#A8DDD4',
    'Sandbian': '#BBE2CE',
    'Katian': '#C2E5D9',
    'Hirnantian': '#CAE8D9',
    'Rhuddanian': '#C9E8DF',
    'Areonian': '#D0EBE5',
    'Telychian': '#D7EFEA',
    'Sheinwoodian': '#D8EEE5',
    'Homerian': '#DFF2EB',
    'Gorstian': '#DFF2F0',
    'Ludfordian': '#E7F5F1',
    'Areonian-Telychian': '#C1E6DF',
    'Rhuddanian-Telychian': '#C1E6DF',
    'Rhuddanian-Areonian': '#C1E6DF',
    'Darriwilian-Sandbian': '#777',
    'Dapingian-Darriwilian': '#7ED6C4'
}

let arcSortMap = {
    'Tremadocian': 0,
    'Floian': 1,
    'Dapingian': 2,
    'Darriwilian': 3,
    'Sandbian': 4,
    'Katian': 5,
    'Hirnantian': 6,
    'Rhuddanian': 7,
    'Areonian': 8,
    'Telychian': 9,
    'Sheinwoodian': 10,
    'Homerian': 11,
    'Gorstian': 12,
    'Ludfordian': 13,
    'Areonian-Telychian': 14,
    'Rhuddanian-Telychian': 15,
    'Rhuddanian-Areonian': 16,
    'Darriwilian-Sandbian': 17,
    'Dapingian-Darriwilian': 18
}

let sunburstRadius = 200;

let mouseoverNodes = [];

let fossilDataforimg = [];

let layersName = [
    'Floian_Dapingian', 'Darwillian', 'Early_Llandovery', 'Hirnantian',
    'Late_Llandovery', 'Ludlow_Pridoli', 'Sandbian_Katian', 'Tremadocian',
    'Wenlock'
];


