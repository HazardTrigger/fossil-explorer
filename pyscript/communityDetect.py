import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import networkx.algorithms.community as nx_comm
import json

from networkx.readwrite import json_graph

with open('../data/graptolites-snet-20220119.json') as f:
    data = json.load(f)

G = json_graph.node_link_graph(data, directed=False, multigraph=False)

cl = nx_comm.louvain_communities(
    G=G,
    resolution=1,
    threshold=0.0000001,
    seed=np.random.seed(28)
)

for id, s in enumerate(cl):
    for node in s:
        nx.set_node_attributes(G=G, values={node: id}, name='communityID')

# for node in G.nodes(data=True):
#     print(node)

colorid = [node[1]['communityID'] for node in G.nodes(data=True)]

# plt.figure()
# nx.draw_kamada_kawai(
#     G=G,
#     node_size=100,
#     node_color=colorid,
#     edge_color='#777',
#     alpha=0.6,
    # with_labels=True,
    # font_size=8,
    # cmap=plt.get_cmap('Paired')
# )
# plt.show()

graphData = json_graph.node_link_data(G)
with open('../data/graptolites-snet-20220120.json', 'w') as f:
    json.dump(graphData, f, indent=4, separators=(',', ':'))
