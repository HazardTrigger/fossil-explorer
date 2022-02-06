import pandas as pd


def arrangeID(s, label):
    for d in label:
        if s in d['species']:
            return int(d['id'])


# data = pd.read_csv('../data/fossil7.csv')
# snet = pd.read_csv('../data/species_vertex_1.18.csv')
# data['names_from_specimens_lables'] = data['names_from_specimens_lables'].apply(lambda s: s.replace(' ', ' ').strip())
# snet['species'] = snet['species'].apply(lambda s: s.split(','))
# labelandid = snet[['id', 'species']].copy(deep=True).to_dict(orient='records')
#
# data['id'] = data['names_from_specimens_lables'].apply(lambda s: arrangeID(s, labelandid))
#
# t = data[data['id'].isna()]
#
# data.to_csv('../data/fossil8.csv', index=False)

data = pd.read_csv('../data/fossil8.csv')
data['Age'] = data['Age'].apply(lambda s: s.replace('Areonian', 'Aeronian'))
data.to_csv('../data/fossil8.csv', index=False)
