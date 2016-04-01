import os

' controller module '

__author__ = 'overkazaf'
__resource__ = 'static'



def isExcludeFiles(ext):
	excludeFiles = ['.js', '.css']
	for fileExt in excludeFiles:
		if ext == fileExt:
			return True
	return False

#functions
def getDownloadedMusicList ():
	dirs = os.listdir(__resource__)
	for dir in dirs:
		mp3Path = __resource__ + '/' + dir + '/mp3/'
		picPath = __resource__ + '/' + dir + '/pic/'

		filename, file_extension = os.path.splitext(dir)

		print 'file_extension ', file_extension
		print 'filename ', filename
		#filter js files
		if isExcludeFiles(file_extension) :
			continue
		if mp3Path == 'static/css/mp3/':
			continue

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
	dirs = os.listdir(__resource__)
	for dir in dirs:
		mp3Path = __resource__ + '/' + dir + '/mp3/'
		picPath = __resource__ + '/' + dir + '/pic/'

		#filter js files
		filename, file_extension = os.path.splitext(dir)
		
		if not os.path.exists(mp3Path):
			continue
			
		if isExcludeFiles(file_extension) :
			continue

		# if mp3Path == 'static/css/mp3/':
		# 	continue

		# if mp3Path == 'static/css/pic/':
		# 	continue

		mp3 = os.listdir(mp3Path)
		mp3 = map(lambda x : mp3Path + x, mp3)
		#print 'mp3Path:', mp3Path 
		#print mp3

		pic = os.listdir(picPath)
		pic = map(lambda x : picPath + x, pic)
		#print 'picPath:', picPath
		#print pic
	return {'mp3s':mp3, 'pics':pic}