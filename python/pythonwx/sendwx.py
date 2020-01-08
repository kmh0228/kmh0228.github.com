#coding=utf-8
import itchat
import datetime
import time

toUserNames=[
    # "栖木26 凯月",
    "赵明强"
]

times = [
    {'h':14,'m':38,'msg':'good morning,美好的一天开始开始了.'},
    {'h':14,'m':40,'msg':'good night,做个好梦.'}
]

def send_move(message):    
    for touser in toUserNames:
        users = itchat.search_friends(name=touser)
        if(len(users)>0):
            itchat.send(message,toUserName=users[0]['UserName'])


if __name__ == "__main__":
    itchat.auto_login(hotReload=True,enableCmdQR=2)  # 首次扫描登录后后续自动登录
    send_move("test")

while True:
    now = datetime.datetime.now()
    for saytime in times:
        if(now.hour == saytime['h'] and now.minute == saytime['m']):
            send_move(saytime['msg'])
    # 每隔60秒检测一次
    time.sleep(60)
