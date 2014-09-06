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
	# user = request.form['username']
	# passw = request.form['password']
	# data = returnData(user,passw)
	data={}

	return render_template("index.html", data=json.dumps(data))


def isElective(course, elStrs):
	for elStr in elStrs:
		if not elStr[:4] == course[:4]:
			continue

		courseNum = int(course[-3:])

		if course == elStr:
			return True

		#Lower bound
		if elStr[-1] == '+':
			if int(elStr[-4:-1]) < courseNum:
				return True
			else:
				continue
		#range
		if '-' in elStr:
			a = int(elStr[-3:])
			b = int(elStr[-7:-4])
			if (b < courseNum) and (courseNum < a):
				return True
			else:
				continue

	return False



def parseMajorData(majorName, classes):
	#major = getMajor(db.database, 'Mathematics')
	reqsTaken = []
	reqsLeft = []
	major = getMajor(db.database, majorName)
	reqs =  major['requiredCourses']
	for r in reqs:
		rt = False
		if 'or' in r:
			for r2 in r[1:-1].split('or'):
				if r2 in classes:
					reqsTaken += [r]
					rt = True
		if r in classes:
			reqsTaken += [r]
			rt = True
		if not rt:
			reqsLeft += [r]

	electivesTaken = []

	t1els = major['tier1Electives']
	elStrs = t1els.split(', ')
	print elStrs
	for course in classes:
		if isElective(course, elStrs):
			electivesTaken += [course]

	print electivesTaken



			 
	# majorDat = {
	# 	'name': majorName,
	# 	'reqTaken': 

	# }
	return major

def returnData(username, password):
	data = getUserData(username,password)
	
	majorData = map(lambda x: parseMajorData(x, data['classes']), data['major'].split(','))
	print majorData
	

	return str(data)

if __name__ == "__main__":
	app.debug = True
	app.run()


