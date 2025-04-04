from flask import Flask, render_template
from flask_socketio import SocketIO
import eventlet
import threading
import time
from simulator import generate_fake_attack

# Patch eventlet for async operation
eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

def background_simulator():
    while True:
        attack = generate_fake_attack()
        socketio.emit("new_attack", attack)
        time.sleep(2)  # Emit new attack every 2 seconds

# Start background simulator thread
threading.Thread(target=background_simulator, daemon=True).start()

if __name__ == '__main__':
    socketio.run(app, debug=True)