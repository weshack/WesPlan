import sqlite3

def connect_database():
	return sqlite3.connect('db/wesplan.db')