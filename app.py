import eel
import time


def callback(page, sockets):
    print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
          "close page: {} current visitor: {}".format(page, len(sockets)))


eel.init('web')

eel.start("index.html",
          # host="120.55.164.80",
          mode="chrome-app",
          # port=8000,
          # mode=None,
        )
