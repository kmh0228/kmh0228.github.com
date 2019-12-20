const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}  
module.exports = {
    devServer:{
        proxy:{
            '/api':{
                target:'http://127.0.0.1:9999',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':'/api'
                }
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
          .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
          .set('_c', resolve('src/components'))
          .set('_l',resolve('src/libs'))
    }
}