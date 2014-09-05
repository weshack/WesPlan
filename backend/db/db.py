import sqlite3

def connect_database():
	return sqlite3.connect('db/wesplan.db')

def getMajors(conn):
	c = conn.cursor()
	majors = c.execute("select * from majors")
	majs = []
	for maj in majors:
		majs.append(maj[1])
	return majs

def getMajor(conn, major):
	c = conn.cursor()
	major = major.capitalize()
	r = c.execute("select * from majors where name='{0}'".format(major)).next()
	return list(r)
	z = []
	for e in r:
		z.append(e)
	return z