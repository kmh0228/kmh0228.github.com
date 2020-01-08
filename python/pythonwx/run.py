import itchat
import datetime

#report_to_name="栖木26 凯月"
report_to_name="社会主义大团结"

def send_move(report_to_name,message):
    now = datetime.datetime.now()
    users = itchat.search_friends(name=report_to_name)
    print(users)
    userName = users[0]['UserName']
    itchat.send(str(now),toUserName=userName)
    itchat.send(message,toUserName=userName)


if __name__ == "__main__":
    itchat.auto_login(hotReload=True)  # 首次扫描登录后后续自动登录
    send_move(report_to_name,"如此牛逼")