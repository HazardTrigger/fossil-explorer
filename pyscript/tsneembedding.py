import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from openTSNE import TSNE

trainer = TSNE(
    n_iter=1000,
    metric="euclidean",
    # initialization="random",
    initialization="pca",
    random_state=28,
    verbose=True
)

data = pd.read_csv('../data/Id_label_Age_Emb_220116.csv')

X = np.array([np.safe_eval(x) for x in data['Embedding'].to_numpy()])

X_embed = trainer.fit(X)

plt.figure()
plt.scatter(x=X_embed[:, 0], y=X_embed[:, 1], s=30)
plt.show()

data['lx'] = X_embed[:, 0]
data['ly'] = X_embed[:, 1]
data.sort_values(by='ID', inplace=True)
data.to_csv('../data/Id_label_Age_Emb_220116.csv', index=False)
