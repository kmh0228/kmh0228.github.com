export default [
      {
        path: '/',
        name: 'home',
        title:'主页',
        //component: Home
        component : ()=>import('../views/home')
      },
      {
        path: '/about',
        name: 'about',
        title: '关于',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () { 
          return import(/* webpackChunkName: "about" */ '../views/about')
        }
      },{
        path: '/piano',
        name: 'piano',
        title: '琴键',
        //component: Home
        component : ()=>import('../views/piano')
      },{
        path: '/audio',
        name: 'audio',
        title:'视频',
        //component: Home
        component : ()=>import('../views/audio')
      },{
        path: '/qnyhjnd',
        name: 'qnyhjnd',
        title:'qnyh加点',
        //component: Home
        component : ()=>import('../views/qnyhjnd')
      }
    ]
