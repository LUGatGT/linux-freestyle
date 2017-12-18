import os
import sys
from socketIO_client import SocketIO

socketIO = SocketIO('127.0.0.1', 4000)
os.system("sh exec.sh " + sys.argv[1] + " " + sys.argv[2] + " " + sys.argv[3])
socketIO.emit('data', sys.argv[3])
print 'done dd'
