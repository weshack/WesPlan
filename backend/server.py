from flask import Flask
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



if __name__ == "__main__":
	app.debug = True
	app.run()


