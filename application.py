import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/", methods = ["GET"])
def render_index():
        return render_template("index.html")


@app.route("/", methods = ["POST"])
def index():
        return render_template("index.html")


@app.route("/add_channel", methods=["GET"])
def render_add_channel():
    