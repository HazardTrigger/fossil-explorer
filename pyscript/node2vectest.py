import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import json

from node2vec import Node2Vec
from openTSNE import TSNE
from networkx.readwrite import json_graph
from scipy.stats import zscore


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

nodes = pd.read_csv('../data/species_vertex1.161800.csv')
links = pd.read_excel('../data/edgelist.xlsx')

nodes['species'] = nodes['species'].apply(lambda s: s.split(','))
nodes['type'] = nodes['species'].apply(lambda s: arrangeType(s, graptoliteTypeMap))
nodes['family'] = nodes['family'].astype(str)

graphData = {
    'nodes': nodes.to_dict(orient='records'),
    'links': links.to_dict(orient='records')
}

G = json_graph.node_link_graph(data=graphData, directed=False, multigraph=False,
                               attrs={'source': 'source', 'target': 'target', 'name': 'node ID'})

# nx.set_node_attributes(G, nx.degree_centrality(G), name='degree')
# nx.set_node_attributes(G, nx.eigenvector_centrality(G, weight='weight'), name='ec')
# nx.set_node_attributes(G, nx.closeness_centrality(G, distance='weight'), name='closeness')
# nx.set_node_attributes(G, nx.betweenness_centrality(G, weight='weight'), name='betweenness')
# nx.set_node_attributes(G, nx.harmonic_centrality(G, distance='weight'), name='hc')

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

trainer = TSNE(
    n_iter=1000,
    metric="euclidean",
    # initialization="random",
    initialization="pca",
    random_state=28,
    verbose=True
)

model = node2vec.fit(window=10, min_count=1, batch_words=4)

X = model.wv.vectors

# topologyFea = [
#     [node[1]['degree'], node[1]['ec'],
#      node[1]['closeness'], node[1]['betweenness'], node[1]['hc']]
#     for node in G.nodes(data=True)
# ]
# topologyFea = np.array(topologyFea)
#
# X = np.concatenate([X, topologyFea], axis=1)
X = zscore(X)
X_embed = trainer.fit(X)

layoutX = {}
layoutY = {}
for i, c in enumerate(X_embed):
    layoutX[i] = X_embed[i][0]
    layoutY[i] = X_embed[i][1]

nx.set_node_attributes(G, values=layoutX, name='lx')
nx.set_node_attributes(G, values=layoutY, name='ly')

plt.figure()
plt.scatter(x=X_embed[:, 0], y=X_embed[:, 1], s=30, alpha=0.5)
plt.show()

data = json_graph.node_link_data(G)

with open('../data/graptolites-snet-20220117.json', 'w') as f:
    json.dump(data, f, indent=4, separators=(',', ':'))
