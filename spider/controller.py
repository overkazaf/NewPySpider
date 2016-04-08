import os
import spider as Spider

' controller module '

__author__ = 'overkazaf'
__resource__ = 'static'

def isExcludeFiles(ext):
	excludeFiles = ['.js', '.css']
	for fileExt in excludeFiles:
		if ext == fileExt:
			return True
	return False

def filterPath (dirs):
	list = []
	for dir in dirs:
		if dir == 'css' or dir == 'js' or dir == '.DS_Store':
			continue
		list.append(dir)
	return list

def getVolumnList():
	list = []
	dirs = os.listdir(__resource__)
	print 'dirs ', dirs
	for dir in dirs:
		if dir == 'css' or dir == 'js':
			continue
		list.append(dir)

	return list

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
def getLocalResources (pageNo, pageSize):
	dirs = os.listdir(__resource__)
	dirs = filterPath(dirs)
	mp3, pic = [],[]
	dict = {'mp3':[], 'pic':[]}

	start = (pageNo-1)*pageSize + 1
	end = pageNo * pageSize

	for dir in dirs:
		mp3Path = __resource__ + '/' + dir + '/mp3/'
		picPath = __resource__ + '/' + dir + '/pic/'

		#filter js files
		filename, file_extension = os.path.splitext(dir)
		
		if not os.path.exists(mp3Path):
			continue
			
		if isExcludeFiles(file_extension) :
			continue

		mp3 = os.listdir(mp3Path)
		mp3 = map(lambda x : mp3Path + x, mp3)

		pic = os.listdir(picPath)
		pic = map(lambda x : picPath + x, pic)
		

		ret1 = {}
		ret1[dir] = mp3
		ret2 = {}
		ret2[dir] = pic
		dict['mp3'].append(ret1)
		dict['pic'].append(ret2)
	return dict

def getTotalFolderCounts ():
	dirs = os.listdir(__resource__)
	dirs = filterPath(dirs)
	return len(dirs)

#get current range of the downloaded volumns
def getVolRange ():
	minVol = 0
	maxVol = 0
	dirs = os.listdir(__resource__)
	dirs = filterPath(dirs)

	#sort by the volumn
	dirs.sort(lambda x,y: cmp(x.split('.')[1], y.split('.')[1]))
	if len(dirs) != 0:
		minVol = dirs[0].split('.')[1]
		maxVol = dirs[-1].split('.')[1]
	else:
		minVol = 100
		maxVol = 100

	print 'minVol ', minVol, ' maxVol ', maxVol

	return {'min': int(minVol), 'max': int(maxVol)}


def runScheduler(type, start, end):
	tasks = []

	print 'starts at ', str(start), ' and ends at ', end
	if type == 'mp3':
		Spider.getMusicByRange(start, end)
	elif type == 'pic':
		Spider.getPicByRange(start, end)
	elif type == 'all':
		Spider.getPicByRange(start, end)
		Spider.getMusicByRange(start, end)


def getDoneFiles(type, rangeType, start, end):
	start = int(start)
	end = int(end)
	mdc = 0
	for vol in range(start, end+1):

		md = getMp3FilesByVol(start)
		mdc = int(mdc) + int(md)
	return {'mp3': mdc}



def getMp3FilesByVol(vol):
	path = 'static/vol.' + str(vol) + '/mp3/'

	files = os.listdir(path)

	cnt = 0
	for file in files:
		if os.path.getsize(path + file) > 10:
			cnt = cnt + 1
	
	return cnt


def getPicFilesByVol(vol):
	path = 'static/vol.' + str(vol) + '/pic/'

	files = os.listdir(path)

	cnt = 0
	for file in files:
		if os.path.getsize(path + file) > 10:
			cnt = cnt + 1
	
	return cnt

	
def getTaskCompletion(type, rangeType, start, end):
	
	print 'start collecting data'
	range = getVolRange()

	print 'range,', range
	if rangeType == 'forward':
		start = range['max']
		end = int(start) + int(end) - 1

	if rangeType == 'backward':
		temp = range['min']
		start = int(temp) - int(end)
		end = int(temp) - 1

		if start < 1:
			start = 1
		if end < 1:
			end = 1


	music = {'total':0,'done':0}
	picture = {'total':0,'done':0}

	if type == 'all' or type == 'mp3':
		music = getMusicCompletion(type, rangeType, start, end)
		print 'music data done'

	if type == 'all' or type == 'pic':
		picture = getPictureCompletion(type, rangeType, start, end)
		print 'picture data done'

	#print 'picture completion, ', picture['total'], ' ', picture.done
	#print 'music completion, ', music['total'], ' ', music['done']
	return {'total':{'mp3':music['total'], 'pic':picture['total']}, 'done':{'mp3': music['done'], 'pic': picture['done']}}


def getPictureCompletion (type, rangeType, start, end):
	start = int(start)
	end = int(end)
	pc = 0
	pdc = 0

	for vol in range(start, end+1):
		p = Spider.getMaxPictureCount(vol)
		pc = int(pc) + int(p)

		pd = getPicFilesByVol(vol)
		pdc = int(pdc) + int(pd)

	return {'total':pc, 'done':pdc}

def getMusicCompletion (type, rangeType, start, end):
	start = int(start)
	end = int(end)
	mc = 0
	mdc = 0

	print 'in getMusicCompletionFn'
	for vol in range(start, end+1):

		m = Spider.getMaxMusicCount(vol)
		mc = int(mc) + int(m)

		md = getMp3FilesByVol(vol)
		mdc = int(mdc) + int(md)

	return {'total':mc, 'done':mdc}

def startScheduler(type, rangeType, start, end):
	volRange = getVolRange()
	minVol = int(volRange['min'])
	maxVol = int(volRange['max'])
	start = int(start)
	end = int(end)

	tasks = getTaskCompletion(type, rangeType, start, end)
	print 'total tasks:', tasks

	if rangeType == 'normal':
		runScheduler(type, start, end)
	elif rangeType == 'forward':
		runScheduler(type, maxVol + 1, maxVol + end)
	elif rangeType == 'backward':
		runScheduler(type, minVol - start, minVol - 1)

	return True


def getThanksDict (list):
	return Spider.getThanksByVolumns(list)