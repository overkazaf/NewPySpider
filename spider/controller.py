import os

' controller module '

__author__ = 'overkazaf'

#functions
def getDownloadedMusicList ():
	dirs = os.listdir('static')
	for dir in dirs:
		mp3Path = 'static/' + dir + '/mp3/'
		picPath = 'static/' + dir + '/pic/'


		mp3 = os.listdir(mp3Path)
		mp3 = map(lambda x : mp3Path + x, mp3)
		#print 'mp3Path:', mp3Path 
		#print mp3

		pic = os.listdir(picPath)
		pic = map(lambda x : picPath + x, pic)
		#print 'picPath:', picPath
		#print pic
	return None

#get all the downloaded resources for local folder
def getLocalResources ():
	dirs = os.listdir('static')
	for dir in dirs:
		mp3Path = 'static/' + dir + '/mp3/'
		picPath = 'static/' + dir + '/pic/'


		mp3 = os.listdir(mp3Path)
		mp3 = map(lambda x : mp3Path + x, mp3)
		#print 'mp3Path:', mp3Path 
		#print mp3

		pic = os.listdir(picPath)
		pic = map(lambda x : picPath + x, pic)
		#print 'picPath:', picPath
		#print pic
	return {'mp3s': mp3, 'pics': pic}