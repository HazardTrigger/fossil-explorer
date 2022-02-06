import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import json

from sklearn.decomposition import PCA
from networkx.readwrite import json_graph

graptoliteTypeMap = {
    'Colonograptus deubeli': 'a',
    'Colonograptus praedeubeli': 'a',
    'Spirograptus turriculatus': 'ab',
    'Lituigraptus convolutus': 'ab',
    'Demirastrites triangulatus': 'ab',
    'Coronograptus cyphus': 'ab',
    'Cystograptus vesiculosus': 'ab',
    'Parakidograptus acuminatus': 'ab',
    'Akidograptus ascensus': 'ab',
    'Metabolograptus persculptus': 'ab',
    'Metabolograptus extraordinarius': 'ab',
    'Paraorthograptus pacificus': 'ab',
    'Dicellograptus complexus': 'ab',
    'Dicellograptus ornatus': 'a',
    'Dicellograptus complanatus': 'ab',
    'Orthograptus calcaratus': 'a',
    'Hustedograptus teretiusculus': 'a',
    'Archiclimacograptus riddellensis': 'a',
    'Pterograptus elegans': 'a',
    'Nicholsonograptus fasciculatus': 'a',
    'Levisograptus dentatus': 'a',
    'Levisograptus austrodentatus': 'a',
    'Spirograptus guerichi': 'b',
    'Stimulograptus sedgwickii': 'b',
    'Dicellograptus mirus': 'b',
    'Tangyagraptus typicus': 'b'
}


def arrangeType(s, typeMap: dict):
    if s in typeMap:
        return typeMap[s]
    else:
        return ''


colorMap = {
    'Aeronian, Llandovery (early Silurian)': '#D9D9D9',
    'Aeroian, Llandovery (early Silurian)': '#D9D9D9',
    'Aeronian-Telychian, Llandovery (Early Silurian)': '#D9D9D9',
    'Aeroian-Telychian, Llandovery (Early Silurian)': '#D9D9D9',
    'Dapingian, Middle Ordovician': '#BEBAD9',
    'Dapingian-Darriwilian (Middle Ordovician)': '#BEBAD9',
    'Darriwilian (Middle Ordovician)': '#FB8072',
    'Darriwilian (Middle Ordovician)-Sandbian (Late Ordovician)': '#FB8072',
    'Darrwilian (Middle Ordovician)-Sandbian (Late Ordovician)': '#FB8072',
    'Hirnantian': '#B3DE68',
    'Hirnantian, Late Ordovician': '#B3DE68',
    'Homerian, Wenlock (Silurian)': '#FFED6F',
    'Katian, Late Ordovician': '#FDB462',
    'Rhuddanian, Llandovery (early Silurian)': '#FBCDE5',
    'Rhuddanian-Aeronian, Llandovery (early Silurian)': '#FBCDE5',
    'Rhuddanian-Aeroian, Llandovery (early Silurian)': '#FBCDE5',
    'Rhuddanian-Telychian, Llandovery (Early Silurian)': '#FBCDE5',
    'Rhuddanian-n, Llandovery (early Silurian)': '#FBCDE5',
    'Sandbian, Late Ordovician': '#7FB1D3',
    'Telychian, Llandovery (Early Silurian)': '#BC80BC'
}

nodes = pd.read_csv('../data/Id_label_Age_Emb_220116.csv')
links = pd.read_excel('../data/edgelist.xlsx')
nodes['Label'] = nodes['Label'].apply(lambda s: s.replace('_', ' '))
nodes['type'] = nodes['Label'].apply(lambda s:  arrangeType(s, graptoliteTypeMap))
nodes['color'] = nodes['Age'].apply(lambda s: colorMap[s])

# plt.figure()
# plt.scatter(x=nodes['lx'].to_numpy(), y=nodes['ly'].to_numpy())
# plt.show()

graphData = {
    'nodes': nodes.to_dict(orient='records'),
    'links': links.to_dict(orient='records')
}

G = json_graph.node_link_graph(data=graphData, directed=False, multigraph=False,
                               attrs={'source': 'source', 'target': 'target', 'name': 'ID'})

data = json_graph.node_link_data(G)

with open('../data/graptolites-tnet-20220119.json', 'w') as f:
    json.dump(data, f, indent=4, separators=(',', ':'))
