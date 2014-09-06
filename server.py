from flask import Flask
from flask import request
from flask import render_template
from acadHist import getUserData
from db.db import *
import re

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
	major = getMajor(db.database, "ECON")
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

	t1Taken = []
	t2Taken = []
	t3Taken = []
	elStrs1 = []
	elStrs2 = []
	elStrs3 = []

	t1els = major['tier1Electives']
	t2els = major['tier2Electives']
	t3els = major['tier3Electives']
	if t1els:
		elStrs1 += re.split(', |\|\|', t1els)
	if t2els:
		elStrs2 += re.split(', |\|\|', t2els)
	if t3els:
		elStrs3 += re.split(', |\|\|', t3els)		
	
	for course in classes:
		if isElective(course, elStrs1):
			t1Taken += [course]
		elif isElective(course, elStrs2):
			t2Taken += [course]
		elif isElective(course, elStrs3):
			t3Taken += [course]





			 
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


