
import random
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
for saytime in times:
    saytime['m'] = random.randint(0,10)
print(times)