import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
import networkx.algorithms.community as nx_comm

from networkx.readwrite import json_graph

nodes = pd.read_csv('../data/new_species_vertex_1.28.csv')
nodes.drop(columns=[
    'genus', 'family', 'color'
], inplace=True)
links = pd.read_csv('../data/new_species_edge_20220127.csv')

graphData = {
    'nodes': nodes.to_dict(orient='records'),
    'links': links.to_dict(orient='records')
}

G = json_graph.node_link_graph(
    data=graphData,
    directed=False,
    multigraph=False,
    attrs={
        'source': 'source', 'target': 'target', 'name': 'id'
    }
)

plt.figure()
nx.draw_kamada_kawai(
    G=G,
    node_size=100,
    edge_color='#777',
    # alpha=0.6,
)
plt.show()

cl = nx_comm.louvain_communities(
    G=G,
    resolution=1,
    threshold=0.0000001,
    seed=np.random.seed(28)
)

for id, s in enumerate(cl):
    for node in s:
        nx.set_node_attributes(G=G, values={node: id}, name='communityID')

colorid = [node[1]['communityID'] for node in G.nodes(data=True)]

plt.figure()
nx.draw_kamada_kawai(
    G=G,
    node_size=100,
    node_color=colorid,
    edge_color='#777',
    # alpha=0.6,
    # with_labels=True,
    # font_size=8,
    cmap=plt.get_cmap('Paired')
)
plt.show()

