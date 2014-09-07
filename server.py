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
	courseinfo = []
	for i in course.split('_'):
		print i
		info = getCourse(db.database, i)
		if info == '':
			continue
		courseinfo += [info]




	return json.dumps({'courses': courseinfo})


@app.route("/login", methods=['POST'])
def login():
	user = request.form['username']
	passw = request.form['password']
	data = returnData(user,passw)
	
	return render_template("index.html", data=data, jsonData=json.dumps(data))



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


def getMajorReqs(classes, major):
	reqs = major['requiredCourses']
	names = map(lambda x: x['name'], classes)
	currents = map(lambda x: x['current'], classes)
	print classes
	for i in range(len(names)):
		print names[i], currents[i]	
	reqsTaken = []
	reqsCurr = []
	reqsLeft = []

	for i in range(len(reqs)):
		r = reqs[i]
		rt = False
		if 'or' in r:
			for r2 in r[1:-1].split(' or '):
				print r2
				if r2 in names:
					if currents[names.index(r2)]:
						reqsCurr += [r2]
					else:
						reqsTaken += [r2]
					rt = True
		if r in names:
			if currents[names.index(r)]:
				reqsCurr += [r]
			else:
				reqsTaken += [r]
			rt = True
		if not rt:
			reqsLeft += [r]

	return (reqsTaken, reqsCurr, reqsLeft)


def parseMajorData(majorName, classes):
	if majorName == '':
		return ''
	#major = getMajor(db.database, 'Mathematics')

	reqsTaken = []
	reqsCurr = []
	reqsLeft = []

	major = getMajor(db.database, majorName)
	majorTitle = str(major['title'])
	if not major:
		return 'DNE'

	(reqsTaken, reqsCurr, reqsLeft) = getMajorReqs(classes,major)

	print reqsTaken

	t1Taken = []
	t2Taken = []
	t3Taken = []
	t1Current = []
	t2Current = []
	t3Current = []
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
		name = course['name']
		if name in major['requiredCourses']:
			continue
		if isElective(name, elStrs1):
			if course['current']:
				t1Current += [name]
			else:
				t1Taken += [name]
		elif isElective(name, elStrs2):
			if course['current']:
				t2Current += [name]
			else:
				t2Taken += [name]
		elif isElective(name, elStrs3):
			if course['current']:
				t3Current += [name]
			else:
				t3Taken += [name]

	print majorTitle
	majorDat = {
		'name': majorName,
		'title': majorTitle,
		'reqsTaken': reqsTaken,
		'reqsCurr': reqsCurr,
		'reqsLeft': reqsLeft,
		't1Current': t1Current,
		't2Current': t2Current,
		't3Current': t3Current,
		't1Taken': t1Taken,
		't2Taken': t2Taken,
		't3Taken': t3Taken,
		't1Total': major['tier1Number'],
		't2Total': major['tier2Number'],
		't3Total': major['tier3Number'],
		't1Strings': elStrs1,
		't2Strings': elStrs2,
		't3Strings': elStrs3
	}
	return majorDat

def returnData(username, password):
	academicData = getUserData(username,password)
	print '*'*5
	print academicData
	print '*'*5
	majorData = map(lambda x: parseMajorData(x, academicData['classes']), academicData['major'].split(','))

	data = {
		'acadData': academicData,
		'majorData': majorData
	}
	print data
	return data
if __name__ == "__main__":
	app.debug = True
	app.run()


