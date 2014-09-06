from flask import Flask
from flask import request
from flask import render_template
from acadHist import getUserData
from db.db import *

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
	
	

	return data#academicData#render_template("index.html")


def parseMajorData(major, classes):
	return getMajor(db.database, 'Mathematics')

def returnData(username, password):
	data = getUserData(username,password)
	
	majorData = map(lambda x: parseMajorData(x, data['classes']), data['major'].split(','))
	print majorData
	

	return str(data)

if __name__ == "__main__":
	app.debug = True
	app.run()


