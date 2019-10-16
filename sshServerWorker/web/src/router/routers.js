export default [
      {
        path: '/',
        name: 'home',
        title:'主页',
        component : ()=>import('../views/home')
      },
      {
        path: '/about',
        name: 'about',
        title: '关于',
        component: function () { 
          return import(/* webpackChunkName: "about" */ '../views/about')
        }
      },{
        path: '/piano',
        name: 'piano',
        title: '琴键',
        component : ()=>import('../views/piano')
      },{
        path: '/audio',
        name: 'audio',
        title:'视频',
        component : ()=>import('../views/audio')
      },{
        path: '/qnyhjnd',
        name: 'qnyhjnd',
        title:'qnyh加点',
        component : ()=>import('../views/qnyhjnd')
      },{
        path: '/xyq',
        name: 'xyq',
        title:'许愿墙',
        //component: Home
        component : ()=>import('../views/xuyuanqiang')
      },{
        path: '/qnxjl',
        name: 'xyq',
        title:'qn行酒令',
        //component: Home
        component : ()=>import('../views/qnxjl')
      },{
        path: '/test',
        name: 'test',
        title:'test',
        //component: Home
        component : ()=>import('../views/test.vue')
      }
    ]
