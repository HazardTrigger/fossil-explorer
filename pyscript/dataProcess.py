import pandas as pd
import numpy as np
from shapely.geometry import Polygon

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
# age_df = pd.read_csv('../data/ageMap.csv')
# data = pd.read_csv('../data/0727Appendix 1. Graptolite specimen.csv')
#
# # data.drop(data[data['Age'].isna()].index, inplace=True)
# # data.to_csv('../data/0727Appendix 1. Graptolite specimen.csv', index=False)
#
# data['color'] = data['Age'].apply(lambda a: colorMap[a])
# ageRange = np.unique([f'{s[0]},{s[1]}' for s in data[['age_from', 'age_to']].to_numpy()])
# data['ageid'] = [f'{s[0]},{s[1]}' for s in data[['age_from', 'age_to']].to_numpy()]
# age_df['ageid'] = age_df['age_from'].astype(str) + ',' + age_df['age_to'].astype(str)
# df_merge = pd.merge(left=data, right=age_df, on='ageid', how='left')
# df_merge.drop(columns=['species ID', 'Subclass', 'Stem_Group', 'Subfamily', 'total_number_of_specimens',
#                        'figs_from_references', '显微镜照片数量', '相机照片数量', 'Super_Family', 'revised_name',
#                        'Microscrope_photo_No', 'SLR_photo_No', 'mean_age_value', 'Reference',
#                        '跑数据照片总数', '备注', 'collection_No', 'ageid', 'Age_x', 'age_from_x', 'age_to_x'], inplace=True)
# df_merge.rename(columns={
#     'Age_y': 'Age',
#     'age_from_y': 'age_from',
#     'age_to_y': 'age_to',
#     'age1': 'Subera'
# }, inplace=True)
#
# df_merge.to_csv('../data/fossil7.csv', index=False)
#
# data = pd.read_csv('../data/fossil6.csv')
# data['color'] = data['']

data = pd.read_csv('../data/fossil8_20220120.csv')
data.sort_values(by='age_from', ascending=False, inplace=True)
data.to_csv('../data/fossil8_20220123.csv', index=False)