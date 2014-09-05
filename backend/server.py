from flask import Flask
from flask import request
from acadHist import getUserData
from db.db import *

app = Flask(__name__)
@app.before_request
def db():
	db.database = connect_database()

@app.route("/")
def main():
	return "Hello world"

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

@app.route("/userdata/", methods=['POST'])
def returnData():
	print request.form
	user = request.form['username']
	passw = request.form['password']
	classes = getUserData(user,passw)
	return str(classes)
	# return ', '.join(classes)

if __name__ == "__main__":
	app.debug = True
	app.run()


