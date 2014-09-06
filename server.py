from flask import Flask, jsonify
from flask import request
from flask import render_template
from acadHist import getUserData
from db.db import *
import json
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
	#data={}
	#return data

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
	if not major:
		return 'DNE'

	reqs =  major['requiredCourses']
	for r in reqs:
		rt = False
		if 'or' in r:
			for r2 in r[1:-1].split(' or '):
				print r2
				if r2 in classes:
					reqsTaken += [r2]
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
		if course in reqsTaken:
			continue
		if isElective(course, elStrs1):
			t1Taken += [course]
		elif isElective(course, elStrs2):
			t2Taken += [course]
		elif isElective(course, elStrs3):
			t3Taken += [course]


	majorDat = {
		'name': majorName,
		'reqsTaken': reqsTaken,
		'reqsLeft': reqsLeft,
		't1Taken': t1Taken,
		't2Taken': t2Taken,
		't3Taken': t3Taken
	}
	return majorDat

def returnData(username, password):
	academicData = getUserData(username,password)
	
	majorData = map(lambda x: parseMajorData(x, academicData['classes']), academicData['major'].split(','))
	print majorData

	data = {
		'acadData': academicData,
		'majorData': majorData
	}
	return data
if __name__ == "__main__":
	app.debug = True
	app.run()


