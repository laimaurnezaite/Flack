import os

from flask import Flask, render_template, request, redirect
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = ["cooking", "gardening", "cleaning", "clothes"]

@app.route("/", methods = ["GET"])
def render_index():
        return render_template("index.html")


@app.route("/", methods = ["POST"])
def index():
        return render_template("index.html")

# @app.route("/cooking", methods=["GET"])
# def render_cooking():
#     return render_template("index.html", channels=channels)


@socketio.on("submit message")
def message(data):
        message = data["message"]
        emit("display message", {"message": message}, broadcast=True)