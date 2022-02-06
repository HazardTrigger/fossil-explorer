import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


colorMap = {
    'Aeronian, Llandovery (early Silurian)': '#D0EBDF',
    'Aeroian, Llandovery (early Silurian)': '#D0EBDF',
    'Aeronian-Telychian, Llandovery (Early Silurian)': '#D0EBDF',
    'Aeroian-Telychian, Llandovery (Early Silurian)': '#D0EBDF',
    'Dapingian, Middle Ordovician': '#66CBBB',
    'Dapingian-Darriwilian (Middle Ordovician)': '#66CBBB',
    'Darriwilian (Middle Ordovician)': '#66CBBB',
    'Darriwilian (Middle Ordovician)-Sandbian (Late Ordovician)': '#66CBBB',
    'Darrwilian (Middle Ordovician)-Sandbian (Late Ordovician)': '#66CBBB',
    'Hirnantian': '#66CBBB',
    'Hirnantian, Late Ordovician': '#66CBBB',
    'Homerian, Wenlock (Silurian)': '#D0EBDF',
    'Katian, Late Ordovician': '#66CBBB',
    'Rhuddanian, Llandovery (early Silurian)': '#D0EBDF',
    'Rhuddanian-Aeronian, Llandovery (early Silurian)': '#D0EBDF',
    'Rhuddanian-Aeroian, Llandovery (early Silurian)': '#D0EBDF',
    'Rhuddanian-Telychian, Llandovery (Early Silurian)': '#D0EBDF',
    'Rhuddanian-n, Llandovery (early Silurian)': '#D0EBDF',
    'Sandbian, Late Ordovician': '#66CBBB',
    'Telychian, Llandovery (Early Silurian)': '#D0EBDF'
}

data = pd.read_csv('../data/Id_label_Age_Emb.csv')
data['color'] = data['Age'].apply(lambda t: colorMap[t])
data.to_csv('../data/Id_label_Age_Emb_220116.csv', index=False)

