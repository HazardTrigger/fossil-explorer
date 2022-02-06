import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import json


def arrangeType(s, typeMap: dict):
    if s in typeMap:
        return typeMap[s]
    else:
        return ''


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

data = pd.read_csv('../data/fossil7.csv')
data['type'] = data['names_from_specimens_lables'].apply(lambda s: arrangeType(s, graptoliteTypeMap))
data.to_csv('../data/fossil7.csv', index=False)