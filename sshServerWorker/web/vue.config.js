module.exports = {
    devServer:{
        proxy:{
            '/api':{
                target:'http://localhost:9999/api',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}