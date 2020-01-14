#coding=utf-8
import itchat
import datetime
import time
import random

toUserNames=[
    "凯月",
    "狗狗",
    "深圳徒弟",
    "糖果",
    "李志杰",
    "骚军"
]

times = [
    {'h':8,'m':2,'msg':[
        'good morning',
        '早',
        '早安',
        '早啊',
        '早,起床啦',
        'good morning'
    ]},
    {'h':22,'m':2,'msg':[
        'good night,做个好梦',
        '晚安',
        '晚安,早些睡觉',
        'Sleep tight',
        'sweet dreams',
        'Nighty-night'
    ]}
]

def send_move(saytimemsg):    
    for touser in toUserNames:
        saytimemsglength = len(saytimemsg)
        rand = random.randint(0,saytimemsglength-1)
        users = itchat.search_friends(name=touser)
        if(len(users)>0):
            itchat.send(saytimemsg[rand],toUserName=users[0]['UserName'])


if __name__ == "__main__":
    itchat.auto_login(hotReload=True,enableCmdQR=2)  # 首次扫描登录后后续自动登录

while True:
    now = datetime.datetime.now()
    if(now.hour == 1 and now.minute == 0):
        for saytime in times:
            saytime['m'] = random.randint(0,10)
    for saytime in times:
        if(now.hour == saytime['h'] and now.minute == saytime['m']):
            saytimemsg = saytime['msg']
            send_move(saytimemsg)
    # 每隔60秒检测一次
    time.sleep(60)
