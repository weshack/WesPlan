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

def getMajor(conn, major):
	c = conn.cursor()
	major = major.capitalize()
	try:
		r = list(c.execute("select * from majors where name='{0}'".format(major)).next())
	except:
		continue
	
	return {
		'name': major,
		'type': r[2].split('&&'),
		'preDeclareCourses': r[3],
		'requiredCourses': r[4],
		'tier1Electives': r[5],
		'tier1Number': r[7],
		'tier2Electives': r[6],
		'tier2Number': r[8],
		'genEd': r[9]
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
