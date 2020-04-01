import os

from flask import Flask, render_template, request, redirect, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


# @app.route("/", methods = ["GET"])
# def get_username():
#         return render_template("login.html")

@app.route("/", methods = ["GET"])
def render_index():
        return render_template("index.html")

@app.route("/", methods = ["POST"])
def index():
        return render_template("index.html")

@socketio.on("submit message")
def message(data):
        message = data["message"]
        emit("display message", {"message": message}, broadcast=True)

@socketio.on("delete message")
def delete_message(data):
        message = {}
        message["message"] = "This message was removed"
        message["user"] = data["message"]["user"]
        message["time"] = data["message"]["time"] 
        message["id"] = data["message"]["id"] 
        emit("display deleted message", {"message": message}, broadcast=True)

@socketio.on("new user")
def display_username(username):
        emit("add user", {"username":username}, broadcast=True)
