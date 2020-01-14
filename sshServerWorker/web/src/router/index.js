import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import cookies from 'js-cookie'

Vue.use(Router)

const router = new Router({
    routes
})

router.beforeEach(function(to,from,next){
    //检查是否有token
    var token = cookies.get('token')
    
    if(!token){
        //没有token
        console.log(to.fullPath);
        if(to.name !== 'login'){
            next({name:'login'})
        }
    }
    next()
});

export default router;
