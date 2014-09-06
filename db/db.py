import sqlite3


def connect_database():
	return sqlite3.connect('db/wesplan.db')

def getMajors(conn):
	c = conn.cursor()
	majors = c.execute("select * from majors")
	majs = []
	for maj in majors:
		majs.append(maj[1])

	return {
		'majors':majs
		}

def parseCourses(courseStr):
	return map((lambda x : x.replace('||', " or ")), courseStr.split('&&'))


def getMajor(conn, major):
	c = conn.cursor()
	#major = major.capitalize()
	print "*"*20, major
	try:
		r = list(c.execute("select * from majors where name='{0}'".format(major)).next())
		name = major
	except:
		continue

	

	return {
		'name': major,
		'type': r[2],
		'preDeclareCourses': parseCourses(r[3]),
		'requiredCourses': parseCourses(r[4]),
		'tier1Electives': r[5],
		'tier2Electives': r[6],
		'tier3Electives': r[7],
		'tier1Number': r[8],
		'tier2Number': r[9],
		'tier3Number': r[10],
		'genEd': r[11],
		'title': r[12]
		}





def getCourse(conn, course):
	number = course[-3:len(course)]
	department = course[0:3]

	c = conn.cursor()
	r = list(c.execute("select * from courses where department='{0}' and number='{1}'"
		.format(department.upper(), number)).next())

	return {
		'name': course,
		'title': r[3],
		'genEdArea': r[1],
		'url': r[4],
		'credit': r[5],
		'semester': r[8],
		'gradingMode': r[10],
		'description': r[11],
		'sections': r[12]
		}
