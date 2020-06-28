export default [
      {
        path:'/login',
        name:'login',
        title:'登录',
        component : ()=>import('../views/login')
      },
      {
        path: '/',
        name: 'home',
        title:'主页',
        component : ()=>import('../views/home')
      },
      {
        path: '/pages',
        name: 'main',
        title:'页面',
        component : ()=>import('../views/main'),
        children:[
          {
            path: 'about',
            name: 'about',
            title: '关于',
            component: function () { 
              return import(/* webpackChunkName: "about" */ '../views/pages/about')
            }
          },{
            path: 'piano',
            name: 'piano',
            title: '琴键',
            component : ()=>import('../views/pages/piano')
          },{
            path: 'audio',
            name: 'audio',
            title:'视频',
            component : ()=>import('../views/pages/audio')
          },{
            path: 'qnyhjnd',
            name: 'qnyhjnd',
            title:'qnyh加点',
            component : ()=>import('../views/pages/qnyhjnd')
          },{
            path: 'xyq',
            name: 'xyq',
            title:'许愿墙',
            //component: Home
            component : ()=>import('../views/pages/xuyuanqiang')
          },{
            path: 'qnxjl',
            name: 'xyq',
            title:'qn行酒令',
            //component: Home
            component : ()=>import('../views/pages/qnxjl')
          },{
            path: 'sxdc',
            name: 'sxdc',
            title:'搜寻单词',
            //component: Home
            component : ()=>import('../views/pages/sxdc')
          }
        ]
      }
    ]
