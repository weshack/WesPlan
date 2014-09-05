from flask import Flask
from db import *

app = Flask(__name__)

@app.route("/")
def main():
	return "Hello world"






if __name__ == "__main__":
    app.run()