module.exports = {
    devServer:{
        proxy:{
            '/api':{
                //target:'129.28.168.243:80/api',
                target:'localhost:9999/api',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}