from flask import Flask
from db import *

app = Flask(__name__)

@app.route("/")
def main():
	return "Hello world"

@app.route("/majors")
def majors():
	return db.getMajors()

@app.route("/major/<major>")
def major(major):
	return db.getMajor(major)

@app.route("/courses/<course>")
def courses(course):
	return db.getCourse(course)




if __name__ == "__main__":
    app.run()



