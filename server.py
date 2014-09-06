from flask import Flask
from flask import request
from flask import render_template
from acadHist import getUserData
from db.db import *
import json

app = Flask(__name__, static_folder="static", template_folder="static")
@app.before_request
def db():
	db.database = connect_database()

@app.route("/")
def main():
	return render_template('login.html')

@app.route("/majors")
def majors():
	f = getMajors(db.database)
	s = ''
	for e in f:
		s += e
		s += '</ br>'
	return s

@app.route("/major/<major>")
def major(major):
	r =  getMajor(db.database, major)
	print r
	return r[1]
	

@app.route("/courses/<course>")
def courses(course):
	return getCourse(db.database, course)

@app.route("/login", methods=['POST'])
def login():
	user = request.form['username']
	passw = request.form['password']
	data = returnData(user,passw)

	return render_template("index.html", data=json.dumps(data))


def returnData(username, password):
	classes = getUserData(username,password)
	return str(classes)

if __name__ == "__main__":
	app.debug = True
	app.run()


