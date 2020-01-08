import itchat
import datetime
import time

#report_to_name="栖木26 凯月"
report_to_name="赵明强"

def send_move(report_to_name,message):
    now = datetime.datetime.now()
    users = itchat.search_friends(name=report_to_name)
    print(users)
    userName = users[0]['UserName']
    #itchat.send(str(now),toUserName=userName)
    itchat.send(str(now)+"--"+message,toUserName=userName)

def doSth(h=8,m=8):
    if __name__ == "__main__":
        itchat.auto_login(hotReload=True)  # 首次扫描登录后后续自动登录
        send_move(report_to_name,"现在时刻"+str(h)+":"+str(m))

doSth(7,7)

#def main(h=3,m=0):
h=15
m=12
while True:
    now = datetime.datetime.now()
    # print(now.hour, now.minute)
    if now.hour == h and now.minute == m:
        doSth(h,m)
    # 每隔60秒检测一次
    time.sleep(60)