from bs4 import BeautifulSoup
import mechanize
import cookielib

def getUserData(username,password):
	br = mechanize.Browser()
	cj = cookielib.LWPCookieJar()
	br.set_cookiejar(cj)
	br.set_debug_redirects(True)
	br.set_handle_robots(False)
	br.set_handle_refresh(False)
	br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]
	br.open("https://wesep.wesleyan.edu/cgi-perl/session.cgi")
	br.select_form(nr=0)
	br["username"] = username
	br["password"] = password
	br.submit()

	request = mechanize.Request("https://wesep.wesleyan.edu/cgi-perl/students/academic_history/academic_history.cgi")
	request.add_header('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')
	request.add_header("Referer", "https://wesep.wesleyan.edu/cgi-perl/portfolio_maker/get_info.cgi/?info=left&portfolio_type=Student&portfolio="+username+"&indicatorID=&expire=05/23/2013%2009:23%20AM")
	cj.add_cookie_header(request)
	raw = br.open(request)

	soup = BeautifulSoup(raw)
	html = soup.prettify()
	x = {}
	for tr in soup.find_all('tr'):
		if "Cumulative Earned Credits" not in tr.get_text():
			if "Fall" in tr.get_text() or "Spring" in tr.get_text() or "Summer" in tr.get_text():
				o = str(tr.find_all('b')[0].get_text())
				x[o]= []
				current = o
			if tr.find_all('a') != [] and 'ALTGPA' not in tr.get_text():
				o = str(tr.find_all('a')[0].get_text().split("-")[0])
				x[current].append(o)
	return x

