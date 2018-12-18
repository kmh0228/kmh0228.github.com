lognum=1

log(){
	[lognum++]
	return lognum
}

echo lognum > info
