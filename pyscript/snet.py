import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import json

from networkx.readwrite import json_graph
from node2vec import Node2Vec
from openTSNE import TSNE
from networkx.readwrite import json_graph
from scipy.stats import zscore


def arrangeID(s, label):
    for d in label:
        if s in d['species']:
            return int(d['species_id'])


def arrangeType(s, typeMap: dict):
    t = []
    for d in s:
        if d in typeMap:
            t.append(str(typeMap[d]))
        else:
            t.append('nan')
    ts = ','.join(np.unique(t))

    if ts.find('2') != -1:
        return 'ab'
    elif ts.find('1') != -1:
        return 'b'
    elif ts.find('0') != -1:
        return 'a'
    else:
        return ''


def layoutForSnet(G, trainer):
    node2vec = Node2Vec(
        graph=G,
        dimensions=128,
        walk_length=80,
        num_walks=10,
        weight_key='weight',
        workers=1,
        temp_folder='../data/temp',
        seed=28
    )

    model = node2vec.fit(window=10, min_count=1, batch_words=4)

    X = model.wv.vectors

    X = zscore(X)
    X_embed = trainer.fit(X)

    layoutX = {}
    layoutY = {}
    for i, c in enumerate(X_embed):
        layoutX[i] = X_embed[i][0]
        layoutY[i] = X_embed[i][1]

    nx.set_node_attributes(G, values=layoutX, name='lx')
    nx.set_node_attributes(G, values=layoutY, name='ly')

    return G


graptoliteTypeMap = {
    'Colonograptus deubeli': 0,
    'Colonograptus praedeubeli': 0,
    'Spirograptus turriculatus': 2,
    'Lituigraptus convolutus': 2,
    'Demirastrites triangulatus': 2,
    'Coronograptus cyphus': 2,
    'Cystograptus vesiculosus': 2,
    'Parakidograptus acuminatus': 2,
    'Akidograptus ascensus': 2,
    'Metabolograptus persculptus': 2,
    'Metabolograptus extraordinarius': 2,
    'Paraorthograptus pacificus': 2,
    'Dicellograptus complexus': 2,
    'Dicellograptus ornatus': 0,
    'Dicellograptus complanatus': 2,
    'Orthograptus calcaratus': 0,
    'Hustedograptus teretiusculus': 0,
    'Archiclimacograptus riddellensis': 0,
    'Pterograptus elegans': 0,
    'Nicholsonograptus fasciculatus': 0,
    'Levisograptus dentatus': 0,
    'Levisograptus austrodentatus': 0,
    'Spirograptus guerichi': 1,
    'Stimulograptus sedgwickii': 1,
    'Dicellograptus mirus': 1,
    'Tangyagraptus typicus': 1
}


trainer = TSNE(
    n_iter=1000,
    metric="euclidean",
    # initialization="random",
    initialization="pca",
    random_state=28,
    verbose=True
)

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


nodes = pd.read_csv('../data/species_vertex_1.18.csv')
links = pd.read_excel('../data/edgelist.xlsx')
fossil = pd.read_csv('../data/fossil5.csv')

nodes['species'] = nodes['species'].apply(lambda s: s.split(','))
nodes['type'] = nodes['species'].apply(lambda s: arrangeType(s, graptoliteTypeMap))
nodes['family'] = nodes['family'].astype(str)
nodes['color'] = nodes['age'].apply(lambda s: colorMap[s])

graphData = {
    'nodes': nodes.to_dict(orient='records'),
    'links': links.to_dict(orient='records')
}

G = json_graph.node_link_graph(data=graphData, directed=False, multigraph=False,
                               attrs={'source': 'source', 'target': 'target', 'name': 'node ID'})

G = layoutForSnet(G, trainer)

data = json_graph.node_link_data(G)

with open('../data/graptolites-snet-20220119.json', 'w') as f:
    json.dump(data, f, indent=4, separators=(',', ':'))
