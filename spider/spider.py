import urllib2  
response = urllib2.urlopen('http://localhost:5000/')  
html = response.read()  
print html 